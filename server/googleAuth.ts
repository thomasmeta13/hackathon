import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables must be provided");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  const getCallbackURL = () => {
    if (process.env.NODE_ENV === 'production') {
      return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/google/callback`;
    }
    return `https://${process.env.REPL_ID}.replit.app/api/auth/google/callback`;
  };

  console.log('Google OAuth callback URL:', getCallbackURL());

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: getCallbackURL()
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract user info from Google profile
      const googleUser = {
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImageUrl: profile.photos?.[0]?.value || null,
      };

      // Check if user exists
      const existingUser = await storage.getUserById(googleUser.id);
      
      if (existingUser) {
        // Update existing user with latest Google info
        const updatedUser = await storage.upsertUser({
          ...googleUser,
          role: existingUser.role, // Preserve existing role
        });
        return done(null, updatedUser);
      } else {
        // New user - role will be set during onboarding
        const newUser = await storage.upsertUser({
          ...googleUser,
          role: 'tasker', // Default role, will be updated during onboarding
        });
        return done(null, newUser);
      }
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.get("/api/auth/google", (req, res, next) => {
    // Store the intended role in session for post-auth routing
    if (req.query.role && (req.query.role === 'organizer' || req.query.role === 'tasker')) {
      (req.session as any).intendedRole = req.query.role as string;
    }
    
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })(req, res, next);
  });

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
      const user = req.user as any;
      const intendedRole = (req.session as any).intendedRole;
      
      // Clear intended role from session
      delete (req.session as any).intendedRole;
      
      // Check if user needs onboarding based on intended role
      if (user && intendedRole === 'organizer') {
        // Update user role to organizer and redirect to organization onboarding
        await storage.upsertUser({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          role: 'organizer'
        });
        res.redirect("/onboarding/organization");
      } else if (user && intendedRole === 'tasker') {
        // Redirect to tasker onboarding if profile incomplete
        if (!user.profileCompletion || user.profileCompletion < 100) {
          res.redirect("/onboarding/tasker");
        } else {
          res.redirect("/");
        }
      } else if (user && !user.profileCompletion) {
        // Default to tasker onboarding for new users
        res.redirect("/onboarding/tasker");
      } else {
        res.redirect("/");
      }
    }
  );

  app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const user = await storage.getUserById((req.user as any).id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
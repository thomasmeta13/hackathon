import session from "express-session";
import type { Express, RequestHandler } from "express";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: process.env.SESSION_SECRET || "htw-earn-hub-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow HTTP for local development
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Mock login endpoints
  app.post("/api/auth/login", (req, res) => {
    const { role } = req.body;
    
    if (!role || !['organizer', 'tasker'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'organizer' or 'tasker'" });
    }

    // Create a mock user
    const mockUser = {
      id: `mock-${role}-${Date.now()}`,
      email: `${role}@example.com`,
      firstName: role === 'organizer' ? 'HTW' : `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      lastName: role === 'organizer' ? 'Organization' : "User",
      role: role,
      profileImageUrl: null,
      xp: role === 'organizer' ? 0 : 0, // XP not relevant for organizers
      profileCompletion: role === 'organizer' ? 100 : 50,
      skills: role === 'tasker' ? ['Development', 'Design'] : [],
      badges: [],
    };

    // Store user in session
    (req.session as any).user = mockUser;
    
    res.json({
      message: "Login successful",
      user: mockUser,
      redirect: role === 'organizer' ? '/onboarding/organization' : '/onboarding/tasker'
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    const user = (req.session as any).user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(user);
  });

  app.get("/api/auth/status", (req, res) => {
    const user = (req.session as any).user;
    res.json({ 
      authenticated: !!user,
      user: user || null
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const user = (req.session as any).user;
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Add user to request object for easy access
  (req as any).user = user;
  next();
};

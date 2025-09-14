// Integration: blueprint:javascript_database
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for local development, but handle Vercel environment
let sqlite: Database.Database;

if (process.env.NODE_ENV === 'production') {
  // For Vercel, we need to use a cloud database
  // You'll need to set up a cloud database like Neon, PlanetScale, or Supabase
  // For now, we'll use an in-memory database (data won't persist)
  sqlite = new Database(':memory:');
} else {
  // Local development
  sqlite = new Database('./dev.db');
}

export const db = drizzle(sqlite, { schema });
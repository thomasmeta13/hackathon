import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// Create database
const sqlite = new Database('./dev.db');
const db = drizzle(sqlite);

// Create tables manually since we don't have migrations yet
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expire INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    role TEXT NOT NULL DEFAULT 'tasker',
    xp INTEGER NOT NULL DEFAULT 0,
    skills TEXT DEFAULT '[]',
    badges TEXT DEFAULT '[]',
    profile_completion INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unclaimed',
    reward INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    ai_output TEXT,
    iterations INTEGER DEFAULT 0,
    assigned_to TEXT,
    created_by TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website TEXT,
    location TEXT,
    industry TEXT,
    size TEXT DEFAULT 'small',
    contact_info TEXT,
    mission TEXT,
    goals TEXT,
    events_organized INTEGER DEFAULT 0,
    sponsor_level TEXT DEFAULT 'bronze',
    created_by TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_task_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    completed_at INTEGER DEFAULT (strftime('%s', 'now')),
    xp_earned INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
  );

  CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);
`);

console.log('Database setup complete!');
sqlite.close();

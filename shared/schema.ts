import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  text,
  sqliteTable,
  real,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: integer("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("tasker"), // "organizer" or "tasker"
  xp: integer("xp").notNull().default(0),
  skills: text("skills", { mode: 'json' }).$type<string[]>().default([]),
  badges: text("badges", { mode: 'json' }).$type<string[]>().default([]),
  profileCompletion: integer("profile_completion").default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("unclaimed"), // unclaimed, in_progress, completed, cancelled
  reward: integer("reward").notNull().default(0), // XP reward
  category: text("category").notNull(), // marketing, event_prep, content_creation, development, design, community
  type: text("type").notNull(), // image_generation, video_creation, coding, writing, social_media, event_planning, research
  aiOutput: text("ai_output"),
  iterations: integer("iterations").default(0),
  assignedTo: text("assigned_to").references(() => users.id),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

// Organizations table
export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  location: text("location"),
  industry: text("industry"),
  size: text("size").default("small"), // startup, small, medium, large, enterprise
  contactInfo: text("contact_info"),
  mission: text("mission"),
  goals: text("goals"),
  eventsOrganized: integer("events_organized").default(0),
  sponsorLevel: text("sponsor_level").default("bronze"),
  createdBy: text("created_by").notNull().references(() => users.id),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

// User task history junction table
export const userTaskHistory = sqliteTable("user_task_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  taskId: text("task_id").notNull().references(() => tasks.id),
  completedAt: integer("completed_at").$defaultFn(() => Date.now()),
  xpEarned: integer("xp_earned").notNull(),
});

// Zod schemas for validation
export const upsertUserSchema = createInsertSchema(users);
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

export const insertUserTaskHistorySchema = createInsertSchema(userTaskHistory).omit({
  id: true,
  completedAt: true,
});
export type InsertUserTaskHistory = z.infer<typeof insertUserTaskHistorySchema>;

// Extended types for API responses with populated user data
export interface TaskWithUsers extends Omit<Task, 'createdBy' | 'assignedTo'> {
  createdBy: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}
export type UserTaskHistory = typeof userTaskHistory.$inferSelect;
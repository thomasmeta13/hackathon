// Integration: blueprint:javascript_database and blueprint:javascript_log_in_with_replit
import {
  users,
  tasks,
  organizations,
  userTaskHistory,
  type User,
  type UpsertUser,
  type Task,
  type TaskWithUsers,
  type InsertTask,
  type Organization,
  type InsertOrganization,
  type UserTaskHistory,
  type InsertUserTaskHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Task operations
  getTasks(): Promise<TaskWithUsers[]>;
  getTaskById(id: string): Promise<Task | undefined>;
  getTasksByUser(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // Organization operations
  getOrganizations(): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  
  // User task history operations
  addTaskHistory(history: InsertUserTaskHistory): Promise<UserTaskHistory>;
  getUserTaskHistory(userId: string): Promise<UserTaskHistory[]>;
  
  // Analytics operations
  getTaskCompletionStats(): Promise<{ totalTasks: number; completedTasks: number; activeTasks: number; activeMembers: number }>;
  getLeaderboard(): Promise<Array<{ user: User; totalXp: number; tasksCompleted: number; rank: number }>>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Task operations
  async getTasks(): Promise<TaskWithUsers[]> {
    // Get all tasks first
    const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    
    // Enrich with user data
    const enrichedTasks: TaskWithUsers[] = [];
    
    for (const task of allTasks) {
      // Get creator info
      const [creator] = await db.select().from(users).where(eq(users.id, task.createdBy));
      
      // Get assignee info if assigned
      let assignee = null;
      if (task.assignedTo) {
        [assignee] = await db.select().from(users).where(eq(users.id, task.assignedTo));
      }
      
      enrichedTasks.push({
        ...task,
        createdBy: creator ? {
          id: creator.id,
          name: `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || creator.email || 'Unknown User',
          avatar: creator.profileImageUrl
        } : {
          id: task.createdBy,
          name: 'Unknown User'
        },
        assignedTo: assignee ? {
          id: assignee.id,
          name: `${assignee.firstName || ''} ${assignee.lastName || ''}`.trim() || assignee.email || 'Unknown User',
          avatar: assignee.profileImageUrl
        } : undefined
      });
    }
    
    return enrichedTasks;
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.assignedTo, userId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Organization operations
  async getOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations);
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [newOrg] = await db.insert(organizations).values(org).returning();
    return newOrg;
  }

  // User task history operations
  async addTaskHistory(history: InsertUserTaskHistory): Promise<UserTaskHistory> {
    const [newHistory] = await db.insert(userTaskHistory).values(history).returning();
    return newHistory;
  }

  async getUserTaskHistory(userId: string): Promise<UserTaskHistory[]> {
    return await db
      .select()
      .from(userTaskHistory)
      .where(eq(userTaskHistory.userId, userId))
      .orderBy(desc(userTaskHistory.completedAt));
  }

  // Analytics operations
  async getTaskCompletionStats(): Promise<{ totalTasks: number; completedTasks: number; activeTasks: number; activeMembers: number }> {
    const stats = await db
      .select({
        status: tasks.status,
        count: count(),
      })
      .from(tasks)
      .groupBy(tasks.status);

    // Get active members count
    const [activeMembersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'tasker'));

    const result = {
      totalTasks: 0,
      completedTasks: 0,
      activeTasks: 0,
      activeMembers: activeMembersResult?.count || 0,
    };

    stats.forEach((stat) => {
      result.totalTasks += stat.count;
      if (stat.status === 'completed') result.completedTasks = stat.count;
      if (stat.status === 'in_progress') result.activeTasks = stat.count;
    });

    return result;
  }

  async getLeaderboard(): Promise<Array<{ user: User; totalXp: number; tasksCompleted: number; rank: number }>> {
    const leaderboard = await db
      .select({
        user: users,
        totalXp: sql<number>`COALESCE(SUM(${userTaskHistory.xpEarned}), 0)`,
        tasksCompleted: count(userTaskHistory.id),
      })
      .from(users)
      .leftJoin(userTaskHistory, eq(users.id, userTaskHistory.userId))
      .groupBy(users.id)
      .orderBy(desc(sql`COALESCE(SUM(${userTaskHistory.xpEarned}), 0)`))
      .limit(10);

    return leaderboard.map((entry, index) => ({
      user: entry.user,
      totalXp: entry.totalXp || 0,
      tasksCompleted: entry.tasksCompleted,
      rank: index + 1,
    }));
  }
}

export const storage = new DatabaseStorage();
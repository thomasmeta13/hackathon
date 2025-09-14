// Integration: blueprint:javascript_log_in_with_replit
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./mockAuth";
import { insertTaskSchema, insertUserTaskHistorySchema, insertOrganizationSchema } from "@shared/schema";
import { z } from "zod";
import { generateTaskHelp, generateOrganizationAssistantResponse, generateInfographic } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes are handled in mockAuth.ts

  // Task routes
  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get('/api/tasks/:id', async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Task claiming endpoint
  app.post('/api/tasks/:id/claim', isAuthenticated, async (req: any, res) => {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;
      
      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (task.status !== 'unclaimed') {
        return res.status(400).json({ message: "Task is not available for claiming" });
      }
      
      const updatedTask = await storage.updateTask(taskId, {
        status: 'in_progress',
        assignedTo: userId,
      });
      
      res.json(updatedTask);
    } catch (error) {
      console.error("Error claiming task:", error);
      res.status(500).json({ message: "Failed to claim task" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const taskData = insertTaskSchema.parse({ ...req.body, createdBy: userId });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id/claim', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      
      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (task.status !== 'unclaimed') {
        return res.status(400).json({ message: "Task is not available for claiming" });
      }

      const updatedTask = await storage.updateTask(taskId, {
        status: 'in_progress',
        assignedTo: userId
      });

      res.json(updatedTask);
    } catch (error) {
      console.error("Error claiming task:", error);
      res.status(500).json({ message: "Failed to claim task" });
    }
  });

  app.patch('/api/tasks/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      
      const task = await storage.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      if (task.assignedTo !== userId) {
        return res.status(403).json({ message: "Not authorized to complete this task" });
      }

      const updatedTask = await storage.updateTask(taskId, {
        status: 'completed'
      });

      // Add to user task history and update XP
      await storage.addTaskHistory({
        userId,
        taskId,
        xpEarned: task.reward
      });

      // Update user XP
      const user = await storage.getUser(userId);
      if (user) {
        await storage.upsertUser({
          ...user,
          xp: user.xp + task.reward
        });
      }

      res.json(updatedTask);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // User routes
  app.get('/api/users/:id/tasks', async (req, res) => {
    try {
      const tasks = await storage.getTasksByUser(req.params.id);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      res.status(500).json({ message: "Failed to fetch user tasks" });
    }
  });

  app.get('/api/users/:id/history', async (req, res) => {
    try {
      const history = await storage.getUserTaskHistory(req.params.id);
      res.json(history);
    } catch (error) {
      console.error("Error fetching user history:", error);
      res.status(500).json({ message: "Failed to fetch user history" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', async (req, res) => {
    try {
      const stats = await storage.getTaskCompletionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get('/api/leaderboard', async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Organization routes
  app.post('/api/organizations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const organizationData = insertOrganizationSchema.parse({ ...req.body, createdBy: userId });
      const organization = await storage.createOrganization(organizationData);
      res.status(201).json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid organization data", errors: error.errors });
      }
      console.error("Error creating organization:", error);
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.get('/api/organizations', async (req, res) => {
    try {
      const organizations = await storage.getOrganizations();
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });

  // AI Organization Assistant endpoint
  app.post('/api/ai/organization-assistant', isAuthenticated, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await generateOrganizationAssistantResponse(message, context);
      res.json({ response });
    } catch (error) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ message: "Failed to generate AI response" });
    }
  });

  // AI assistance endpoint
  app.post('/api/ai/task-help', async (req: any, res) => {
    try {
      const { taskId, userInput, taskTitle, taskDescription } = req.body;
      
      if (!taskId || !userInput || !taskTitle || !taskDescription) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const response = await generateTaskHelp(taskTitle, taskDescription, userInput);
      console.log('Generated AI response:', response);
      res.json({ response });
    } catch (error) {
      console.error("Error generating AI help:", error);
      res.status(500).json({ message: "Failed to generate AI assistance" });
    }
  });

  // AI infographic generation endpoint
  app.post('/api/ai/generate-infographic', async (req: any, res) => {
    try {
      const { taskTitle, taskDescription, taskCategory, iteration, userFeedback, currentPrompt } = req.body;
      
      if (!taskTitle || !taskDescription) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const response = await generateInfographic(
        taskTitle, 
        taskDescription, 
        taskCategory, 
        iteration, 
        userFeedback, 
        currentPrompt
      );
      res.json(response);
    } catch (error) {
      console.error("Error generating infographic:", error);
      res.status(500).json({ message: "Failed to generate infographic" });
    }
  });

  // User profile routes
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      
      // Basic validation for profile updates
      const profileUpdateSchema = z.object({
        skills: z.array(z.string()).optional(),
        profileCompletion: z.number().min(0).max(100).optional(),
      });
      
      const validatedData = profileUpdateSchema.parse(updateData);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.upsertUser({
        ...user,
        ...validatedData,
      });

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
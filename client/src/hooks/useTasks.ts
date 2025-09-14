import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Task, TaskWithUsers } from "@shared/schema";

export function useTasks() {
  return useQuery<TaskWithUsers[]>({
    queryKey: ["/api/tasks"],
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ["/api/tasks", id],
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useClaimTask() {
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await apiRequest("PATCH", `/api/tasks/${taskId}/claim`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useCompleteTask() {
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await apiRequest("PATCH", `/api/tasks/${taskId}/complete`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (taskData: any) => {
      const response = await apiRequest("POST", "/api/tasks", taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}
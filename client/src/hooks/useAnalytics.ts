import { useQuery } from "@tanstack/react-query";

export interface TaskStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  activeMembers: number;
}

export interface LeaderboardEntry {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
    role: string;
  };
  totalXp: number;
  tasksCompleted: number;
  rank: number;
}

export function useTaskStats() {
  return useQuery<TaskStats>({
    queryKey: ["/api/analytics/stats"],
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });
}

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });
}
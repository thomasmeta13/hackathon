import { LeaderboardCard } from "@/components/LeaderboardCard"
import { StatsCard } from "@/components/StatsCard"
import { Trophy, Medal, Star, TrendingUp } from "lucide-react"

export default function Leaderboard() {
  // todo: remove mock functionality
  const mockLeaderboard = [
    {
      user: {
        id: "user-1",
        firstName: "Sarah",
        lastName: "Chen",
        email: "sarah@htwearning.com",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
        role: "tasker"
      },
      totalXp: 850,
      tasksCompleted: 12,
      rank: 1
    },
    {
      user: {
        id: "user-2",
        firstName: "Marcus",
        lastName: "Rodriguez",
        email: "marcus@htwearning.com",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        role: "organizer"
      },
      totalXp: 720,
      tasksCompleted: 8,
      rank: 2
    },
    {
      user: {
        id: "user-3",
        firstName: "Emily",
        lastName: "Foster",
        email: "emily@htwearning.com",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
        role: "tasker"
      },
      totalXp: 650,
      tasksCompleted: 9,
      rank: 3
    },
    {
      user: {
        id: "user-4",
        firstName: "David",
        lastName: "Kim",
        email: "david@htwearning.com",
        role: "tasker"
      },
      totalXp: 480,
      tasksCompleted: 6,
      rank: 4
    },
    {
      user: {
        id: "user-5",
        firstName: "Lisa",
        lastName: "Wang",
        email: "lisa@htwearning.com",
        role: "tasker"
      },
      totalXp: 420,
      tasksCompleted: 7,
      rank: 5
    },
    {
      user: {
        id: "user-6",
        firstName: "Alex",
        lastName: "Johnson",
        email: "alex@htwearning.com",
        role: "tasker"
      },
      totalXp: 380,
      tasksCompleted: 5,
      rank: 6
    }
  ]

  const mockStats = {
    totalContributors: 89,
    totalXpEarned: 15240,
    avgTasksPerUser: 4.2,
    topContributorStreak: 12
  }

  return (
    <div className="space-y-6" data-testid="page-leaderboard">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-leaderboard-title">
          Community Leaderboard
        </h1>
        <p className="text-muted-foreground" data-testid="text-leaderboard-subtitle">
          Top contributors making HTW 2025 amazing
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Contributors"
          value={mockStats.totalContributors}
          description="Active community members"
          icon={<Trophy className="h-4 w-4" />}
          trend={{ value: 12, direction: "up", label: "this month" }}
          color="primary"
        />
        <StatsCard
          title="Total XP Earned"
          value={`${(mockStats.totalXpEarned / 1000).toFixed(1)}k`}
          description="Community-wide experience"
          icon={<Star className="h-4 w-4" />}
          trend={{ value: 25, direction: "up", label: "vs last month" }}
          color="success"
        />
        <StatsCard
          title="Avg Tasks/User"
          value={mockStats.avgTasksPerUser}
          description="Tasks per contributor"
          icon={<Medal className="h-4 w-4" />}
          color="secondary"
        />
        <StatsCard
          title="Top Streak"
          value={`${mockStats.topContributorStreak} days`}
          description="Longest active streak"
          icon={<TrendingUp className="h-4 w-4" />}
          color="warning"
        />
      </div>

      {/* Main Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <LeaderboardCard entries={mockLeaderboard} />
        </div>
      </div>
    </div>
  )
}
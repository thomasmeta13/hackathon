import { LeaderboardCard } from '../LeaderboardCard'

export default function LeaderboardCardExample() {
  // todo: remove mock functionality
  const mockEntries = [
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
    }
  ]

  return (
    <div className="max-w-md">
      <LeaderboardCard entries={mockEntries} />
    </div>
  )
}
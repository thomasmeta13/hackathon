import { TaskCard } from '../TaskCard'

export default function TaskCardExample() {
  // todo: remove mock functionality
  const mockTask = {
    id: "task-1",
    title: "Create HTW 2025 Marketing Video",
    description: "Design and produce a 60-second promotional video highlighting HTW 2025 speakers, sponsors, and key events. Should be engaging and shareable across social media platforms.",
    category: "marketing",
    type: "video_creation",
    status: "unclaimed" as const,
    reward: 150,
    createdBy: {
      id: "user-1",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
    },
    createdAt: "2025-01-13T10:00:00Z"
  }

  const handleClaim = (taskId: string) => {
    console.log('Claim task triggered:', taskId)
  }

  const handleView = (taskId: string) => {
    console.log('View task triggered:', taskId)
  }

  return (
    <div className="max-w-md">
      <TaskCard 
        {...mockTask}
        onClaim={handleClaim}
        onView={handleView}
      />
    </div>
  )
}
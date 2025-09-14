import { useState } from "react"
import { TaskCard } from "@/components/TaskCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Trophy, SortAsc } from "lucide-react"
import { useLocation } from "wouter"
import { useClaimTask } from "@/hooks/useTasks"
import { useToast } from "@/hooks/use-toast"

export default function QuestBoard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [, setLocation] = useLocation()
  const claimTaskMutation = useClaimTask()
  const { toast } = useToast()

  // todo: remove mock functionality
  const mockTasks = [
    {
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
    },
    {
      id: "task-2",
      title: "Design Speaker Badge Template",
      description: "Create a professional speaker badge template that includes name, company, social media handles, and QR code for networking.",
      category: "design",
      type: "image_generation",
      status: "in_progress" as const,
      reward: 100,
      createdBy: {
        id: "user-2",
        name: "Marcus Rodriguez"
      },
      assignedTo: {
        id: "user-3",
        name: "Emily Foster"
      },
      createdAt: "2025-01-12T15:30:00Z"
    },
    {
      id: "task-3",
      title: "Write Event Schedule App Copy",
      description: "Draft user-friendly copy for the HTW 2025 mobile app including onboarding flow, navigation labels, and help text.",
      category: "content_creation",
      type: "writing",
      status: "completed" as const,
      reward: 80,
      createdBy: {
        id: "user-4",
        name: "David Kim"
      },
      assignedTo: {
        id: "user-5",
        name: "Lisa Wang"
      },
      createdAt: "2025-01-11T09:15:00Z"
    },
    {
      id: "task-4",
      title: "Build Sponsor Showcase Component",
      description: "Develop a React component to showcase event sponsors with logos, descriptions, and links. Should be responsive and accessible.",
      category: "development",
      type: "coding",
      status: "unclaimed" as const,
      reward: 200,
      createdBy: {
        id: "user-1",
        name: "Sarah Chen"
      },
      createdAt: "2025-01-10T14:20:00Z"
    },
    {
      id: "task-5",
      title: "Research Venue Accessibility Options",
      description: "Compile a comprehensive report on accessibility features at HTW 2025 venues including parking, entrances, and accommodations.",
      category: "event_prep",
      type: "research",
      status: "unclaimed" as const,
      reward: 120,
      createdBy: {
        id: "user-6",
        name: "Alex Johnson"
      },
      createdAt: "2025-01-09T11:45:00Z"
    }
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "marketing", label: "Marketing" },
    { value: "event_prep", label: "Event Preparation" },
    { value: "content_creation", label: "Content Creation" },
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "community", label: "Community" }
  ]

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "unclaimed", label: "Unclaimed" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ]

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "reward_high", label: "Highest Reward" },
    { value: "reward_low", label: "Lowest Reward" }
  ]

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "reward_high":
        return b.reward - a.reward
      case "reward_low":
        return a.reward - b.reward
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const handleClaimTask = async (taskId: string) => {
    try {
      await claimTaskMutation.mutateAsync(taskId)
      toast({
        title: "Task claimed!",
        description: "You have successfully claimed this task. Good luck!",
      })
    } catch (error) {
      toast({
        title: "Failed to claim task",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewTask = (taskId: string) => {
    setLocation(`/task/${taskId}`)
  }

  const getStatusCounts = () => {
    return {
      total: mockTasks.length,
      unclaimed: mockTasks.filter(t => t.status === 'unclaimed').length,
      inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
      completed: mockTasks.filter(t => t.status === 'completed').length
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-8" data-testid="page-quest-board">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" data-testid="text-quest-board-title">
            Quest Board
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-quest-board-subtitle">
            Discover and claim tasks to earn XP and contribute to HTW 2025
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-2" data-testid="badge-total-tasks">
            <Trophy className="h-4 w-4 mr-2" />
            {statusCounts.total} Total
          </Badge>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted/30 rounded-lg" data-testid="stat-unclaimed">
          <div className="text-2xl font-bold text-secondary-foreground">{statusCounts.unclaimed}</div>
          <div className="text-sm text-muted-foreground">Unclaimed</div>
        </div>
        <div className="text-center p-4 bg-warning/10 rounded-lg" data-testid="stat-in-progress">
          <div className="text-2xl font-bold text-warning">{statusCounts.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center p-4 bg-success/10 rounded-lg" data-testid="stat-completed">
          <div className="text-2xl font-bold text-success">{statusCounts.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center p-4 bg-primary/10 rounded-lg" data-testid="stat-available-xp">
          <div className="text-2xl font-bold text-primary">
            {mockTasks.filter(t => t.status === 'unclaimed').reduce((sum, t) => sum + t.reward, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Available XP</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title, type, sponsor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-base border-2 focus:border-blue-500"
            data-testid="input-search-tasks"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 h-12 border-2 focus:border-blue-500" data-testid="select-category-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-44 h-12 border-2 focus:border-blue-500" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-12 border-2 focus:border-blue-500" data-testid="select-sort-filter">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" data-testid="text-results-count">
          Showing {sortedTasks.length} of {mockTasks.length} tasks
        </p>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {sortedTasks.length === 0 ? (
          <div className="col-span-full text-center py-12" data-testid="empty-state">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClaim={handleClaimTask}
              onView={handleViewTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
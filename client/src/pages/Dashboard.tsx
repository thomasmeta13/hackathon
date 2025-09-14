import { StatsCard } from "@/components/StatsCard"
import { TaskCard } from "@/components/TaskCard"
import { AIOrganizationAssistant } from "@/components/AIOrganizationAssistant"
import { useAuth } from "@/hooks/useAuth"
import { useTasks, useClaimTask, useCompleteTask, useCreateTask } from "@/hooks/useTasks"
import { useTaskStats } from "@/hooks/useAnalytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trophy, Users, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Link, useLocation } from "wouter"
import { User } from "@shared/schema"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const { user } = useAuth()
  const { data: tasks, isLoading: tasksLoading } = useTasks()
  const { data: stats, isLoading: statsLoading } = useTaskStats()
  const claimTaskMutation = useClaimTask()
  const completeTaskMutation = useCompleteTask()
  const createTaskMutation = useCreateTask()
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  
  const isOrganizer = (user as User)?.role === 'organizer'

  // Get recent tasks (first 5)
  const recentTasks = tasks?.slice(0, 5) || []

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
    // Navigate to task detail page using wouter
    setLocation(`/task/${taskId}`)
  }

  const handleCreateTask = async (task: {
    title: string
    description: string
    category: string
    type: string
    reward: number
  }) => {
    try {
      await createTaskMutation.mutateAsync(task)
      toast({
        title: "Task created!",
        description: "Your new task has been published to the community.",
      })
    } catch (error) {
      toast({
        title: "Failed to create task",
        description: "Please check your input and try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProfile = () => {
    console.log('Edit profile triggered')
  }


  return (
    <div className="space-y-6" data-testid="page-dashboard">

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">
            {isOrganizer ? 'Dashboard' : 'Welcome back!'}
          </h1>
          <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
            {isOrganizer 
              ? 'Monitor community activity and create new tasks'
              : 'Discover new quests and track your progress'
            }
          </p>
        </div>
        {isOrganizer && (
          <Button asChild data-testid="button-create-task-header">
            <Link href="/create-task">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Link>
          </Button>
        )}
      </div>

      {/* Organization Stats */}
      {isOrganizer ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Event Attendance"
            value="2,847"
            description="Total attendees across events"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 15, direction: "up", label: "vs last month" }}
            color="primary"
            isLoading={false}
          />
          <StatsCard
            title="Social Media Reach"
            value="45.2K"
            description="Total social media impressions"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{ value: 23, direction: "up", label: "this week" }}
            color="success"
            isLoading={false}
          />
          <StatsCard
            title="Events Hosted"
            value="12"
            description="Events organized this quarter"
            icon={<Trophy className="h-4 w-4" />}
            trend={{ value: 8, direction: "up", label: "vs last quarter" }}
            color="warning"
            isLoading={false}
          />
          <StatsCard
            title="Community Engagement"
            value="94%"
            description="Active participation rate"
            icon={<CheckCircle className="h-4 w-4" />}
            progress={{ value: 94, max: 100 }}
            color="success"
            isLoading={false}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tasks"
            value={stats?.totalTasks || 0}
            description="Community tasks available"
            icon={<Trophy className="h-4 w-4" />}
            trend={{ value: 12, direction: "up", label: "vs last week" }}
            color="primary"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Active Members"
            value={stats?.activeMembers || 0}
            description="Contributors this month"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 8, direction: "up", label: "new this week" }}
            color="success"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Completed"
            value={stats?.completedTasks || 0}
            description="Tasks finished"
            icon={<CheckCircle className="h-4 w-4" />}
            progress={stats ? { value: stats.completedTasks, max: stats.totalTasks } : undefined}
            color="success"
            isLoading={statsLoading}
          />
          <StatsCard
            title="In Progress"
            value={stats?.activeTasks || 0}
            description="Tasks being worked on"
            icon={<Clock className="h-4 w-4" />}
            color="warning"
            isLoading={statsLoading}
          />
        </div>
      )}

      {/* Performance Insights for Organizers - Moved before AI assistant */}
      {isOrganizer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-green-600">↑ 12% this month</p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Task Time</p>
                  <p className="text-2xl font-bold">2.3h</p>
                  <p className="text-xs text-blue-600">↓ 8% faster</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Organization Assistant for Organizers */}
          {isOrganizer && (
            <AIOrganizationAssistant 
              onTaskCreate={handleCreateTask} 
              user={user}
              tasks={tasks}
              stats={stats}
            />
          )}

      {/* Recent Tasks */}
      <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" data-testid="text-recent-tasks-title">
                {isOrganizer ? 'Recent Tasks' : 'Available Quests'}
              </h2>
              <Button variant="outline" asChild data-testid="button-view-all-tasks">
                <Link href="/quests">
                  View All
                  <TrendingUp className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasksLoading ? (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
                  ))}
                </>
              ) : recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    {...task}
                    status={task.status as "unclaimed" | "in_progress" | "completed" | "cancelled"}
                    createdAt={task.createdAt ? new Date(task.createdAt).toISOString() : new Date().toISOString()}
                    createdBy={{
                      ...task.createdBy,
                      avatar: task.createdBy.avatar || undefined
                    }}
                    assignedTo={task.assignedTo ? {
                      ...task.assignedTo,
                      avatar: task.assignedTo.avatar || undefined
                    } : undefined}
                    onClaim={handleClaimTask}
                    onView={handleViewTask}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No tasks available yet</h3>
                  <p>{isOrganizer ? "Create your first task!" : "Check back soon!"}</p>
                </div>
              )}
            </div>
          </div>

    </div>
  )
}
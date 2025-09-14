import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTaskStats, useLeaderboard } from "@/hooks/useAnalytics";
import { useTasks } from "@/hooks/useTasks";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Target, 
  Trophy, 
  Clock, 
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Download
} from "lucide-react";

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = useTaskStats();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  // Mock data for demonstration
  const mockStats = {
    totalTasks: 127,
    activeMembers: 89,
    completedTasks: 98,
    activeTasks: 29,
    totalXP: 15200,
    avgCompletionTime: 2.3,
    completionRate: 77.2,
    engagementScore: 8.4
  };

  const taskCategories = [
    { name: "Marketing", count: 34, color: "bg-blue-500", percentage: 27 },
    { name: "Design", count: 28, color: "bg-purple-500", percentage: 22 },
    { name: "Development", count: 24, color: "bg-green-500", percentage: 19 },
    { name: "Content", count: 18, color: "bg-yellow-500", percentage: 14 },
    { name: "Events", count: 15, color: "bg-orange-500", percentage: 12 },
    { name: "Other", count: 8, color: "bg-gray-500", percentage: 6 }
  ];

  const weeklyData = [
    { day: "Mon", tasks: 12, completed: 8 },
    { day: "Tue", tasks: 18, completed: 14 },
    { day: "Wed", tasks: 15, completed: 11 },
    { day: "Thu", tasks: 22, completed: 18 },
    { day: "Fri", tasks: 16, completed: 12 },
    { day: "Sat", tasks: 8, completed: 6 },
    { day: "Sun", tasks: 5, completed: 4 }
  ];

  const topPerformers = leaderboard?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Insights into your organization's performance and community engagement
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{mockStats.completionRate}%</p>
              </div>
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={mockStats.completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Completion Time</p>
                <p className="text-2xl font-bold">{mockStats.avgCompletionTime}h</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-600">↓ 12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                <p className="text-2xl font-bold">{mockStats.engagementScore}/10</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={mockStats.engagementScore * 10} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total XP Distributed</p>
                <p className="text-2xl font-bold">{mockStats.totalXP.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-600">↑ 23% this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Categories */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Task Distribution by Category
            </CardTitle>
            <CardDescription>
              Breakdown of tasks by category to identify focus areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taskCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Weekly Activity
            </CardTitle>
            <CardDescription>
              Task creation and completion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-8">{day.day}</span>
                  <div className="flex-1 mx-3">
                    <div className="flex gap-1 mb-1">
                      <div 
                        className="h-2 bg-blue-500 rounded-sm flex-1"
                        style={{ width: `${(day.tasks / 25) * 100}%` }}
                      ></div>
                      <div 
                        className="h-2 bg-green-500 rounded-sm"
                        style={{ width: `${(day.completed / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-right w-16">
                    <div className="text-blue-600">{day.tasks}</div>
                    <div className="text-green-600">{day.completed}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Top Contributors
            </CardTitle>
            <CardDescription>
              Most active and successful taskers this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{performer.firstName} {performer.lastName}</p>
                      <p className="text-sm text-muted-foreground">{performer.tasksCompleted} tasks</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {performer.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              Key recommendations for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Strong Performance
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Your completion rate is 15% above community average
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Engagement Opportunity
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Marketing tasks have highest completion rates
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Optimization Tip
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Consider breaking down larger tasks into smaller milestones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

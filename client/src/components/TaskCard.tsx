import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Trophy, User, Zap, Palette, Code, Megaphone, Users, Lightbulb, Star, DollarSign, Bitcoin, Clock, CheckCircle } from "lucide-react"

export interface TaskCardProps {
  id: string
  title: string
  description: string
  category: string
  type: string
  status: "unclaimed" | "in_progress" | "completed" | "cancelled"
  reward: number
  createdBy: {
    id: string
    name: string
    avatar?: string
  }
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  onClaim?: (taskId: string) => void
  onView?: (taskId: string) => void
  className?: string
}

export function TaskCard({
  id,
  title,
  description,
  category,
  type,
  status,
  reward,
  createdBy,
  assignedTo,
  createdAt,
  onClaim,
  onView,
  className = ""
}: TaskCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground"
      case "in_progress":
        return "bg-warning text-warning-foreground"
      case "unclaimed":
        return "bg-secondary text-secondary-foreground"
      case "cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getCategoryIcon = () => {
    const icons: Record<string, React.ReactNode> = {
      marketing: <Megaphone className="h-5 w-5" />,
      event_prep: <Calendar className="h-5 w-5" />,
      content_creation: <Lightbulb className="h-5 w-5" />,
      development: <Code className="h-5 w-5" />,
      design: <Palette className="h-5 w-5" />,
      community: <Users className="h-5 w-5" />
    }
    return icons[category] || <Star className="h-5 w-5" />
  }

  const getCategoryGradient = () => {
    const gradients: Record<string, string> = {
      marketing: "bg-gradient-to-br from-pink-100 via-rose-50 to-orange-100 dark:from-pink-950/30 dark:via-rose-950/20 dark:to-orange-950/30",
      event_prep: "bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100 dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-teal-950/30",
      content_creation: "bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30",
      development: "bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-950/30 dark:via-emerald-950/20 dark:to-teal-950/30",
      design: "bg-gradient-to-br from-purple-100 via-violet-50 to-pink-100 dark:from-purple-950/30 dark:via-violet-950/20 dark:to-pink-950/30",
      community: "bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-cyan-950/30"
    }
    return gradients[category] || "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-950/30 dark:to-gray-900/30"
  }

  const getRewardIcon = () => {
    if (reward >= 500) return <Bitcoin className="h-4 w-4" />
    if (reward >= 200) return <DollarSign className="h-4 w-4" />
    return <Zap className="h-4 w-4" />
  }

  const getRewardText = () => {
    if (status === "completed") return `Completed $${reward}`
    return `Earn $${reward}`
  }

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${getCategoryGradient()} ${className}`} data-testid={`card-task-${id}`}>
      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className={`${getStatusColor()} shadow-md flex items-center gap-1`} data-testid={`badge-status-${status}`}>
          {getStatusIcon()}
          {getRewardText()}
        </Badge>
      </div>

      <CardContent className="p-0">
        {/* Visual Element */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Phone mockup or visual element */}
              <div className="w-24 h-40 bg-black rounded-[20px] p-2 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-[16px] flex items-center justify-center">
                  {getCategoryIcon()}
                </div>
              </div>
              {/* Background decoration */}
              <div className="absolute -inset-10 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <CardTitle className="text-xl font-bold leading-tight mb-2" data-testid={`text-title-${id}`}>
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-description-${id}`}>
              {description}
            </CardDescription>
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-2" data-testid={`badge-category-${category}`}>
              {getCategoryIcon()}
              {category.replace('_', ' ')}
            </Badge>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Deadline: {new Date(createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Paid in</span>
              <span className="font-medium">XP</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => onView?.(id)}
              data-testid={`button-view-${id}`}
            >
              View Details
            </Button>
            {status === "unclaimed" && (
              <Button 
                size="sm"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => onClaim?.(id)}
                data-testid={`button-claim-${id}`}
              >
                Claim Task
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
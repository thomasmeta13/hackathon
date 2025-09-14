import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: "up" | "down" | "neutral"
    label?: string
  }
  progress?: {
    value: number
    max: number
    label?: string
  }
  color?: "primary" | "success" | "warning" | "destructive" | "secondary"
  className?: string
  isLoading?: boolean
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  progress,
  color = "primary",
  className = "",
  isLoading = false
}: StatCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "border-success/20 bg-success/5"
      case "warning":
        return "border-warning/20 bg-warning/5"
      case "destructive":
        return "border-destructive/20 bg-destructive/5"
      case "secondary":
        return "border-border"
      default:
        return "border-primary/20 bg-primary/5"
    }
  }

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-success" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-destructive" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (trend?.direction) {
      case "up":
        return "text-success"
      case "down":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={`hover-elevate transition-all ${getColorClasses()} ${className}`} data-testid="card-stats">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" data-testid="text-stats-title">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground" data-testid="icon-stats">
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold" data-testid="text-stats-value">
                {value}
              </div>
              
              {trend && (
                <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span data-testid="text-stats-trend">
                    {trend.value > 0 ? '+' : ''}{trend.value}%
                  </span>
                </div>
              )}
            </div>

            {description && (
              <CardDescription className="text-xs" data-testid="text-stats-description">
                {description}
              </CardDescription>
            )}

            {progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {progress.label || "Progress"}
                  </span>
                  <span className="text-muted-foreground" data-testid="text-stats-progress">
                    {progress.value}/{progress.max}
                  </span>
                </div>
                <Progress 
                  value={(progress.value / progress.max) * 100} 
                  className="h-2"
                />
              </div>
            )}

            {trend?.label && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span data-testid="text-stats-trend-label">{trend.label}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Zap, Medal, Award } from "lucide-react"

export interface LeaderboardEntry {
  user: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    profileImageUrl?: string
    role: string
  }
  totalXp: number
  tasksCompleted: number
  rank: number
}

export interface LeaderboardCardProps {
  entries: LeaderboardEntry[]
  className?: string
}

export function LeaderboardCard({ entries, className = "" }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-muted-foreground font-bold text-sm">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white"
      case 2:
        return "bg-gray-400 text-white"
      case 3:
        return "bg-amber-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className={`hover-elevate transition-all ${className}`} data-testid="card-leaderboard">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="text-leaderboard-title">
          <Trophy className="h-5 w-5 text-primary" />
          Top Contributors
        </CardTitle>
        <CardDescription>
          Community members leading by XP and task completion
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No contributors yet</p>
          </div>
        ) : (
          entries.map((entry) => {
            const displayName = entry.user.firstName && entry.user.lastName 
              ? `${entry.user.firstName} ${entry.user.lastName}` 
              : entry.user.email?.split('@')[0] || 'Anonymous'

            return (
              <div 
                key={entry.user.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                data-testid={`row-leaderboard-${entry.rank}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.user.profileImageUrl} />
                    <AvatarFallback>
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" data-testid={`text-leader-name-${entry.rank}`}>
                        {displayName}
                      </span>
                      {entry.user.role === 'organizer' && (
                        <Badge variant="outline" className="text-xs">
                          Organizer
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.tasksCompleted} tasks completed
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xp font-bold">
                      <Zap className="h-4 w-4" />
                      <span data-testid={`text-leader-xp-${entry.rank}`}>{entry.totalXp}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">XP</div>
                  </div>
                  
                  <Badge className={getRankBadgeColor(entry.rank)}>
                    #{entry.rank}
                  </Badge>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
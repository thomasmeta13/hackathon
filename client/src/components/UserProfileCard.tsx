import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Zap, Target, Star, Settings } from "lucide-react"

export interface UserProfileCardProps {
  user: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    profileImageUrl?: string
    role: string
    xp: number
    skills: string[]
    badges: string[]
    profileCompletion: number
  }
  onEditProfile?: () => void
  className?: string
}

export function UserProfileCard({ user, onEditProfile, className = "" }: UserProfileCardProps) {
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email?.split('@')[0] || 'Anonymous'

  const getXpLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1
  }

  const getXpProgress = (xp: number) => {
    return (xp % 100)
  }

  const getRoleColor = () => {
    return user.role === 'organizer' 
      ? "bg-primary text-primary-foreground" 
      : "bg-secondary text-secondary-foreground"
  }

  return (
    <Card className={`hover-elevate transition-all ${className}`} data-testid="card-user-profile">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12" data-testid="avatar-user">
            <AvatarImage src={user.profileImageUrl} />
            <AvatarFallback className="text-lg font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg" data-testid="text-username">
              {displayName}
            </CardTitle>
            <CardDescription data-testid="text-user-email">
              {user.email}
            </CardDescription>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onEditProfile}
          data-testid="button-edit-profile"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={getRoleColor()} data-testid="badge-user-role">
            {user.role}
          </Badge>
          <div className="flex items-center gap-1 text-xp">
            <Zap className="h-4 w-4" />
            <span className="font-bold" data-testid="text-user-xp">{user.xp} XP</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              Level {getXpLevel(user.xp)}
            </span>
            <span className="text-muted-foreground" data-testid="text-xp-progress">
              {getXpProgress(user.xp)}/100 XP
            </span>
          </div>
          <Progress value={getXpProgress(user.xp)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              Profile Completion
            </span>
            <span className="text-muted-foreground" data-testid="text-profile-completion">
              {user.profileCompletion}%
            </span>
          </div>
          <Progress value={user.profileCompletion} className="h-2" />
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Star className="h-4 w-4 text-muted-foreground" />
              Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {user.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  data-testid={`badge-skill-${index}`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.badges && user.badges.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              Badges
            </h4>
            <div className="flex flex-wrap gap-1">
              {user.badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  className="text-xs bg-chart-3 text-white"
                  data-testid={`badge-achievement-${index}`}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Users, Target, Star, Settings, Calendar, Award } from "lucide-react"

export interface OrganizationProfileCardProps {
  user: {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    profileImageUrl?: string
    role: string
    profileCompletion: number
  }
  onEditProfile?: () => void
  className?: string
}

export function OrganizationProfileCard({ user, onEditProfile, className = "" }: OrganizationProfileCardProps) {
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email?.split('@')[0] || 'Organization'

  // Mock data for organization metrics - in real app, this would come from API
  const organizationStats = {
    tasksCreated: 12,
    activeVolunteers: 45,
    tasksCompleted: 8,
    communityImpact: 87
  }

  return (
    <Card className={`hover-elevate transition-all ${className}`} data-testid="card-organization-profile">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12" data-testid="avatar-organization">
            <AvatarImage src={user.profileImageUrl} />
            <AvatarFallback className="text-lg font-semibold bg-blue-600 text-white">
              <Building2 className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg" data-testid="text-organization-name">
              {displayName}
            </CardTitle>
            <CardDescription data-testid="text-organization-email">
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
          <Badge className="bg-blue-600 text-white" data-testid="badge-organization-role">
            Organization
          </Badge>
          <div className="flex items-center gap-1 text-blue-600">
            <Building2 className="h-4 w-4" />
            <span className="font-bold" data-testid="text-organization-status">Active</span>
          </div>
        </div>

        {/* Organization Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600" data-testid="text-tasks-created">
              {organizationStats.tasksCreated}
            </div>
            <div className="text-xs text-muted-foreground">Tasks Created</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-600" data-testid="text-active-volunteers">
              {organizationStats.activeVolunteers}
            </div>
            <div className="text-xs text-muted-foreground">Active Volunteers</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600" data-testid="text-tasks-completed">
              {organizationStats.tasksCompleted}
            </div>
            <div className="text-xs text-muted-foreground">Tasks Completed</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-orange-600" data-testid="text-community-impact">
              {organizationStats.communityImpact}%
            </div>
            <div className="text-xs text-muted-foreground">Community Impact</div>
          </div>
        </div>

        {/* Profile Completion */}
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

        {/* Quick Actions */}
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onEditProfile}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Organization
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

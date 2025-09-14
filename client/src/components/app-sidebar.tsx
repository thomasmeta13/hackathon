import { Home, Trophy, Users, BarChart3, Plus, User, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Link, useLocation } from "wouter"
import { User as UserType } from "@shared/schema"

export function AppSidebar() {
  const { user } = useAuth()
  const [location] = useLocation()
  
  const typedUser = user as UserType | undefined
  const displayName = (typedUser?.firstName && typedUser?.lastName) 
    ? `${typedUser.firstName} ${typedUser.lastName}` 
    : typedUser?.email?.split('@')[0] || 'User'

  const isOrganizer = typedUser?.role === 'organizer'

  // Navigation items for all users
  const mainItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      testId: "nav-dashboard"
    },
    {
      title: "Quest Board",
      url: "/quests",
      icon: Trophy,
      testId: "nav-quests"
    },
    {
      title: "Leaderboard",
      url: "/leaderboard", 
      icon: Users,
      testId: "nav-leaderboard"
    }
  ]

  // Additional items for organizers
  const organizerItems = [
    {
      title: "Create Task",
      url: "/create-task",
      icon: Plus,
      testId: "nav-create-task"
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      testId: "nav-analytics"
    }
  ]

  const userItems = [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
      testId: "nav-profile"
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      testId: "nav-settings"
    }
  ]

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg" data-testid="text-app-title">HTW Earn Hub</h2>
            <p className="text-xs text-muted-foreground">Gamified Tasks</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isOrganizer && (
          <SidebarGroup>
            <SidebarGroupLabel>Organizer Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {organizerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url}>
                      <Link href={item.url} data-testid={item.testId}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src={typedUser?.profileImageUrl} />
            <AvatarFallback className="text-xs">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate" data-testid="text-sidebar-username">
              {displayName}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {typedUser?.role}
              </Badge>
              {typedUser?.role === 'tasker' && typedUser?.xp !== undefined && (
                <span className="text-xs text-muted-foreground" data-testid="text-sidebar-xp">
                  {typedUser.xp} XP
                </span>
              )}
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
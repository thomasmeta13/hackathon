import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Target, Calendar } from "lucide-react";

export default function Login() {
  const handleOrganizationLogin = () => {
    // Set user in localStorage and navigate to organization onboarding
    const user = {
      id: 'org-' + Date.now(),
      role: 'organizer',
      email: 'org@htw2025.com',
      firstName: 'Organization',
      lastName: 'User'
    };
    localStorage.setItem('htw-user', JSON.stringify(user));
    window.location.href = "/onboarding/organization";
  };

  const handleTaskerLogin = () => {
    // Set user in localStorage and navigate to tasker onboarding
    const user = {
      id: 'tasker-' + Date.now(),
      role: 'tasker',
      email: 'tasker@htw2025.com',
      firstName: 'Tasker',
      lastName: 'User'
    };
    localStorage.setItem('htw-user', JSON.stringify(user));
    window.location.href = "/onboarding/tasker";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HTW Earn Hub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect organizers with community members through gamified task management for Honolulu Tech Week
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3 w-3" />
              XP Rewards
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Trophy className="h-3 w-3" />
              Leaderboards
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              Community
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              Real Events
            </Badge>
          </div>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Organization Login */}
          <Card className="hover-elevate">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl" data-testid="text-organization-title">
                I'm an Organization
              </CardTitle>
              <CardDescription data-testid="text-organization-description">
                Create and manage tasks for Honolulu Tech Week events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Post tasks for your events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Manage volunteer contributions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Track event progress</span>
                </div>
              </div>
              <Button 
                onClick={handleOrganizationLogin}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                data-testid="button-organization-login"
              >
                Continue as Organization
              </Button>
            </CardContent>
          </Card>

          {/* Tasker Login */}
          <Card className="hover-elevate">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl" data-testid="text-tasker-title">
                I'm a Tasker
              </CardTitle>
              <CardDescription data-testid="text-tasker-description">
                Complete tasks and earn XP for Honolulu Tech Week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Browse and claim tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Earn XP and badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Climb the leaderboard</span>
                </div>
              </div>
              <Button 
                onClick={handleTaskerLogin}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                data-testid="button-tasker-login"
              >
                Continue as Tasker
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our terms of service and privacy policy
          </p>
          <p className="mt-2">
            Powered by Replit Auth - secure and trusted authentication
          </p>
        </div>
      </div>
    </div>
  );
}
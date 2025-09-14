import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import QuestBoard from "@/pages/QuestBoard";
import Leaderboard from "@/pages/Leaderboard";
import OrganizationOnboarding from "@/pages/onboarding/OrganizationOnboarding";
import TaskerOnboarding from "@/pages/onboarding/TaskerOnboarding";
import TaskDetail from "@/pages/TaskDetail";
import CreateTask from "@/pages/CreateTask";
import Analytics from "@/pages/Analytics";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/onboarding/organization" component={OrganizationOnboarding} />
      <Route path="/onboarding/tasker" component={TaskerOnboarding} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/quests" component={QuestBoard} />
          <Route path="/task/:id" component={TaskDetail} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/create-task" component={CreateTask} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/profile" component={Dashboard} />
          <Route path="/settings" component={Dashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <Router />;
  }

  // Custom sidebar width for HTW Earn Hub
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={async () => {
                  try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    window.location.href = '/login';
                  } catch (error) {
                    console.error('Logout failed:', error);
                    window.location.href = '/login';
                  }
                }}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="htw-earn-hub-theme">
        <TooltipProvider>
          <AuthenticatedApp />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
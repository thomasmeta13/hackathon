import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Trophy, Target, Users, Star, Code, Palette, Megaphone, Calendar } from "lucide-react";

const taskerSchema = z.object({
  skills: z.array(z.string()).optional(),
});

type TaskerForm = z.infer<typeof taskerSchema>;

const availableSkills = [
  { id: "development", label: "Development", icon: Code, color: "bg-blue-500" },
  { id: "design", label: "Design", icon: Palette, color: "bg-purple-500" },
  { id: "marketing", label: "Marketing", icon: Megaphone, color: "bg-green-500" },
  { id: "event_planning", label: "Event Planning", icon: Calendar, color: "bg-orange-500" },
  { id: "content_creation", label: "Content Creation", icon: Star, color: "bg-yellow-500" },
  { id: "community", label: "Community", icon: Users, color: "bg-pink-500" },
];

export default function TaskerOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const form = useForm<TaskerForm>({
    resolver: zodResolver(taskerSchema),
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = async (data: TaskerForm) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await apiRequest("/api/user/profile", "PATCH", {
        skills: data.skills,
        profileCompletion: 100,
      });

      await refetch();

      toast({
        title: "Profile completed successfully!",
        description: "Welcome to HTW Earn Hub. Start claiming tasks to earn XP!",
      });

      setLocation("/");
    } catch (error) {
      toast({
        title: "Profile update failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome, Tasker!
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Complete your profile to start earning XP and claiming tasks
          </p>
          {user && (
            <p className="text-sm text-muted-foreground">
              Hello, <span className="font-medium">{user.firstName || user.email || 'User'}</span>!
            </p>
          )}
        </div>

        {/* Gamification Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Claim Tasks</h3>
                <p className="text-xs text-muted-foreground">Browse and claim tasks that match your skills</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Earn XP</h3>
                <p className="text-xs text-muted-foreground">Complete tasks to earn experience points</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Leaderboard</h3>
                <p className="text-xs text-muted-foreground">Climb the ranks and earn badges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Skills</CardTitle>
            <CardDescription>
              Choose areas where you'd like to contribute. This helps us recommend relevant tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Areas of Interest</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {availableSkills.map((skill) => {
                          const Icon = skill.icon;
                          const isSelected = (field.value || []).includes(skill.id);
                          return (
                            <div 
                              key={skill.id}
                              className={`
                                flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${isSelected 
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                                  : 'border-border hover:border-purple-300 hover:bg-muted/50'
                                }
                              `}
                              onClick={() => {
                                const currentSkills = field.value || [];
                                const updatedSkills = currentSkills.includes(skill.id)
                                  ? currentSkills.filter((s) => s !== skill.id)
                                  : [...currentSkills, skill.id];
                                field.onChange(updatedSkills);
                              }}
                            >
                              {/* Custom checkbox indicator */}
                              <div className={`
                                w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                                ${isSelected 
                                  ? 'bg-purple-500 border-purple-500' 
                                  : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                                }
                              `}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className={`w-8 h-8 rounded-full ${skill.color} flex items-center justify-center`}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <span className="font-medium text-sm">{skill.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch("skills") || []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {(form.watch("skills") || []).map((skillId) => {
                        const skill = availableSkills.find(s => s.id === skillId);
                        if (!skill) return null;
                        const Icon = skill.icon;
                        return (
                          <Badge key={skillId} variant="secondary" className="gap-1">
                            <div className={`w-3 h-3 rounded-full ${skill.color}`}></div>
                            <Icon className="h-3 w-3" />
                            {skill.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="flex-1"
                    data-testid="button-skip"
                  >
                    Skip for Now
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || (form.watch("skills") || []).length === 0}
                    className="flex-1"
                    data-testid="button-complete-profile"
                  >
                    {isSubmitting ? "Saving..." : "Complete Profile"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
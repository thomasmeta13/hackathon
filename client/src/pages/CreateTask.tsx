import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCreateTask } from "@/hooks/useTasks";
import { Plus, ArrowLeft, Lightbulb, Target, Clock, Users, Bot, Sparkles } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  type: z.string().min(1, "Please select a type"),
  reward: z.number().min(10, "Reward must be at least 10 XP"),
  estimatedHours: z.number().min(1, "Must be at least 1 hour"),
  skills: z.array(z.string()).optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

const categories = [
  "Marketing & Promotion",
  "Content Creation", 
  "Event Planning",
  "Technical Development",
  "Design & Graphics",
  "Community Outreach",
  "Video Production",
  "Writing & Documentation"
];

const taskTypes = [
  { value: "individual", label: "Individual Task", description: "Completed by one person" },
  { value: "collaborative", label: "Collaborative Task", description: "Requires team coordination" },
  { value: "creative", label: "Creative Task", description: "Artistic or design-focused" },
  { value: "technical", label: "Technical Task", description: "Development or technical work" },
  { value: "research", label: "Research Task", description: "Information gathering and analysis" }
];

const skillTags = [
  "Social Media", "Video Production", "Graphic Design", "Web Development",
  "Event Planning", "Photography", "Writing", "Marketing", "Community Outreach",
  "Project Management", "Data Analysis", "Content Creation", "UI/UX Design"
];

export default function CreateTask() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createTaskMutation = useCreateTask();

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      type: "",
      reward: 50,
      estimatedHours: 2,
      skills: [],
    },
  });

  const watchedSkills = form.watch("skills") || [];

  const onSubmit = async (data: TaskForm) => {
    setIsSubmitting(true);
    try {
      await createTaskMutation.mutateAsync(data);
      toast({
        title: "Task created successfully!",
        description: "Your task has been published to the community.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Failed to create task",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues("skills") || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    form.setValue("skills", newSkills);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Task</h1>
          <p className="text-muted-foreground">
            Publish a task for the HTW 2025 community to work on
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Task Details
              </CardTitle>
              <CardDescription>
                Provide clear information to help taskers understand what you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Create promotional video for HTW 2025"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed information about what needs to be done, including requirements, deliverables, and any specific guidelines..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {taskTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reward"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>XP Reward *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Hours *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="2"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-3">
                    <FormLabel>Required Skills (Optional)</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {skillTags.map((skill) => (
                        <Badge
                          key={skill}
                          variant={watchedSkills.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer hover-elevate"
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click on skills that are required for this task
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Creating..." : "Create Task"}
                      <Plus className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Task Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Task Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        Smart Suggestions
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        Based on your community's preferences, I recommend Marketing and Design tasks for highest engagement.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Optimal Reward Range
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Tasks with 50-100 XP have 87% completion rate in your community.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Best Posting Time
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Tuesday-Thursday 2-6 PM gets 23% more task claims.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // Auto-fill form with AI suggestions
                  form.setValue("title", "Create promotional content for HTW 2025");
                  form.setValue("description", "Design and create engaging promotional materials including social media graphics, flyers, and digital banners for Honolulu Tech Week 2025. Include event details, dates, and compelling visuals that capture the tech community spirit.");
                  form.setValue("category", "Marketing & Promotion");
                  form.setValue("type", "creative");
                  form.setValue("reward", 75);
                  form.setValue("estimatedHours", 3);
                  form.setValue("skills", ["Graphic Design", "Marketing", "Content Creation"]);
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Auto-fill with AI Suggestion
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Tips for Great Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Be Specific</p>
                    <p className="text-muted-foreground">Clear requirements lead to better results</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Realistic Timeline</p>
                    <p className="text-muted-foreground">Consider the complexity when setting hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Fair Rewards</p>
                    <p className="text-muted-foreground">Match XP to effort and value delivered</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Title:</span>
                  <p className="text-muted-foreground">
                    {form.watch("title") || "Your task title will appear here"}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Reward:</span>
                  <span className="ml-2 text-blue-600 font-medium">
                    {form.watch("reward") || 0} XP
                  </span>
                </div>
                <div>
                  <span className="font-medium">Estimated Time:</span>
                  <span className="ml-2 text-green-600 font-medium">
                    {form.watch("estimatedHours") || 0} hours
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

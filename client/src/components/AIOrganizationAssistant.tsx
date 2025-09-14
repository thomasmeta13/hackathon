import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Sparkles, Plus, Target, BarChart3, Lightbulb, MessageSquare, TrendingUp, Users, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface TaskSuggestion {
  title: string;
  description: string;
  category: string;
  reward: number;
  skills: string[];
}

export function AIOrganizationAssistant({ onTaskCreate, user, tasks, stats }: { 
  onTaskCreate?: (task: any) => void;
  user?: any;
  tasks?: any[];
  stats?: any;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your HTW Earn Hub AI assistant. I can help you create tasks, analyze performance, and provide insights to boost your organization's success. What would you like to do today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskReward, setTaskReward] = useState(50);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await fetch('/api/ai/organization-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: {
            organizationName: user?.organizationName || "HTW Organization",
            userName: user?.name || user?.email || "Organizer",
            userRole: user?.role || "organizer",
            recentTasks: tasks?.slice(0, 5) || [],
            performance: {
              completionRate: stats?.completionRate || 87,
              avgTaskTime: stats?.avgTaskTime || "2.3h",
              activeMembers: stats?.activeMembers || 45,
              totalTasks: stats?.totalTasks || (tasks?.length || 12),
              completedTasks: stats?.completedTasks || 0
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !taskDescription.trim() || !taskCategory) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (onTaskCreate) {
      onTaskCreate({
        title: taskTitle,
        description: taskDescription,
        category: taskCategory,
        type: "coding", // Default type
        reward: taskReward,
      });
      
      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setTaskCategory("");
      setTaskReward(50);
      
      toast({
        title: "Task created!",
        description: "Your new task has been published to the community.",
      });
    }
  };

  const suggestedQuestions = [
    "How can I improve task completion rates?",
    "What types of tasks work best for my community?",
    "Suggest some task ideas for HTW 2025",
    "How is my organization performing?"
  ];

  const suggestedTasks: TaskSuggestion[] = [
    {
      title: "Create HTW 2025 promotional graphics",
      description: "Design eye-catching graphics for social media promotion",
      category: "Design & Graphics",
      reward: 75,
      skills: ["Graphic Design", "Social Media"]
    },
    {
      title: "Develop workshop marketing campaign",
      description: "Create and execute marketing strategy for upcoming workshops",
      category: "Marketing & Promotion",
      reward: 100,
      skills: ["Marketing", "Content Creation"]
    },
    {
      title: "Record event highlight videos",
      description: "Film and edit short videos showcasing event highlights",
      category: "Video Production",
      reward: 150,
      skills: ["Video Production", "Content Creation"]
    },
    {
      title: "Create technical documentation",
      description: "Write comprehensive guides for workshop materials",
      category: "Content Creation",
      reward: 80,
      skills: ["Technical Writing", "Documentation"]
    }
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggested Tasks Section */}
      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Suggested Tasks
              </CardTitle>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showCreateForm ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Task Title *</label>
                    <Input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Create promotional graphics"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category *</label>
                    <select
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="marketing">Marketing</option>
                      <option value="design">Design</option>
                      <option value="development">Development</option>
                      <option value="content_creation">Content Creation</option>
                      <option value="event_prep">Event Prep</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <Textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Describe what needs to be done..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Reward (XP):</label>
                    <Input
                      type="number"
                      value={taskReward}
                      onChange={(e) => setTaskReward(Number(e.target.value))}
                      className="w-20"
                      min="10"
                      max="500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Task
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  AI-generated task suggestions based on your community's preferences and performance
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedTasks.map((task, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{task.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {task.reward} XP
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {task.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setTaskTitle(task.title);
                                setTaskDescription(task.description);
                                setTaskCategory(task.category.toLowerCase().replace(' & ', '_').replace(' ', '_'));
                                setTaskReward(task.reward);
                                setShowCreateForm(true);
                              }}
                              className="ml-2"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Use
                            </Button>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Category: {task.category}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      {/* Performance Insights Section */}
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="text-xs text-muted-foreground">↑ 12% this month</div>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Active Members</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">45</div>
                <div className="text-xs text-muted-foreground">↑ 8 new this week</div>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Avg. Task Time</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">2.3h</div>
                <div className="text-xs text-muted-foreground">↓ 8% faster</div>
              </div>
              
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Total Tasks</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-xs text-muted-foreground">3 completed this week</div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* AI Chat Section */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Suggested Questions */}
          <div className="px-6 pb-4 border-b">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInputValue(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages - Fixed height with scroll */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="px-6 py-4">
                <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900">
                          <Bot className="h-4 w-4 text-purple-600" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.type === 'user' && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                          <span className="text-xs font-medium">U</span>
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-purple-100 dark:bg-purple-900">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </ScrollArea>
          </div>
                
          {/* Input - Fixed at bottom */}
          <div className="p-6 border-t bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

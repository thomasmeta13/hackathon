import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Task } from "@shared/schema";
import { Trophy, Clock, Star, Lightbulb, Zap, Send, ArrowLeft, Bot, User, Loader2, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { QuestExecution } from "@/components/QuestExecution";

export default function TaskDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [aiInput, setAiInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);
  const [isExecutingQuest, setIsExecutingQuest] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch task details
  const { data: task, isLoading } = useQuery<Task>({
    queryKey: [`/api/tasks/${id}`],
    enabled: !!id,
  });

  // Start quest mutation
  const startQuestMutation = useMutation({
    mutationFn: async () => {
      if (!task || !user) throw new Error("Missing task or user");
      
      return await apiRequest(`/api/tasks/${task.id}/claim`, "POST", { userId: (user as any).id });
    },
    onSuccess: () => {
      toast({
        title: "Quest Started!",
        description: "You've successfully claimed this task. Good luck!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${id}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start quest. Please try again.",
        variant: "destructive",
      });
    },
  });

  // AI assistance mutation
  const aiAssistMutation = useMutation({
    mutationFn: async (input: string) => {
      if (!task) throw new Error("Missing task");
      
      const response = await apiRequest("/api/ai/task-help", "POST", { 
        taskId: task.id,
        userInput: input,
        taskTitle: task.title,
        taskDescription: task.description,
      });
      return await response.json();
    },
    onSuccess: async (data: any, input: string) => {
      // Add user message first
      const userMessage = {
        id: `user-${Date.now()}`,
        type: 'user' as const,
        content: input,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setAiInput("");
      
      // Parse the response properly
      let response = "I'm sorry, I couldn't process your request. Please try again.";
      
      console.log('AI Response data:', data); // Debug log
      
      try {
        if (typeof data === 'string') {
          response = data;
        } else if (data && typeof data === 'object') {
          // The server sends { response: "..." }
          response = data.response || data.message || data.content || "I'm here to help! What would you like to know about this task?";
          console.log('Parsed response:', response);
        }
      } catch (error) {
        console.error('Error parsing AI response:', error);
        response = "I'm here to help! What would you like to know about this task?";
      }
      
      // Add AI response
      const aiMessage = {
        id: `ai-${Date.now() + 1}`,
        type: 'ai' as const,
        content: response,
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "AI Assistant",
        description: "Got your response!",
      });
    },
    onError: (error) => {
      console.error('AI Assistant error:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'ai' as const,
        content: "I'm sorry, I'm having trouble connecting right now. This might be because the AI service isn't configured yet. Please try again later or contact support if the issue persists.",
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "AI Assistant Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartQuest = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to start quests",
        variant: "destructive",
      });
      return;
    }
    setIsExecutingQuest(true);
  };

  const handleCompleteQuest = () => {
    setIsExecutingQuest(false);
    toast({
      title: "Quest Completed!",
      description: "Great job on completing this quest!",
    });
  };

  const handleAiAssist = () => {
    if (!aiInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a question or describe what you need help with",
        variant: "destructive",
      });
      return;
    }
    aiAssistMutation.mutate(aiInput);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading quest details...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quest Not Found</h2>
          <p className="text-muted-foreground">The quest you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }


  const statusColors = {
    unclaimed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    in_progress: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Quest Execution Mode */}
        {isExecutingQuest ? (
          <QuestExecution 
            task={task} 
            onComplete={handleCompleteQuest}
          />
        ) : (
          <>
            {/* Task Details */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <CardTitle className="text-2xl" data-testid="text-task-title">
                  {task.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="secondary"
                    data-testid="badge-category"
                  >
                    {task.category}
                  </Badge>
                  <Badge 
                    className={statusColors[task.status as keyof typeof statusColors]}
                    data-testid="badge-status"
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="secondary" className="gap-1" data-testid="badge-xp">
                    <Trophy className="w-3 h-3" />
                    {task.reward} XP
                  </Badge>
                  <Badge variant="outline" data-testid="badge-type">
                    {task.type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              {task.status === 'unclaimed' && (
                <Button 
                  onClick={handleStartQuest}
                  disabled={startQuestMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  data-testid="button-start-quest"
                >
                  {startQuestMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Quest
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Quest Description</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                {task.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Task Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground">Category: {task.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground">Type: {task.type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-muted-foreground">Reward: {task.reward} XP</span>
                </div>
              </div>
            </div>

            {/* AI Quest Assistant Chat */}
            <div className="border-t pt-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bot className="w-5 h-5 text-purple-600" />
                    AI Quest Assistant
                  </CardTitle>
                  <CardDescription>
                    Chat with AI to get personalized guidance and suggestions for completing this quest
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <div className="border rounded-lg bg-white dark:bg-gray-800 flex flex-col" style={{ height: '400px' }}>
                    <ScrollArea className="flex-1 p-4">
                      {chatMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <Bot className="w-12 h-12 text-purple-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">Welcome to AI Quest Assistant!</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Ask me anything about this quest. I can help with:
                            </p>
                            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              <div>• Step-by-step guidance</div>
                              <div>• Tool recommendations</div>
                              <div>• Best practices</div>
                              <div>• Troubleshooting tips</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              {message.type === 'ai' && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarFallback className="bg-purple-100 text-purple-600">
                                    <Bot className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  message.type === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                <div className="whitespace-pre-wrap text-sm">
                                  {message.content}
                                </div>
                                <div className={`text-xs mt-1 ${
                                  message.type === 'user' 
                                    ? 'text-blue-100' 
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {message.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                              {message.type === 'user' && (
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    <User className="w-4 h-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))}
                          {aiAssistMutation.isPending && (
                            <div className="flex gap-3 justify-start">
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  <Bot className="w-4 h-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  AI is thinking...
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Suggested Questions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "How should I start this task?",
                        "What tools do I need?",
                        "Give me step-by-step guidance",
                        "What are common pitfalls to avoid?",
                        "How can I make this more efficient?"
                      ].map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setAiInput(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask for help with this quest... (e.g., 'How should I start?', 'What tools do I need?', 'Give me step-by-step guidance')"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      className="min-h-[60px] resize-none"
                      data-testid="input-ai-question"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAiAssist();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleAiAssist}
                      disabled={aiAssistMutation.isPending || !aiInput.trim()}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4"
                      data-testid="button-ai-assist"
                    >
                      {aiAssistMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  );
}
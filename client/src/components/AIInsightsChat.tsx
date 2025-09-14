import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles, TrendingUp, Users, Target } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIInsightsChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your HTW Earn Hub AI assistant. I can help you analyze your organization's performance, suggest task improvements, and provide insights to boost community engagement. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('task') && input.includes('create')) {
      return "Based on your community activity, I recommend creating tasks that combine multiple skills. Try tasks like 'Create a promotional video for HTW 2025' which involves video production, marketing, and content creation. This attracts more diverse contributors and increases completion rates by 40%.";
    }
    
    if (input.includes('engagement') || input.includes('active')) {
      return "Your community engagement is strong! To boost it further, consider: 1) Adding gamification elements like bonus XP for early completions, 2) Creating collaborative tasks that require team coordination, 3) Offering exclusive badges for consistent contributors. These strategies typically increase participation by 60%.";
    }
    
    if (input.includes('analytics') || input.includes('stats')) {
      return "Here's what I see in your data: Task completion rate is 78% (above average), peak activity is Tuesday-Thursday 2-6 PM, most popular categories are Marketing and Design. Consider scheduling task releases during peak hours and creating more design-focused content to maximize engagement.";
    }
    
    if (input.includes('improve') || input.includes('better')) {
      return "To improve your organization's performance: 1) Break down large tasks into smaller milestones, 2) Provide clear success criteria and examples, 3) Add progress tracking features, 4) Send regular updates to taskers. Organizations using these practices see 35% higher task completion rates.";
    }
    
    if (input.includes('community') || input.includes('member')) {
      return "Your community shows great potential! Top contributors are active 4-5 times per week. To retain them: 1) Recognize top performers publicly, 2) Offer mentorship opportunities, 3) Create exclusive events for active members, 4) Provide skill development resources. This builds long-term loyalty and attracts new talent.";
    }
    
    return "That's a great question! Based on HTW Earn Hub best practices, I'd recommend focusing on clear communication, setting realistic deadlines, and providing regular feedback. Would you like me to dive deeper into any specific area like task creation, community engagement, or performance analytics?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I improve task completion rates?",
    "What types of tasks work best for my community?",
    "How can I increase member engagement?",
    "What analytics should I focus on?"
  ];

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Insights Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Suggested Questions */}
        <div className="px-6 pb-4">
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

        {/* Messages */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <Avatar className="h-8 w-8">
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
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                      <span className="text-xs font-medium">U</span>
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
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
        </ScrollArea>

        {/* Input */}
        <div className="p-6 pt-0">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your organization's performance..."
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
  );
}

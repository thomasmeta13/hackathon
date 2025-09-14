import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  RefreshCw, 
  Download, 
  Copy,
  CheckCircle,
  Clock,
  Lightbulb,
  Image as ImageIcon
} from "lucide-react";

interface QuestExecutionProps {
  task: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    reward: number;
  };
  onComplete?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function QuestExecution({ task, onComplete }: QuestExecutionProps) {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Initialize with first AI message and image generation
  useEffect(() => {
    if (!currentImage && !isGeneratingImage) {
      generateInitialImage();
    }
  }, []);

  const generateInitialImage = async () => {
    setIsGeneratingImage(true);
    try {
      // Generate initial DALL-E prompt and image
      const response = await fetch('/api/ai/generate-infographic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
          taskCategory: task.category,
          iteration: 0,
          userFeedback: null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate initial image');
      }

      const data = await response.json();
      setCurrentPrompt(data.prompt);
      setCurrentImage(data.imageUrl);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've created an initial infographic for "${task.title}". The image shows a visual representation of the key concepts and information. You can see the prompt I used and provide feedback to improve it.`,
        timestamp: new Date()
      };
      setChatMessages([aiMessage]);

    } catch (error) {
      console.error('Error generating initial image:', error);
      toast({
        title: "Failed to generate image",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput("");
    setIsGenerating(true);

    try {
      // Send feedback to AI and generate new image
      const response = await fetch('/api/ai/generate-infographic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
          taskCategory: task.category,
          iteration: chatMessages.length,
          userFeedback: currentInput,
          currentPrompt: currentPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process feedback');
      }

      const data = await response.json();
      
      // Update prompt and image
      setCurrentPrompt(data.prompt);
      setCurrentImage(data.imageUrl);

      // Add AI response
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error processing feedback:', error);
      toast({
        title: "Failed to process feedback",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch('/api/ai/generate-infographic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
          taskCategory: task.category,
          iteration: chatMessages.length,
          userFeedback: "Regenerate with same prompt",
          currentPrompt: currentPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate image');
      }

      const data = await response.json();
      setCurrentImage(data.imageUrl);

    } catch (error) {
      console.error('Error regenerating image:', error);
      toast({
        title: "Failed to regenerate image",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Prompt copied!",
        description: "The prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `${task.title.replace(/\s+/g, '_')}_infographic.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quest Execution</h2>
          <p className="text-muted-foreground">Create and iterate on your infographic</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={regenerateImage} disabled={isGeneratingImage}>
            {isGeneratingImage ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Regenerate
          </Button>
          {currentImage && (
            <Button variant="outline" onClick={downloadImage}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Instructions and Prompt */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Task: {task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium">Guidelines:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Create a visually appealing infographic</li>
                    <li>• Include key information and data points</li>
                    <li>• Use clear typography and color scheme</li>
                    <li>• Make it shareable on social media</li>
                    <li>• Ensure it's accessible and readable</li>
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{task.category}</Badge>
                  <Badge variant="outline">{task.type}</Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {task.reward} XP
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  DALL-E Prompt
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPrompt}
                  className="h-8"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <div className="text-sm font-mono bg-muted p-3 rounded-lg">
                  {currentPrompt || "Generating prompt..."}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Image and Chat */}
        <div className="space-y-6">
          {/* Generated Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Generated Infographic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                {isGeneratingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Generating image...</p>
                    </div>
                  </div>
                ) : currentImage ? (
                  <img 
                    src={currentImage} 
                    alt="Generated infographic" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No image generated yet</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="flex flex-col" style={{ height: '500px' }}>
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chat with AI Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-hidden min-h-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {chatMessages.map((message) => (
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
                    {isGenerating && (
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
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
              
              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Provide feedback on the image... (e.g., 'Make it more colorful', 'Add more text', 'Change the layout')"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[60px] max-h-[120px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isGenerating || !userInput.trim()}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex-shrink-0"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

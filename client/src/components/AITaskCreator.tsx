import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Lightbulb, RefreshCw } from "lucide-react"

export interface AITaskCreatorProps {
  onTaskCreate?: (task: {
    title: string
    description: string
    category: string
    type: string
    reward: number
  }) => void
  className?: string
}

export function AITaskCreator({ onTaskCreate, className = "" }: AITaskCreatorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTask, setGeneratedTask] = useState<{
    title: string
    description: string
    category: string
    type: string
    reward: number
  } | null>(null)

  const categories = [
    { value: "marketing", label: "Marketing" },
    { value: "event_prep", label: "Event Preparation" },
    { value: "content_creation", label: "Content Creation" },
    { value: "development", label: "Development" },
    { value: "design", label: "Design" },
    { value: "community", label: "Community" }
  ]

  const types = [
    { value: "image_generation", label: "Image Generation" },
    { value: "video_creation", label: "Video Creation" },
    { value: "coding", label: "Coding" },
    { value: "writing", label: "Writing" },
    { value: "social_media", label: "Social Media" },
    { value: "event_planning", label: "Event Planning" },
    { value: "research", label: "Research" }
  ]

  const handleGenerateTask = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // todo: remove mock functionality - replace with actual OpenAI API call
    const mockGeneratedTask = {
      title: `HTW 2025: ${prompt}`,
      description: `Create compelling content for HTW 2025 based on the prompt: "${prompt}". This task involves developing high-quality materials that align with the event's goals and target audience. The deliverable should be engaging, professional, and suitable for sharing across multiple channels.`,
      category: "marketing",
      type: "content_creation",
      reward: Math.floor(Math.random() * 200) + 50
    }
    
    setGeneratedTask(mockGeneratedTask)
    setIsGenerating(false)
    console.log('AI task generated:', mockGeneratedTask)
  }

  const handleRefineTask = () => {
    if (!generatedTask) return
    
    console.log('Refine task triggered')
    // todo: remove mock functionality - implement task refinement
    setGeneratedTask({
      ...generatedTask,
      description: generatedTask.description + " [Refined with additional AI suggestions and improved clarity for better execution.]",
      reward: generatedTask.reward + 25
    })
  }

  const handleCreateTask = () => {
    if (!generatedTask) return
    
    onTaskCreate?.(generatedTask)
    console.log('Task created:', generatedTask)
    
    // Reset form
    setPrompt("")
    setGeneratedTask(null)
  }

  return (
    <Card className={`hover-elevate transition-all ${className}`} data-testid="card-ai-task-creator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="text-ai-creator-title">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Task Creator
        </CardTitle>
        <CardDescription>
          Describe what you need help with, and AI will suggest a detailed task for the community
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">What do you need the community to work on?</Label>
          <div className="flex gap-2">
            <Textarea
              id="ai-prompt"
              placeholder="e.g., Create a promotional video for our keynote speakers..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px]"
              data-testid="input-ai-prompt"
            />
          </div>
          <Button 
            onClick={handleGenerateTask}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
            data-testid="button-generate-task"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Task...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                Generate Task with AI
              </>
            )}
          </Button>
        </div>

        {generatedTask && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border" data-testid="section-generated-task">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" data-testid="text-generated-title">
                {generatedTask.title}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefineTask}
                data-testid="button-refine-task"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refine
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground" data-testid="text-generated-description">
              {generatedTask.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-chart-1 text-white" data-testid="badge-generated-category">
                {categories.find(c => c.value === generatedTask.category)?.label}
              </Badge>
              <Badge variant="outline" data-testid="badge-generated-type">
                {types.find(t => t.value === generatedTask.type)?.label}
              </Badge>
              <Badge className="bg-xp text-xp-foreground" data-testid="badge-generated-reward">
                {generatedTask.reward} XP
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-category">Category</Label>
                <Select value={generatedTask.category} onValueChange={(value) => 
                  setGeneratedTask({...generatedTask, category: value})
                }>
                  <SelectTrigger data-testid="select-task-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-type">Type</Label>
                <Select value={generatedTask.type} onValueChange={(value) => 
                  setGeneratedTask({...generatedTask, type: value})
                }>
                  <SelectTrigger data-testid="select-task-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-reward">XP Reward</Label>
                <Input 
                  type="number"
                  value={generatedTask.reward}
                  onChange={(e) => setGeneratedTask({
                    ...generatedTask, 
                    reward: parseInt(e.target.value) || 0
                  })}
                  data-testid="input-task-reward"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleCreateTask}
              className="w-full"
              data-testid="button-create-task"
            >
              Create Task for Community
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
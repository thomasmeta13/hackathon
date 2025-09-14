import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Zap, Star, ArrowRight, CheckCircle } from "lucide-react"

export default function Landing() {
  const features = [
    {
      icon: <Trophy className="h-6 w-6 text-primary" />,
      title: "Gamified Tasks",
      description: "Earn XP, unlock badges, and climb the leaderboard while contributing to HTW 2025"
    },
    {
      icon: <Zap className="h-6 w-6 text-warning" />,
      title: "AI-Powered Creation",
      description: "Smart task generation and guidance help organizers create meaningful community work"
    },
    {
      icon: <Users className="h-6 w-6 text-success" />,
      title: "Community Driven",
      description: "Connect with fellow tech enthusiasts and make HTW 2025 the best event yet"
    },
    {
      icon: <Star className="h-6 w-6 text-chart-3" />,
      title: "Skill Development",
      description: "Build your portfolio while helping organize one of Hawaii's premier tech events"
    }
  ]

  const stats = [
    { label: "Active Tasks", value: "127+" },
    { label: "Contributors", value: "89" },
    { label: "XP Earned", value: "15.2k" },
    { label: "Tasks Completed", value: "342" }
  ]

  const taskTypes = [
    "Social Media Content",
    "Video Production", 
    "Website Development",
    "Event Planning",
    "Graphic Design",
    "Community Outreach"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" data-testid="page-landing">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20" data-testid="badge-htw-2025">
                HTW 2025 Community Platform
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight" data-testid="text-hero-title">
                HTW <span className="text-primary">Earn Hub</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-hero-subtitle">
                Join the gamified platform where HTW organizers and community members collaborate through 
                AI-assisted task creation and rewarded contributions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => window.location.href = '/login'}
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold" data-testid="text-features-title">
              How HTW Earn Hub Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A gamified ecosystem where organizers create meaningful tasks and community members 
              earn rewards while building HTW 2025 together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-feature-${index}`}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-lg bg-muted">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Task Types Section */}
      <div className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold" data-testid="text-task-types-title">
                Contribute Your Skills
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from diverse task types that match your interests and expertise
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {taskTypes.map((type, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-sm py-2 px-4 hover-elevate"
                  data-testid={`badge-task-type-${index}`}
                >
                  <CheckCircle className="h-3 w-3 mr-2" />
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-gradient-to-br from-primary/5 to-chart-2/5 border-primary/20">
            <CardHeader className="space-y-4">
              <CardTitle className="text-3xl">Ready to Shape HTW 2025?</CardTitle>
              <CardDescription className="text-lg">
                Join our community of organizers and contributors making HTW 2025 extraordinary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/login'}
                  data-testid="button-join-community"
                >
                  Join the Community
                  <Trophy className="h-5 w-5 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Free to join • Earn XP and badges • Build your portfolio
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
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
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Building2, Award, CheckCircle, Globe, MapPin, Users, Mail, Phone, ExternalLink } from "lucide-react";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z.string().min(10, "Organization description must be at least 10 characters"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  industry: z.string().min(1, "Industry is required"),
  size: z.enum(["startup", "small", "medium", "large", "enterprise"]).default("small"),
  contactInfo: z.string().optional(),
  sponsorLevel: z.enum(["bronze", "silver", "gold", "platinum"]).default("bronze"),
  mission: z.string().min(20, "Mission statement must be at least 20 characters"),
  goals: z.string().min(20, "Goals must be at least 20 characters"),
});

type OrganizationForm = z.infer<typeof organizationSchema>;

export default function OrganizationOnboarding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<OrganizationForm>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      location: "",
      industry: "",
      size: "small",
      contactInfo: "",
      sponsorLevel: "bronze",
      mission: "",
      goals: "",
    },
  });

  const onSubmit = async (data: OrganizationForm) => {
    setIsSubmitting(true);
    try {
      await apiRequest("/api/organizations", "POST", data);

      toast({
        title: "Organization registered successfully!",
        description: "Welcome to HTW Earn Hub. You can now start creating tasks.",
      });

      setLocation("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sponsorLevelInfo = {
    bronze: { color: "bg-orange-500", description: "Community supporter" },
    silver: { color: "bg-gray-400", description: "Event sponsor" },
    gold: { color: "bg-yellow-500", description: "Major sponsor" },
    platinum: { color: "bg-purple-500", description: "Premier partner" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Organization Setup
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Set up your organization profile to start creating tasks for Honolulu Tech Week
          </p>
        </div>

        {/* Benefits Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Organization Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Task Creation</h3>
                <p className="text-xs text-muted-foreground">Post tasks for your events and projects</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Progress Tracking</h3>
                <p className="text-xs text-muted-foreground">Monitor task completion in real-time</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Community Access</h3>
                <p className="text-xs text-muted-foreground">Connect with motivated volunteers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Honolulu Tech Week Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              About Honolulu Tech Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Honolulu Tech Week is Hawaii's premier technology conference, bringing together innovators, 
                entrepreneurs, and tech enthusiasts from across the Pacific. As an organization partner, 
                you'll have access to our community of motivated volunteers and tech professionals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Community Reach</h4>
                    <p className="text-xs text-muted-foreground">Access to 500+ active tech professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Verified Volunteers</h4>
                    <p className="text-xs text-muted-foreground">All volunteers are verified and skilled</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Recognition</h4>
                    <p className="text-xs text-muted-foreground">Showcase your organization's impact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <ExternalLink className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Networking</h4>
                    <p className="text-xs text-muted-foreground">Connect with other organizations</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>
              Tell us about your organization to help taskers understand your mission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Tech Innovation Hawaii"
                              data-testid="input-organization-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="nonprofit">Non-profit</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of your organization and what you do..."
                            className="min-h-[100px]"
                            data-testid="input-organization-description"
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
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="e.g. Honolulu, HI"
                                className="pl-10"
                                data-testid="input-location"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                              <SelectItem value="small">Small (11-50 employees)</SelectItem>
                              <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                              <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://your-organization.com"
                              className="pl-10"
                              data-testid="input-website"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mission & Goals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Mission & Goals
                  </h3>

                  <FormField
                    control={form.control}
                    name="mission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Statement *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What is your organization's core mission and purpose?"
                            className="min-h-[100px]"
                            data-testid="input-mission"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goals for Honolulu Tech Week *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What do you hope to achieve through this platform? What types of tasks will you create?"
                            className="min-h-[100px]"
                            data-testid="input-goals"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact & Sponsorship */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contact & Sponsorship
                  </h3>

                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Email, phone, or other contact details for taskers to reach you"
                            className="min-h-[80px]"
                            data-testid="input-contact-info"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sponsorLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-sponsor-level">
                              <SelectValue placeholder="Select sponsor level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(sponsorLevelInfo).map(([level, info]) => (
                              <SelectItem key={level} value={level}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                                  <span className="capitalize">{level}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {info.description}
                                  </Badge>
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
                    disabled={isSubmitting}
                    className="flex-1"
                    data-testid="button-complete-setup"
                  >
                    {isSubmitting ? "Setting up..." : "Complete Setup"}
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
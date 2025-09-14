import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar, Award } from "lucide-react";

export interface OrganizationBannerProps {
  organization: {
    name: string;
    contactInfo?: string;
    sponsorLevel: string;
    imageUrl?: string;
  };
  stats: {
    totalTasks: number;
    activeMembers: number;
    completedTasks: number;
    activeTasks: number;
  };
}

export function OrganizationBanner({ organization, stats }: OrganizationBannerProps) {
  const getSponsorLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-orange-500';
      case 'silver': return 'bg-gray-400';
      case 'gold': return 'bg-yellow-500';
      case 'platinum': return 'bg-purple-500';
      default: return 'bg-orange-500';
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Organization Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-gray-800">
              <AvatarImage src={organization.imageUrl} />
              <AvatarFallback className="text-2xl font-bold bg-blue-600 text-white">
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {organization.name}
                </h1>
                <Badge 
                  className={`${getSponsorLevelColor(organization.sponsorLevel)} text-white border-0`}
                >
                  {organization.sponsorLevel.charAt(0).toUpperCase() + organization.sponsorLevel.slice(1)} Sponsor
                </Badge>
              </div>
              {organization.contactInfo && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {organization.contactInfo}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalTasks}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3" />
                Total Tasks
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.activeMembers}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Active Members
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.completedTasks}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Award className="h-3 w-3" />
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.activeTasks}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3" />
                In Progress
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

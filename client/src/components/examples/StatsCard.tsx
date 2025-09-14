import { StatsCard } from '../StatsCard'
import { Trophy, Users, CheckCircle, Clock } from 'lucide-react'

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatsCard
        title="Total Tasks"
        value="127"
        description="Active community tasks"
        icon={<Trophy className="h-4 w-4" />}
        trend={{ value: 12, direction: "up", label: "vs last week" }}
        color="primary"
      />
      
      <StatsCard
        title="Active Members"
        value="89"
        description="Contributors this month"
        icon={<Users className="h-4 w-4" />}
        trend={{ value: 8, direction: "up", label: "new this week" }}
        color="success"
      />
      
      <StatsCard
        title="Completed"
        value="42"
        description="Tasks finished"
        icon={<CheckCircle className="h-4 w-4" />}
        progress={{ value: 42, max: 127, label: "Completion rate" }}
        color="success"
      />
      
      <StatsCard
        title="In Progress"
        value="23"
        description="Tasks being worked on"
        icon={<Clock className="h-4 w-4" />}
        trend={{ value: -3, direction: "down", label: "vs yesterday" }}
        color="warning"
      />
    </div>
  )
}
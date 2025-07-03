"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertTriangle, Users } from "lucide-react"

export function TaskStatistics({ statistics }) {
  const {
    total = 0,
    completed = 0,
    pending = 0,
    overdue = 0,
    completion_rate = 0,
    avg_completion_time = 0,
  } = statistics || {}

  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completed,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock className="h-4 w-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Overdue",
      value: overdue,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.bgColor} ${stat.color} p-2 rounded-md`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
      
      {/* Completion Rate */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{completion_rate}%</span>
          </div>
          <Progress value={completion_rate} className="h-2" />
        </CardContent>
      </Card>

      {/* Average Completion Time */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avg_completion_time} 
            <span className="text-sm font-normal text-gray-500 ml-1">days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

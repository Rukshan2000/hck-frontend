"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CheckSquare, Clock, Calendar } from "lucide-react"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"
import { ImprovedTasksTable } from "@/components/tasks"

// Dummy data for temporary use until API endpoints are restored
const dummyStats = {
  total_tasks: 12,
  my_tasks: 5,
  pending_tasks: 3,
  overdue_tasks: 1
}

const dummyMyTasks = {
  data: [
    { id: 1, title: "Complete project proposal", status: "pending", deadline: "2025-07-10" },
    { id: 2, title: "Review pull requests", status: "completed", deadline: "2025-07-01" },
    { id: 3, title: "Update documentation", status: "pending", deadline: "2025-07-15" },
    { id: 4, title: "Schedule team meeting", status: "completed", deadline: null },
    { id: 5, title: "Prepare quarterly report", status: "pending", deadline: "2025-07-20" }
  ]
}

export function DashboardPage() {
  const currentUser = useSelector(selectCurrentUser)
  const stats = dummyStats
  const myTasks = dummyMyTasks

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const statsCards = [
    {
      title: "Total Tasks",
      value: stats?.total_tasks || 0,
      description: "All tasks in the system",
      icon: CheckSquare,
      color: "text-blue-600",
    },
    {
      title: "My Tasks",
      value: stats?.my_tasks || 0,
      description: "Tasks assigned to me",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: stats?.pending_tasks || 0,
      description: "Tasks awaiting completion",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Overdue",
      value: stats?.overdue_tasks || 0,
      description: "Tasks past deadline",
      icon: Calendar,
      color: "text-red-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {currentUser?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your tasks and team progress.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Recent Tasks</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            {myTasks?.data?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No tasks assigned to you yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myTasks?.data?.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </p>
                    </div>
                    <Badge 
                      variant={task.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <CheckSquare className="mr-2 h-4 w-4" />
              Create New Task
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              View Team Tasks
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Overdue Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* All Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage and view all tasks in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ImprovedTasksTable showFilters={true} />
        </CardContent>
      </Card>
    </div>
  )
}

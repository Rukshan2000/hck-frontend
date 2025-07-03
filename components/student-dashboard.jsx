"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Calendar, CheckSquare, Clock, Bell, Briefcase, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

export function StudentDashboard() {
  const user = useSelector(selectCurrentUser)

  // Simulated data for student dashboard
  const upcomingAssignments = [
    { id: 1, title: "Research Project Phase 1", dueDate: "2025-07-10", course: "Advanced Research Methods" },
    { id: 2, title: "Group Presentation", dueDate: "2025-07-15", course: "Professional Communication" },
    { id: 3, title: "Programming Assignment", dueDate: "2025-07-05", course: "Web Development" }
  ]
  
  const jobOpportunities = [
    { id: 1, title: "Frontend Developer Intern", company: "TechSolutions Inc.", deadline: "2025-08-15" },
    { id: 2, title: "UX/UI Designer", company: "CreativeTech", deadline: "2025-08-05" }
  ]
  
  const announcements = [
    { id: 1, title: "Summer Internship Fair", date: "2025-07-20", description: "Don't miss our annual internship fair with over 50 companies!" },
    { id: 2, title: "Workshop: Resume Building", date: "2025-07-12", description: "Learn how to create an effective resume for tech jobs." }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Student"}</h2>
          <p className="text-muted-foreground">
            Your student dashboard overview for today
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assignments Due Soon
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next due: {new Date(upcomingAssignments[0].dueDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobOpportunities.length}</div>
            <p className="text-xs text-muted-foreground">
              New opportunities this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Learning materials available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">
              New announcements this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Assignments due in the next two weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/tasks">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline" asChild>
                <Link href="/tasks">View all assignments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Job Opportunities</CardTitle>
            <CardDescription>
              Latest job postings matching your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobOpportunities.map(job => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/opportunities">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline" asChild>
                <Link href="/opportunities">View all opportunities</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>
            Important updates and upcoming events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{announcement.title}</h4>
                  <span className="text-sm text-muted-foreground">{new Date(announcement.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {announcement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

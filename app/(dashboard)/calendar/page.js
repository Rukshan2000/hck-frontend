"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Clock, BookOpen, CheckSquare } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { SimulateStudentUser } from "@/components/opportunities/simulate-student-user"

export default function CalendarPage() {
  const [date, setDate] = useState(new Date())
  
  // Mock events data
  const events = [
    {
      id: 1,
      title: "Research Project Due",
      date: new Date(2025, 6, 10), // July 10, 2025
      type: "assignment",
      time: "11:59 PM"
    },
    {
      id: 2,
      title: "Group Presentation",
      date: new Date(2025, 6, 15), // July 15, 2025
      type: "assignment",
      time: "2:00 PM"
    },
    {
      id: 3,
      title: "Summer Internship Fair",
      date: new Date(2025, 6, 20), // July 20, 2025
      type: "event",
      time: "10:00 AM - 4:00 PM"
    },
    {
      id: 4,
      title: "Resume Building Workshop",
      date: new Date(2025, 6, 12), // July 12, 2025
      type: "event",
      time: "3:00 PM - 5:00 PM"
    },
    {
      id: 5,
      title: "Programming Assignment Due",
      date: new Date(2025, 6, 5), // July 5, 2025
      type: "assignment",
      time: "11:59 PM"
    }
  ]
  
  // Function to check if a date has events
  const hasEvents = (day) => {
    return events.some(event => 
      day.getDate() === event.date.getDate() && 
      day.getMonth() === event.date.getMonth() && 
      day.getFullYear() === event.date.getFullYear()
    )
  }
  
  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => 
    date.getDate() === event.date.getDate() && 
    date.getMonth() === event.date.getMonth() && 
    date.getFullYear() === event.date.getFullYear()
  )
  
  return (
    <>
      <SimulateStudentUser />
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Academic Calendar</h2>
          <p className="text-muted-foreground">
            View your schedule, assignments, and events
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <Card>
            <CardHeader>
              <CardTitle>Events & Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map(event => (
                    <div key={event.id} className="flex items-start space-x-4 rounded-lg border p-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        {event.type === "assignment" ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant={event.type === "assignment" ? "destructive" : "secondary"}>
                            {event.type === "assignment" ? "Due" : "Event"}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.type === "assignment" && (
                          <p className="text-sm text-muted-foreground">
                            Don't forget to submit your assignment before the deadline
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No events scheduled for this day</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select another date to view events or select a date with highlighted indicators
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (day) => hasEvents(day)
                }}
                modifiersStyles={{
                  hasEvents: { 
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    backgroundColor: 'var(--primary-50)',
                  }
                }}
              />
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Upcoming Deadlines</p>
                <div className="space-y-2">
                  {events
                    .filter(event => event.type === "assignment" && event.date >= new Date())
                    .sort((a, b) => a.date - b.date)
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="flex justify-between text-sm">
                        <span>{event.title}</span>
                        <span className="text-muted-foreground">
                          {event.date.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

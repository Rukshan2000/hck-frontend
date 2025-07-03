"use client"

import { useState } from "react"
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Pause } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800", 
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
  reviewed: <AlertCircle className="h-4 w-4" />,
  closed: <XCircle className="h-4 w-4" />,
}

export function TaskCard({ task, onEdit, onDelete, onMarkComplete, onRestore }) {
  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDeadline = getDaysUntilDeadline(task.deadline)
  const isOverdue = daysUntilDeadline < 0
  const isDueSoon = daysUntilDeadline <= 3 && daysUntilDeadline >= 0

  return (
    <Card className={`${isOverdue ? 'border-red-300' : isDueSoon ? 'border-yellow-300' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
          <div className="flex items-center gap-1">
            {statusIcons[task.status]}
            <Badge className={`ml-2 ${priorityColors[task.priority] || 'bg-gray-100 text-gray-800'}`}>
              {task.priority || 'medium'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {task.deadline && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : ''}`}>
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(task.deadline).toLocaleDateString()}
                {daysUntilDeadline !== null && (
                  <span className="ml-1">
                    ({isOverdue ? `${Math.abs(daysUntilDeadline)} days overdue` : 
                      daysUntilDeadline === 0 ? 'Due today' : 
                      `${daysUntilDeadline} days left`})
                  </span>
                )}
              </span>
            </div>
          )}
          
          {task.assigned_to && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{task.assigned_to_name || 'Assigned'}</span>
            </div>
          )}
        </div>

        {task.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className={`
            ${task.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
            ${task.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
            ${task.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            ${task.status === 'closed' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
          `}>
            {task.status}
          </Badge>
          
          <div className="flex gap-1">
            {/* Removed restore button since API doesn't support it */}
            <Button size="sm" variant="outline" onClick={() => onEdit?.(task)}>
              Edit
            </Button>
            {task.status !== 'completed' && (
              <Button size="sm" variant="default" onClick={() => onMarkComplete?.(task.id)}>
                Complete
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={() => onDelete?.(task.id)}>
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

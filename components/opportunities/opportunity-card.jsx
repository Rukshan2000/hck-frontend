"use client"

import { Calendar, Briefcase, MapPin, Users, Clock, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ApplyFormModal } from "./apply-form-modal"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

const typeColors = {
  "Internship": "bg-purple-100 text-purple-800",
  "Full-time": "bg-blue-100 text-blue-800",
  "Part-time": "bg-green-100 text-green-800",
  "Contract": "bg-orange-100 text-orange-800",
  "Freelance": "bg-yellow-100 text-yellow-800"
}

export function OpportunityCard({ opportunity, onEdit }) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const isStudent = currentUser?.roles?.some(role => role.name === 'student')
  const isAdmin = currentUser?.roles?.some(role => role.name === 'admin' || role.name === 'staff')
  
  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDeadline = getDaysUntilDeadline(opportunity.deadline)
  const isExpired = daysUntilDeadline < 0
  const isClosingSoon = daysUntilDeadline <= 7 && daysUntilDeadline >= 0

  return (
    <>
      <Card className={`${isExpired ? 'border-red-300' : isClosingSoon ? 'border-yellow-300' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-medium">{opportunity.title}</CardTitle>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>{opportunity.company}</span>
              </div>
            </div>
            <Badge className={typeColors[opportunity.type] || 'bg-gray-100 text-gray-800'}>
              {opportunity.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{opportunity.description}</p>
          
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{opportunity.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className={`${isExpired ? 'text-red-600' : isClosingSoon ? 'text-yellow-600' : ''}`}>
                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                {daysUntilDeadline !== null && (
                  <span className="ml-1">
                    ({isExpired ? `Expired ${Math.abs(daysUntilDeadline)} days ago` : 
                      daysUntilDeadline === 0 ? 'Closes today' : 
                      `${daysUntilDeadline} days left`})
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Posted: {new Date(opportunity.posted_at).toLocaleDateString()}</span>
            </div>
            
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{opportunity.applicationCount} applications</span>
              </div>
            )}
          </div>
          
          <div className="pt-3 flex justify-between items-center">
            <Badge variant={opportunity.status === 'Open' ? 'success' : 'destructive'}>
              {opportunity.status}
            </Badge>
            
            <div className="flex gap-2">
              {isStudent && opportunity.status === 'Open' && !isExpired && (
                <Button 
                  onClick={() => setIsApplyModalOpen(true)}
                  variant="default"
                >
                  Apply
                </Button>
              )}
              
              {isAdmin && (
                <Button 
                  onClick={() => onEdit?.(opportunity)}
                  variant="outline"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ApplyFormModal
        open={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
        opportunity={opportunity}
      />
    </>
  )
}

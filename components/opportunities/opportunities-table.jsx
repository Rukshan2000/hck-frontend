"use client"

import { useState } from "react"
import { MoreHorizontal, Building, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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

export function OpportunitiesTable({ opportunities, filters, onEdit }) {
  const [applyModalState, setApplyModalState] = useState({ isOpen: false, opportunity: null })
  
  const currentUser = useSelector(selectCurrentUser)
  const isStudent = currentUser?.roles?.some(role => role.name === 'student')
  const isAdmin = currentUser?.roles?.some(role => role.name === 'admin' || role.name === 'staff')

  // Apply filters
  const filteredOpportunities = opportunities.filter(opportunity => {
    // Search filter
    if (filters.search && !opportunity.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !opportunity.company.toLowerCase().includes(filters.search.toLowerCase()) &&
        !opportunity.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type !== 'all' && opportunity.type !== filters.type) {
      return false;
    }
    
    // Location filter
    if (filters.location !== 'all' && opportunity.location !== filters.location) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && opportunity.status !== filters.status) {
      return false;
    }
    
    return true;
  });

  const handleApply = (opportunity) => {
    setApplyModalState({ isOpen: true, opportunity });
  }

  const handleApplyModalClose = () => {
    setApplyModalState({ isOpen: false, opportunity: null });
  }

  const getDaysLeft = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead>Applications</TableHead>}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-8 text-gray-500">
                  No opportunities found. {filters.search || filters.type !== 'all' || filters.location !== 'all' || filters.status !== 'all' ? 
                    'Try adjusting your filters.' : 'Check back later for new opportunities!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOpportunities.map((opportunity) => {
                const daysLeft = getDaysLeft(opportunity.deadline);
                const isExpired = daysLeft < 0;
                const isClosingSoon = daysLeft <= 7 && daysLeft >= 0;

                return (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        {opportunity.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeColors[opportunity.type] || 'bg-gray-100 text-gray-800'}>
                        {opportunity.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {opportunity.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`${isExpired ? 'text-red-600' : isClosingSoon ? 'text-yellow-600' : ''}`}>
                        {new Date(opportunity.deadline).toLocaleDateString()}
                        <div className="text-xs">
                          {isExpired 
                            ? `Expired ${Math.abs(daysLeft)} days ago` 
                            : daysLeft === 0 
                              ? 'Closes today' 
                              : `${daysLeft} days left`}
                        </div>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={opportunity.status === 'Open' ? 'success' : 'destructive'}>
                        {opportunity.status}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>{opportunity.applicationCount}</TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isStudent && opportunity.status === 'Open' && !isExpired && (
                            <DropdownMenuItem onClick={() => handleApply(opportunity)}>
                              Apply
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => onEdit?.(opportunity)}>
                              Edit
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem>
                              View Applications
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ApplyFormModal
        open={applyModalState.isOpen}
        onOpenChange={handleApplyModalClose}
        opportunity={applyModalState.opportunity}
      />
    </>
  )
}

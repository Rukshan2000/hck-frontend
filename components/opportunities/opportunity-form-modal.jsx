"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function OpportunityFormModal({ open, onOpenChange, opportunity }) {
  const { toast } = useToast()
  const isEditing = Boolean(opportunity?.id)

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    type: "Full-time",
    deadline: "",
    status: "Open",
  })

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || "",
        company: opportunity.company || "",
        description: opportunity.description || "",
        requirements: opportunity.requirements || "",
        location: opportunity.location || "",
        type: opportunity.type || "Full-time",
        deadline: opportunity.deadline ? new Date(opportunity.deadline).toISOString().split('T')[0] : "",
        status: opportunity.status || "Open",
      })
    } else {
      setFormData({
        title: "",
        company: "",
        description: "",
        requirements: "",
        location: "",
        type: "Full-time",
        deadline: "",
        status: "Open",
      })
    }
  }, [opportunity])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Success",
        description: isEditing 
          ? "Job opportunity updated successfully" 
          : "Job opportunity created successfully",
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const jobTypes = [
    { value: 'Internship', label: 'Internship' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' },
  ]

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Job Opportunity" : "Create New Job Opportunity"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the job opportunity details below." 
              : "Fill in the details to post a new job opportunity."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                rows={4}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                required
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  required
                  placeholder="e.g. Remote, New York, NY"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Job Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

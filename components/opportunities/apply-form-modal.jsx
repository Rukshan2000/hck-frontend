"use client"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { Building, Upload } from "lucide-react"

export function ApplyFormModal({ open, onOpenChange, opportunity }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    cv: null
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        })
        e.target.value = ""
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        })
        e.target.value = ""
        return
      }
      
      handleChange('cv', file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.cv) {
      toast({
        title: "CV required",
        description: "Please upload your CV to apply",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Application submitted",
        description: `Your application for ${opportunity.title} has been submitted successfully.`,
      })
      
      onOpenChange(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        coverLetter: "",
        cv: null
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!opportunity) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Position</DialogTitle>
          <DialogDescription>
            Submit your application for {opportunity.title} at {opportunity.company}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <Building className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">{opportunity.title}</div>
                <div className="text-sm text-gray-500">{opportunity.company} - {opportunity.location}</div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cv">Upload CV (PDF only, max 5MB)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('cv-upload').click()}
                  className="cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">
                  {formData.cv ? formData.cv.name : 'No file selected'}
                </span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
              <Textarea
                id="coverLetter"
                rows={4}
                placeholder="Tell us why you're a good fit for this position..."
                value={formData.coverLetter}
                onChange={(e) => handleChange("coverLetter", e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

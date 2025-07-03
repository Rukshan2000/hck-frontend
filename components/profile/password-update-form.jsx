"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useUpdateProfileMutation } from "@/lib/features/auth/authApiSlice"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

export function PasswordUpdateForm() {
  const { toast } = useToast()
  const currentUser = useSelector(selectCurrentUser)
  
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  })
  
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      toast({
        title: "Error",
        description: "New password and confirmation don't match",
        variant: "destructive",
      })
      return
    }
    
    try {
      await updateProfile({
        current_password: formData.current_password,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      }).unwrap()
      
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      
      // Clear form
      setFormData({
        current_password: "",
        password: "",
        password_confirmation: ""
      })
    } catch (error) {
      console.error('Password update error:', error)
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update password",
        variant: "destructive",
      })
    }
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription>
          Make sure your account is using a strong, secure password
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              value={formData.current_password}
              onChange={(e) => handleChange('current_password', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirm New Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => handleChange('password_confirmation', e.target.value)}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

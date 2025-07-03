"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation 
} from "@/lib/features/auth/authApiSlice"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

export function ProfileUpdateForm() {
  const { toast } = useToast()
  const currentUser = useSelector(selectCurrentUser)
  
  const { data: userData, isLoading: isLoadingUser } = useGetProfileQuery()
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null // For file upload
  })
  
  const [previewUrl, setPreviewUrl] = useState("")
  
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        avatar: null
      })
      setPreviewUrl(userData.avatar || "")
    }
  }, [userData])
  
  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange('avatar', file)
      
      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create FormData if there's a file to upload
      let dataToSubmit = { ...formData }
      
      if (formData.avatar) {
        const formDataObj = new FormData()
        formDataObj.append('name', formData.name)
        formDataObj.append('email', formData.email)
        formDataObj.append('avatar', formData.avatar)
        dataToSubmit = formDataObj
      }
      
      await updateProfile(dataToSubmit).unwrap()
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update profile",
        variant: "destructive",
      })
    }
  }
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  
  if (isLoadingUser) {
    return <div className="flex justify-center py-8">Loading profile...</div>
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile details and email address
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Avatar upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl} alt={formData.name} />
              <AvatarFallback className="text-lg">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <Label
                htmlFor="avatar"
                className="cursor-pointer text-sm font-medium text-primary"
              >
                Change Profile Picture
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

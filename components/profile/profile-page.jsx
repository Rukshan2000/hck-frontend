"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileUpdateForm } from "./profile-update-form"
import { PasswordUpdateForm } from "./password-update-form"

export function ProfilePage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account security
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileUpdateForm />
        </TabsContent>
        
        <TabsContent value="password">
          <PasswordUpdateForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

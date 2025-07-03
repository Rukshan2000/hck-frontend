"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  useAddUserMutation,
  useUpdateUserMutation
} from "@/lib/features/users/usersApiSlice"
import { useGetRolesQuery } from "@/lib/features/roles/rolesApiSlice"
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice"
import { selectSelectedUser, clearSelectedUser } from "@/lib/features/users/usersSlice"

export function UserFormModal({ open, onOpenChange }) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const selectedUser = useSelector(selectSelectedUser)
  const isEditing = Boolean(selectedUser?.id)

  const [addUser, { isLoading: isAdding }] = useAddUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const { data: rolesData } = useGetRolesQuery()
  const { data: usersData } = useGetUsersQuery({ limit: 100 }) // Get potential managers

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    manager_id: "none", // Changed from empty string to "none"
  })

  const isLoading = isAdding || isUpdating

  useEffect(() => {
    if (selectedUser?.id) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: "",
        password_confirmation: "",
        role_id: selectedUser.role_id?.toString() || "",
        manager_id: selectedUser.manager_id?.toString() || "none", // Changed from empty string to "none"
      })
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role_id: "",
        manager_id: "none", // Changed from empty string to "none"
      })
    }
  }, [selectedUser])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Remove empty password fields if not changed (for updating)
    const submitData = { ...formData }
    if (isEditing && !submitData.password) {
      delete submitData.password
      delete submitData.password_confirmation
    }

    // Handle the "none" value for manager_id by changing it to null or empty string
    if (submitData.manager_id === "none") {
      submitData.manager_id = null;
    }

    try {
      if (isEditing) {
        await updateUser({ id: selectedUser.id, ...submitData }).unwrap()
        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        await addUser(submitData).unwrap()
        toast({
          title: "Success",
          description: "User created successfully",
        })
      }
      
      onOpenChange(false)
      dispatch(clearSelectedUser())
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to save user",
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = (open) => {
    if (!open) {
      setTimeout(() => {
        dispatch(clearSelectedUser())
        setFormData({
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role_id: "",
          manager_id: "none", // Changed from empty string to "none"
        })
      }, 300)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update user details below." : "Enter user details below to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
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
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? "New Password (leave blank to keep current)" : "Password"}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => handleChange('password_confirmation', e.target.value)}
                  required={!isEditing || formData.password.length > 0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">Role</Label>
              <Select
                value={formData.role_id}
                onValueChange={(value) => handleChange('role_id', value)}
              >
                <SelectTrigger id="role_id">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.data?.filter(role => role.id && role.name).map((role) => (
                    <SelectItem 
                      key={role.id} 
                      value={role.id?.toString() || String(role.id) || `role-${role.name}`}
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager_id">Manager (Optional)</Label>
              <Select
                value={formData.manager_id}
                onValueChange={(value) => handleChange('manager_id', value)}
              >
                <SelectTrigger id="manager_id">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Manager</SelectItem>
                  {usersData?.data?.filter(user => 
                    user.id && 
                    user.name && 
                    (!selectedUser?.id || user.id !== selectedUser.id) // Can't be your own manager
                  ).map((user) => (
                    <SelectItem 
                      key={user.id} 
                      value={user.id?.toString() || String(user.id) || `user-${user.name}`}
                    >
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleDialogClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 
                (isEditing ? "Updating..." : "Creating...") : 
                (isEditing ? "Update User" : "Create User")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

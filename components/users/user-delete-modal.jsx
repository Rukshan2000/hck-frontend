"use client"

import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export function UserDeleteModal({ open, onOpenChange, user, onDelete, isDeleting }) {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    try {
      await onDelete(user.id)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500">Role: {user?.role?.name || "No Role"}</p>
            </div>
            <p className="text-sm text-red-600 font-medium mt-4">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

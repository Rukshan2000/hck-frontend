"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function TaskDeleteModal({ open, onOpenChange, task, onDelete, isDeleting }) {
  const { toast } = useToast()
  
  const handleDelete = async () => {
    try {
      await onDelete(task.id)
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete task",
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
            Delete Task
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to delete this task?</p>
            <div className="mt-2 p-3 bg-gray-50 rounded-md border">
              <p className="font-medium">{task?.title}</p>
              {task?.description && (
                <p className="text-sm text-gray-600 mt-1 truncate">{task.description}</p>
              )}
            </div>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

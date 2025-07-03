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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAddTaskMutation, useUpdateTaskMutation } from "@/lib/features/tasks/tasksApiSlice"
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice"
import { selectSelectedTask, clearSelectedTask } from "@/lib/features/tasks/taskSlice"

export function TaskFormModal({ open, onOpenChange }) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const selectedTask = useSelector(selectSelectedTask)
  const isEditing = Boolean(selectedTask?.id)

  const [addTask, { isLoading: isAdding }] = useAddTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const { data: usersData } = useGetUsersQuery()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    deadline: "",
    assigned_to: "",
  })

  const isLoading = isAdding || isUpdating

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        status: selectedTask.status || "pending",
        deadline: selectedTask.deadline || "",
        assigned_to: selectedTask.assigned_to || "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        deadline: "",
        assigned_to: "",
      })
    }
  }, [selectedTask])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await updateTask({ id: selectedTask.id, ...formData }).unwrap()
        toast({
          title: "Success",
          description: "Task updated successfully",
        })
      } else {
        // Include created_by from selectedTask for new tasks
        const payload = {
          ...formData,
          created_by: selectedTask?.created_by
        }
        await addTask(payload).unwrap()
        toast({
          title: "Success",
          description: "Task created successfully",
        })
      }
      dispatch(clearSelectedTask())
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCancel = () => {
    dispatch(clearSelectedTask())
    onOpenChange(false)
  }

  const taskStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'closed', label: 'Closed' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the task details below." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assigned_to">Assign To</Label>
              <Select value={formData.assigned_to || "unassigned"} onValueChange={(value) => handleChange("assigned_to", value === "unassigned" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {usersData?.data?.filter(user => user.id && user.name).map((user) => (
                    <SelectItem key={user.id} value={user.id?.toString() || user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding || isUpdating}>
              {isAdding || isUpdating ? "Saving..." : 
              selectedTask ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

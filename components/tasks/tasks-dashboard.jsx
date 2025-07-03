"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice"
import {
  useGetTaskListQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} from "@/lib/features/tasks/tasksApiSlice"
import { 
  selectTasksFilters, 
  setFilters,
  setPagination,
  setSelectedTask
} from "@/lib/features/tasks/taskSlice"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

import { ImprovedTasksTable } from "./improved-tasks-table"
import { TaskFormModal } from "./task-form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export function TasksDashboard() {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const filters = useSelector(selectTasksFilters)
  const currentUser = useSelector(selectCurrentUser)
  
  const { data: usersData } = useGetUsersQuery()

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(setPagination({ page: 1 })) // Reset to first page when filters change
  }

  const handleCreateTask = () => {
    dispatch(setSelectedTask({ created_by: currentUser?.id }))
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    dispatch(setSelectedTask(null))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateTask}>Add Task</Button>
      </div>

      {/* Tasks Table with Filters */}
      <ImprovedTasksTable showFilters={true} />

      {/* Task Form Modal */}
      <TaskFormModal open={isModalOpen} onOpenChange={handleModalClose} />
    </div>
  )
}

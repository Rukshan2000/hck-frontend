"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TaskCard } from "./task-card"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { 
  useGetTaskListQuery, 
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "@/lib/features/tasks/tasksApiSlice"
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice"
import { TaskFormModal } from "./task-form-modal"
import { 
  selectTasksFilters, 
  selectTasksPagination,
  setFilters,
  setPagination,
  setSelectedTask 
} from "@/lib/features/tasks/taskSlice"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"

export function TasksGrid() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const filters = useSelector(selectTasksFilters)
  const pagination = useSelector(selectTasksPagination)
  const currentUser = useSelector(selectCurrentUser)
  const debouncedSearch = useDebounce(filters.search, 300)
  
  // Query parameters
  const queryParams = {
    ...filters,
    ...pagination,
    search: debouncedSearch,
    status: filters.status === 'all' ? '' : filters.status,
    assigned_to: filters.assigned_to === 'all' ? '' : filters.assigned_to,
  }

  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTaskListQuery(queryParams, {
    skip: !currentUser?.id
  })

  const { data: usersData } = useGetUsersQuery()
  const [deleteTask] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()

  const handleEdit = (task) => {
    const taskWithCreatedBy = {
      ...task,
      created_by: task.created_by || currentUser?.id
    }
    dispatch(setSelectedTask(taskWithCreatedBy))
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    dispatch(setSelectedTask(null))
    refetch()
  }

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await deleteTask(taskId).unwrap()
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleMarkCompleted = async (taskId) => {
    try {
      // Use updateTask instead of markCompleted
      const updatedTask = { id: taskId, status: 'completed' }
      await updateTask(updatedTask).unwrap()
      toast({
        title: "Success",
        description: "Task marked as completed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async (taskId) => {
    // Since restoreTask mutation is not available in the updated API,
    // inform the user that this functionality is not available
    toast({
      title: "Notice",
      description: "Task restoration functionality is not available in the current API",
    })
    
    // Refresh the task list
    refetch()
  }

  // Add user names to tasks
  const tasksWithUserNames = tasksData?.data?.map(task => ({
    ...task,
    assigned_to_name: usersData?.data?.find(u => u.id.toString() === task.assigned_to?.toString())?.name || 'Unassigned'
  })) || []

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading tasks: {error?.data?.message || error?.message || 'Unknown error'}</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    )
  }

  if (!currentUser) {
    return <div className="text-center py-8">Please log in to view tasks</div>
  }

  if (tasksWithUserNames.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          No tasks found. {filters.search || filters.status !== 'all' || filters.assigned_to !== 'all' ? 
            'Try adjusting your filters.' : 'Create your first task!'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasksWithUserNames.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMarkComplete={handleMarkCompleted}
            onRestore={handleRestore}
          />
        ))}
      </div>

      {/* Pagination */}
      {tasksData?.links && (
        <div className="flex justify-center space-x-2 mt-6">
          {tasksData.links.map((link, index) => (
            <Button
              key={index}
              variant={link.active ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const page = link.url?.split('page=')[1]
                if (page) dispatch(setPagination({ page: parseInt(page) }))
              }}
              disabled={!link.url}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}

      <TaskFormModal open={isModalOpen} onOpenChange={handleModalClose} />
    </>
  )
}

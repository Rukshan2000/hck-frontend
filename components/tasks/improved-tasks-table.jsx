"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MoreHorizontal, Edit, Trash2, Plus, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { 
  useGetTaskListQuery, 
  useDeleteTaskMutation,
  useUpdateTaskMutation
} from "@/lib/features/tasks/tasksApiSlice"
import { useGetUsersQuery } from "@/lib/features/users/usersApiSlice"
import { TaskFormModal } from "./task-form-modal"
import { TaskDeleteModal } from "./task-delete-modal"
import { 
  selectTasksFilters, 
  selectTasksPagination,
  setFilters,
  setPagination,
  setSelectedTask 
} from "@/lib/features/tasks/taskSlice"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  reviewed: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-800",
}

export function ImprovedTasksTable({ showFilters = false }) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  
  const filters = useSelector(selectTasksFilters)
  const pagination = useSelector(selectTasksPagination)
  const currentUser = useSelector(selectCurrentUser)
  const debouncedSearch = useDebounce(filters.search, 300)
  
  // Query parameters - removed with_trashed since it's no longer supported
  const queryParams = {
    ...filters,
    ...pagination,
    search: debouncedSearch,
    status: filters.status === 'all' ? '' : filters.status,
    assigned_to: filters.assigned_to === 'all' ? '' : filters.assigned_to,
  }

  // For debugging, let's start with all tasks endpoint
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTaskListQuery(queryParams, {
    skip: !currentUser?.id // Skip query if user is not loaded
  })

  // Debug logs
  console.log('Current User:', currentUser)
  console.log('User Roles:', currentUser?.roles)
  console.log('Query Params:', queryParams)
  console.log('Tasks Data:', tasksData)
  console.log('Is Loading:', isLoading)
  console.log('Is Error:', isError)
  console.log('Error:', error)
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL)

  const { data: usersData } = useGetUsersQuery()
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  
  // Dummy functions to replace removed API hooks
  const markCompleted = (id) => Promise.resolve({ data: { id } })
  const restoreTask = (id) => Promise.resolve({ data: { id } })

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(setPagination({ page: 1 })) // Reset to first page when filters change
  }

  const handlePageChange = (page) => {
    dispatch(setPagination({ page }))
  }

  const handleEdit = (task) => {
    // Add created_by to task data if not present
    const taskWithCreatedBy = {
      ...task,
      created_by: task.created_by || currentUser?.id
    }
    dispatch(setSelectedTask(taskWithCreatedBy))
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    dispatch(setSelectedTask({ created_by: currentUser?.id }))
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    dispatch(setSelectedTask(null))
    // Refetch data to get latest changes
    refetch()
  }

  const handleDeleteClick = (task) => {
    setTaskToDelete(task)
    setIsDeleteModalOpen(true)
  }
  
  const handleDeleteConfirmed = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap()
      // Refetch tasks after successful deletion
      refetch()
      return Promise.resolve() // Return resolved promise for the delete modal
    } catch (error) {
      console.error('Delete error:', error)
      return Promise.reject(error) // Return rejected promise for the delete modal
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
    toast({
      title: "Notice",
      description: "Task restoration functionality is not available in current API",
    })
    // Refresh the list to remove deleted items when with_trashed is toggled off
    refetch()
  }

  const getUserName = (userId) => {
    // First check if the task has an assignee object directly (from the API response)
    if (tasksData?.tasks) {
      const task = tasksData.tasks.find(t => t.assigned_to?.toString() === userId?.toString())
      if (task?.assignee?.name) {
        return task.assignee.name
      }
    }
    
    // Fallback to the old logic
    const user = usersData?.data?.find(u => u.id.toString() === userId?.toString())
    return user ? user.name : 'Unassigned'
  }

  if (isLoading) return <div className="flex justify-center py-8">Loading tasks...</div>
  if (isError) {
    console.error('Task fetch error:', error)
    return (
      <div className="text-red-600 text-center py-8">
        <p>Error loading tasks: {error?.data?.message || error?.message || 'Unknown error'}</p>
        <Button onClick={refetch} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  if (!currentUser) {
    return <div className="flex justify-center py-8">Please log in to view tasks</div>
  }
  
  // Handle different API response formats - check if tasks data is nested under 'tasks' property
  const tasks = tasksData?.tasks || tasksData?.data

  return (
    <>
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search tasks..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.assigned_to || 'all'}
              onValueChange={(value) => handleFilterChange('assigned_to', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Assigned to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {usersData?.data?.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading tasks...</div>
        ) : isError ? (
          <div className="text-red-600 text-center py-8">
            <p>Error loading tasks: {error?.data?.message || error?.message || 'Unknown error'}</p>
            <Button onClick={refetch} className="mt-2">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No tasks found. {filters.search || filters.status || filters.assigned_to ? 'Try adjusting your filters.' : 'Create your first task!'}
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks?.map((task) => (
                    <TableRow key={task.id} className={task.deleted_at ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {task.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[task.status] || 'bg-gray-100 text-gray-800'}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{task.assignee?.name || getUserName(task.assigned_to)}</TableCell>
                      <TableCell>
                        {task.created_at ? new Date(task.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Removed restore functionality and simplified dropdown */}
                            <>
                              <DropdownMenuItem onClick={() => handleEdit(task)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {task.status !== 'completed' && (
                                <DropdownMenuItem onClick={() => handleMarkCompleted(task.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(task)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {(tasksData?.links || tasksData?.meta?.links) && (
              <div className="flex justify-center space-x-2">
                {(tasksData?.links || tasksData?.meta?.links)?.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const page = link.url?.split('page=')[1]
                      if (page) handlePageChange(parseInt(page))
                    }}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <TaskFormModal open={isModalOpen} onOpenChange={handleModalClose} />
      <TaskDeleteModal 
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        task={taskToDelete}
        onDelete={handleDeleteConfirmed}
        isDeleting={isDeleting}
      />
    </>
  )
}

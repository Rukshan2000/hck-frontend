"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MoreHorizontal, Edit, Trash2, Plus, Filter } from "lucide-react"
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
  useMarkTaskCompletedMutation,
  useRestoreTaskMutation 
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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  reviewed: "bg-blue-100 text-blue-800",
  closed: "bg-gray-100 text-gray-800",
}

export function TasksTable() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const filters = useSelector(selectTasksFilters)
  const pagination = useSelector(selectTasksPagination)
  const debouncedSearch = useDebounce(filters.search, 300)

  // Use dummy data for now, replace with actual API call when backend is ready
  const {
    data: tasks = dummyTasks,
    isLoading,
    error,
  } = useGetTaskListQuery(undefined, {
    // Skip the actual API call and use dummy data
    skip: true,
  })

  const [deleteTask] = useDeleteTaskMutation()

  const handleEdit = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId).unwrap()
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading tasks</div>

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="max-w-[200px] truncate">{task.description}</TableCell>
                <TableCell>
                  <Badge className={statusColors[task.status]}>{task.status.replace("-", " ")}</Badge>
                </TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskFormModal open={isModalOpen} onOpenChange={handleModalClose} task={selectedTask} />
    </>
  )
}

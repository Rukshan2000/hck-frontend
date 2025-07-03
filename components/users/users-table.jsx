"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MoreHorizontal, Edit, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { 
  useGetUsersQuery, 
  useDeleteUserMutation,
  useRestoreUserMutation 
} from "@/lib/features/users/usersApiSlice"
import { useGetRolesQuery } from "@/lib/features/roles/rolesApiSlice"
import { 
  selectUsersFilters, 
  selectUsersPagination,
  setFilters,
  setPagination,
  setSelectedUser 
} from "@/lib/features/users/usersSlice"
import { UserFormModal } from "./user-form-modal"
import { UserDeleteModal } from "./user-delete-modal"
import { UsersHeader } from "./users-header"

export function UsersTable() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  
  const filters = useSelector(selectUsersFilters)
  const pagination = useSelector(selectUsersPagination)
  const debouncedSearch = useDebounce(filters.search, 300)

  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  
  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery({
    ...filters,
    ...pagination,
    search: debouncedSearch,
    role_id: filters.role_id === 'all' ? '' : filters.role_id,
  })

  const { data: rolesData } = useGetRolesQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [restoreUser] = useRestoreUserMutation()

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(setPagination({ page: 1 }))
  }

  const handlePageChange = (page) => {
    dispatch(setPagination({ page }))
  }

  const handleEdit = (user) => {
    dispatch(setSelectedUser(user))
    setFormModalOpen(true)
  }

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap()
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      setDeleteModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async (userId) => {
    try {
      await restoreUser(userId).unwrap()
      toast({
        title: "Success",
        description: "User restored successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to restore user",
        variant: "destructive",
      })
    }
  }

  const openDeleteModal = (user) => {
    setUserToDelete(user)
    setDeleteModalOpen(true)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (isLoading) return <div className="flex justify-center py-8">Loading users...</div>
  if (isError) return <div className="text-red-600 text-center py-8">Error: {error?.message}</div>

  return (
    <div className="space-y-4">
      {/* Header */}
      <UsersHeader onOpenFormModal={setFormModalOpen} />

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-sm"
        />

        <Select
          value={filters.role_id}
          onValueChange={(value) => handleFilterChange('role_id', value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
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

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.with_trashed}
            onChange={(e) => handleFilterChange('with_trashed', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Include Deleted</span>
        </label>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found. {filters.search || filters.role_id ? 'Try adjusting your filters.' : 'Create your first user!'}
                </TableCell>
              </TableRow>
            ) : (
              usersData?.data?.map((user) => (
                <TableRow key={user.id} className={user.deleted_at ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role?.name || 'No Role'}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.manager?.name || '-'}</TableCell>
                  <TableCell>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {user.deleted_at ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.deleted_at ? (
                          <DropdownMenuItem onClick={() => handleRestore(user.id)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openDeleteModal(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {usersData?.links && (
        <div className="flex justify-center space-x-2">
          {usersData.links.map((link, index) => (
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

      {/* Modals */}
      <UserFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
      />

      <UserDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        user={userToDelete}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}

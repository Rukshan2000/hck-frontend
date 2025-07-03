"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { setSelectedUser } from "@/lib/features/users/usersSlice"

export function UsersHeader({ onOpenFormModal }) {
  const dispatch = useDispatch()

  const handleCreateNew = () => {
    dispatch(setSelectedUser({}))
    onOpenFormModal(true)
  }

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Users Management</h2>
      <Button onClick={handleCreateNew}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add User
      </Button>
    </div>
  )
}

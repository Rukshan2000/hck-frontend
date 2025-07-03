"use client"

import { usePermissions } from "@/hooks/use-permissions"

export function UserProfileWidget() {
  const { user, isMounted } = usePermissions()

  if (!isMounted) {
    return <div className="p-4">Loading user data...</div>
  }

  if (!user) {
    return <div className="p-4">Not logged in</div>
  }

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold">Welcome, {user.name || user.username}</h3>
      <p className="text-sm text-muted-foreground">Role: {user.role?.name || "Not assigned"}</p>
      {user.email && <p className="text-sm">{user.email}</p>}
    </div>
  )
}
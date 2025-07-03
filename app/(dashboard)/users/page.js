"use client"

import { UsersTable } from "@/components/users-table"
import { RouteGuard } from "@/components/auth/route-guard"

export default function UsersPage() {
  return (
    <RouteGuard requiredPermission="/users">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage team members and their permissions.</p>
        </div>

        <UsersTable />
      </div>
    </RouteGuard>
  )
}

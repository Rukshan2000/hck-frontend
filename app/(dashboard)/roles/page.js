"use client"

import { RouteGuard } from "@/components/auth/route-guard"

export default function RolesPage() {
  return (
    <RouteGuard requiredPermission="/roles">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">Manage user roles and permissions.</p>
        </div>
        
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Roles Management</h2>
          <p className="text-muted-foreground">
            Role management functionality will be implemented here.
            This will include creating, editing, and managing user roles and their permissions.
          </p>
        </div>
      </div>
    </RouteGuard>
  )
}

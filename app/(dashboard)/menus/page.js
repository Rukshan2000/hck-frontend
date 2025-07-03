"use client"

import { RouteGuard } from "@/components/auth/route-guard"

export default function MenusPage() {
  return (
    <RouteGuard requiredPermission="/menus">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menus</h1>
          <p className="text-muted-foreground">Manage application menus and navigation.</p>
        </div>
        
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Menu Management</h2>
          <p className="text-muted-foreground">
            Menu management functionality will be implemented here.
            This will include creating, editing, and organizing application menus and navigation items.
          </p>
        </div>
      </div>
    </RouteGuard>
  )
}

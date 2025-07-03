"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { RouteGuard } from "@/components/auth/route-guard"

export default function DashboardLayout({ children }) {
  return (
    <RouteGuard requireAuth={true}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNav />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  )
}

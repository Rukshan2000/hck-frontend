"use client"

import { Home, Settings, Users, CheckSquare, Users2, Shield, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    permission: null, // Everyone can access
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    permission: null, // Everyone can access
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    permission: "/users", // Requires users permission
  },
  {
    title: "Teams",
    url: "/teams",
    icon: Users2,
    permission: "/teams",
  },
  {
    title: "Roles",
    url: "/roles",
    icon: Shield,
    permission: "/roles", // Admin only
  },
  {
    title: "Menus",
    url: "/menus",
    icon: Menu,
    permission: "/menus", // Admin only
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    permission: null,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { hasPermission, isAdmin, isMounted } = usePermissions()

  // Filter menu items based on permissions, but only after mounting
  const accessibleItems = isMounted ? menuItems.filter(item => {
    if (!item.permission) return true // No permission required
    if (isAdmin) return true // Admin can access everything
    return hasPermission(item.permission)
  }) : menuItems.filter(item => !item.permission) // Only show items without permissions during SSR

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <CheckSquare className="h-6 w-6" />
          <span className="font-semibold">TaskManager</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accessibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

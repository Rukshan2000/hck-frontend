"use client"

import { Home, Settings, Users, CheckSquare, Users2, Shield, Menu, BookOpen, Calendar, GraduationCap } from "lucide-react"
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

// Regular menu items for staff/admin
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
	{
		title: "Opportunities",
		url: "/opportunities",
		icon: GraduationCap,
		permission: null, // Everyone can access
	},
]

// Student-specific menu items
const studentMenuItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "My Assignments",
		url: "/tasks",
		icon: CheckSquare,
	},
	{
		title: "Job Opportunities",
		url: "/opportunities",
		icon: GraduationCap,
	},
	{
		title: "Resources",
		url: "/resources",
		icon: BookOpen,
	},
	{
		title: "Opportunities",
		url: "/opportunities",
		icon: Calendar,
	}
]

export function AppSidebar() {
	const pathname = usePathname()
	const { hasPermission, isAdmin, hasRole, isMounted, userRole } = usePermissions()

	// Determine which menu items to display based on role
	let displayMenuItems = menuItems

	// If user is a student, use the student menu
	if (isMounted && hasRole('student')) {
		displayMenuItems = studentMenuItems
	}
	
	// Filter menu items based on permissions, but only after mounting
	const accessibleItems = isMounted 
		? (hasRole('student') 
				? displayMenuItems // Student gets their specific menu
				: menuItems.filter(item => {
						if (!item.permission) return true // No permission required
						if (isAdmin) return true // Admin can access everything
						return hasPermission(item.permission)
					}))
		: menuItems.filter(item => !item.permission) // Only show items without permissions during SSR

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<CheckSquare className="h-6 w-6" />
					<span className="font-semibold">
						{isMounted && hasRole('student') ? "Student Portal" : "Ciber Wizards"}
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						{isMounted && hasRole('student') ? "Student Navigation" : "Navigation"}
					</SidebarGroupLabel>
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

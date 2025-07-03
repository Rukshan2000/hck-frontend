"use client"

import { Search, LogOut, Settings, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
import { useLogoutMutation } from "@/lib/features/auth/authApiSlice"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"
import { STORAGE_KEYS } from "@/lib/constants"
import { storage } from "@/lib/helpers"

export function TopNav() {
  const router = useRouter()
  const { toast } = useToast()
  const user = useSelector(selectCurrentUser)
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      
      // Clear all auth-related data from localStorage
      localStorage.removeItem("auth")
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      storage.remove(STORAGE_KEYS.USER_DATA)
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
      
      // Optional: Clear all localStorage data if you want a complete reset
      // storage.clear()
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
      
      // Even if API call fails, clear local session data
      localStorage.removeItem("auth")
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      storage.remove(STORAGE_KEYS.USER_DATA)
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
    }
  }

  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-8" />
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

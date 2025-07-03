"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectIsAuthenticated, selectAuthLoading, selectCurrentUser, selectAuthInitialized } from "@/lib/features/auth/authSlice"
import { usePermissions } from "@/hooks/use-permissions"
import { AuthLoadingScreen } from "./auth-loading-screen"

export function RouteGuard({ children, requireAuth = true, requiredPermission = null }) {
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const isInitialized = useSelector(selectAuthInitialized)
  const currentUser = useSelector(selectCurrentUser)
  const { hasPermission, canAccess } = usePermissions()
  const [isMounted, setIsMounted] = useState(false)

  // Debug logging
  console.log('RouteGuard state:', {
    requireAuth,
    isAuthenticated,
    isLoading,
    isInitialized,
    isMounted,
    hasUser: !!currentUser
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only redirect after component is mounted and auth is initialized
    if (isMounted && isInitialized && !isLoading) {
      if (requireAuth && !isAuthenticated) {
        console.log('Redirecting to login - not authenticated')
        router.push("/login")
      } else if (!requireAuth && isAuthenticated) {
        console.log('Redirecting to dashboard - already authenticated')
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, isInitialized, requireAuth, router, isMounted])

  // Show loading spinner during SSR hydration, auth loading, or initialization
  if (!isMounted || isLoading || !isInitialized) {
    return <AuthLoadingScreen />
  }

  // Don't render children if auth check fails
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  // Check permission if required
  if (requiredPermission && currentUser && isAuthenticated) {
    const hasAccess = Array.isArray(requiredPermission) 
      ? canAccess(requiredPermission)
      : hasPermission(requiredPermission)
    
    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
  }

  return children
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectIsAuthenticated, selectAuthLoading } from "@/lib/features/auth/authSlice"

export default function HomePage() {
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (isAuthenticated) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, isLoading, router, isMounted])

  // Show loading while checking auth or during hydration
  if (!isMounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return null
}

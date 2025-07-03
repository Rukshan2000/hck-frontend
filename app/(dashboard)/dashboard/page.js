"use client"

import { DashboardPage } from "@/components/dashboard-page"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { hasRole, isMounted } = usePermissions()
  const router = useRouter()

  // Redirect students to student dashboard
  useEffect(() => {
    if (isMounted && hasRole('student')) {
      router.replace('/student-dashboard')
    }
  }, [isMounted, hasRole, router])

  return <DashboardPage />
}

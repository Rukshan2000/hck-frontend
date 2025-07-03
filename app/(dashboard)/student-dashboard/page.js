"use client"

import { StudentDashboard } from "@/components/student-dashboard"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SimulateStudentUser } from "@/components/opportunities/simulate-student-user"

export default function StudentDashboardPage() {
  const { hasRole, isAdmin, isMounted } = usePermissions()
  const router = useRouter()

  // Redirect admin/staff to regular dashboard if they try to access student dashboard
  useEffect(() => {
    if (isMounted && !hasRole('student') && (isAdmin || hasRole('staff'))) {
      router.replace('/dashboard')
    }
  }, [isMounted, hasRole, isAdmin, router])

  return (
    <>
      {/* This is for simulation purposes only - remove in production */}
      <SimulateStudentUser />
      <StudentDashboard />
    </>
  )
}

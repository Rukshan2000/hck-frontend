"use client"

import { OpportunitiesDashboard } from "@/components/opportunities"
import { SimulateStudentUser } from "@/components/opportunities/simulate-student-user"

export default function OpportunitiesPage() {
  return (
    <>
      <SimulateStudentUser />
      <OpportunitiesDashboard />
    </>
  )
}

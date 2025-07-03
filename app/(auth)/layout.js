"use client"

import { RouteGuard } from "@/components/auth/route-guard"

export default function AuthLayout({ children }) {
  return <RouteGuard requireAuth={false}>{children}</RouteGuard>
}

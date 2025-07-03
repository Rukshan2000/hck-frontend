"use client"

import { useSelector } from "react-redux"
import { selectCurrentUser, selectIsAuthenticated } from "@/lib/features/auth/authSlice"

export function AuthStatusCheck() {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-bold">Authentication Status</h3>
      <p>Is Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
      {user && (
        <div className="mt-2">
          <p>User ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Role: {user.role?.name}</p>
        </div>
      )}
      {!user && <p>No user logged in</p>}
    </div>
  )
}
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { selectCurrentUser, selectUserPermissions } from '../lib/features/auth/authSlice'

export function usePermissions() {
  const user = useSelector(selectCurrentUser)
  const permissions = useSelector(selectUserPermissions)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const hasPermission = (path) => {
    if (!isMounted) return false
    if (user?.role?.name === 'admin') return true
    return permissions?.some(menu => menu.path === path)
  }

  const hasRole = (roleName) => {
    if (!isMounted) return false
    return user?.role?.name === roleName
  }

  const canAccess = (requiredPermissions = []) => {
    if (!isMounted) return false
    if (user?.role?.name === 'admin') return true
    if (!Array.isArray(requiredPermissions)) {
      requiredPermissions = [requiredPermissions]
    }
    return requiredPermissions.some(permission => hasPermission(permission))
  }

  return {
    hasPermission,
    hasRole,
    canAccess,
    isAdmin: isMounted ? user?.role?.name === 'admin' : false,
    userRole: isMounted ? user?.role?.name : null,
    permissions: isMounted ? permissions : null,
    user: isMounted ? user : null,
    isMounted,
  }
}

"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCredentials, setLoading, logout } from "@/lib/features/auth/authSlice"
import { loadAuthFromStorage } from "@/lib/middleware/authPersistence"
import { selectAuthInitialized } from "@/lib/features/auth/authSlice"

export function useAuthInitialization() {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectAuthInitialized)

  useEffect(() => {
    if (!isInitialized) {
      console.log('Initializing auth state...')
      
      // Set loading state during initialization
      dispatch(setLoading(true))
      
      try {
        // Load auth state from localStorage
        const savedAuth = loadAuthFromStorage()
        
        if (savedAuth && savedAuth.accessToken) {
          console.log('Found saved auth data, restoring session')
          dispatch(setCredentials(savedAuth))
        } else {
          console.log('No valid auth data found')
          dispatch(setLoading(false))
        }
      } catch (error) {
        console.error('Error during auth initialization:', error)
        dispatch(logout())
      }
    }
  }, [dispatch, isInitialized])

  return { isInitialized }
}

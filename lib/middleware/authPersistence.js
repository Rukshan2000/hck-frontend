import { createListenerMiddleware } from "@reduxjs/toolkit"
import { setCredentials, logout } from "../features/auth/authSlice"
import { STORAGE_KEYS } from "../constants"
import { storage } from "../helpers"

const authPersistenceMiddleware = createListenerMiddleware()

// Save auth state to localStorage when credentials are set
authPersistenceMiddleware.startListening({
  actionCreator: setCredentials,
  effect: (action, listenerApi) => {
    const { user, accessToken, refreshToken } = action.payload
    
    // Store in main auth object
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }),
    )
    
    // Also store individual items for more granular access
    storage.set(STORAGE_KEYS.AUTH_TOKEN, accessToken)
    storage.set(STORAGE_KEYS.USER_DATA, user)
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },
})

// Clear localStorage when user logs out
authPersistenceMiddleware.startListening({
  actionCreator: logout,
  effect: (action, listenerApi) => {
    // Remove main auth object
    localStorage.removeItem("auth")
    
    // Also remove individual items
    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    storage.remove(STORAGE_KEYS.USER_DATA)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
  },
})

// Function to validate if token is expired
const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    // Decode JWT token payload (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error parsing token:', error)
    return true
  }
}

// Function to load auth state from localStorage
export const loadAuthFromStorage = () => {
  try {
    const authData = localStorage.getItem("auth")
    
    if (!authData) {
      return null
    }
    
    const parsedAuth = JSON.parse(authData)
    
    // Check if token is expired or missing essential data
    if (!parsedAuth.accessToken || !parsedAuth.user || isTokenExpired(parsedAuth.accessToken)) {
      console.log('Token expired or invalid auth data, clearing session')
      
      // Clean up all auth related storage
      localStorage.removeItem("auth")
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      storage.remove(STORAGE_KEYS.USER_DATA)
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
      
      return null
    }
    
    // Ensure user session is valid
    if (parsedAuth.isAuthenticated !== true) {
      console.log('Session not marked as authenticated, clearing session')
      localStorage.removeItem("auth")
      return null
    }
    
    return parsedAuth
  } catch (error) {
    console.error("Error loading auth from storage:", error)
    
    // Clean up on error
    localStorage.removeItem("auth")
    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    storage.remove(STORAGE_KEYS.USER_DATA)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
  }
  
  return null
}

export default authPersistenceMiddleware

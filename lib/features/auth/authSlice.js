import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true for SSR hydration
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
  permissions: [],
  isInitialized: false, // Track if auth has been initialized
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken, token } = action.payload
      state.user = user
      state.accessToken = accessToken || token
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      state.isLoading = false
      state.isInitialized = true
      state.error = null
      state.loginAttempts = 0
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
      if (!action.payload) {
        state.isInitialized = true
      }
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1
      state.lastLoginAttempt = Date.now()
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isLoading = false
      state.isInitialized = true
      state.error = null
      state.loginAttempts = 0
      state.lastLoginAttempt = null
      state.permissions = []
    },
  },
})

export const { 
  setCredentials, 
  setLoading, 
  setError, 
  incrementLoginAttempts, 
  clearError, 
  updateUser, 
  setPermissions,
  logout 
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.accessToken
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error
export const selectLoginAttempts = (state) => state.auth.loginAttempts
export const selectUserPermissions = (state) => state.auth.permissions
export const selectAuthInitialized = (state) => state.auth.isInitialized

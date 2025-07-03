import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 401) {
    console.log('Received 401, attempting token refresh...')
    
    // Try to refresh the token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

    if (refreshResult?.data) {
      console.log('Token refresh successful')
      const { accessToken } = refreshResult.data
      // Store the new token
      api.dispatch(setCredentials({ accessToken }))
      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions)
    } else {
      console.log('Token refresh failed, logging out user')
      // Refresh failed, logout user
      api.dispatch(logout())
      // Clear localStorage as well
      localStorage.removeItem("auth")
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Role', 'Menu', 'Task', 'Auth', 'Team'],
  endpoints: (builder) => ({}),
})

// Import actions that will be used in baseQueryWithReauth
import { setCredentials, logout } from "../features/auth/authSlice"

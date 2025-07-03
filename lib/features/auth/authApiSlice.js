import { apiSlice } from "../../api/apiSlice"
import { setCredentials, logout, setLoading, setError, incrementLoginAttempts, setPermissions, updateUser } from "./authSlice"
import { STORAGE_KEYS } from "../../constants"
import { storage } from "../../helpers"

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true))
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
          
          // Fetch user permissions after login
          dispatch(authApiSlice.endpoints.getPermissions.initiate())
        } catch (error) {
          dispatch(incrementLoginAttempts())
          dispatch(setError(error.error?.data?.message || "Login failed"))
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(setLoading(true))
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (error) {
          dispatch(setError(error.error?.data?.message || "Registration failed"))
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          
          // Clear all auth-related items from localStorage
          localStorage.removeItem("auth")
          storage.remove(STORAGE_KEYS.AUTH_TOKEN)
          storage.remove(STORAGE_KEYS.USER_DATA)
          storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
          
          // Dispatch logout to clear Redux state
          dispatch(logout())
        } catch (error) {
          console.error("Logout API call failed, but clearing session anyway:", error)
          
          // Even if logout fails on server, clear local state and storage
          localStorage.removeItem("auth")
          storage.remove(STORAGE_KEYS.AUTH_TOKEN)
          storage.remove(STORAGE_KEYS.USER_DATA)
          storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
          
          dispatch(logout())
        }
      },
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),
    getPermissions: builder.query({
      query: () => "/auth/permissions",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setPermissions(data.menus || data.permissions || []))
        } catch (error) {
          console.error('Failed to fetch permissions:', error)
        }
      },
      providesTags: ["Auth"],
    }),
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(updateUser(data.user))
        } catch (error) {
          dispatch(setError(error.error?.data?.message || 'Profile update failed'))
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetData,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useGetPermissionsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice

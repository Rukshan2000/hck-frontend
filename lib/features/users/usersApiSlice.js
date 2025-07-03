import { apiSlice } from '../../api/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params = {}) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getTrashedUsers: builder.query({
      query: (params = {}) => ({
        url: '/users/trashed',
        params,
      }),
      providesTags: ['User'],
    }),
    restoreUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
    forceDeleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/force-delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation: useAddUserMutation, // Renamed to match task style
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetTrashedUsersQuery,
  useRestoreUserMutation,
  useForceDeleteUserMutation,
} = usersApiSlice

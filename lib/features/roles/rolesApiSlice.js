import { apiSlice } from '../../api/apiSlice'

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params = {}) => ({
        url: '/roles',
        params,
      }),
      providesTags: ['Role'],
    }),
    getRole: builder.query({
      query: (id) => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    createRole: builder.mutation({
      query: (roleData) => ({
        url: '/roles',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...roleData }) => ({
        url: `/roles/${id}`,
        method: 'PUT',
        body: roleData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
    getTrashedRoles: builder.query({
      query: (params = {}) => ({
        url: '/roles/trashed',
        params,
      }),
      providesTags: ['Role'],
    }),
    restoreRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Role'],
    }),
    forceDeleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/${id}/force-delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
  }),
})

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetTrashedRolesQuery,
  useRestoreRoleMutation,
  useForceDeleteRoleMutation,
} = rolesApiSlice

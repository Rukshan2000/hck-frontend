import { apiSlice } from '../../api/apiSlice'

export const menusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: (params = {}) => ({
        url: '/menus',
        params,
      }),
      providesTags: ['Menu'],
    }),
    getMenu: builder.query({
      query: (id) => `/menus/${id}`,
      providesTags: (result, error, id) => [{ type: 'Menu', id }],
    }),
    createMenu: builder.mutation({
      query: (menuData) => ({
        url: '/menus',
        method: 'POST',
        body: menuData,
      }),
      invalidatesTags: ['Menu'],
    }),
    updateMenu: builder.mutation({
      query: ({ id, ...menuData }) => ({
        url: `/menus/${id}`,
        method: 'PUT',
        body: menuData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Menu', id }],
    }),
    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `/menus/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu'],
    }),
    reorderMenus: builder.mutation({
      query: (menuData) => ({
        url: '/menus/reorder',
        method: 'POST',
        body: menuData,
      }),
      invalidatesTags: ['Menu'],
    }),
    getTrashedMenus: builder.query({
      query: (params = {}) => ({
        url: '/menus/trashed',
        params,
      }),
      providesTags: ['Menu'],
    }),
    restoreMenu: builder.mutation({
      query: (id) => ({
        url: `/menus/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Menu'],
    }),
    forceDeleteMenu: builder.mutation({
      query: (id) => ({
        url: `/menus/${id}/force-delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Menu'],
    }),
  }),
})

export const {
  useGetMenusQuery,
  useGetMenuQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useReorderMenusMutation,
  useGetTrashedMenusQuery,
  useRestoreMenuMutation,
  useForceDeleteMenuMutation,
} = menusApiSlice

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedRole: null,
  filters: {
    search: '',
    with_trashed: false,
  },
  pagination: {
    page: 1,
    per_page: 15,
  },
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  setSelectedRole,
  setFilters,
  setPagination,
  clearSelectedRole,
  clearFilters,
} = rolesSlice.actions

export default rolesSlice.reducer

// Selectors
export const selectSelectedRole = (state) => state.roles.selectedRole
export const selectRolesFilters = (state) => state.roles.filters
export const selectRolesPagination = (state) => state.roles.pagination

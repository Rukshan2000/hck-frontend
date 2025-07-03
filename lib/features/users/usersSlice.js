import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedUser: null,
  filters: {
    search: '',
    role_id: 'all',
    manager_id: '',
    with_trashed: false,
  },
  pagination: {
    page: 1,
    per_page: 15,
  },
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  setSelectedUser,
  setFilters,
  setPagination,
  clearSelectedUser,
  clearFilters,
} = usersSlice.actions

export default usersSlice.reducer

// Selectors
export const selectSelectedUser = (state) => state.users.selectedUser
export const selectUsersFilters = (state) => state.users.filters
export const selectUsersPagination = (state) => state.users.pagination

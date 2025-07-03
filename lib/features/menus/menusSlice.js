import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedMenu: null,
  filters: {
    search: '',
    parent_id: '',
    with_trashed: false,
  },
  pagination: {
    page: 1,
    per_page: 15,
  },
}

const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    setSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearSelectedMenu: (state) => {
      state.selectedMenu = null
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const {
  setSelectedMenu,
  setFilters,
  setPagination,
  clearSelectedMenu,
  clearFilters,
} = menusSlice.actions

export default menusSlice.reducer

// Selectors
export const selectSelectedMenu = (state) => state.menus.selectedMenu
export const selectMenusFilters = (state) => state.menus.filters
export const selectMenusPagination = (state) => state.menus.pagination

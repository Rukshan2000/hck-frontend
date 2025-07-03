import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  selectedTask: null,
  filters: {
    search: '',
    status: 'all',
    assigned_to: 'all',
    created_by: '',
    deadline_from: '',
    deadline_to: '',
    overdue: false,
    with_trashed: false,
  },
  pagination: {
    page: 1,
    per_page: 15,
  },
  viewMode: 'list', // 'list' | 'kanban' | 'calendar'
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { 
  setSelectedTask, 
  setFilters, 
  setPagination,
  setViewMode,
  clearSelectedTask,
  clearFilters 
} = taskSlice.actions

export default taskSlice.reducer

// Selectors
export const selectSelectedTask = (state) => state.tasks.selectedTask
export const selectTasksFilters = (state) => state.tasks.filters
export const selectTasksPagination = (state) => state.tasks.pagination
export const selectTasksViewMode = (state) => state.tasks.viewMode

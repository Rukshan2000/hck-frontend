import { apiSlice } from "../../api/apiSlice"

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks (index)
    getTaskList: builder.query({
      query: (params = {}) => ({
        url: "/tasks",
        params,
      }),
      providesTags: ["Task"],
    }),
    
    // View single task (show)
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    
    // Add a new task (store)
    addTask: builder.mutation({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    
    // Update task (update)
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    
    // Delete task (destroy)
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
})

export const {
  useGetTaskListQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApiSlice

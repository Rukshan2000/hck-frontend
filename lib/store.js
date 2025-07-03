import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer, { setCredentials } from "./features/auth/authSlice"
import taskReducer from "./features/tasks/taskSlice"
import usersReducer from "./features/users/usersSlice"
import rolesReducer from "./features/roles/rolesSlice"
import menusReducer from "./features/menus/menusSlice"
import authPersistenceMiddleware, { loadAuthFromStorage } from "./middleware/authPersistence"

// Initial auth state - always start with clean state for SSR
const initialAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginAttempt: null,
  permissions: [],
}

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    tasks: taskReducer,
    users: usersReducer,
    roles: rolesReducer,
    menus: menusReducer,
  },
  preloadedState: {
    auth: initialAuthState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware, authPersistenceMiddleware.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Restore auth state on app initialization
if (typeof window !== "undefined") {
  const savedAuth = loadAuthFromStorage()
  if (savedAuth) {
    store.dispatch(setCredentials(savedAuth))
  }
}

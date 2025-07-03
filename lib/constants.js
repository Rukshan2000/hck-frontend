// Task status options
export const TASK_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  REVIEWED: 'reviewed',
  CLOSED: 'closed',
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.PENDING]: 'Pending',
  [TASK_STATUSES.COMPLETED]: 'Completed',
  [TASK_STATUSES.REVIEWED]: 'Reviewed',
  [TASK_STATUSES.CLOSED]: 'Closed',
}

export const TASK_STATUS_COLORS = {
  [TASK_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUSES.COMPLETED]: 'bg-green-100 text-green-800',
  [TASK_STATUSES.REVIEWED]: 'bg-blue-100 text-blue-800',
  [TASK_STATUSES.CLOSED]: 'bg-gray-100 text-gray-800',
}

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
}

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PERMISSIONS: '/auth/permissions',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    COMPLETE: (id) => `/tasks/${id}/complete`,
    MY_TASKS: '/tasks/my-tasks',
    CREATED_TASKS: '/tasks/created-tasks',
    STATISTICS: '/tasks/statistics',
    TRASHED: '/tasks/trashed',
    RESTORE: (id) => `/tasks/${id}/restore`,
    FORCE_DELETE: (id) => `/tasks/${id}/force-delete`,
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    TRASHED: '/users/trashed',
    RESTORE: (id) => `/users/${id}/restore`,
    FORCE_DELETE: (id) => `/users/${id}/force-delete`,
  },
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    UPDATE: (id) => `/roles/${id}`,
    DELETE: (id) => `/roles/${id}`,
    TRASHED: '/roles/trashed',
    RESTORE: (id) => `/roles/${id}/restore`,
    FORCE_DELETE: (id) => `/roles/${id}/force-delete`,
  },
  MENUS: {
    LIST: '/menus',
    CREATE: '/menus',
    UPDATE: (id) => `/menus/${id}`,
    DELETE: (id) => `/menus/${id}`,
    REORDER: '/menus/reorder',
    TRASHED: '/menus/trashed',
    RESTORE: (id) => `/menus/${id}/restore`,
    FORCE_DELETE: (id) => `/menus/${id}/force-delete`,
  },
}

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PER_PAGE: 15,
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
}

// Form validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
}

// Toast messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Welcome back! You have been successfully logged in.',
    LOGOUT: 'You have been successfully logged out.',
    REGISTER: 'Account created successfully! Welcome aboard.',
    TASK_CREATED: 'Task created successfully.',
    TASK_UPDATED: 'Task updated successfully.',
    TASK_DELETED: 'Task deleted successfully.',
    TASK_COMPLETED: 'Task marked as completed.',
    TASK_RESTORED: 'Task restored successfully.',
    USER_CREATED: 'User created successfully.',
    USER_UPDATED: 'User updated successfully.',
    USER_DELETED: 'User deleted successfully.',
    USER_RESTORED: 'User restored successfully.',
  },
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
    VALIDATION_ERROR: 'Please correct the errors and try again.',
  },
}

// Debounce delay for search inputs
export const DEBOUNCE_DELAY = 300

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy HH:mm',
}

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
}

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { VALIDATION_RULES, DATE_FORMATS } from "./constants"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Date utilities
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '-'
  
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    return '-'
  }
}

export const formatDateTime = (date) => {
  if (!date) return '-'
  
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return '-'
  }
}

export const isOverdue = (deadline) => {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null
  
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Validation utilities
export const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL.test(email)
}

export const validatePassword = (password) => {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH
}

export const validateName = (name) => {
  return name.length >= VALIDATION_RULES.NAME.MIN_LENGTH && 
         name.length <= VALIDATION_RULES.NAME.MAX_LENGTH
}

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

// Object utilities
export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

export const pick = (obj, keys) => {
  const result = {}
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })
  
  return searchParams.toString()
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  
  return result
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Permission utilities
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!requiredPermission) return true
  if (!userPermissions || !Array.isArray(userPermissions)) return false
  
  return userPermissions.some(permission => 
    permission.path === requiredPermission || 
    permission.name === requiredPermission
  )
}

export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true
  
  return requiredPermissions.some(permission => 
    hasPermission(userPermissions, permission)
  )
}

export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true
  
  return requiredPermissions.every(permission => 
    hasPermission(userPermissions, permission)
  )
}

// Error handling utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.data?.message) return error.data.message
  if (error?.error?.data?.message) return error.error.data.message
  return 'An unexpected error occurred'
}

export const getValidationErrors = (error) => {
  if (error?.data?.errors) return error.data.errors
  if (error?.errors) return error.errors
  return {}
}

// Theme utilities
export const getTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('theme') || 'light'
}

export const setTheme = (theme) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Local storage utilities with error handling
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage:`, error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage:`, error)
    }
  },
  
  remove: (key) => {
    try {
      if (typeof window === 'undefined') return
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
    }
  },
  
  clear: () => {
    try {
      if (typeof window === 'undefined') return
      localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
    }
  }
}

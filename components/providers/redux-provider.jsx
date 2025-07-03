"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { useAuthInitialization } from "@/hooks/use-auth-initialization"
import ErrorBoundary from "@/components/error-boundary"

function AuthInitializer() {
  useAuthInitialization()
  return null
}

export function ReduxProvider({ children }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthInitializer />
        {children}
      </Provider>
    </ErrorBoundary>
  )
}

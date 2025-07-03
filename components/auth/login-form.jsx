"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useLoginMutation } from "@/lib/features/auth/authApiSlice"
import { selectAuthError, selectAuthLoading, selectLoginAttempts } from "@/lib/features/auth/authSlice"
import { STORAGE_KEYS } from "@/lib/constants"
import { storage } from "@/lib/helpers"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const authError = useSelector(selectAuthError)
  const authLoading = useSelector(selectAuthLoading)
  const loginAttempts = useSelector(selectLoginAttempts)

  const isLoading = isLoginLoading || authLoading

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Rate limiting check
    if (loginAttempts >= 5) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      }).unwrap()

      // Save session data in localStorage (this is a backup, the middleware should do this too)
      if (result && result.accessToken) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            isAuthenticated: true,
          })
        )
        
        // Also store as separate items for easier access
        storage.set(STORAGE_KEYS.AUTH_TOKEN, result.accessToken)
        storage.set(STORAGE_KEYS.USER_DATA, result.user)
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, result.refreshToken)
        
        // If remember me is checked, set a flag in localStorage
        if (formData.remember) {
          storage.set('remember_me', true)
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })

      router.push("/dashboard")
    } catch (error) {
      // Error is handled by the authApiSlice
      console.error("Login error:", error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {authError && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {loginAttempts >= 3 && loginAttempts < 5 && (
            <Alert>
              <AlertDescription>
                Warning: {5 - loginAttempts} attempts remaining before temporary lockout.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={(e) => handleChange("remember", e.target.checked)}
              disabled={isLoading}
              className="rounded border-gray-300"
            />
            <Label htmlFor="remember" className="text-sm">
              Remember me
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="text-center text-sm space-y-2">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
            <div>
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

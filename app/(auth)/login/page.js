import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - Ciber Wizards",
  description: "Sign in to your Ciber Wizards account",
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  )
}

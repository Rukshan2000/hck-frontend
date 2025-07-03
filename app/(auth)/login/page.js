import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - TaskManager",
  description: "Sign in to your TaskManager account",
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  )
}

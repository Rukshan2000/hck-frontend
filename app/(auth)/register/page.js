import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Create Account - TaskManager",
  description: "Create your TaskManager account",
}

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <RegisterForm />
    </div>
  )
}

import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Create Account - Ciber Wizards",
  description: "Create your Ciber Wizards account",
}

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <RegisterForm />
    </div>
  )
}

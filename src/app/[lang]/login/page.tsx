'use client'

import { AuthLayout } from '@/layout/AuthLayout'
import { Login } from '@/ui/components/login'

export default function LoginPage() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  )
}

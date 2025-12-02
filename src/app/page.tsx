'use client'

import { useAuth } from '@/context/AuthContext'
import { useSpinner } from '@/context/SpinnerContext'
import { AppLayout } from '@/layout/AppLayout/AppLayout'
import { useEffect } from 'react'

export default function Page() {
  const { user, loading } = useAuth()
  const { showSpinner, hideSpinner } = useSpinner()
  useEffect(() => {
    if (loading) {
      showSpinner()
    } else {
      hideSpinner()
    }
  }, [loading])

  const displayName = user?.full_name ?? user?.email ?? 'User'

  return (
    <AppLayout>
      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <h1 className='text-2xl font-semibold text-gray-900'>Welcome back, {displayName}</h1>
        <p className='mt-2 text-gray-600'>
          This is the main dashboard area. Drop your widgets or page content here.
        </p>
      </section>
    </AppLayout>
  )
}

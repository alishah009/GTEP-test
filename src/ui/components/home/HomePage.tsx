'use client'

import { useAuth } from '@/context/AuthContext'
import { useSpinner } from '@/context/SpinnerContext'
import { AppLayout } from '@/layout/AppLayout/AppLayout'
import { useEffect } from 'react'

type HomePageClientProps = {
  dict: Awaited<ReturnType<typeof import('@/lib/i18n/dictionaries').getDictionary>>
}

export function HomePageClient({ dict }: HomePageClientProps) {
  const { user, loading } = useAuth()
  const { showSpinner, hideSpinner } = useSpinner()

  useEffect(() => {
    if (loading) {
      showSpinner()
    } else {
      hideSpinner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const displayName = user?.full_name ?? user?.email ?? dict.common.user

  return (
    <AppLayout>
      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <h1 className='text-2xl font-semibold text-gray-900'>
          {dict.pages.home.welcomeBack.replace('{name}', displayName)}
        </h1>
        <p className='mt-2 text-gray-600'>{dict.pages.home.dashboardDescription}</p>
      </section>
    </AppLayout>
  )
}

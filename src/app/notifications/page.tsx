'use client'

import { AppLayout } from '@/layout/AppLayout/AppLayout'

export default function Page() {
  return (
    <AppLayout>
      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mt-2 text-gray-600'>
          This is the main Notifications area. Drop your widgets or page content here.
        </p>
      </section>
    </AppLayout>
  )
}

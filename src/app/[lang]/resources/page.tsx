// Server Component - no 'use client' directive
import { AppLayout } from '@/layout/AppLayout/AppLayout'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/config/i18n'

type ResourcesPageProps = {
  params: Promise<{ lang: Locale }>
}

export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) // Server-side dictionary loading

  return (
    <AppLayout>
      <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <p className='mt-2 text-gray-600'>{dict.pages.resources.description}</p>
      </section>
    </AppLayout>
  )
}

'use client'

import { useParams } from 'next/navigation'
import type { Locale } from '@/config/i18n'
import { defaultLocale } from '@/config/i18n'

export function useLocale(): Locale {
  const params = useParams()
  const lang = params?.lang as string | undefined
  return (lang as Locale) || defaultLocale
}

'use client'

import { useEffect } from 'react'
import { useLocale } from '@/hooks/i18n/useLocale'

/**
 * Client component to set the lang attribute on the html element
 * This is needed because the root layout can't access the locale from params
 *
 * Usage: Add this component in your root layout
 */
export function LocaleSetter() {
  const locale = useLocale()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])

  return null
}

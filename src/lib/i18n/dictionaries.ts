/**
 * Server-side dictionary loader
 * Use this in Server Components (no 'use client' directive)
 *
 * Example:
 * ```tsx
 * import { getDictionary } from '@/lib/i18n/dictionaries'
 *
 * export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
 *   const { lang } = await params
 *   const dict = await getDictionary(lang)
 *   return <div>{dict.pages.home.title}</div>
 * }
 * ```
 *
 * For Client Components, use the useDictionary() hook from @/hooks/i18n/useDictionary
 */
import 'server-only'
import type { Locale } from '@/config/i18n'

const dictionaries = {
  'en-US': () => import('./dictionaries/en.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default), // Fallback for 'en'
  'es-ES': () => import('./dictionaries/es.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default) // Fallback for 'es'
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries['en-US']()
}

/**
 * Client-side dictionary loader
 * Used internally by the useDictionary() hook
 *
 * For Client Components, use the useDictionary() hook from @/hooks/i18n/useDictionary
 * instead of calling this directly.
 */
import type { Locale } from '@/config/i18n'

const dictionaries = {
  'en-US': () => import('./dictionaries/en.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default), // Fallback for 'en'
  'es-ES': () => import('./dictionaries/es.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default) // Fallback for 'es'
}

export const getDictionaryClient = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries['en-US']()
}

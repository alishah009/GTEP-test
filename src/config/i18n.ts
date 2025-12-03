// Using BCP 47 format: language-COUNTRY (e.g., en-US, es-ES)
// This allows for regional variants if needed in the future (e.g., en-GB, es-MX)
export const locales = ['en-US', 'es-ES'] as const
export const defaultLocale = 'en-US' as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  'en-US': 'English',
  'es-ES': 'Español'
}

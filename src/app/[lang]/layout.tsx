import { locales } from '@/config/i18n'

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}

/**
 * Nested layout for [lang] routes
 * Note: html and body tags are in the root layout to avoid hydration errors
 */
export default async function LangLayout({
  children
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // This layout just wraps children - all providers and html/body are in root layout
  // Params are typed as string by Next.js, but we validate them at runtime via middleware
  return <>{children}</>
}

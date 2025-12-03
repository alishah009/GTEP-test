// Server Component - loads dictionary on server
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/config/i18n'
import { HomePageClient } from '@/ui/components/home/HomePage'

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) // Server-side dictionary loading

  return <HomePageClient dict={dict} />
}

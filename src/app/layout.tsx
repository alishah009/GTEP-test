import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { SpinnerProvider } from '@/context/SpinnerContext'
import { LocaleSetter } from '@/lib/i18n/LocaleSetter'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'GTEP',
  description: 'GTEP platform',
  icons: {
    icon: [
      { url: '/gtep.png', type: 'image/png' },
      { url: '/gtep.png', type: 'image/png', sizes: '32x32' },
      { url: '/gtep.png', type: 'image/png', sizes: '16x16' }
    ],
    shortcut: '/gtep.png',
    apple: '/gtep.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`${poppins.variable} antialiased`}>
        <LocaleSetter />
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SpinnerProvider>{children}</SpinnerProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

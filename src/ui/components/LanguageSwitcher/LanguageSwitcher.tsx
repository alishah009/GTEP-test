'use client'

import { useLocale } from '@/hooks/i18n/useLocale'
import { usePathname, useRouter } from 'next/navigation'
import { localeNames, type Locale } from '@/config/i18n'
import { DownOutlined, CheckOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'

export function LanguageSwitcher() {
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Show only main locales (English and Spanish)
  const availableLocales: Locale[] = ['en-US', 'es-ES']

  const switchLanguage = (targetLocale: Locale) => {
    // Replace the locale in the current pathname
    const pathWithoutLocale = pathname.replace(/^\/[^/]+/, '') || '/'
    const newPath = `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    router.push(newPath)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLocaleCode = currentLocale.split('-')[0].toUpperCase()

  // Get flag emoji for locale
  const getFlag = (locale: Locale) => {
    const code = locale.split('-')[0]
    if (code === 'en') return '🇺🇸'
    if (code === 'es') return '🇪🇸'
    return '🌐'
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex cursor-pointer items-center gap-1.5 max-[400px]:gap-1 rounded-lg border px-3 py-2 max-[400px]:px-2 max-[400px]:py-1.5 text-sm max-[400px]:text-xs font-medium transition-all duration-200 ${
          isOpen
            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-600 hover:shadow-sm'
        }`}
        aria-label='Switch language'
        aria-expanded={isOpen}
      >
        <div className='flex items-center gap-1.5 max-[400px]:gap-1'>
          <span className='text-base max-[400px]:text-sm'>{getFlag(currentLocale)}</span>
          <span className='rounded bg-gray-100 px-1.5 py-0.5 max-[400px]:px-1 max-[400px]:py-0.5 text-xs max-[400px]:text-[10px] font-bold text-gray-600'>
            {currentLocaleCode}
          </span>
        </div>
        <DownOutlined
          className={`ml-1 max-[400px]:ml-0.5 text-xs max-[400px]:text-[10px] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary-600' : 'text-gray-400'
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl backdrop-blur-sm transition-all duration-200 ease-out'>
          <div className='p-1.5'>
            {availableLocales.map((locale) => {
              const isActive =
                currentLocale === locale || currentLocale.startsWith(locale.split('-')[0])
              const localeCode = locale.split('-')[0].toUpperCase()
              return (
                <button
                  key={locale}
                  type='button'
                  onClick={() => switchLanguage(locale)}
                  className={`group relative w-full cursor-pointer rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <span className='text-lg'>{getFlag(locale)}</span>
                      <div className='flex flex-col'>
                        <span
                          className={`text-sm font-medium ${
                            isActive ? 'text-primary-700' : 'text-gray-900'
                          }`}
                        >
                          {localeNames[locale]}
                        </span>
                        <span
                          className={`text-xs ${isActive ? 'text-primary-500' : 'text-gray-500'}`}
                        >
                          {localeCode}
                        </span>
                      </div>
                    </div>
                    {isActive && <CheckOutlined className='text-primary-600' />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

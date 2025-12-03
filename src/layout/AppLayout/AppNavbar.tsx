'use client'

import Image from 'next/image'
import {
  BellOutlined,
  MenuOutlined,
  MoonOutlined,
  SearchOutlined,
  SunOutlined
} from '@ant-design/icons'
import { Input } from 'antd'
import { useTheme } from '@/context/ThemeContext'
import { LanguageSwitcher } from '@/ui/components/LanguageSwitcher/LanguageSwitcher'
import { useDictionary } from '@/hooks/i18n/useDictionary'

type AppNavbarProps = {
  onToggleSidebar: () => void
}

export function AppNavbar({ onToggleSidebar }: AppNavbarProps) {
  const notificationCount = 16
  const { theme, toggleTheme } = useTheme()
  const { dict, loading: dictLoading } = useDictionary()

  if (!dict || dictLoading) {
    return null
  }

  return (
    <header className='z-20 flex shrink-0 items-center justify-between gap-6 border-b border-gray-200 bg-white px-6 py-3'>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          className='rounded-md p-2 text-gray-600 hover:bg-gray-100'
          onClick={onToggleSidebar}
          aria-label={dict.navigation.toggleSidebar}
        >
          <MenuOutlined />
        </button>
        <Image
          src='/gtep.png'
          alt={dict.layout.logo}
          width={120}
          height={10}
          className='h-10 w-auto'
        />
      </div>

      <div className='flex flex-1 items-center justify-end gap-4'>
        <div className='hidden max-w-md flex-1 lg:flex'>
          <Input
            placeholder={dict.navigation.searchPlaceholder}
            className='py-3! px-4! rounded-full! border-0! bg-gray-100! text-sm! text-gray-600! hover:border-primary-600! focus:border-primary-600! focus:ring-0! focus:shadow-[0_0_0_4px_rgba(221,91,74,0.15)]!'
            suffix={<SearchOutlined className='text-gray-500!' size={50} />}
          />
        </div>
        <LanguageSwitcher />
        <button
          className='relative rounded-full'
          aria-label={dict.navigation.toggleTheme}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <MoonOutlined className='text-lg text-gray-700' />
          ) : (
            <SunOutlined className='text-lg text-gray-700' />
          )}
        </button>
        <button className='relative rounded-full' aria-label={dict.navigation.notifications}>
          <BellOutlined className='text-lg text-gray-700' />
          {notificationCount > 0 ? (
            <span className='absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold leading-none text-white'>
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  )
}

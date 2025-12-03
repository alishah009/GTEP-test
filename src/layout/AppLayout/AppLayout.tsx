'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightOutlined, CloseOutlined } from '@ant-design/icons'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, filterNavItemsByRole, type NavItem } from '@/config/accessControl'
import { AppNavbar } from './AppNavbar'
import { useAuth } from '@/context/AuthContext'
import { useSpinner } from '@/context/SpinnerContext'
import { useLocale } from '@/hooks/i18n/useLocale'
import { useDictionary } from '@/hooks/i18n/useDictionary'

type AppLayoutProps = {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, loading, logout } = useAuth()
  const { showSpinner, hideSpinner } = useSpinner()
  const locale = useLocale()
  const { dict, loading: dictLoading } = useDictionary()

  const [isDesktop, setIsDesktop] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [allowSidebarAnimation, setAllowSidebarAnimation] = useState(false)
  const pathname = usePathname()

  // Strip locale from pathname for comparison (e.g., /en-US/profile -> /profile)
  const pathnameWithoutLocale = useMemo(() => {
    const localePrefix = `/${locale}`
    if (pathname.startsWith(localePrefix)) {
      const path = pathname.slice(localePrefix.length) || '/'
      return path
    }
    return pathname
  }, [pathname, locale])

  // Map navigation items to translated labels
  const translatedNavItems = useMemo(() => {
    if (!dict) return NAV_ITEMS

    const translateNavItem = (item: NavItem): NavItem => {
      const labelMap: Record<string, string> = {
        Home: dict.navigation.home,
        Achievements: dict.navigation.achievements,
        'Training Courses': dict.navigation.trainingCourses,
        'Leader Board': dict.navigation.leaderboard,
        Notifications: dict.navigation.notifications,
        Resources: dict.navigation.resources,
        Profile: dict.navigation.profile
      }

      return {
        ...item,
        // Use dictionary value, fallback to original label only if not found in map
        label: labelMap[item.label] ?? item.label,
        children: item.children?.map(translateNavItem)
      }
    }

    return NAV_ITEMS.map(translateNavItem)
  }, [dict])

  const visibleNavItems = useMemo(
    () => filterNavItemsByRole(translatedNavItems, user?.role ?? null),
    [translatedNavItems, user?.role]
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')

    const handleChange = () => {
      setIsDesktop(mediaQuery.matches)
      setIsSidebarOpen(mediaQuery.matches)
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAllowSidebarAnimation(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const initials = useMemo(() => {
    if (!user?.full_name) return 'U'
    const parts = user.full_name.split(' ').filter(Boolean)
    if (parts.length === 0) return 'U'
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }, [user])

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  useEffect(() => {
    if (loading) {
      showSpinner()
    } else {
      hideSpinner()
    }
  }, [hideSpinner, loading, showSpinner])

  // Don't render until dictionary is loaded
  if (!dict || dictLoading) {
    return null
  }

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50 text-gray-900'>
      <button
        type='button'
        className={`fixed inset-0 z-30 bg-black/30 ${
          allowSidebarAnimation ? 'transition-opacity' : ''
        } lg:hidden ${
          isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeSidebar}
        aria-label={dict.navigation.closeSidebar}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-white ${
          allowSidebarAnimation ? 'transition-transform duration-300 ease-in-out' : ''
        } ${isSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full shadow-none'}`}
      >
        <div className='flex items-center justify-between  px-6 py-4'>
          <div className='flex items-center gap-3'>
            {user?.photo_url ? (
              <Image
                src={user.photo_url}
                alt={dict.layout.userAvatar}
                width={48}
                height={48}
                className='h-12 w-12 rounded-full object-cover'
              />
            ) : (
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700'>
                {initials}
              </div>
            )}
            <div>
              <p className='text-base font-semibold text-gray-900'>
                {user?.full_name ?? dict.common.user}
              </p>
              <p className='text-sm text-gray-400'>{user?.role ?? dict.common.guest}@gtep.com</p>
            </div>
          </div>
          <button
            type='button'
            className='rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden'
            onClick={toggleSidebar}
            aria-label={dict.navigation.closeSidebar}
          >
            <CloseOutlined />
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto px-4 py-6'>
          <ul className='space-y-1'>
            {visibleNavItems.map((item) => {
              const isActive = pathnameWithoutLocale === item.href
              const hrefWithLocale = `/${locale}${item.href === '/' ? '' : item.href}`
              return (
                <li key={item.href}>
                  <Link
                    href={hrefWithLocale}
                    className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      {item.icon ? (
                        <span className='text-base'>{item.icon && <item.icon />}</span>
                      ) : null}
                      <span>{item.label}</span>
                    </div>
                    {item.children && item.children.length > 0 ? (
                      <span className='text-xs text-gray-400'>▸</span>
                    ) : null}
                  </Link>
                  {item.children && item.children.length > 0 ? (
                    <ul className='mt-1 space-y-1 pl-4'>
                      {item.children.map((child) => {
                        const isChildActive = pathnameWithoutLocale === child.href
                        const childHrefWithLocale = `/${locale}${child.href}`
                        return (
                          <li key={child.href}>
                            <Link
                              href={childHrefWithLocale}
                              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                isChildActive
                                  ? 'bg-primary-50 text-primary-600'
                                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              {child.icon ? (
                                <span className='text-sm'>{child.icon && <child.icon />}</span>
                              ) : null}
                              <span>{child.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </li>
              )
            })}
            {visibleNavItems.length === 0 ? (
              <li className='rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500'>
                {dict.navigation.noSectionsAvailable}
              </li>
            ) : null}
          </ul>
        </nav>

        <div className='px-6 py-4'>
          {logout ? (
            <button
              type='button'
              onClick={() => {
                logout()
                if (!isDesktop) {
                  closeSidebar()
                }
              }}
              className='mt-4 flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-[#F25555] transition hover:text-[#d94444]'
            >
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE3DF]'>
                <ArrowRightOutlined />
              </span>
              {dict.navigation.logout}
            </button>
          ) : null}
        </div>
      </aside>

      <div
        className={`flex h-full flex-1 flex-col overflow-hidden ${
          allowSidebarAnimation ? 'transition-[margin-left] duration-300' : ''
        } lg:ml-0`}
        style={{ marginLeft: isDesktop ? (isSidebarOpen ? '16rem' : '0') : undefined }}
      >
        <AppNavbar onToggleSidebar={toggleSidebar} />

        <main className='flex-1 overflow-y-auto px-4 py-6 lg:px-8'>{children}</main>
      </div>
    </div>
  )
}

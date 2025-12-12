import { CookieOptions, createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@/enum/User'
import { canRoleAccessPath } from '@/config/accessControl'
import { env } from '@/config/env'
import { locales, defaultLocale } from '@/config/i18n'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1]
    return locale
  }

  // Get the preferred locale from Accept-Language header
  const headers = { 'accept-language': request.headers.get('accept-language') || '' }
  const languages = new Negotiator({ headers }).languages()
  const matchedLocale = match(languages, locales, defaultLocale)
  return matchedLocale
}

function stripLocale(pathname: string): string {
  const localeMatch = pathname.match(/^\/([^/]+)(\/.*)?$/)
  if (localeMatch && locales.includes(localeMatch[1] as (typeof locales)[number])) {
    return localeMatch[2] || '/'
  }
  return pathname
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(request.url)
    newUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(newUrl)
  }

  const response = NextResponse.next()

  const supabase = createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.delete({ name, ...options })
      }
    }
  })

  // Fetch session and validate it to avoid stale/invalid cookies granting access
  const {
    data: { session }
  } = await supabase.auth.getSession()

  let validSession = session
  if (session?.access_token) {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      validSession = null
    }
  }

  // Strip locale from path for route checking
  const pathWithoutLocale = stripLocale(pathname)

  // Redirect logged-in users away from /login and /signup
  if ((pathWithoutLocale === '/login' || pathWithoutLocale === '/signup') && validSession) {
    const locale = pathname.split('/')[1]
    return NextResponse.redirect(new URL(`/${locale}/`, request.url))
  }

  const isAuthRoute = pathWithoutLocale === '/login' || pathWithoutLocale === '/signup'

  // Protect all paths except /login and /signup
  if (!isAuthRoute && !validSession) {
    const locale = pathname.split('/')[1]
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (validSession) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', validSession.user.id)
      .single()

    const userRole = (profile?.role as Role | null) ?? null
    const isAllowed = canRoleAccessPath(pathWithoutLocale, userRole)

    if (!isAllowed) {
      const locale = pathname.split('/')[1]
      return NextResponse.redirect(new URL(`/${locale}/`, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
      Match all routes except static files, _next, etc.
      This protects / and /dashboard/*
    */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)).*)'
  ]
}

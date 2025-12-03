import { CookieOptions, createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@/enum/User'
import { canRoleAccessPath } from '@/config/accessControl'
import { env } from '@/config/env'

export async function middleware(request: NextRequest) {
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

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // Redirect logged-in users away from /login and /signup
  if ((path === '/login' || path === '/signup') && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const isAuthRoute = path === '/login' || path === '/signup'

  // Protect all paths except /login and /signup
  if (!isAuthRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const userRole = (profile?.role as Role | null) ?? null
    const isAllowed = canRoleAccessPath(path, userRole)

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/', request.url))
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

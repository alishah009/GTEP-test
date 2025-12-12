'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/supabaseBrowser'
import { useTheme } from '@/context/ThemeContext'
import { useUser } from '@/hooks/useUser'
import { User } from '@/entity/User'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  logout: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()
  const router = useRouter()
  const { resetTheme } = useTheme()

  const { data: userData, isLoading: userLoading } = useUser(session?.user?.id ?? null)

  const logout = useCallback(async () => {
    if (typeof document !== 'undefined') {
      document.cookie.split(';').forEach((cookie) => {
        const [name] = cookie.split('=')
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      })
    }
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
      window.sessionStorage.clear()
    }
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    resetTheme()
    router.replace('/login')
    router.refresh()
  }, [resetTheme, router, supabase])

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setSession(data.session)
      } else {
        await logout()
      }
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [logout, supabase])

  // Set user only after session & userData are ready
  useEffect(() => {
    if (session && userData && !userLoading) {
      // Defer state update to next microtask to avoid cascading renders
      queueMicrotask(() => {
        setUser({ ...userData, email: session.user.email ?? null } as User)
        setLoading(false)
      })
    } else {
      queueMicrotask(() => {
        setUser(null)
        setLoading(false)
      })
    }
  }, [session, userData, userLoading])

  return (
    <AuthContext.Provider value={{ user, session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseBrowser'
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
  const router = useRouter()

  const { data: userData, isLoading: userLoading } = useUser(session?.user?.id ?? null)

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.push('/login')
  }

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
      console.log('context newSession', newSession, _event)
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Set user only after session & userData are ready
  useEffect(() => {
    if (session && userData && !userLoading) {
      // Defer state update to next microtask to avoid cascading renders
      queueMicrotask(() => {
        setUser({ ...userData, email: session.user.email ?? null } as User)
        setLoading(false)
      })
    } else if (!session) {
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

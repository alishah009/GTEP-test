'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSupabaseClient,
  setAuthPersistence,
  PersistenceMode
} from '@/lib/supabase/supabaseBrowser'
import { useRouter } from 'next/navigation'
import { User } from '@/entity/User'
import { MessageInstance } from 'antd/es/message/interface'
import { Role } from '@/enum/User'

// Login mutation
export function useLogin(
  messageApi: MessageInstance,
  options?: {
    redirectTo?: string
  }
) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const redirectTo = options?.redirectTo ?? '/'
  return useMutation({
    mutationFn: async ({
      email,
      password,
      rememberMe
    }: {
      email: string
      password: string
      rememberMe?: boolean
    }) => {
      // Treat missing/false as session-only; only explicit true persists
      const shouldRemember = rememberMe === true
      const persistenceMode = shouldRemember ? PersistenceMode.Local : PersistenceMode.Session

      setAuthPersistence(persistenceMode)

      // Use the shared client - it uses dynamic storage that checks persistence mode
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      // Invalidate and refetch session
      queryClient.invalidateQueries({ queryKey: ['session'] })
      messageApi.open({
        key: 'LoginResponse',
        type: 'success',
        content: 'Login Successfully'
      })
      router.replace(redirectTo)
    },
    onMutate: () => {
      messageApi.open({
        key: 'LoginResponse',
        type: 'loading',
        content: 'loading...'
      })
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error)
      messageApi.open({
        key: 'LoginResponse',
        type: 'error',
        content: errorMessage
      })
    }
  })
}

// Signup mutation
export function useSignup(messageApi: MessageInstance) {
  const queryClient = useQueryClient()
  // const router = useRouter()
  const supabase = getSupabaseClient()

  return useMutation({
    mutationFn: async (user: User) => {
      // Create user in Supabase Auth
      // Store full_name and role in user metadata so the database trigger can access it
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email!,
        password: user.password!,
        options: {
          data: {
            full_name: user.full_name,
            role: Role.CUSTOMER
          }
        }
      })
      if (authError) {
        throw authError
      }
      // User profile will be automatically created by database trigger
      // No need to manually insert into 'users' table
      return authData
    },
    onSuccess: () => {
      messageApi.open({
        key: 'SignupResponse',
        type: 'success',
        content: 'An email has been sent to you. Please verify your email and then login.'
      })
      //router.push('/login')
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
    onMutate: () => {
      messageApi.open({
        key: 'SignupResponse',
        type: 'loading',
        content: 'loading...'
      })
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error)
      messageApi.open({
        key: 'SignupResponse',
        type: 'error',
        content: errorMessage
      })
    }
  })
}

// Logout mutation
export function useLogout(messageApi: MessageInstance) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // Clear persistence flags and any remaining tokens
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('gtep:auth:persistence')
        window.sessionStorage.removeItem('gtep:auth:persistence')
      }
    },
    onSuccess: () => {
      // Clear session from cache
      queryClient.clear()
      router.replace('/login')
      router.refresh()
    },
    onMutate: () => {
      messageApi.open({
        key: 'LogoutResponse',
        type: 'loading',
        content: 'loading...'
      })
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : String(error)
      messageApi.open({
        key: 'LogoutResponse',
        type: 'error',
        content: errorMessage
      })
    }
  })
}

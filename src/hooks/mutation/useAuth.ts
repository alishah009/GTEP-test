'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabaseBrowser'
import { useRouter } from 'next/navigation'
import { User } from '@/entity/User'
import { Role } from '@/enum/User'
import { MessageInstance } from 'antd/es/message/interface'

// Login mutation
export function useLogin(messageApi: MessageInstance) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
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
      router.push('/')
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
  const router = useRouter()

  return useMutation({
    mutationFn: async (user: User) => {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email!,
        password: user.password!
      })
      if (authError) {
        throw authError
      }
      // Insert user profile into 'users' table
      if (authData.user?.id) {
        const { error: profileError } = await supabase
          .from('users')
          // @ts-expect-error - Supabase type inference issue with users table
          .insert({ ...user, role: Role.CUSTOMER })

        if (profileError) {
          throw profileError
        }
      }
      return authData
    },
    onSuccess: () => {
      messageApi.open({
        key: 'SignupResponse',
        type: 'success',
        content: 'Signup Successfully'
      })
      router.push('/login')
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
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      // Clear session from cache
      queryClient.setQueryData(['session'], null)
      router.push('/login')
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

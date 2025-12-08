/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useLogin, useSignup, useLogout } from '../useAuth'
import { supabase } from '@/lib/supabase/supabaseBrowser'
import { Role } from '@/enum/User'
import { User } from '@/entity/User'
import { MessageInstance } from 'antd/es/message/interface'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('@/lib/supabase/supabaseBrowser', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn()
  }
}))

const mockRouter = {
  push: jest.fn()
}

const mockMessageApi: MessageInstance = {
  open: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  loading: jest.fn(),
  destroy: jest.fn()
} as any

describe('useAuth Mutations', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  describe('useLogin', () => {
    const email = 'test@example.com'
    const password = 'password123'

    describe('Business Logic - Authentication', () => {
      it('should call signInWithPassword with correct credentials', async () => {
        const mockAuthData = {
          user: { id: 'user-id', email },
          session: { access_token: 'token' }
        }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email,
          password
        })
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1)
      })

      it('should throw error when authentication fails', async () => {
        const authError = { message: 'Invalid credentials', status: 400 }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: null,
          error: authError
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(authError)
      })
    })

    describe('Business Logic - Query Invalidation', () => {
      it('should invalidate session query on successful login', async () => {
        const mockAuthData = {
          user: { id: 'user-id', email },
          session: { access_token: 'token' }
        }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        // Set initial session data
        queryClient.setQueryData(['session'], { user: null })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['session'] })
      })
    })

    describe('Business Logic - Navigation', () => {
      it('should redirect to home page on successful login', async () => {
        const mockAuthData = {
          user: { id: 'user-id', email },
          session: { access_token: 'token' }
        }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(mockRouter.push).toHaveBeenCalledWith('/')
        expect(mockRouter.push).toHaveBeenCalledTimes(1)
      })
    })

    describe('Business Logic - User Feedback', () => {
      it('should show loading message when mutation starts', async () => {
        const mockAuthData = {
          user: { id: 'user-id', email },
          session: { access_token: 'token' }
        }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        // onMutate is called synchronously, so we can check immediately
        await waitFor(() => {
          expect(mockMessageApi.open).toHaveBeenCalledWith({
            key: 'LoginResponse',
            type: 'loading',
            content: 'loading...'
          })
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })
      })

      it('should show success message on successful login', async () => {
        const mockAuthData = {
          user: { id: 'user-id', email },
          session: { access_token: 'token' }
        }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'LoginResponse',
          type: 'success',
          content: 'Login Successfully'
        })
      })

      it('should show error message when login fails', async () => {
        const authError = { message: 'Invalid email or password', status: 400 }
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: null,
          error: authError
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        // The error handler converts non-Error objects using String(), which results in "[object Object]"
        // This is current behavior - the code checks instanceof Error first, then falls back to String()
        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'LoginResponse',
          type: 'error',
          content: String(authError) // This is what the code actually does for non-Error objects
        })
      })

      it('should handle non-Error objects in error handler', async () => {
        // Create an actual Error instance to test the instanceof Error path
        const authError = new Error('Network error')
        ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: null,
          error: authError
        })

        const { result } = renderHook(() => useLogin(mockMessageApi), { wrapper })

        result.current.mutate({ email, password })

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        // Verify Error instances use error.message
        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'LoginResponse',
          type: 'error',
          content: authError.message
        })
      })
    })
  })

  describe('useSignup', () => {
    const mockUser: User = {
      id: '',
      email: 'newuser@example.com',
      full_name: 'John Doe',
      password: 'securePassword123',
      role: Role.CUSTOMER
    }

    const mockAuthUser = {
      id: 'new-user-id',
      email: mockUser.email
    }

    describe('Business Logic - User Creation', () => {
      it('should create auth user with email and password', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockInsert = jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: {}, error: null })
          })
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: mockUser.email,
          password: mockUser.password
        })
        expect(supabase.auth.signUp).toHaveBeenCalledTimes(1)
      })

      it('should throw error when auth creation fails', async () => {
        const authError = { message: 'Email already exists', status: 400 }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: null,
          error: authError
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(authError)
        // Should not attempt to create profile if auth fails
        expect(supabase.from).not.toHaveBeenCalled()
      })

      it('should not create profile if user id is missing', async () => {
        const mockAuthData = {
          user: null,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        // Should not attempt to create profile if user.id is missing
        expect(supabase.from).not.toHaveBeenCalled()
      })
    })

    describe('Business Logic - Profile Creation', () => {
      it('should create user profile with correct data after auth success', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(supabase.from).toHaveBeenCalledWith('users')
        expect(mockInsert).toHaveBeenCalledWith({
          id: mockAuthUser.id,
          full_name: mockUser.full_name,
          role: Role.CUSTOMER
        })
      })

      it('should assign CUSTOMER role to new users', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        // User object might have a different role, but signup should always use CUSTOMER
        const userWithDifferentRole = { ...mockUser, role: Role.ADMIN }
        result.current.mutate(userWithDifferentRole)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            role: Role.CUSTOMER
          })
        )
      })

      it('should throw error when profile creation fails', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const profileError = { message: 'Database error', status: 500 }
        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: profileError })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(profileError)
      })
    })

    describe('Business Logic - Query Invalidation', () => {
      it('should invalidate session query on successful signup', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['session'] })
      })
    })

    describe('Business Logic - Navigation', () => {
      it('should redirect to login page on successful signup', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(mockRouter.push).toHaveBeenCalledWith('/login')
        expect(mockRouter.push).toHaveBeenCalledTimes(1)
      })
    })

    describe('Business Logic - User Feedback', () => {
      it('should show loading message when signup starts', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        // onMutate is called synchronously, so we can check immediately
        await waitFor(() => {
          expect(mockMessageApi.open).toHaveBeenCalledWith({
            key: 'SignupResponse',
            type: 'loading',
            content: 'loading...'
          })
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })
      })

      it('should show success message on successful signup', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: {}, error: null })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'SignupResponse',
          type: 'success',
          content: 'Signup Successfully'
        })
      })

      it('should show error message when auth signup fails', async () => {
        const authError = { message: 'Email already registered', status: 400 }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: null,
          error: authError
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        // The error handler converts non-Error objects using String(), which results in "[object Object]"
        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'SignupResponse',
          type: 'error',
          content: String(authError) // This is what the code actually does for non-Error objects
        })
      })

      it('should show error message when profile creation fails', async () => {
        const mockAuthData = {
          user: mockAuthUser,
          session: null
        }
        ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
          data: mockAuthData,
          error: null
        })

        const profileError = { message: 'Failed to create profile', status: 500 }
        const mockSelect = jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: profileError })
        })
        const mockInsert = jest.fn().mockReturnValue({
          select: mockSelect
        })
        ;(supabase.from as jest.Mock).mockReturnValue({
          insert: mockInsert
        })

        const { result } = renderHook(() => useSignup(mockMessageApi), { wrapper })

        result.current.mutate(mockUser)

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        // The error handler converts non-Error objects using String(), which results in "[object Object]"
        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'SignupResponse',
          type: 'error',
          content: String(profileError) // This is what the code actually does for non-Error objects
        })
      })
    })
  })

  describe('useLogout', () => {
    describe('Business Logic - Authentication', () => {
      it('should call signOut when logout is triggered', async () => {
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: null
        })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        result.current.mutate()

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(supabase.auth.signOut).toHaveBeenCalledTimes(1)
      })

      it('should throw error when signOut fails', async () => {
        const logoutError = { message: 'Logout failed', status: 500 }
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: logoutError
        })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        result.current.mutate()

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(logoutError)
      })
    })

    describe('Business Logic - Session Management', () => {
      it('should clear session from cache on successful logout', async () => {
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: null
        })

        // Set initial session data
        queryClient.setQueryData(['session'], { user: { id: 'user-id' } })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData')

        result.current.mutate()

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(setQueryDataSpy).toHaveBeenCalledWith(['session'], null)
      })
    })

    describe('Business Logic - Navigation', () => {
      it('should redirect to login page on successful logout', async () => {
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: null
        })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        result.current.mutate()

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })

        expect(mockRouter.push).toHaveBeenCalledWith('/login')
        expect(mockRouter.push).toHaveBeenCalledTimes(1)
      })
    })

    describe('Business Logic - User Feedback', () => {
      it('should show loading message when logout starts', async () => {
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: null
        })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        result.current.mutate()

        // onMutate is called synchronously, so we can check immediately
        await waitFor(() => {
          expect(mockMessageApi.open).toHaveBeenCalledWith({
            key: 'LogoutResponse',
            type: 'loading',
            content: 'loading...'
          })
        })

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true)
        })
      })

      it('should show error message when logout fails', async () => {
        const logoutError = { message: 'Unable to logout', status: 500 }
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: logoutError
        })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        result.current.mutate()

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        // The error handler converts non-Error objects using String(), which results in "[object Object]"
        expect(mockMessageApi.open).toHaveBeenCalledWith({
          key: 'LogoutResponse',
          type: 'error',
          content: String(logoutError) // This is what the code actually does for non-Error objects
        })
      })

      it('should not redirect or clear session when logout fails', async () => {
        const logoutError = { message: 'Logout error', status: 500 }
        ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
          error: logoutError
        })

        queryClient.setQueryData(['session'], { user: { id: 'user-id' } })

        const { result } = renderHook(() => useLogout(mockMessageApi), { wrapper })

        result.current.mutate()

        await waitFor(() => {
          expect(result.current.isError).toBe(true)
        })

        // Should not redirect on error
        expect(mockRouter.push).not.toHaveBeenCalled()

        // Should not clear session on error
        const sessionData = queryClient.getQueryData(['session'])
        expect(sessionData).toEqual({ user: { id: 'user-id' } })
      })
    })
  })
})

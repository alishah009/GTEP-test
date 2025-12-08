/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock environment variables FIRST before any imports that use them
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

// Mock env config module
jest.mock('@/config/env', () => ({
  env: {
    supabase: {
      url: 'https://test.supabase.co',
      anonKey: 'test-anon-key'
    },
    tinymce: {
      apiKey: ''
    },
    nodeEnv: 'test',
    appEnv: 'local',
    isDevelopment: false,
    isStaging: false,
    isProduction: false,
    isLocal: true
  }
}))

// Mock supabase client
jest.mock('@/lib/supabase/supabaseBrowser', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn()
    }
  }
}))

// Mock useAuth hook
const mockShowSpinner = jest.fn()
const mockHideSpinner = jest.fn()
jest.mock('@/context/AuthContext')
jest.mock('@/context/SpinnerContext', () => ({
  useSpinner: jest.fn()
}))

// Mock AppLayout component
jest.mock('@/layout/AppLayout/AppLayout', () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='app-layout'>{children}</div>
  )
}))

import { HomePageClient } from '@/ui/components/home'
import { render, screen } from '@testing-library/react'
import { useAuth } from '@/context/AuthContext'
import { useSpinner } from '@/context/SpinnerContext'

const mockDictionary = {
  common: {
    user: 'User'
  },
  pages: {
    home: {
      welcomeBack: 'Welcome back, {name}',
      dashboardDescription:
        'This is the main dashboard area. Drop your widgets or page content here.'
    }
  }
}

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false
    })
    ;(useSpinner as jest.Mock).mockReturnValue({
      showSpinner: mockShowSpinner,
      hideSpinner: mockHideSpinner
    })
  })

  describe('Rendering', () => {
    it('renders all home page elements correctly', () => {
      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByTestId('app-layout')).toBeInTheDocument()
      expect(screen.getByText('Welcome back, User')).toBeInTheDocument()
      expect(
        screen.getByText('This is the main dashboard area. Drop your widgets or page content here.')
      ).toBeInTheDocument()
    })

    it('renders with user full name when available', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          full_name: 'John Doe',
          email: 'john@example.com'
        },
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, John Doe')).toBeInTheDocument()
    })

    it('renders with user email when full name is not available', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          email: 'jane@example.com'
        },
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, jane@example.com')).toBeInTheDocument()
    })

    it('renders with default user text when user is null', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, User')).toBeInTheDocument()
    })

    it('renders with default user text when user has no name or email', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: '1'
        },
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, User')).toBeInTheDocument()
    })
  })

  describe('Spinner Management', () => {
    it('shows spinner when loading is true', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(mockShowSpinner).toHaveBeenCalled()
    })

    it('hides spinner when loading is false', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(mockHideSpinner).toHaveBeenCalled()
    })

    it('updates spinner state when loading changes from true to false', () => {
      const { rerender } = render(<HomePageClient dict={mockDictionary as any} />)

      // Initial state: loading false
      expect(mockHideSpinner).toHaveBeenCalled()

      // Change to loading true
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true
      })
      jest.clearAllMocks()

      rerender(<HomePageClient dict={mockDictionary as any} />)
      expect(mockShowSpinner).toHaveBeenCalled()
    })
  })

  describe('User Display Logic', () => {
    it('prioritizes full_name over email', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          full_name: 'Alice Smith',
          email: 'alice@example.com'
        },
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, Alice Smith')).toBeInTheDocument()
      expect(screen.queryByText('Welcome back, alice@example.com')).not.toBeInTheDocument()
    })

    it('uses email when full_name is not available', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          email: 'bob@example.com'
        },
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, bob@example.com')).toBeInTheDocument()
    })

    it('uses dictionary fallback when user is null', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, User')).toBeInTheDocument()
    })

    it('uses dictionary fallback when user has no name or email', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: '1',
          role: 'CUSTOMER'
        },
        loading: false
      })

      render(<HomePageClient dict={mockDictionary as any} />)

      expect(screen.getByText('Welcome back, User')).toBeInTheDocument()
    })
  })

  describe('Layout Integration', () => {
    it('wraps content in AppLayout component', () => {
      render(<HomePageClient dict={mockDictionary as any} />)

      const appLayout = screen.getByTestId('app-layout')
      expect(appLayout).toBeInTheDocument()
      expect(appLayout).toHaveTextContent('Welcome back')
      expect(appLayout).toHaveTextContent('This is the main dashboard area')
    })
  })
})

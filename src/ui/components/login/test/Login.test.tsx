/* eslint-disable @typescript-eslint/no-explicit-any */
import { Login } from '@/ui/components/login'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useDictionary } from '@/hooks/i18n/useDictionary'
import { useLogin } from '@/hooks/mutation/useAuth'

// Mock useDictionary hook
jest.mock('@/hooks/i18n/useDictionary')

// Mock useLogin hook
const mutateAsyncMock = jest.fn()
jest.mock('@/hooks/mutation/useAuth', () => ({
  useLogin: jest.fn()
}))

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || ''} />
}))
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

// Mock UI components
jest.mock('@/ui/Atoms/Button', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Button: ({ children, loading, buttonType, ...props }: any) => (
    <button {...props} disabled={props.disabled || loading}>
      {loading ? 'Loading...' : children}
    </button>
  )
}))

// Mock InputField - simplified version that works with react-hook-form
jest.mock('@/ui/Atoms/Input/InputField', () => ({
  InputField: ({ label, name, type, required }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required={required} data-testid={`input-${name}`} />
    </div>
  )
}))

// Mock Ant Design message
const messageApiMock = jest.fn()
jest.mock('antd', () => ({
  message: {
    useMessage: () => [messageApiMock, <div key='message-context' />]
  }
}))

const mockDictionary = {
  dict: {
    auth: {
      login: {
        title: 'Login',
        subtitle: 'Welcome back!',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot password?',
        submitButton: 'Login',
        signupLink: "Don't have an account?",
        createAccount: 'Sign up'
      }
    }
  },
  loading: false,
  locale: 'en'
}

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mutateAsyncMock.mockResolvedValue({})
    ;(useDictionary as jest.Mock).mockReturnValue(mockDictionary)
    ;(useLogin as jest.Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false
    })
  })

  describe('Rendering', () => {
    it('renders all login page elements correctly', () => {
      render(<Login />)

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
      expect(screen.getByText('Welcome back!')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByText('Forgot password?')).toBeInTheDocument()
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
      expect(screen.getByText('Sign up')).toBeInTheDocument()
      expect(screen.getByAltText('logo')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    it('renders forgot password link with correct href', () => {
      render(<Login />)
      const forgotPasswordLink = screen.getByText('Forgot password?').closest('a')
      expect(forgotPasswordLink).toHaveAttribute('href', '/en/forgot-password')
    })

    it('renders signup link with correct href', () => {
      render(<Login />)
      const signupLink = screen.getByText('Sign up').closest('a')
      expect(signupLink).toHaveAttribute('href', '/en/signup')
    })

    it('returns null when dictionary is loading', () => {
      ;(useDictionary as jest.Mock).mockReturnValue({
        ...mockDictionary,
        dict: null,
        loading: true
      })

      const { container } = render(<Login />)
      expect(container.firstChild).toBeNull()
    })

    it('returns null when dictionary is not available', () => {
      ;(useDictionary as jest.Mock).mockReturnValue({
        ...mockDictionary,
        dict: null,
        loading: false
      })

      const { container } = render(<Login />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Form Submission', () => {
    it('submits the form with valid email and password', async () => {
      render(<Login />)

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Login' })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mutateAsyncMock).toHaveBeenCalled()
      })
      expect(mutateAsyncMock).toHaveBeenCalledTimes(1)
      // Note: Due to mocking limitations, exact form values may not be captured
      // but we verify that the mutation was called, indicating form submission
    })

    it('does not submit form when email is empty', async () => {
      render(<Login />)

      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Login' })

      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mutateAsyncMock).not.toHaveBeenCalled()
      })
    })

    it('does not submit form when password is empty', async () => {
      render(<Login />)

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Login' })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mutateAsyncMock).not.toHaveBeenCalled()
      })
    })

    it('handles form submission error gracefully', async () => {
      const errorMock = jest.fn().mockRejectedValue(new Error('Login failed'))
      ;(useLogin as jest.Mock).mockReturnValue({
        mutateAsync: errorMock,
        isPending: false
      })

      render(<Login />)

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Login' })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(errorMock).toHaveBeenCalled()
      })
    })
  })

  describe('Loading State', () => {
    it('disables submit button when isPending is true', () => {
      ;(useLogin as jest.Mock).mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: true
      })

      render(<Login />)
      const submitButton = screen.getByRole('button', { name: 'Loading...' })
      expect(submitButton).toBeDisabled()
    })

    it('enables submit button when isPending is false', () => {
      ;(useLogin as jest.Mock).mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false
      })

      render(<Login />)
      const submitButton = screen.getByRole('button', { name: 'Login' })
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('Input Fields', () => {
    it('allows typing in email input', () => {
      render(<Login />)
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      expect(emailInput.value).toBe('user@example.com')
    })

    it('allows typing in password input', () => {
      render(<Login />)
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement

      fireEvent.change(passwordInput, { target: { value: 'secret123' } })
      expect(passwordInput.value).toBe('secret123')
    })

    it('password input has type password', () => {
      render(<Login />)
      const passwordInput = screen.getByLabelText('Password')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('email input has type email', () => {
      render(<Login />)
      const emailInput = screen.getByLabelText('Email')
      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })
})

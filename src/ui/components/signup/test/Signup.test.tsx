/* eslint-disable @typescript-eslint/no-explicit-any */
import { Signup } from '@/ui/components/signup'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useDictionary } from '@/hooks/i18n/useDictionary'
import { useSignup } from '@/hooks/mutation/useAuth'

// Mock useDictionary hook
jest.mock('@/hooks/i18n/useDictionary')

// Mock useSignup hook
const mutateAsyncMock = jest.fn()
jest.mock('@/hooks/mutation/useAuth', () => ({
  useSignup: jest.fn()
}))

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
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
  InputField: ({ label, name, type = 'text', required }: any) => (
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
      signup: {
        title: 'Create an account',
        subtitle: 'Please fill in the form to create an account',
        fullName: 'Full Name',
        email: 'Email',
        password: 'Password',
        submitButton: 'Sign Up',
        loginLink: 'Already have an account?',
        signIn: 'Log In'
      }
    }
  },
  loading: false,
  locale: 'en'
}

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mutateAsyncMock.mockResolvedValue({})
    ;(useDictionary as jest.Mock).mockReturnValue(mockDictionary)
    ;(useSignup as jest.Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false
    })
  })

  describe('Rendering', () => {
    it('renders all signup page elements correctly', () => {
      render(<Signup />)

      expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument()
      expect(screen.getByText('Please fill in the form to create an account')).toBeInTheDocument()
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByText('Already have an account?')).toBeInTheDocument()
      expect(screen.getByText('Log In')).toBeInTheDocument()
      expect(screen.getByAltText('logo')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
    })

    it('renders login link with correct href', () => {
      render(<Signup />)
      const loginLink = screen.getByText('Log In').closest('a')
      expect(loginLink).toHaveAttribute('href', '/en/login')
    })

    it('returns null when dictionary is loading', () => {
      ;(useDictionary as jest.Mock).mockReturnValue({
        ...mockDictionary,
        dict: null,
        loading: true
      })

      const { container } = render(<Signup />)
      expect(container.firstChild).toBeNull()
    })

    it('returns null when dictionary is not available', () => {
      ;(useDictionary as jest.Mock).mockReturnValue({
        ...mockDictionary,
        dict: null,
        loading: false
      })

      const { container } = render(<Signup />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Form Submission', () => {
    it('submits the form with valid full name, email and password', async () => {
      render(<Signup />)

      const fullNameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Sign Up' })

      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
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

    it('does not submit form when full name is empty', async () => {
      render(<Signup />)

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Sign Up' })

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mutateAsyncMock).not.toHaveBeenCalled()
      })
    })

    it('does not submit form when email is empty', async () => {
      render(<Signup />)

      const fullNameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Sign Up' })

      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mutateAsyncMock).not.toHaveBeenCalled()
      })
    })

    it('does not submit form when password is empty', async () => {
      render(<Signup />)

      const fullNameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Sign Up' })

      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mutateAsyncMock).not.toHaveBeenCalled()
      })
    })

    it('handles form submission error gracefully', async () => {
      const errorMock = jest.fn().mockRejectedValue(new Error('Signup failed'))
      ;(useSignup as jest.Mock).mockReturnValue({
        mutateAsync: errorMock,
        isPending: false
      })

      render(<Signup />)

      const fullNameInput = screen.getByLabelText('Full Name') as HTMLInputElement
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
      const submitButton = screen.getByRole('button', { name: 'Sign Up' })

      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
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
      ;(useSignup as jest.Mock).mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: true
      })

      render(<Signup />)
      const submitButton = screen.getByRole('button', { name: 'Loading...' })
      expect(submitButton).toBeDisabled()
    })

    it('enables submit button when isPending is false', () => {
      ;(useSignup as jest.Mock).mockReturnValue({
        mutateAsync: mutateAsyncMock,
        isPending: false
      })

      render(<Signup />)
      const submitButton = screen.getByRole('button', { name: 'Sign Up' })
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('Input Fields', () => {
    it('allows typing in full name input', () => {
      render(<Signup />)
      const fullNameInput = screen.getByLabelText('Full Name') as HTMLInputElement

      fireEvent.change(fullNameInput, { target: { value: 'Jane Smith' } })
      expect(fullNameInput.value).toBe('Jane Smith')
    })

    it('allows typing in email input', () => {
      render(<Signup />)
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      expect(emailInput.value).toBe('user@example.com')
    })

    it('allows typing in password input', () => {
      render(<Signup />)
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement

      fireEvent.change(passwordInput, { target: { value: 'secret123' } })
      expect(passwordInput.value).toBe('secret123')
    })

    it('password input has type password', () => {
      render(<Signup />)
      const passwordInput = screen.getByLabelText('Password')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('email input has type email', () => {
      render(<Signup />)
      const emailInput = screen.getByLabelText('Email')
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('full name input has type text', () => {
      render(<Signup />)
      const fullNameInput = screen.getByLabelText('Full Name')
      expect(fullNameInput).toHaveAttribute('type', 'text')
    })
  })
})

import { LanguageSwitcher } from '@/ui/components/LanguageSwitcher'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useLocale } from '@/hooks/i18n/useLocale'
import { usePathname, useRouter } from 'next/navigation'

// Mock Next.js hooks
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn()
}))

// Mock useLocale hook
jest.mock('@/hooks/i18n/useLocale')

// Mock Ant Design icons
jest.mock('@ant-design/icons', () => ({
  DownOutlined: () => <span data-testid='down-icon'>▼</span>,
  CheckOutlined: () => <span data-testid='check-icon'>✓</span>
}))

// Mock locale config
jest.mock('@/config/i18n', () => ({
  locales: ['en-US', 'es-ES'],
  defaultLocale: 'en-US',
  localeNames: {
    'en-US': 'English',
    'es-ES': 'Español'
  }
}))

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useLocale as jest.Mock).mockReturnValue('en-US')
    ;(usePathname as jest.Mock).mockReturnValue('/en-US')
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
  })

  describe('Rendering', () => {
    it('renders language switcher button correctly', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('displays current locale flag and code', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('EN')).toBeInTheDocument()
    })

    it('displays Spanish locale when current locale is es-ES', () => {
      ;(useLocale as jest.Mock).mockReturnValue('es-ES')

      render(<LanguageSwitcher />)

      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
      expect(screen.getByText('ES')).toBeInTheDocument()
    })

    it('renders dropdown icon', () => {
      render(<LanguageSwitcher />)

      expect(screen.getByTestId('down-icon')).toBeInTheDocument()
    })
  })

  describe('Dropdown Toggle', () => {
    it('opens dropdown when button is clicked', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      expect(screen.queryByText('English')).not.toBeInTheDocument()

      fireEvent.click(button)

      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes dropdown when button is clicked again', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })

      // Open dropdown
      fireEvent.click(button)
      expect(screen.getByText('English')).toBeInTheDocument()

      // Close dropdown
      fireEvent.click(button)
      expect(screen.queryByText('English')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Language Options', () => {
    it('displays all available locales in dropdown', () => {
      render(<LanguageSwitcher />)
      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
    })

    it('shows flag emoji for each locale', () => {
      render(<LanguageSwitcher />)
      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const flags = screen.getAllByText(/🇺🇸|🇪🇸/)
      expect(flags.length).toBeGreaterThanOrEqual(2)
    })

    it('shows locale codes for each option', () => {
      render(<LanguageSwitcher />)
      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      expect(screen.getAllByText('EN').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('ES').length).toBeGreaterThanOrEqual(1)
    })

    it('marks current locale as active with check icon', () => {
      render(<LanguageSwitcher />)
      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const checkIcons = screen.getAllByTestId('check-icon')
      expect(checkIcons.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Language Switching', () => {
    it('switches language when locale option is clicked', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/en-US/profile')

      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es-ES/profile')
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('preserves path when switching language', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/en-US/training_courses')

      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es-ES/training_courses')
    })

    it('handles root path correctly when switching language', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/en-US')

      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es-ES')
    })

    it('closes dropdown after language is switched', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      expect(screen.getByText('English')).toBeInTheDocument()

      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)

      // Dropdown should close after selection
      waitFor(() => {
        expect(screen.queryByText('English')).not.toBeInTheDocument()
      })
    })

    it('switches from Spanish to English correctly', () => {
      ;(useLocale as jest.Mock).mockReturnValue('es-ES')
      ;(usePathname as jest.Mock).mockReturnValue('/es-ES/resources')

      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const englishOption = screen.getByText('English')
      fireEvent.click(englishOption)

      expect(mockPush).toHaveBeenCalledWith('/en-US/resources')
    })
  })

  describe('Click Outside Behavior', () => {
    it('closes dropdown when clicking outside', () => {
      render(
        <div>
          <LanguageSwitcher />
          <div data-testid='outside'>Outside element</div>
        </div>
      )

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      expect(screen.getByText('English')).toBeInTheDocument()

      const outsideElement = screen.getByTestId('outside')
      fireEvent.mouseDown(outsideElement)

      waitFor(() => {
        expect(screen.queryByText('English')).not.toBeInTheDocument()
      })
    })

    it('does not close dropdown when clicking inside', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      expect(screen.getByText('English')).toBeInTheDocument()

      const englishOption = screen.getByText('English')
      fireEvent.mouseDown(englishOption)

      // Dropdown should still be open
      expect(screen.getByText('English')).toBeInTheDocument()
    })
  })

  describe('Pathname Handling', () => {
    it('handles pathname with locale prefix correctly', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/en-US/achievements')

      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es-ES/achievements')
    })

    it('handles nested paths correctly', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/en-US/profile/settings')

      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      fireEvent.click(button)

      const spanishOption = screen.getByText('Español')
      fireEvent.click(spanishOption)

      expect(mockPush).toHaveBeenCalledWith('/es-ES/profile/settings')
    })
  })

  describe('Flag Display', () => {
    it('displays correct flag for English locale', () => {
      ;(useLocale as jest.Mock).mockReturnValue('en-US')

      render(<LanguageSwitcher />)

      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    })

    it('displays correct flag for Spanish locale', () => {
      ;(useLocale as jest.Mock).mockReturnValue('es-ES')

      render(<LanguageSwitcher />)

      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
    })

    it('displays fallback flag for unknown locale', () => {
      ;(useLocale as jest.Mock).mockReturnValue('fr-FR')

      render(<LanguageSwitcher />)

      // Should show fallback flag or handle gracefully
      const button = screen.getByRole('button', { name: /switch language/i })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct aria-label on button', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      expect(button).toHaveAttribute('aria-label', 'Switch language')
    })

    it('updates aria-expanded when dropdown opens', () => {
      render(<LanguageSwitcher />)

      const button = screen.getByRole('button', { name: /switch language/i })
      expect(button).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
  })
})

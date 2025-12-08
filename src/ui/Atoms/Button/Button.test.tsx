/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  SecondaryGrayButton,
  TertiaryButton,
  TertiaryPrimaryButton,
  LinkDefaultButton,
  LinkGrayButton,
  DangerButton,
  GrayOutlineButton
} from '@/ui/Atoms/Button'
import { SuccessButton, PrimaryOutlineButton } from '@/ui/Atoms/Button/Button'

// Mock ConditionalRender component
jest.mock('@/ui/Atoms/Wrapper/ConditionalRender', () => ({
  ConditionalRender: ({ render: shouldRender, children }: any) => (shouldRender ? children : null)
}))

describe('Button Component', () => {
  describe('Generic Button with buttonType', () => {
    it('renders Primary button when buttonType is Primary', () => {
      render(<Button buttonType='Primary'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders Secondary button when buttonType is Secondary', () => {
      render(<Button buttonType='Secondary'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders SecondaryGray button when buttonType is SecondaryGray', () => {
      render(<Button buttonType='SecondaryGray'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders Tertiary button when buttonType is Tertiary', () => {
      render(<Button buttonType='Tertiary'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders TertiaryPrimary button when buttonType is TertiaryPrimary', () => {
      render(<Button buttonType='TertiaryPrimary'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders LinkDefault button when buttonType is Link', () => {
      render(<Button buttonType='Link'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders LinkGray button when buttonType is LinkGray', () => {
      render(<Button buttonType='LinkGray'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders Success button when buttonType is Success', () => {
      render(<Button buttonType='Success'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders Danger button when buttonType is Danger', () => {
      render(<Button buttonType='Danger'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders GrayOutline button when buttonType is GrayOutline', () => {
      render(<Button buttonType='GrayOutline'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders PrimaryOutline button when buttonType is PrimaryOutline', () => {
      render(<Button buttonType='PrimaryOutline'>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })
  })

  describe('Button Variants - PrimaryButton', () => {
    it('renders with children', () => {
      render(<PrimaryButton>Primary Button</PrimaryButton>)
      expect(screen.getByRole('button', { name: 'Primary Button' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>)

      const button = screen.getByRole('button', { name: 'Click me' })
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is disabled when disabled prop is true', () => {
      render(<PrimaryButton disabled>Disabled Button</PrimaryButton>)
      expect(screen.getByRole('button', { name: 'Disabled Button' })).toBeDisabled()
    })

    it('shows loading spinner when loading is true', () => {
      render(<PrimaryButton loading>Loading Button</PrimaryButton>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button.querySelector('svg')).toBeInTheDocument()
    })

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(
        <PrimaryButton disabled onClick={handleClick}>
          Disabled
        </PrimaryButton>
      )

      const button = screen.getByRole('button', { name: 'Disabled' })
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn()
      render(
        <PrimaryButton loading onClick={handleClick}>
          Loading
        </PrimaryButton>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Button Variants - SecondaryButton', () => {
    it('renders with children', () => {
      render(<SecondaryButton>Secondary Button</SecondaryButton>)
      expect(screen.getByRole('button', { name: 'Secondary Button' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<SecondaryButton onClick={handleClick}>Click me</SecondaryButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders with destructive variant', () => {
      render(<SecondaryButton Destructive>Destructive</SecondaryButton>)
      expect(screen.getByRole('button', { name: 'Destructive' })).toBeInTheDocument()
    })
  })

  describe('Button Variants - SecondaryGrayButton', () => {
    it('renders with children', () => {
      render(<SecondaryGrayButton>Gray Button</SecondaryGrayButton>)
      expect(screen.getByRole('button', { name: 'Gray Button' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<SecondaryGrayButton onClick={handleClick}>Click me</SecondaryGrayButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders with destructive variant', () => {
      render(<SecondaryGrayButton Destructive>Destructive</SecondaryGrayButton>)
      expect(screen.getByRole('button', { name: 'Destructive' })).toBeInTheDocument()
    })
  })

  describe('Button Variants - TertiaryButton', () => {
    it('renders with children', () => {
      render(<TertiaryButton>Tertiary Button</TertiaryButton>)
      expect(screen.getByRole('button', { name: 'Tertiary Button' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<TertiaryButton onClick={handleClick}>Click me</TertiaryButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - TertiaryPrimaryButton', () => {
    it('renders with children', () => {
      render(<TertiaryPrimaryButton>Tertiary Primary</TertiaryPrimaryButton>)
      expect(screen.getByRole('button', { name: 'Tertiary Primary' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<TertiaryPrimaryButton onClick={handleClick}>Click me</TertiaryPrimaryButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - LinkDefaultButton', () => {
    it('renders with children', () => {
      render(<LinkDefaultButton>Link Button</LinkDefaultButton>)
      expect(screen.getByRole('button', { name: 'Link Button' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<LinkDefaultButton onClick={handleClick}>Click me</LinkDefaultButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - LinkGrayButton', () => {
    it('renders with children', () => {
      render(<LinkGrayButton>Link Gray</LinkGrayButton>)
      expect(screen.getByRole('button', { name: 'Link Gray' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<LinkGrayButton onClick={handleClick}>Click me</LinkGrayButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - SuccessButton', () => {
    it('renders with children', () => {
      render(<SuccessButton>Success</SuccessButton>)
      expect(screen.getByRole('button', { name: 'Success' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<SuccessButton onClick={handleClick}>Click me</SuccessButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - DangerButton', () => {
    it('renders with children', () => {
      render(<DangerButton>Danger</DangerButton>)
      expect(screen.getByRole('button', { name: 'Danger' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<DangerButton onClick={handleClick}>Click me</DangerButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - GrayOutlineButton', () => {
    it('renders with children', () => {
      render(<GrayOutlineButton>Gray Outline</GrayOutlineButton>)
      expect(screen.getByRole('button', { name: 'Gray Outline' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<GrayOutlineButton onClick={handleClick}>Click me</GrayOutlineButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Variants - PrimaryOutlineButton', () => {
    it('renders with children', () => {
      render(<PrimaryOutlineButton>Primary Outline</PrimaryOutlineButton>)
      expect(screen.getByRole('button', { name: 'Primary Outline' })).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = jest.fn()
      render(<PrimaryOutlineButton onClick={handleClick}>Click me</PrimaryOutlineButton>)

      fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Button Sizes', () => {
    it('applies sm size by default', () => {
      render(<PrimaryButton>Small</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Small' })
      expect(button).toBeInTheDocument()
    })

    it('applies md size when buttonSize is md', () => {
      render(<PrimaryButton buttonSize='md'>Medium</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Medium' })
      expect(button).toBeInTheDocument()
    })

    it('applies lg size when buttonSize is lg', () => {
      render(<PrimaryButton buttonSize='lg'>Large</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Large' })
      expect(button).toBeInTheDocument()
    })

    it('applies xl size when buttonSize is xl', () => {
      render(<PrimaryButton buttonSize='xl'>Extra Large</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Extra Large' })
      expect(button).toBeInTheDocument()
    })

    it('applies 2xl size when buttonSize is 2xl', () => {
      render(<PrimaryButton buttonSize='2xl'>2X Large</PrimaryButton>)
      const button = screen.getByRole('button', { name: '2X Large' })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('disables button when loading', () => {
      render(<PrimaryButton loading>Loading</PrimaryButton>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('shows spinner when loading', () => {
      render(<PrimaryButton loading>Loading</PrimaryButton>)
      const button = screen.getByRole('button')
      const spinner = button.querySelector('svg[aria-hidden="true"]')
      expect(spinner).toBeInTheDocument()
    })

    it('hides children when loading', () => {
      render(<PrimaryButton loading>Loading Text</PrimaryButton>)
      expect(screen.queryByText('Loading Text')).not.toBeInTheDocument()
    })

    it('prevents onClick when loading', () => {
      const handleClick = jest.fn()
      render(
        <PrimaryButton loading onClick={handleClick}>
          Loading
        </PrimaryButton>
      )

      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Icons', () => {
    it('renders PrefixIcon when provided', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>📝</span>
      render(<PrimaryButton PrefixIcon={PrefixIcon}>With Icon</PrimaryButton>)

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('renders PostfixIcon when provided', () => {
      const PostfixIcon = <span data-testid='postfix-icon'>→</span>
      render(<PrimaryButton PostfixIcon={PostfixIcon}>With Icon</PrimaryButton>)

      expect(screen.getByTestId('postfix-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('renders both PrefixIcon and PostfixIcon', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>📝</span>
      const PostfixIcon = <span data-testid='postfix-icon'>→</span>
      render(
        <PrimaryButton PrefixIcon={PrefixIcon} PostfixIcon={PostfixIcon}>
          With Icons
        </PrimaryButton>
      )

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      expect(screen.getByTestId('postfix-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icons')).toBeInTheDocument()
    })

    it('hides icons when loading', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>📝</span>
      render(
        <PrimaryButton loading PrefixIcon={PrefixIcon}>
          Loading
        </PrimaryButton>
      )

      expect(screen.queryByTestId('prefix-icon')).not.toBeInTheDocument()
    })
  })

  describe('Keyboard Interaction', () => {
    it('calls onClick when Enter key is pressed', () => {
      const handleClick = jest.fn()
      render(<PrimaryButton onClick={handleClick}>Press Enter</PrimaryButton>)

      const button = screen.getByRole('button', { name: 'Press Enter' })
      fireEvent.keyDown(button, { key: 'Enter' })

      expect(handleClick).toHaveBeenCalled()
    })

    it('does not call onClick when Enter is pressed and button is disabled', () => {
      const handleClick = jest.fn()
      render(
        <PrimaryButton disabled onClick={handleClick}>
          Disabled
        </PrimaryButton>
      )

      const button = screen.getByRole('button', { name: 'Disabled' })
      fireEvent.keyDown(button, { key: 'Enter' })

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when Enter is pressed and button is loading', () => {
      const handleClick = jest.fn()
      render(
        <PrimaryButton loading onClick={handleClick}>
          Loading
        </PrimaryButton>
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Button Types', () => {
    it('renders button element (default type is button)', () => {
      render(<PrimaryButton>Button</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Button' })
      expect(button).toBeInTheDocument()
      // HTML buttons default to type="button" even if attribute is not explicitly set
      expect(button.tagName).toBe('BUTTON')
    })

    it('renders with type="submit" when specified', () => {
      render(<PrimaryButton type='submit'>Submit</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Submit' })
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('renders with type="reset" when specified', () => {
      render(<PrimaryButton type='reset'>Reset</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Reset' })
      expect(button).toHaveAttribute('type', 'reset')
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(<PrimaryButton className='custom-class'>Custom</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Custom' })
      expect(button).toHaveClass('custom-class')
    })
  })
})


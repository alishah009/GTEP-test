import { render, screen } from '@testing-library/react'
import { FieldLabel } from '@/ui/Atoms/Label/FieldLabel'

// Mock ConditionalRender
jest.mock('@/ui/Atoms/Wrapper/ConditionalRender', () => ({
  ConditionalRender: ({ render, children }: any) => (render ? <>{children}</> : null)
}))

// Mock OptionalText
jest.mock('@/ui/Atoms/Input/utils/OptionalText', () => ({
  OptionalText: () => <span data-testid='optional-text'>(Optional)</span>
}))

describe('FieldLabel Component', () => {
  describe('Rendering', () => {
    it('renders label text', () => {
      render(<FieldLabel label='Test Label' />)

      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('renders without label when label prop is not provided', () => {
      render(<FieldLabel />)

      expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
    })

    it('applies default className', () => {
      const { container } = render(<FieldLabel label='Test Label' />)

      const labelElement = container.querySelector('.font-medium')
      expect(labelElement).toBeInTheDocument()
    })
  })

  describe('Required Field', () => {
    it('does not show optional text when required is true', () => {
      render(<FieldLabel label='Required Field' required />)

      expect(screen.getByText('Required Field')).toBeInTheDocument()
      expect(screen.queryByTestId('optional-text')).not.toBeInTheDocument()
    })

    it('shows optional text when required is false', () => {
      render(<FieldLabel label='Optional Field' required={false} />)

      expect(screen.getByText('Optional Field')).toBeInTheDocument()
      expect(screen.getByTestId('optional-text')).toBeInTheDocument()
    })

    it('shows optional text when required is not provided', () => {
      render(<FieldLabel label='Field' />)

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.getByTestId('optional-text')).toBeInTheDocument()
    })
  })

  describe('Config Prop', () => {
    it('hides label when showLabel is false', () => {
      render(<FieldLabel label='Hidden Label' config={{ showLabel: false }} />)

      expect(screen.queryByText('Hidden Label')).not.toBeInTheDocument()
    })

    it('shows label when showLabel is true', () => {
      render(<FieldLabel label='Visible Label' config={{ showLabel: true }} />)

      expect(screen.getByText('Visible Label')).toBeInTheDocument()
    })

    it('hides optional text when showOptional is false', () => {
      render(
        <FieldLabel
          label='Field'
          required={false}
          config={{ showOptional: false }}
        />
      )

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.queryByTestId('optional-text')).not.toBeInTheDocument()
    })

    it('shows optional text when showOptional is true and not required', () => {
      render(
        <FieldLabel
          label='Field'
          required={false}
          config={{ showOptional: true }}
        />
      )

      expect(screen.getByTestId('optional-text')).toBeInTheDocument()
    })

    it('hides label container when showLabelContainer is false', () => {
      render(
        <FieldLabel label='Field' config={{ showLabelContainer: false }} />
      )

      // When showLabelContainer is false, the wrapper div should not render
      expect(screen.queryByText('Field')).not.toBeInTheDocument()
    })

    it('shows label container when showLabelContainer is true', () => {
      render(
        <FieldLabel label='Field' config={{ showLabelContainer: true }} />
      )

      expect(screen.getByText('Field')).toBeInTheDocument()
    })
  })

  describe('Config Combinations', () => {
    it('handles all config options set to false', () => {
      render(
        <FieldLabel
          label='Field'
          config={{
            showLabel: false,
            showOptional: false,
            showLabelContainer: false
          }}
        />
      )

      expect(screen.queryByText('Field')).not.toBeInTheDocument()
    })

    it('handles all config options set to true with required false', () => {
      render(
        <FieldLabel
          label='Field'
          required={false}
          config={{
            showLabel: true,
            showOptional: true,
            showLabelContainer: true
          }}
        />
      )

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.getByTestId('optional-text')).toBeInTheDocument()
    })

    it('handles partial config override', () => {
      render(
        <FieldLabel
          label='Field'
          config={{
            showLabel: true,
            showOptional: false
          }}
        />
      )

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.queryByTestId('optional-text')).not.toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      const { container } = render(
        <FieldLabel label='Test' className='custom-class' />
      )

      const labelElement = container.querySelector('.custom-class')
      expect(labelElement).toBeInTheDocument()
    })

    it('merges custom className with default className', () => {
      const { container } = render(
        <FieldLabel label='Test' className='custom-class' />
      )

      const labelElement = container.querySelector('.font-medium.custom-class')
      expect(labelElement).toBeInTheDocument()
    })
  })

  describe('Default Config Behavior', () => {
    it('uses default config values when config is not provided', () => {
      render(<FieldLabel label='Field' required={false} />)

      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.getByTestId('optional-text')).toBeInTheDocument()
    })

    it('merges provided config with defaults', () => {
      render(
        <FieldLabel
          label='Field'
          config={{
            showOptional: false
          }}
        />
      )

      expect(screen.getByText('Field')).toBeInTheDocument()
      // showOptional is false, so optional text should not show
      expect(screen.queryByTestId('optional-text')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string label', () => {
      render(<FieldLabel label='' />)

      // Should render but with no visible text
      expect(screen.queryByTestId('optional-text')).toBeInTheDocument()
    })

    it('handles undefined label', () => {
      render(<FieldLabel label={undefined} />)

      // Should handle gracefully
      expect(screen.queryByTestId('optional-text')).toBeInTheDocument()
    })
  })
})


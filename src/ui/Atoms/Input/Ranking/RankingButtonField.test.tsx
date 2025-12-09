/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { RankingButtonField } from '@/ui/Atoms/Input/Ranking/RankingButtonField'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock RankingButton component
jest.mock('@/ui/Atoms/Input/Ranking/RankingButton', () => ({
  RankingButton: ({ label, error, disabled, value, onChange, name }: any) => {
    const fieldName = name || 'unknown'

    return (
      <div>
        {label && <label htmlFor={fieldName}>{label}</label>}
        <div data-testid={`ranking-${fieldName}`}>
          <input
            type='hidden'
            name={fieldName}
            value={value || 0}
            data-testid={`hidden-input-${fieldName}`}
          />
          <div role='radiogroup' aria-label='Rating'>
            {[1, 2, 3, 4, 5].map((star) => (
              /* eslint-disable-next-line jsx-a11y/role-supports-aria-props */
              <button
                key={star}
                type='button'
                role='radio'
                aria-checked={value >= star}
                data-testid={`star-${fieldName}-${star}`}
                disabled={disabled}
                onClick={() => onChange?.(star)}
                className={value >= star ? 'checked' : ''}
                aria-invalid={!!error}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        {error && <span data-testid={`error-${fieldName}`}>{error}</span>}
      </div>
    )
  }
}))

// Mock getNestedError utility
jest.mock('@/ui/Atoms/Input/utils/getNestedError', () => ({
  getNestedError: jest.fn((errors: any, name: string) => {
    const error = errors?.[name]
    return error?.message || null
  })
}))

// Test wrapper component
const FormWrapper = ({ children, defaultValues = {} }: any) => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange'
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('RankingButtonField Component', () => {
  describe('Rendering', () => {
    it('renders ranking field with label', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test Label' />
        </FormWrapper>
      )

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('ranking-testField')).toBeInTheDocument()
    })

    it('renders without label', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='' />
        </FormWrapper>
      )

      expect(screen.getByTestId('ranking-testField')).toBeInTheDocument()
    })

    it('renders 5 star buttons by default', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const stars = screen.getAllByRole('radio')
      expect(stars).toHaveLength(5)
    })

    it('renders hidden input field', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const hiddenInput = screen.getByTestId('hidden-input-testField')
      expect(hiddenInput).toBeInTheDocument()
      expect(hiddenInput).toHaveAttribute('type', 'hidden')
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Required Field' required />
        </FormWrapper>
      )

      const ranking = screen.getByTestId('ranking-testField')
      expect(ranking).toBeInTheDocument()
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Optional Field' required={false} />
        </FormWrapper>
      )

      const ranking = screen.getByTestId('ranking-testField')
      expect(ranking).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables all stars when disabled prop is true', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Disabled Field' disabled />
        </FormWrapper>
      )

      const stars = screen.getAllByRole('radio')
      stars.forEach((star) => {
        expect(star).toBeDisabled()
      })
    })

    it('enables stars when disabled prop is false', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Enabled Field' disabled={false} />
        </FormWrapper>
      )

      const stars = screen.getAllByRole('radio')
      stars.forEach((star) => {
        expect(star).not.toBeDisabled()
      })
    })
  })

  describe('User Selection', () => {
    it('allows selecting a rating by clicking a star', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const star3 = screen.getByTestId('star-testField-3')
      fireEvent.click(star3)

      const hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('3')
    })

    it('updates form value when star is clicked', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <RankingButtonField name='testField' label='Test' />
            <button
              type='button'
              onClick={() => {
                const value = methods.getValues('testField')
                expect(value).toBe(4)
              }}
            >
              Check Value
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const star4 = screen.getByTestId('star-testField-4')
      fireEvent.click(star4)

      const button = screen.getByText('Check Value')
      fireEvent.click(button)
    })

    it('allows changing rating by clicking different star', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const star2 = screen.getByTestId('star-testField-2')
      const star5 = screen.getByTestId('star-testField-5')

      fireEvent.click(star2)
      let hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('2')

      fireEvent.click(star5)
      hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('5')
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' error='This field has an error' />
        </FormWrapper>
      )

      expect(screen.getByTestId('error-testField')).toBeInTheDocument()
      expect(screen.getByText('This field has an error')).toBeInTheDocument()
    })

    it('displays error from form validation', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <RankingButtonField name='testField' label='Required Field' required />
            <button
              type='button'
              onClick={() => {
                methods.trigger('testField')
              }}
            >
              Trigger Validation
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const button = screen.getByText('Trigger Validation')
      fireEvent.click(button)

      await waitFor(() => {
        const stars = screen.getAllByRole('radio')
        expect(stars[0]).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('marks stars as invalid when error exists', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' error='Error message' />
        </FormWrapper>
      )

      const stars = screen.getAllByRole('radio')
      stars.forEach((star) => {
        expect(star).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  describe('Default Values', () => {
    it('renders with default value from form', () => {
      render(
        <FormWrapper defaultValues={{ testField: 3 }}>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('3')

      // Check that first 3 stars are checked
      const star1 = screen.getByTestId('star-testField-1')
      const star2 = screen.getByTestId('star-testField-2')
      const star3 = screen.getByTestId('star-testField-3')
      const star4 = screen.getByTestId('star-testField-4')

      expect(star1).toHaveAttribute('aria-checked', 'true')
      expect(star2).toHaveAttribute('aria-checked', 'true')
      expect(star3).toHaveAttribute('aria-checked', 'true')
      expect(star4).toHaveAttribute('aria-checked', 'false')
    })

    it('renders with zero rating when no default value set', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('0')

      const stars = screen.getAllByRole('radio')
      stars.forEach((star) => {
        expect(star).toHaveAttribute('aria-checked', 'false')
      })
    })

    it('renders with maximum rating (5)', () => {
      render(
        <FormWrapper defaultValues={{ testField: 5 }}>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('5')

      const stars = screen.getAllByRole('radio')
      stars.forEach((star) => {
        expect(star).toHaveAttribute('aria-checked', 'true')
      })
    })
  })

  describe('Rating Range', () => {
    it('accepts rating value of 1', () => {
      render(
        <FormWrapper defaultValues={{ testField: 1 }}>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('1')

      const star1 = screen.getByTestId('star-testField-1')
      expect(star1).toHaveAttribute('aria-checked', 'true')
    })

    it('accepts rating value of 5', () => {
      render(
        <FormWrapper defaultValues={{ testField: 5 }}>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const hiddenInput = screen.getByTestId('hidden-input-testField') as HTMLInputElement
      expect(hiddenInput.value).toBe('5')
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(
        <FormWrapper>
          <RankingButtonField name='testField' label='Test' className='custom-ranking-class' />
        </FormWrapper>
      )

      const ranking = screen.getByTestId('ranking-testField')
      expect(ranking).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('clears errors on unmount for non-nested fields', () => {
      const TestComponent = ({ showField }: { showField: boolean }) => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            {showField && <RankingButtonField name='testField' label='Test' required />}
          </FormProvider>
        )
      }

      const { rerender } = render(<TestComponent showField={true} />)

      const ranking = screen.getByTestId('ranking-testField')
      expect(ranking).toBeInTheDocument()

      rerender(<TestComponent showField={false} />)
      expect(screen.queryByTestId('ranking-testField')).not.toBeInTheDocument()
    })

    it('integrates with form submission', () => {
      const TestComponent = () => {
        const methods = useForm()
        const handleSubmit = (data: any) => {
          expect(data.testField).toBe(4)
        }

        return (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <RankingButtonField name='testField' label='Rating' />
              <button type='submit'>Submit</button>
            </form>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const star4 = screen.getByTestId('star-testField-4')
      fireEvent.click(star4)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)
    })
  })

  describe('Visual Feedback', () => {
    it('shows checked state for selected stars', () => {
      render(
        <FormWrapper defaultValues={{ testField: 3 }}>
          <RankingButtonField name='testField' label='Test' />
        </FormWrapper>
      )

      const star1 = screen.getByTestId('star-testField-1')
      const star2 = screen.getByTestId('star-testField-2')
      const star3 = screen.getByTestId('star-testField-3')
      const star4 = screen.getByTestId('star-testField-4')

      expect(star1).toHaveAttribute('aria-checked', 'true')
      expect(star2).toHaveAttribute('aria-checked', 'true')
      expect(star3).toHaveAttribute('aria-checked', 'true')
      expect(star4).toHaveAttribute('aria-checked', 'false')
    })
  })
})

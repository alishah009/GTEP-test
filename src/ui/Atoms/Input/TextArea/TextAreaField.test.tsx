/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { TextAreaField } from '@/ui/Atoms/Input/TextArea/TextAreaField'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock TextArea component
jest.mock('@/ui/Atoms/Input/TextArea/TextArea', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TextArea: ({ label, error, rows, disabled, classNames: _classNames, ...restProps }: any) => {
    // Extract field props that Controller passes
    const { onChange, onBlur, value = '', name, ref, ...fieldProps } = restProps
    const fieldName = name || 'unknown'

    // Filter out non-DOM props to avoid React warnings
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { classNames: _unused, ...domProps } = fieldProps

    return (
      <div>
        {label && <label htmlFor={fieldName}>{label}</label>}
        <textarea
          id={fieldName}
          name={fieldName}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          ref={ref}
          disabled={disabled}
          rows={rows || 4}
          data-testid={`textarea-${fieldName}`}
          aria-invalid={!!error}
          {...domProps}
        />
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

describe('TextAreaField Component', () => {
  describe('Rendering', () => {
    it('renders textarea field with label', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test Label' rows={4} />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('textarea-testField')).toBeInTheDocument()
    })

    it('renders textarea without label', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='' rows={4} />
        </FormWrapper>
      )

      expect(screen.getByTestId('textarea-testField')).toBeInTheDocument()
    })

    it('renders with specified number of rows', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={6} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toHaveAttribute('rows', '6')
    })

    it('uses default rows when not specified', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toHaveAttribute('rows', '4')
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Required Field' rows={4} required />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toBeInTheDocument()
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Optional Field' rows={4} required={false} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables textarea when disabled prop is true', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Disabled Field' rows={4} disabled />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toBeDisabled()
    })

    it('enables textarea when disabled prop is false', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Enabled Field' rows={4} disabled={false} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).not.toBeDisabled()
    })
  })

  describe('User Input', () => {
    it('allows typing in the textarea field', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Test Value' } })

      expect(textarea.value).toBe('Test Value')
    })

    it('allows multi-line text input', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField') as HTMLTextAreaElement
      const multiLineText = 'Line 1\nLine 2\nLine 3'
      fireEvent.change(textarea, { target: { value: multiLineText } })

      expect(textarea.value).toBe(multiLineText)
    })

    it('updates form value when user types', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <TextAreaField name='testField' label='Test' rows={4} />
            <button
              type='button'
              onClick={() => {
                const value = methods.getValues('testField')
                expect(value).toBe('Typed Value')
              }}
            >
              Check Value
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const textarea = screen.getByTestId('textarea-testField') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Typed Value' } })

      const button = screen.getByText('Check Value')
      fireEvent.click(button)
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} error='This field has an error' />
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
            <TextAreaField name='testField' label='Required Field' rows={4} required />
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
        const textarea = screen.getByTestId('textarea-testField')
        expect(textarea).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('marks textarea as invalid when error exists', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} error='Error message' />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Placeholder', () => {
    it('renders with placeholder text', () => {
      render(
        <FormWrapper>
          <TextAreaField
            name='testField'
            label='Test'
            rows={4}
            placeholder='Enter your text here'
          />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toHaveAttribute('placeholder', 'Enter your text here')
    })

    it('renders without placeholder', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('renders with default value from form', () => {
      render(
        <FormWrapper defaultValues={{ testField: 'Default text value' }}>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField') as HTMLTextAreaElement
      expect(textarea.value).toBe('Default text value')
    })

    it('renders with empty string as default value', () => {
      render(
        <FormWrapper defaultValues={{ testField: '' }}>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField') as HTMLTextAreaElement
      expect(textarea.value).toBe('')
    })
  })

  describe('Rows Configuration', () => {
    it('renders with 3 rows', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={3} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toHaveAttribute('rows', '3')
    })

    it('renders with 10 rows', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={10} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toHaveAttribute('rows', '10')
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} className='custom-textarea-class' />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Long Text Handling', () => {
    it('handles long text input', () => {
      render(
        <FormWrapper>
          <TextAreaField name='testField' label='Test' rows={4} />
        </FormWrapper>
      )

      const textarea = screen.getByTestId('textarea-testField') as HTMLTextAreaElement
      const longText = 'A'.repeat(1000)
      fireEvent.change(textarea, { target: { value: longText } })

      expect(textarea.value).toBe(longText)
      expect(textarea.value.length).toBe(1000)
    })
  })

  describe('Form Integration', () => {
    it('clears errors on unmount for non-nested fields', () => {
      const TestComponent = ({ showField }: { showField: boolean }) => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            {showField && <TextAreaField name='testField' label='Test' rows={4} required />}
          </FormProvider>
        )
      }

      const { rerender } = render(<TestComponent showField={true} />)

      const textarea = screen.getByTestId('textarea-testField')
      expect(textarea).toBeInTheDocument()

      rerender(<TestComponent showField={false} />)
      expect(screen.queryByTestId('textarea-testField')).not.toBeInTheDocument()
    })
  })
})

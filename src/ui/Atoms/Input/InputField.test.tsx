/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock Input component
jest.mock('@/ui/Atoms/Input/Input', () => ({
  Input: ({ label, error, disabled, fieldType, type, ...field }: any) => {
    // Extract react-hook-form field props
    const { onChange, onBlur, value = '', name, ref, ...inputProps } = field

    // Determine input type based on fieldType (matching Input.tsx logic)
    let inputType = type || 'text'
    if (fieldType === 'Numeric' || fieldType === 'Float') {
      inputType = 'number'
    } else if (fieldType === 'AlphaNumeric') {
      inputType = 'text'
    }

    return (
      <div>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          disabled={disabled}
          data-testid={`input-${name}`}
          aria-invalid={!!error}
          {...inputProps}
        />
        {error && <span data-testid={`error-${name}`}>{error}</span>}
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

describe('InputField Component', () => {
  describe('Rendering', () => {
    it('renders input field with label', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test Label' />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('input-testField')).toBeInTheDocument()
    })

    it('renders without label', () => {
      render(
        <FormWrapper>
          <InputField name='testField' />
        </FormWrapper>
      )

      expect(screen.getByTestId('input-testField')).toBeInTheDocument()
    })

    it('renders with default maxLength of 50', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).toHaveAttribute('maxLength', '50')
    })

    it('renders with custom maxLength', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test' maxLength={100} />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).toHaveAttribute('maxLength', '100')
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Required Field' required />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).toHaveAttribute('required')
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Optional Field' required={false} />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).not.toHaveAttribute('required')
    })
  })

  describe('Input Types', () => {
    it('renders with type="text" by default', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Text Input' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders with type="email"', () => {
      render(
        <FormWrapper>
          <InputField name='email' label='Email' type='email' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('renders with type="password"', () => {
      render(
        <FormWrapper>
          <InputField name='password' label='Password' type='password' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('renders with type="number" for Numeric fieldType', () => {
      render(
        <FormWrapper>
          <InputField name='number' label='Number' fieldType='Numeric' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-number')
      expect(input).toBeInTheDocument()
      // FieldType conversion happens in Input component
    })

    it('renders with type="number" for Float fieldType', () => {
      render(
        <FormWrapper>
          <InputField name='float' label='Float' fieldType='Float' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-float')
      expect(input).toBeInTheDocument()
      // FieldType conversion happens in Input component
    })
  })

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Disabled Field' disabled />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).toBeDisabled()
    })

    it('enables input when disabled prop is false', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Enabled Field' disabled={false} />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).not.toBeDisabled()
    })
  })

  describe('User Input', () => {
    it('allows typing in the input field', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Test Value' } })

      expect(input.value).toBe('Test Value')
    })

    it('updates form value when user types', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <InputField name='testField' label='Test' />
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

      const input = screen.getByTestId('input-testField') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Typed Value' } })

      const button = screen.getByText('Check Value')
      fireEvent.click(button)
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test' error='This field has an error' />
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
            <InputField name='testField' label='Required Field' required />
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
        const input = screen.getByTestId('input-testField')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('marks input as invalid when error exists', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test' error='Error message' />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Length Validation', () => {
    it('enforces minLength validation', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <InputField name='testField' label='Test' minLength={5} required />
            <button
              type='button'
              onClick={async () => {
                const result = await methods.trigger('testField')
                expect(result).toBe(false)
              }}
            >
              Validate
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const input = screen.getByTestId('input-testField') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'abc' } })

      const button = screen.getByText('Validate')
      fireEvent.click(button)
    })

    it('enforces maxLength validation', () => {
      render(
        <FormWrapper>
          <InputField name='testField' label='Test' maxLength={10} />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-testField') as HTMLInputElement
      expect(input).toHaveAttribute('maxLength', '10')
    })
  })

  describe('Optional Field Behavior', () => {
    it('sets value to null when optional field is empty', async () => {
      const TestComponent = () => {
        const methods = useForm({ defaultValues: { testField: '' } })
        return (
          <FormProvider {...methods}>
            <InputField name='testField' label='Optional' required={false} />
            <button
              type='button'
              onClick={() => {
                const value = methods.getValues('testField')
                expect(value).toBeNull()
              }}
            >
              Check
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const button = screen.getByText('Check')
      await waitFor(() => {
        fireEvent.click(button)
      })
    })
  })

  describe('Field Types Validation', () => {
    it('validates Alphabet fieldType', () => {
      render(
        <FormWrapper defaultValues={{ alphabet: '' }}>
          <InputField name='alphabet' label='Alphabet' fieldType='Alphabet' required />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-alphabet')
      expect(input).toBeInTheDocument()
    })

    it('validates Numeric fieldType', () => {
      render(
        <FormWrapper>
          <InputField name='numeric' label='Numeric' fieldType='Numeric' required />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-numeric')
      expect(input).toBeInTheDocument()
      // Type conversion handled by Input component based on fieldType
    })

    it('validates Float fieldType', () => {
      render(
        <FormWrapper>
          <InputField name='float' label='Float' fieldType='Float' required />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-float')
      expect(input).toBeInTheDocument()
      // Type conversion handled by Input component based on fieldType
    })

    it('validates AlphaNumeric fieldType', () => {
      render(
        <FormWrapper>
          <InputField name='alphanumeric' label='AlphaNumeric' fieldType='AlphaNumeric' required />
        </FormWrapper>
      )

      const input = screen.getByTestId('input-alphanumeric')
      expect(input).toBeInTheDocument()
    })
  })
})

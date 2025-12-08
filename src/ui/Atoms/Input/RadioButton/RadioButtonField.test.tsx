/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { RadioButtonField } from '@/ui/Atoms/Input/RadioButton/RadioButtonField'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock RadioButton component
jest.mock('@/ui/Atoms/Input/RadioButton/RadioButton', () => ({
  RadioButton: ({ label, error, constant, disabled, ...restProps }: any) => {
    // Extract field props that Controller passes
    const { onChange, onBlur, value, name, ref, ...fieldProps } = restProps
    const fieldName = name || 'unknown'

    return (
      <div>
        {label && <label htmlFor={fieldName}>{label}</label>}
        <div role='radiogroup' data-testid={`radiogroup-${fieldName}`}>
          {constant?.map((item: any, index: number) => (
            <label key={index} htmlFor={`${fieldName}-${index}`}>
              <input
                id={`${fieldName}-${index}`}
                name={fieldName}
                type='radio'
                value={item.key}
                checked={value === item.key}
                onChange={(e) => onChange?.(e.target.value)}
                onBlur={onBlur}
                ref={index === 0 ? ref : undefined}
                disabled={disabled}
                data-testid={`radio-${fieldName}-${index}`}
                aria-invalid={!!error}
                {...fieldProps}
              />
              {item.value}
            </label>
          ))}
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

const mockOptions = [
  { key: 'option1', value: 'Option 1' },
  { key: 'option2', value: 'Option 2' },
  { key: 'option3', value: 'Option 3' }
]

describe('RadioButtonField Component', () => {
  describe('Rendering', () => {
    it('renders radio button field with label', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test Label' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('radiogroup-testField')).toBeInTheDocument()
    })

    it('renders without label', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByTestId('radiogroup-testField')).toBeInTheDocument()
    })

    it('renders all radio options from constant prop', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('renders correct number of radio buttons', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons).toHaveLength(3)
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Required Field'
            constant={mockOptions}
            required
          />
        </FormWrapper>
      )

      const radioGroup = screen.getByTestId('radiogroup-testField')
      expect(radioGroup).toBeInTheDocument()
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Optional Field'
            constant={mockOptions}
            required={false}
          />
        </FormWrapper>
      )

      const radioGroup = screen.getByTestId('radiogroup-testField')
      expect(radioGroup).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables all radio buttons when disabled prop is true', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Disabled Field'
            constant={mockOptions}
            disabled
          />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach((radio) => {
        expect(radio).toBeDisabled()
      })
    })

    it('enables radio buttons when disabled prop is false', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Enabled Field'
            constant={mockOptions}
            disabled={false}
          />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach((radio) => {
        expect(radio).not.toBeDisabled()
      })
    })
  })

  describe('User Selection', () => {
    it('allows selecting a radio option', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radio1 = screen.getByTestId('radio-testField-0') as HTMLInputElement
      const radio2 = screen.getByTestId('radio-testField-1') as HTMLInputElement

      expect(radio1.checked).toBe(false)
      expect(radio2.checked).toBe(false)

      fireEvent.click(radio1)
      expect(radio1.checked).toBe(true)
      expect(radio2.checked).toBe(false)
    })

    it('allows only one option to be selected at a time', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radio1 = screen.getByTestId('radio-testField-0') as HTMLInputElement
      const radio2 = screen.getByTestId('radio-testField-1') as HTMLInputElement
      const radio3 = screen.getByTestId('radio-testField-2') as HTMLInputElement

      fireEvent.click(radio1)
      expect(radio1.checked).toBe(true)
      expect(radio2.checked).toBe(false)
      expect(radio3.checked).toBe(false)

      fireEvent.click(radio2)
      expect(radio1.checked).toBe(false)
      expect(radio2.checked).toBe(true)
      expect(radio3.checked).toBe(false)
    })

    it('updates form value when option is selected', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <RadioButtonField name='testField' label='Test' constant={mockOptions} />
            <button
              type='button'
              onClick={() => {
                const value = methods.getValues('testField')
                expect(value).toBe('option2')
              }}
            >
              Check Value
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const radio2 = screen.getByTestId('radio-testField-1') as HTMLInputElement
      fireEvent.click(radio2)

      const button = screen.getByText('Check Value')
      fireEvent.click(button)
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Test'
            constant={mockOptions}
            error='This field has an error'
          />
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
            <RadioButtonField
              name='testField'
              label='Required Field'
              constant={mockOptions}
              required
            />
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
        const radioButtons = screen.getAllByRole('radio')
        expect(radioButtons[0]).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('marks radio buttons as invalid when error exists', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Test'
            constant={mockOptions}
            error='Error message'
          />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach((radio) => {
        expect(radio).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  describe('Options', () => {
    it('handles empty options array', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={[]} />
        </FormWrapper>
      )

      const radioGroup = screen.getByTestId('radiogroup-testField')
      expect(radioGroup).toBeInTheDocument()
      expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    })

    it('renders options with different key types', () => {
      const mixedOptions = [
        { key: 'string1', value: 'String Option' },
        { key: 123, value: 'Number Option' },
        { key: true, value: 'Boolean Option' }
      ]

      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mixedOptions as any} />
        </FormWrapper>
      )

      expect(screen.getByText('String Option')).toBeInTheDocument()
      expect(screen.getByText('Number Option')).toBeInTheDocument()
      expect(screen.getByText('Boolean Option')).toBeInTheDocument()
    })

    it('renders single radio button option', () => {
      const singleOption = [{ key: 'only', value: 'Only Option' }]

      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={singleOption} />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons).toHaveLength(1)
      expect(screen.getByText('Only Option')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('renders with default value from form', () => {
      render(
        <FormWrapper defaultValues={{ testField: 'option2' }}>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radio1 = screen.getByTestId('radio-testField-0') as HTMLInputElement
      const radio2 = screen.getByTestId('radio-testField-1') as HTMLInputElement
      const radio3 = screen.getByTestId('radio-testField-2') as HTMLInputElement

      expect(radio1.checked).toBe(false)
      expect(radio2.checked).toBe(true)
      expect(radio3.checked).toBe(false)
    })

    it('renders with first option as default when no default value set', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach((radio) => {
        expect((radio as HTMLInputElement).checked).toBe(false)
      })
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(
        <FormWrapper>
          <RadioButtonField
            name='testField'
            label='Test'
            constant={mockOptions}
            className='custom-radio-class'
          />
        </FormWrapper>
      )

      const radioGroup = screen.getByTestId('radiogroup-testField')
      expect(radioGroup).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('clears errors on unmount for non-nested fields', () => {
      const TestComponent = ({ showField }: { showField: boolean }) => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            {showField && (
              <RadioButtonField name='testField' label='Test' constant={mockOptions} required />
            )}
          </FormProvider>
        )
      }

      const { rerender } = render(<TestComponent showField={true} />)

      const radioGroup = screen.getByTestId('radiogroup-testField')
      expect(radioGroup).toBeInTheDocument()

      rerender(<TestComponent showField={false} />)
      expect(screen.queryByTestId('radiogroup-testField')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has radiogroup role', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
    })

    it('all radio buttons have the same name attribute', () => {
      render(
        <FormWrapper>
          <RadioButtonField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const radioButtons = screen.getAllByRole('radio') as HTMLInputElement[]
      const names = radioButtons.map((radio) => radio.name)
      const uniqueNames = new Set(names)

      expect(uniqueNames.size).toBe(1)
      expect(uniqueNames.has('testField')).toBe(true)
    })
  })
})

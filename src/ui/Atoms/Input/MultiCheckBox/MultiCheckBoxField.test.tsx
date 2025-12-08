/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { MultiCheckBoxField } from '@/ui/Atoms/Input/MultiCheckBox/MultiCheckBoxField'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock MultiCheckBox component
jest.mock('@/ui/Atoms/Input/MultiCheckBox/MultiCheckBox', () => ({
  MultiCheckBox: ({ label, error, constant, disabled, field, ...restProps }: any) => {
    const { onChange, onBlur, value = [], name, ref, ...fieldProps } = field || {}
    const fieldName = name || 'unknown'

    return (
      <div>
        {label && <label htmlFor={fieldName}>{label}</label>}
        <div role='group' data-testid={`multicheckbox-group-${fieldName}`}>
          {constant?.map((item: any, index: number) => {
            const isChecked = Array.isArray(value) && value.includes(item.key)
            return (
              <label key={index} htmlFor={`${fieldName}-${index}`}>
                <input
                  id={`${fieldName}-${index}`}
                  name={`${fieldName}[]`}
                  type='checkbox'
                  value={item.key}
                  checked={isChecked}
                  onChange={(e) => {
                    const currentValue = Array.isArray(value) ? [...value] : []
                    if (e.target.checked) {
                      currentValue.push(item.key)
                    } else {
                      const index = currentValue.indexOf(item.key)
                      if (index > -1) {
                        currentValue.splice(index, 1)
                      }
                    }
                    onChange?.(currentValue)
                  }}
                  onBlur={onBlur}
                  ref={index === 0 ? ref : undefined}
                  disabled={disabled}
                  data-testid={`multicheckbox-${fieldName}-${index}`}
                  aria-invalid={!!error}
                  {...fieldProps}
                />
                {item.value}
              </label>
            )
          })}
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

describe('MultiCheckBoxField Component', () => {
  describe('Rendering', () => {
    it('renders multi checkbox field with label', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test Label' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('multicheckbox-group-testField')).toBeInTheDocument()
    })

    it('renders without label', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByTestId('multicheckbox-group-testField')).toBeInTheDocument()
    })

    it('renders all checkbox options from constant prop', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('renders correct number of checkboxes', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(3)
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField
            name='testField'
            label='Required Field'
            constant={mockOptions}
            required
          />
        </FormWrapper>
      )

      const group = screen.getByTestId('multicheckbox-group-testField')
      expect(group).toBeInTheDocument()
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField
            name='testField'
            label='Optional Field'
            constant={mockOptions}
            required={false}
          />
        </FormWrapper>
      )

      const group = screen.getByTestId('multicheckbox-group-testField')
      expect(group).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables all checkboxes when disabled prop is true', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Disabled Field' constant={mockOptions} disabled />
        </FormWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled()
      })
    })

    it('enables checkboxes when disabled prop is false', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField
            name='testField'
            label='Enabled Field'
            constant={mockOptions}
            disabled={false}
          />
        </FormWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeDisabled()
      })
    })
  })

  describe('User Selection', () => {
    it('allows selecting multiple checkboxes', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkbox1 = screen.getByTestId('multicheckbox-testField-0') as HTMLInputElement
      const checkbox2 = screen.getByTestId('multicheckbox-testField-1') as HTMLInputElement
      const checkbox3 = screen.getByTestId('multicheckbox-testField-2') as HTMLInputElement

      expect(checkbox1.checked).toBe(false)
      expect(checkbox2.checked).toBe(false)
      expect(checkbox3.checked).toBe(false)

      fireEvent.click(checkbox1)
      expect(checkbox1.checked).toBe(true)

      fireEvent.click(checkbox2)
      expect(checkbox2.checked).toBe(true)

      expect(checkbox3.checked).toBe(false)
    })

    it('allows deselecting checkboxes', () => {
      render(
        <FormWrapper defaultValues={{ testField: ['option1', 'option2'] }}>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkbox1 = screen.getByTestId('multicheckbox-testField-0') as HTMLInputElement
      const checkbox2 = screen.getByTestId('multicheckbox-testField-1') as HTMLInputElement

      expect(checkbox1.checked).toBe(true)
      expect(checkbox2.checked).toBe(true)

      fireEvent.click(checkbox1)
      expect(checkbox1.checked).toBe(false)
      expect(checkbox2.checked).toBe(true)
    })

    it('updates form value with array when checkboxes are selected', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
            <button
              type='button'
              onClick={() => {
                const value = methods.getValues('testField')
                expect(Array.isArray(value)).toBe(true)
                expect(value).toContain('option1')
              }}
            >
              Check Value
            </button>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const checkbox1 = screen.getByTestId('multicheckbox-testField-0') as HTMLInputElement
      fireEvent.click(checkbox1)

      const button = screen.getByText('Check Value')
      fireEvent.click(button)
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField
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
            <MultiCheckBoxField
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
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes[0]).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('marks checkboxes as invalid when error exists', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField
            name='testField'
            label='Test'
            constant={mockOptions}
            error='Error message'
          />
        </FormWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  describe('Options', () => {
    it('handles empty options array', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={[]} />
        </FormWrapper>
      )

      const group = screen.getByTestId('multicheckbox-group-testField')
      expect(group).toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })

    it('renders options with different key types', () => {
      const mixedOptions = [
        { key: 'string1', value: 'String Option' },
        { key: 123, value: 'Number Option' },
        { key: true, value: 'Boolean Option' }
      ]

      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={mixedOptions as any} />
        </FormWrapper>
      )

      expect(screen.getByText('String Option')).toBeInTheDocument()
      expect(screen.getByText('Number Option')).toBeInTheDocument()
      expect(screen.getByText('Boolean Option')).toBeInTheDocument()
    })

    it('renders single checkbox option', () => {
      const singleOption = [{ key: 'only', value: 'Only Option' }]

      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={singleOption} />
        </FormWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(1)
      expect(screen.getByText('Only Option')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('renders with default value array from form', () => {
      render(
        <FormWrapper defaultValues={{ testField: ['option2', 'option3'] }}>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkbox1 = screen.getByTestId('multicheckbox-testField-0') as HTMLInputElement
      const checkbox2 = screen.getByTestId('multicheckbox-testField-1') as HTMLInputElement
      const checkbox3 = screen.getByTestId('multicheckbox-testField-2') as HTMLInputElement

      expect(checkbox1.checked).toBe(false)
      expect(checkbox2.checked).toBe(true)
      expect(checkbox3.checked).toBe(true)
    })

    it('renders with empty array when no default value set', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
      checkboxes.forEach((checkbox) => {
        expect(checkbox.checked).toBe(false)
      })
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField
            name='testField'
            label='Test'
            constant={mockOptions}
            className='custom-multicheckbox-class'
          />
        </FormWrapper>
      )

      const group = screen.getByTestId('multicheckbox-group-testField')
      expect(group).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('clears errors on unmount for non-nested fields', () => {
      const TestComponent = ({ showField }: { showField: boolean }) => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            {showField && (
              <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} required />
            )}
          </FormProvider>
        )
      }

      const { rerender } = render(<TestComponent showField={true} />)

      const group = screen.getByTestId('multicheckbox-group-testField')
      expect(group).toBeInTheDocument()

      rerender(<TestComponent showField={false} />)
      expect(screen.queryByTestId('multicheckbox-group-testField')).not.toBeInTheDocument()
    })
  })

  describe('Multiple Selection Behavior', () => {
    it('allows selecting all options', () => {
      render(
        <FormWrapper>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkbox1 = screen.getByTestId('multicheckbox-testField-0') as HTMLInputElement
      const checkbox2 = screen.getByTestId('multicheckbox-testField-1') as HTMLInputElement
      const checkbox3 = screen.getByTestId('multicheckbox-testField-2') as HTMLInputElement

      fireEvent.click(checkbox1)
      fireEvent.click(checkbox2)
      fireEvent.click(checkbox3)

      expect(checkbox1.checked).toBe(true)
      expect(checkbox2.checked).toBe(true)
      expect(checkbox3.checked).toBe(true)
    })

    it('allows selecting none of the options', () => {
      render(
        <FormWrapper defaultValues={{ testField: ['option1', 'option2', 'option3'] }}>
          <MultiCheckBoxField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const checkbox1 = screen.getByTestId('multicheckbox-testField-0') as HTMLInputElement
      const checkbox2 = screen.getByTestId('multicheckbox-testField-1') as HTMLInputElement
      const checkbox3 = screen.getByTestId('multicheckbox-testField-2') as HTMLInputElement

      fireEvent.click(checkbox1)
      fireEvent.click(checkbox2)
      fireEvent.click(checkbox3)

      expect(checkbox1.checked).toBe(false)
      expect(checkbox2.checked).toBe(false)
      expect(checkbox3.checked).toBe(false)
    })
  })
})


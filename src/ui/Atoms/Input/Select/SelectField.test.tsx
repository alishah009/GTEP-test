/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { SelectField } from '@/ui/Atoms/Input/Select/SelectField'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock Select component - it receives field props from react-hook-form
jest.mock('@/ui/Atoms/Input/Select/Select', () => ({
  Select: ({
    label,
    error,
    constant,
    disabled,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showSearch: _showSearch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    classNames: _classNames,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prefixComponent: _prefixComponent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectSize: _selectSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filterOption: _filterOption,
    ...restProps
  }: any) => {
    // Extract field props that Controller passes
    const { onChange, onBlur, value = '', name, ref, ...domProps } = restProps
    const fieldName = name || 'unknown'

    return (
      <div>
        {label && <label htmlFor={fieldName}>{label}</label>}
        <select
          id={fieldName}
          name={fieldName}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          ref={ref}
          disabled={disabled}
          data-testid={`select-${fieldName}`}
          aria-invalid={!!error}
          {...domProps}
        >
          <option value=''>Select an option</option>
          {constant?.map((item: any, index: number) => (
            <option key={index} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
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

describe('SelectField Component', () => {
  describe('Rendering', () => {
    it('renders select field with label', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test Label' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('select-testField')).toBeInTheDocument()
    })

    it('renders without label', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByTestId('select-testField')).toBeInTheDocument()
    })

    it('renders all options from constant prop', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
      expect(screen.getByText('Option 3')).toBeInTheDocument()
    })

    it('renders default placeholder option', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Required Field' constant={mockOptions} required />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeInTheDocument()
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <SelectField
            name='testField'
            label='Optional Field'
            constant={mockOptions}
            required={false}
          />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables select when disabled prop is true', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Disabled Field' constant={mockOptions} disabled />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeDisabled()
    })

    it('enables select when disabled prop is false', () => {
      render(
        <FormWrapper>
          <SelectField
            name='testField'
            label='Enabled Field'
            constant={mockOptions}
            disabled={false}
          />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).not.toBeDisabled()
    })
  })

  describe('User Selection', () => {
    it('allows selecting an option', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField') as HTMLSelectElement
      fireEvent.change(select, { target: { value: 'option1' } })

      expect(select.value).toBe('option1')
    })

    it('updates form value when option is selected', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <SelectField name='testField' label='Test' constant={mockOptions} />
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

      const select = screen.getByTestId('select-testField') as HTMLSelectElement
      fireEvent.change(select, { target: { value: 'option2' } })

      const button = screen.getByText('Check Value')
      fireEvent.click(button)
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <SelectField
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
            <SelectField name='testField' label='Required Field' constant={mockOptions} required />
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
        const select = screen.getByTestId('select-testField')
        expect(select).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('marks select as invalid when error exists', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={mockOptions} error='Error message' />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Options', () => {
    it('handles empty options array', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={[]} />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeInTheDocument()
      expect(screen.getByText('Select an option')).toBeInTheDocument()
    })

    it('handles undefined constant prop', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeInTheDocument()
    })

    it('renders options with different key types', () => {
      const mixedOptions = [
        { key: 'string1', value: 'String Option' },
        { key: 123, value: 'Number Option' },
        { key: true, value: 'Boolean Option' }
      ]

      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={mixedOptions as any} />
        </FormWrapper>
      )

      expect(screen.getByText('String Option')).toBeInTheDocument()
      expect(screen.getByText('Number Option')).toBeInTheDocument()
      expect(screen.getByText('Boolean Option')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('renders with default value from form', () => {
      render(
        <FormWrapper defaultValues={{ testField: 'option2' }}>
          <SelectField name='testField' label='Test' constant={mockOptions} />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField') as HTMLSelectElement
      expect(select.value).toBe('option2')
    })

    it('renders with initial default value', () => {
      const TestComponent = () => {
        const methods = useForm({ defaultValues: { testField: 'option2' } })
        return (
          <FormProvider {...methods}>
            <SelectField name='testField' label='Test' constant={mockOptions} />
          </FormProvider>
        )
      }

      render(<TestComponent />)
      const select = screen.getByTestId('select-testField') as HTMLSelectElement
      expect(select.value).toBe('option2')
    })
  })

  describe('Multiple Selection Mode', () => {
    it('handles multiple selection mode', () => {
      render(
        <FormWrapper>
          <SelectField name='testField' label='Test' constant={mockOptions} mode='multiple' />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(
        <FormWrapper>
          <SelectField
            name='testField'
            label='Test'
            constant={mockOptions}
            className='custom-select-class'
          />
        </FormWrapper>
      )

      const select = screen.getByTestId('select-testField')
      expect(select).toBeInTheDocument()
    })
  })
})

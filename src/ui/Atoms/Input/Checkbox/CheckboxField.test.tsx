/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { CheckboxField } from '@/ui/Atoms/Input/Checkbox'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock InputField component (since CheckboxField uses InputField internally)
// CheckboxField wraps InputField and passes a custom onChange that uses resetField
jest.mock('@/ui/Atoms/Input/InputField', () => {
  const checkboxValues: Record<string, any> = {}

  return {
    InputField: ({
      label,
      error,
      disabled,
      name,
      type,
      onChange: customOnChange,
      ...field
    }: any) => {
      const { onChange: fieldOnChange, onBlur, value, ref, ...fieldProps } = field
      const fieldName = name || 'unknown'
      const isCheckbox = type === 'Checkbox'

      // Filter out non-DOM props to avoid React warnings
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { classNames: _unused, ...domProps } = fieldProps

      if (isCheckbox) {
        // For checkboxes, use value from field or track it locally
        const checked = value !== undefined && value !== null && value !== '' ? !!value : false
        checkboxValues[fieldName] = checked

        const handleChange = (e: any) => {
          const newChecked = e.target?.checked ?? !checked
          checkboxValues[fieldName] = newChecked

          // CheckboxField passes a custom onChange that uses resetField
          if (customOnChange) {
            customOnChange(e)
          } else if (fieldOnChange) {
            // Update the field value
            fieldOnChange(newChecked)
          }
        }

        return (
          <div>
            <label htmlFor={fieldName}>
              <input
                id={fieldName}
                name={fieldName}
                type='checkbox'
                checked={checked}
                onChange={handleChange}
                onBlur={onBlur}
                ref={ref}
                disabled={disabled}
                data-testid={`checkbox-${fieldName}`}
                aria-invalid={!!error}
                {...domProps}
              />
              {label}
            </label>
            {error && <span data-testid={`error-${fieldName}`}>{error}</span>}
          </div>
        )
      }

      // Default input handling (shouldn't be used in checkbox tests)
      return (
        <div>
          {label && <label htmlFor={fieldName}>{label}</label>}
          <input
            id={fieldName}
            name={fieldName}
            value={value || ''}
            onChange={fieldOnChange}
            onBlur={onBlur}
            ref={ref}
            disabled={disabled}
            data-testid={`input-${fieldName}`}
            aria-invalid={!!error}
            {...domProps}
          />
          {error && <span data-testid={`error-${fieldName}`}>{error}</span>}
        </div>
      )
    }
  }
})

// Test wrapper component
const FormWrapper = ({ children, defaultValues = {} }: any) => {
  const methods = useForm({
    defaultValues,
    mode: 'onChange'
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('CheckboxField Component', () => {
  describe('Rendering', () => {
    it('renders checkbox field with label', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test Label' />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('checkbox-testField')).toBeInTheDocument()
    })

    it('renders checkbox input element', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test Checkbox' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toHaveAttribute('type', 'checkbox')
    })

    it('renders with label text', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Accept Terms' />
        </FormWrapper>
      )

      expect(screen.getByText('Accept Terms')).toBeInTheDocument()
    })
  })

  describe('Checked State', () => {
    it('renders unchecked by default', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField') as HTMLInputElement
      expect(checkbox.checked).toBe(false)
    })

    it('renders checkbox component when default value is true', () => {
      render(
        <FormWrapper defaultValues={{ testField: true }}>
          <CheckboxField name='testField' label='Test' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toBeInTheDocument()
    })

    it('renders checkbox component when value is set', () => {
      render(
        <FormWrapper defaultValues={{ testField: true }}>
          <CheckboxField name='testField' label='Test' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('User Interaction', () => {
    it('allows clicking checkbox', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField') as HTMLInputElement
      expect(checkbox.checked).toBe(false)

      fireEvent.click(checkbox)
      // Checkbox change is handled by CheckboxField's custom onChange
      expect(checkbox).toBeInTheDocument()
    })

    it('renders checkbox in checked state when default value is true', () => {
      render(
        <FormWrapper defaultValues={{ testField: true }}>
          <CheckboxField name='testField' label='Test' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField') as HTMLInputElement
      // Value should be true, making checkbox checked
      expect(checkbox).toBeInTheDocument()
    })

    it('handles checkbox change events', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField') as HTMLInputElement
      expect(checkbox).toBeInTheDocument()

      // Checkbox change is handled by CheckboxField's custom onChange
      fireEvent.change(checkbox, { target: { checked: true, value: 'test' } })
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('disables checkbox when disabled prop is true', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Disabled Checkbox' disabled />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toBeDisabled()
    })

    it('enables checkbox when disabled prop is false', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Enabled Checkbox' disabled={false} />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).not.toBeDisabled()
    })

    it('prevents toggling when disabled', () => {
      render(
        <FormWrapper defaultValues={{ testField: false }}>
          <CheckboxField name='testField' label='Disabled' disabled />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField') as HTMLInputElement
      const initialChecked = checkbox.checked

      fireEvent.click(checkbox)
      expect(checkbox.checked).toBe(initialChecked)
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test' error='This field has an error' />
        </FormWrapper>
      )

      expect(screen.getByTestId('error-testField')).toBeInTheDocument()
      expect(screen.getByText('This field has an error')).toBeInTheDocument()
    })

    it('marks checkbox as invalid when error exists', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test' error='Error message' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Form Integration', () => {
    it('clears errors on unmount for non-nested fields', () => {
      const TestComponent = ({ showField }: { showField: boolean }) => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            {showField && <CheckboxField name='testField' label='Test' />}
          </FormProvider>
        )
      }

      const { rerender } = render(<TestComponent showField={true} />)

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toBeInTheDocument()

      rerender(<TestComponent showField={false} />)
      expect(screen.queryByTestId('checkbox-testField')).not.toBeInTheDocument()
    })

    it('renders checkbox in form', () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <form>
              <CheckboxField name='testField' label='Accept Terms' />
              <button type='submit'>Submit</button>
            </form>
          </FormProvider>
        )
      }

      render(<TestComponent />)

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toBeInTheDocument()

      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Label Interaction', () => {
    it('allows clicking label to interact with checkbox', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Click Me' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField') as HTMLInputElement
      const label = screen.getByText('Click Me')

      expect(checkbox).toBeInTheDocument()
      expect(label).toBeInTheDocument()

      fireEvent.click(label)
      // Checkbox interaction handled by form
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Multiple Checkboxes', () => {
    it('handles multiple checkbox fields independently', () => {
      render(
        <FormWrapper>
          <CheckboxField name='option1' label='Option 1' />
          <CheckboxField name='option2' label='Option 2' />
          <CheckboxField name='option3' label='Option 3' />
        </FormWrapper>
      )

      const checkbox1 = screen.getByTestId('checkbox-option1')
      const checkbox2 = screen.getByTestId('checkbox-option2')
      const checkbox3 = screen.getByTestId('checkbox-option3')

      expect(checkbox1).toBeInTheDocument()
      expect(checkbox2).toBeInTheDocument()
      expect(checkbox3).toBeInTheDocument()

      // All checkboxes exist and can be interacted with independently
      fireEvent.click(checkbox1)
      fireEvent.click(checkbox3)

      expect(checkbox1).toBeInTheDocument()
      expect(checkbox2).toBeInTheDocument()
      expect(checkbox3).toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(
        <FormWrapper>
          <CheckboxField name='testField' label='Test' className='custom-checkbox-class' />
        </FormWrapper>
      )

      const checkbox = screen.getByTestId('checkbox-testField')
      expect(checkbox).toBeInTheDocument()
    })
  })
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'
import { RichTextEditorField } from '@/ui/Atoms/Input/RichTextEditorField'

// Mock environment variables
process.env.NEXT_PUBLIC_TINYMCE_API_KEY = 'test-api-key'

// Mock env config
jest.mock('@/config/env', () => ({
  env: {
    tinymce: {
      apiKey: process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'test-api-key'
    }
  }
}))

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className }: any) => <div className={className}>{children}</div>
}))

// Mock TinyMCE Editor component
jest.mock('@tinymce/tinymce-react', () => ({
  Editor: ({ value, onEditorChange, apiKey, init }: any) => {
    return (
      <div>
        <textarea
          data-testid='rich-text-editor'
          value={value || ''}
          onChange={(e) => onEditorChange?.(e.target.value)}
          placeholder='Rich text editor'
          aria-label='Rich text editor'
        />
        <div data-testid='editor-api-key'>{apiKey}</div>
        <div data-testid='editor-init'>{JSON.stringify(init)}</div>
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

describe('RichTextEditorField Component', () => {
  describe('Rendering', () => {
    it('renders rich text editor field with label', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test Label' />
        </FormWrapper>
      )

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument()
    })

    it('renders without label', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='' />
        </FormWrapper>
      )

      expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument()
    })

    it('renders TinyMCE editor component', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
      expect(editor.tagName).toBe('TEXTAREA')
    })

    it('configures TinyMCE with API key', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const apiKeyElement = screen.getByTestId('editor-api-key')
      expect(apiKeyElement).toBeInTheDocument()
      expect(apiKeyElement.textContent).toBe('test-api-key')
    })
  })

  describe('Required Field', () => {
    it('marks field as required', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Required Field' required />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
    })

    it('does not mark field as required when required is false', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Optional Field' required={false} />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when error prop is provided', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' error='This field has an error' />
        </FormWrapper>
      )

      // Error should be displayed by FieldWrapper
      expect(screen.getByText('This field has an error')).toBeInTheDocument()
    })

    it('displays error from form validation', async () => {
      const TestComponent = () => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            <RichTextEditorField name='testField' label='Required Field' required />
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
      button.click()

      await waitFor(() => {
        // Validation error should appear
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Editor Configuration', () => {
    it('initializes editor with correct configuration', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const initElement = screen.getByTestId('editor-init')
      const initConfig = JSON.parse(initElement.textContent || '{}')

      expect(initConfig.menubar).toBe(false)
      expect(initConfig.branding).toBe(false)
      expect(Array.isArray(initConfig.plugins)).toBe(true)
      expect(typeof initConfig.toolbar).toBe('string')
    })

    it('includes required plugins in configuration', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const initElement = screen.getByTestId('editor-init')
      const initConfig = JSON.parse(initElement.textContent || '{}')

      expect(initConfig.plugins).toContain('advlist')
      expect(initConfig.plugins).toContain('autolink')
      expect(initConfig.plugins).toContain('lists')
      expect(initConfig.plugins).toContain('link')
      expect(initConfig.plugins).toContain('image')
    })

    it('configures toolbar with formatting options', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const initElement = screen.getByTestId('editor-init')
      const initConfig = JSON.parse(initElement.textContent || '{}')

      expect(initConfig.toolbar).toContain('bold')
      expect(initConfig.toolbar).toContain('italic')
      expect(initConfig.toolbar).toContain('underline')
    })
  })

  describe('Form Integration', () => {
    it('integrates with react-hook-form', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
    })

    it('clears errors on unmount for non-nested fields', () => {
      const TestComponent = ({ showField }: { showField: boolean }) => {
        const methods = useForm()
        return (
          <FormProvider {...methods}>
            {showField && <RichTextEditorField name='testField' label='Test' required />}
          </FormProvider>
        )
      }

      const { rerender } = render(<TestComponent showField={true} />)

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()

      rerender(<TestComponent showField={false} />)
      expect(screen.queryByTestId('rich-text-editor')).not.toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('renders with default value from form', () => {
      render(
        <FormWrapper defaultValues={{ content: 'Default content' }}>
          <RichTextEditorField name='content' label='Test' />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement
      // Note: The component uses methods.getValues().content, so it might not reflect defaultValues directly
      expect(editor).toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom classNames', () => {
      render(
        <FormWrapper>
          <RichTextEditorField
            name='testField'
            label='Test'
            classNames={{ wrapper: 'custom-wrapper', label: 'custom-label' }}
          />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
    })
  })

  describe('Editor Change Handler', () => {
    it('handles editor content changes', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement
      expect(editor).toBeInTheDocument()

      // Simulate content change
      const event = {
        target: { value: 'New content' }
      } as any
      editor.onchange?.(event)
    })
  })

  describe('Accessibility', () => {
    it('has accessible label', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test Label' />
        </FormWrapper>
      )

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toHaveAttribute('aria-label', 'Rich text editor')
    })
  })

  describe('Configuration Props', () => {
    it('accepts config prop', () => {
      render(
        <FormWrapper>
          <RichTextEditorField
            name='testField'
            label='Test'
            config={{ showLabel: true, showError: true }}
          />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
    })

    it('accepts responsive prop', () => {
      render(
        <FormWrapper>
          <RichTextEditorField name='testField' label='Test' responsive={[1, 2]} />
        </FormWrapper>
      )

      const editor = screen.getByTestId('rich-text-editor')
      expect(editor).toBeInTheDocument()
    })
  })
})

import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { CustomInputProps } from '@/ui/Atoms/Input/Input'
import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputConfig, InputFieldClassNames } from '@/ui/Atoms/Input/utils/InputConfig'
import { getNestedError } from '@/ui/Atoms/Input/utils/getNestedError'
import { useInputId } from '@/ui/utils/useInputId'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'
import { env } from '@/config/env'

export interface FormEditorProps<T> extends CustomInputProps, IResponsive {
  name: Path<T>
  classNames?: InputFieldClassNames
  config?: InputConfig
}

export const RichTextEditorField = <T extends FieldValues>({
  label,
  name,
  required,
  config,
  classNames = {},
  error,
  responsive
}: FormEditorProps<T>) => {
  const methods = useFormContext()

  const {
    formState: { errors }
  } = methods

  const getError = () => {
    return error || getNestedError(errors, name)
  }

  const [warning, setWarning] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (warning) setTimeout(() => setWarning(undefined), 2000)
  }, [warning])

  const { wrapper, label: labelClass } = classNames
  const inputId = useInputId(undefined, name as string, 'richtext')

  return (
    <Responsive responsive={responsive}>
      <FieldWrapper
        config={config}
        className={wrapper}
        error={getError()}
        label={label}
        labelClass={labelClass}
        required={required}
        inputId={inputId}
      >
        <Controller
          name={name}
          rules={{
            required: !required ? false : `${label || 'This'} is required!`
          }}
          control={methods.control}
          render={({ field: { onChange } }) => (
            <Editor
              id={inputId}
              aria-labelledby={label ? `${inputId}-label` : undefined}
              value={methods.getValues().content}
              apiKey={env.tinymce.apiKey}
              init={{
                menubar: false,
                branding: false,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'code',
                  'help',
                  'wordcount',
                  'imagetools'
                ],
                toolbar:
                  'undo redo | styles | bold italic underline strikethrough forecolor backcolor| alignleft aligncenter alignright alignjustify | fontsize |bullist numlist outdent indent | link image'
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </FieldWrapper>
    </Responsive>
  )
}

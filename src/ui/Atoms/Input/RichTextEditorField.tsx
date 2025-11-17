import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { CustomInputProps } from '@/ui/Atoms/Input/Input'
import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputConfig, InputFieldClassNames } from '@/ui/Atoms/Input/utils/InputConfig'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'

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
    try {
      return error || eval(`errors?.${name?.replaceAll('.', '?.')}?.message`)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      errors
      return undefined
    }
  }

  const [warning, setWarning] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (warning) setTimeout(() => setWarning(undefined), 2000)
  }, [warning])

  const { wrapper, label: labelClass } = classNames

  return (
    <Responsive responsive={responsive}>
      <FieldWrapper
        config={config}
        className={wrapper}
        error={getError()}
        label={label}
        labelClass={labelClass}
        required={required}
      >
        <Controller
          name={name}
          rules={{
            required: !required ? false : `${label || 'This'} is required!`
          }}
          control={methods.control}
          render={({ field: { onChange } }) => (
            <Editor
              value={methods.getValues().content}
              apiKey={process.env.TINYMCE_APIKEY}
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

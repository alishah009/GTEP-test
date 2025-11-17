import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { MultiCheckBox, TestProps } from '@/ui/Atoms/Input/MultiCheckBox/MultiCheckBox'
import { cn } from '@/ui/utils/cn'
import { useEffect } from 'react'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'

interface ChildrenProps<T> extends TestProps, IResponsive {
  name: Path<T>
}
type InputFieldClassNames = {
  root?: string
  label?: string
  wrapper?: string
}

interface Props<T> extends ChildrenProps<T> {
  classNames?: InputFieldClassNames
}

export const MultiCheckBoxField = <T extends FieldValues>({
  label,
  name,
  error,
  constant,
  required,
  disabled,
  classNames = {},
  responsive,
  ...rest
}: Props<T>) => {
  const methods = useFormContext()

  const {
    clearErrors,
    resetField,
    formState: { errors }
  } = useFormContext()

  useEffect(() => {
    return () => {
      if (!name.includes('[')) {
        clearErrors(name)
        resetField(name, { defaultValue: undefined })
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      errors
    }
  }, [])

  const getError = () => {
    try {
      return error || eval(`errors?.${name?.replaceAll('.', '?.')}?.message`)
    } catch (e) {
      return undefined
    }
  }



  const { root, ...restClasses } = classNames

  return (
    <Responsive responsive={responsive || [1, 1]} className={cn('flex flex-col gap-[6px]', root)}>
      <Controller
        name={name}
        control={methods.control}
        rules={{
          required: !required ? false : `${label || 'This'} is required!`
        }}
        render={({ field }) => (
          <MultiCheckBox
            disabled={disabled}
            label={label}
            name={name}
            classNames={restClasses}
            constant={constant}
            required={required}
            error={getError()}
            field={field}
            {...rest}
          />
        )}
      ></Controller>
    </Responsive>
  )
}

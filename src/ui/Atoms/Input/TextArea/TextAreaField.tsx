import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import {
  ClassNames,
  TextArea,
  Props as TextAreaProps
} from '@/ui/Atoms/Input/TextArea/TextArea'
import { InputFieldClassNames } from '@/ui/Atoms/Input/utils/InputConfig'

import { cn } from '@/ui/utils/cn'
import { useEffect } from 'react'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'

interface ChildrenProps<T> extends TextAreaProps, IResponsive {
  name: Path<T>
  classNames?: ClassNames & InputFieldClassNames
}

export const TextAreaField = <T extends FieldValues>({
  label,
  name,
  error,
  rows,
  required,
  disabled,
  classNames = {},
  responsive,
  ...rest
}: ChildrenProps<T>) => {
  const methods = useFormContext()

  const {
    clearErrors,
    resetField,

    formState: { errors }
  } = methods


  useEffect(() => {
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      errors
      if (!name.includes('[')) {
        clearErrors(name)
        resetField(name, { defaultValue: undefined })
      }
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
    <Responsive responsive={responsive || [1, 2]} className={cn('flex flex-col gap-[6px] ', root)}>
      <Controller
        name={name}
        control={methods.control}
        rules={{
          required: !required ? false : `${label || 'This'} is required!`
        }}
        render={({ field }) => (
          <TextArea
            {...field}
            {...rest}
            disabled={disabled }
            label={label}
            required={required}
            classNames={restClasses}
            rows={rows}
            error={getError()}
          />
        )}
      ></Controller>
    </Responsive>
  )
}

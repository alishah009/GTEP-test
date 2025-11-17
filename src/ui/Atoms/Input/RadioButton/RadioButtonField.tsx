import { Props, RadioButton } from '@/ui/Atoms/Input/RadioButton/RadioButton'
import { useEffect } from 'react'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'

import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { InputFieldClassNames } from '@/ui/Atoms/Input/utils/InputConfig'
import { cn } from '@/ui/utils/cn'

export interface ChildrenProps<T> extends Props<T, unknown>, IResponsive {
  name: Path<T>
  classNames?: InputFieldClassNames
}

export const RadioButtonField = <T extends FieldValues>({
  label,
  name,
  required,
  constant,
  error,
  classNames = {},
  responsive,
  ...rest
}: ChildrenProps<T>) => {
  const methods = useFormContext()

  const {
    formState: { errors },
    clearErrors
  } = methods

  const getError = () => {
    try {
      return error || eval(`errors?.${name?.replaceAll('.', '?.')}?.message`)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      errors

      return undefined
    }
  }
  useEffect(() => {
    return () => {
      if (!name.includes('[')) {
        clearErrors(name)
      }
    }
  }, [])

  const { root, ...restClasses } = classNames

  return (
    <Responsive responsive={responsive || [1, 1]} className={cn('flex flex-col gap-[6px]', root)}>
      <Controller
        name={name}
        control={methods.control}
        defaultValue={rest.defaultValue as unknown as T[typeof name]}
        rules={{
          validate: {
            Required: (value) => {
              if (required && [undefined, null].includes(value)) {
                return `${label || 'This'} is required!`
              }

              return undefined
            }
          }
        }}
        render={({ field }) => (
          <RadioButton
            {...field}
            {...rest}
            disabled={rest.disabled}
            label={label}
            constant={constant}
            classNames={restClasses}
            required={required}
            error={getError()}
          />
        )}
      ></Controller>
    </Responsive>
  )
}

RadioButtonField.displayName = 'RadioButtonField'

import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { CustomInputProps, Input } from '@/ui/Atoms/Input/Input'
import { InputFieldClassNames } from '@/ui/Atoms/Input/utils/InputConfig'
import { cn } from '@/ui/utils/cn'
import { CommonInputProps } from 'rc-input/lib/interface'
import { useEffect } from 'react'
import { Controller, FieldValues, Path, useFormContext, useWatch } from 'react-hook-form'

interface ChildrenProps<T> extends CustomInputProps, IResponsive {
  name: Path<T>
}

export interface FormInputProps<T extends FieldValues> extends ChildrenProps<T> {
  classNames?: CommonInputProps['classNames'] & InputFieldClassNames
  pattern?: {
    value: RegExp
    message: string
  }
  shouldNotContain?: string[]
  sameAs?: string
  decimal?: number | undefined
}

export const InputField = <T extends FieldValues>({
  label,
  maxLength = 50,
  required,
  minLength,
  min,
  max,
  classNames = {},
  name,
  disabled,
  error,
  fieldType,
  shouldNotContain,
  responsive,
  sameAs,
  pattern,
  decimal = undefined,
  ...rest
}: FormInputProps<T>) => {
  const methods = useFormContext()
  const { control, setValue } = useFormContext()

  const { root, ...restClasses } = classNames

  const {
    formState: { errors }
  } = methods
  const fieldValue = useWatch({
    name: `${name}`,
    control
  })
  useEffect(() => {
    if (!required && fieldValue === '') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(name, null as any)
    }
  }, [fieldValue, name, required])

  const getError = () => {
    try {
      return error || eval(`errors?.${name?.replaceAll('.', '?.')}?.message`)
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      errors
      return undefined
    }
  }

  return (
    <Responsive
      responsive={responsive || [1, 1]}
      className={cn(`flex flex-col gap-[6px] w-full FormInput `, root)}
    >
      <Controller
        name={name || ''}
        rules={{
          required: !required ? false : `${label || 'This'} is required!`,
          maxLength: maxLength && {
            value: maxLength,
            message: `${label || 'This'} should have length of ${maxLength}! `
          },
          minLength: minLength && {
            value: minLength,
            message: `${label || 'This'} should have length of ${minLength}!`
          },
          validate: {
            FieldType: (value) => {
              if (
                shouldNotContain &&
                shouldNotContain.filter((item) => item === value).length > 1
              ) {
                return `${label || 'This'} should be unique`
              }

              if (!value) return undefined
              if (sameAs && value !== sameAs) {
                return `${label || 'This'} should match`
              }
              if (max !== undefined && parseFloat(value.toString()) > +max) {
                return `Maximum value ${max}!`
              }

              if (pattern !== undefined && !pattern.value.test(value.toString())) {
                return pattern.message || 'Please match the requested pattern '
              }

              if (min !== undefined && parseInt(value.toString()) < +min) {
                return `Minimum value ${min}!`
              }

              if (!fieldType) return undefined

              if (fieldType === 'Float' && decimal) {
                const patternRegExp = new RegExp(`^-?\\d+(\\.\\d{1,${decimal}})?$`)

                return !patternRegExp.test(value)
                  ? `Value should be a number with upto ${decimal} points`
                  : undefined
              }

              if (required) {
                switch (fieldType) {
                  case 'Alphabet':
                    return !RegExp(/^[A-Za-z ]*$/).test(value)
                      ? `Value should only contain letters`
                      : undefined
                  case 'Numeric':
                    return !RegExp(/^[0-9]+$/).test(value) ? `Value should be a number` : undefined
                  case 'Float':
                    return !RegExp(/^-?\d+(\.\d+)?$/).test(value)
                      ? `Value should be a number`
                      : undefined
                  case 'AlphaNumeric':
                    return !RegExp(/^[a-zA-Z0-9@\- ]+$/).test(value) // Special characters @ and - are allowed. To add more special characters, add them to the regex
                      ? `Value should only contain letters, numbers, @, or -.`
                      : undefined
                  default:
                    return undefined
                }
              } else return undefined
            }
          }
        }}
        control={methods.control}
        render={({ field }) => {
          return (
            <Input
              {...field}
              {...rest}
              label={label}
              required={required}
              maxLength={maxLength}
              minLength={minLength}
              classNames={restClasses}
              error={getError()}
              disabled={disabled}
              onWheel={() => (document.activeElement as HTMLElement).blur()}
            />
          )
        }}
      />
    </Responsive>
  )
}

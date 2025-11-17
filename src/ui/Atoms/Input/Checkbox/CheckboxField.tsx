/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInputProps, InputField } from '@/ui/Atoms/Input/InputField'
import { cn } from '@/ui/utils/cn'
import { useEffect } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'

export const Checkbox = <T extends FieldValues>({
  name,
  label,
  className,
  classNames,
  responsive,
  ...rest
}: FormInputProps<T>) => {
  const { clearErrors, resetField } = useFormContext()

  useEffect(() => {
    return () => {
      if (!name.includes('[')) {
        clearErrors(name)
        resetField(name, { defaultValue: undefined })
      }
    }
  }, [])
 

  return (
    <InputField
      disabled={rest.disabled}
      name={name}
      label={label}
      responsive={responsive || [1, 2]}
      classNames={{
        ...classNames,
        root: cn('px-2 py-2 w-min', classNames?.root),
        label: cn('whitespace-nowrap', classNames?.label),
        wrapper: 'flex-row-reverse justify-end gap-2 '
      }}
      className={className}
      type='Checkbox'
      onChange={(e) => {
        resetField(name, { defaultValue: e.target.value as any })
      }}
      {...rest}
    />
  )
}

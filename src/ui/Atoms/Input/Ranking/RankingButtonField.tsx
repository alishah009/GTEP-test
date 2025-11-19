/* eslint-disable @typescript-eslint/no-explicit-any */
import { RankingButton } from '@/ui/Atoms/Input/Ranking/RankingButton'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Responsive } from '@/ui/Atoms/Grid/Responsive'
import { getNestedError } from '@/ui/Atoms/Input/utils/getNestedError'

import { cn } from '@/ui/utils/cn'

export const RankingButtonField = ({
  label,
  name,
  required,
  error,
  classNames = {},
  responsive,
  ...rest
}: any) => {
  const methods = useFormContext()
  const {
    formState: { errors },
    clearErrors
  } = methods
 

  const getError = () => {
    return error || getNestedError(errors, name)
  }
  useEffect(() => {
    return () => {
      if (!name.includes('[')) {
        clearErrors(name)
      }
    }
  }, [name, clearErrors])

  const { root, ...restClasses } = classNames

  return (
    <Responsive responsive={responsive || [1, 1]} className={cn('flex flex-col gap-[6px]', root)}>
      <Controller
        name={name}
        control={methods.control}
        defaultValue={rest.defaultValue as unknown}
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
          <RankingButton
            {...field}
            {...rest}
            control={methods.control}
            setValue={methods.setValue}
            disabled={rest.disabled }
            label={label}
            classNames={restClasses}
            required={required}
            error={getError()}
          />
        )}
      ></Controller>
    </Responsive>
  )
}

RankingButtonField.displayName = 'RankingButtonField'

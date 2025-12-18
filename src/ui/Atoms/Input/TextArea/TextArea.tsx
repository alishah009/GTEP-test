import { TextAreaProps } from 'antd/es/input/TextArea'

import { Input } from 'antd'

import { CommonInputProps } from 'rc-input/lib/interface'

import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputClassNames, InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { useInputId } from '@/ui/utils/useInputId'
import { cn } from '@/ui/utils/cn'

type A = CommonInputProps['classNames']

export type ClassNames = InputClassNames & A

export interface Props extends TextAreaProps {
  name: string
  className?: string
  label: string
  error?: string
  placeholder?: string
  value?: string
  rows: number
  classNames?: ClassNames
  config?: InputConfig
}

export const TextArea = ({
  label,
  error,
  rows,
  required,
  config,
  className,
  classNames = {},
  name,
  ...rest
}: Props) => {
  const { label: labelClass, wrapper, ...restClasses } = classNames
  const inputId = useInputId(rest.id, name, 'textarea')

  return (
    <FieldWrapper
      config={config}
      className={wrapper}
      error={error}
      label={label}
      labelClass={labelClass}
      required={required}
      inputId={inputId}
    >
      <Input.TextArea
        {...rest}
        id={inputId}
        aria-labelledby={inputId ? `${inputId}-label` : undefined}
        rows={rows}
        className={cn(
          {
            'border-red-500 focus:border-red-500 hover:border-red-500 focus:shadow-ShadowError100':
              error
          },
          className
        )}
        classNames={restClasses}
      />
    </FieldWrapper>
  )
}

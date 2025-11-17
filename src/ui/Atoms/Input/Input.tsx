import { cn } from '@/ui/utils/cn'
import { Input as AntDInput, InputProps } from 'antd'

import { CommonInputProps } from 'rc-input/lib/interface'

import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputClassNames, InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { ReactNode } from 'react'
type InputSizes = {
  [key in InputSize]: string
}

export type InputFieldType = 'Numeric' | 'Alphabet' | 'Float' | 'AlphaNumeric'

export interface CustomInputProps extends Omit<InputProps, 'pattern'> {
  label?: string
  error?: string
  addonAfter?: ReactNode
  suffixComponent?: ReactNode
  prefixComponent?: ReactNode
  fieldType?: InputFieldType
  inputSize?: InputSize
  config?: InputConfig
  classNames?: CommonInputProps['classNames'] & InputClassNames
}

export type InputSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const InputSizeConfig: InputSizes = {
  '2xl':
    '!text-[18px]  !px-[28px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  lg: '!text-[16px] !px-[18px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  md: '!text-[14px] !px-[16px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  sm: '!text-[14px]   rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  xl: '!text-[16px]  !px-[20px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600'
}

export const Input = ({
  label,
  error,
  required,
  prefixComponent,
  suffixComponent,
  fieldType,
  inputSize,
  classNames = {},
  className,
  type,
  config,
  ...rest
}: CustomInputProps) => {
  const { label: labelClass, wrapper, ...restClasses } = classNames

  function suitableType(inputType: string | undefined | null) {
    switch (inputType) {
      case 'Numeric':
        return 'number'
      case 'Float':
        return 'number'
      case 'AlphaNumeric':
        return 'text'
      default:
        return type
    }
  }

  return (
    <FieldWrapper
      config={config}
      className={wrapper}
      error={error}
      label={label}
      labelClass={labelClass}
      required={required}
    >
      {/* Input Field */}
      <AntDInput
        {...rest}
        type={suitableType(fieldType)}
        prefix={prefixComponent}
        suffix={suffixComponent}
        classNames={restClasses}
        className={cn(InputSizeConfig[inputSize || 'sm'], className, {
          'border-red-500 focus:border-red-500 hover:!border-red-500 focus:shadow-ShadowError100 AddOnStyle':
            error
        })}
      />
    </FieldWrapper>
  )
}

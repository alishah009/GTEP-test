import { cn } from '@/ui/utils/cn'
import { Input as AntDInput, InputProps } from 'antd'

import { CommonInputProps } from 'rc-input/lib/interface'

import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputClassNames, InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { ReactNode, useId, ChangeEvent } from 'react'
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
    '!text-[18px]  !px-[28px] !py-[5px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  lg: '!text-[16px] !px-[18px] !py-[8px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  md: '!text-[15px] !px-[15px] !py-[7px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  sm: '!text-[14px] !px-[14px] !py-[5px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600',
  xl: '!text-[18px] !px-[20px] !py-[9px] rounded-[8px] bg-white border-solid w-full focus:outline-green-600'
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
  const generatedId = useId()
  const isEmail = type === 'email'

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

  // Handle checkbox type specially - wrap input in label for clickability
  if (type === 'Checkbox') {
    const { value, onChange, name, disabled, id, onBlur } = rest
    const inputId = id || name || `checkbox-${generatedId}`
    // Only treat null, undefined, or empty string as unset; values like 0 should be handled correctly
    const checked = value !== null && value !== undefined && value !== '' ? Boolean(value) : false

    // Define proper onChange handler for checkbox - accepts native ChangeEvent<HTMLInputElement>
    // Ant Design's InputProps onChange is compatible with native ChangeEvent<HTMLInputElement>
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        // onChange from InputProps accepts ChangeEvent<HTMLInputElement> for native inputs
        onChange(e)
      }
    }

    return (
      <FieldWrapper
        config={{ ...config, showLabel: false }}
        className={wrapper}
        error={error}
        label={label}
        labelClass={labelClass}
        required={required}
      >
        <label
          htmlFor={inputId}
          className={cn('flex items-center gap-[6px] cursor-pointer', labelClass)}
        >
          <input
            id={inputId}
            name={name}
            type='checkbox'
            checked={checked}
            onChange={handleCheckboxChange}
            onBlur={onBlur}
            disabled={disabled}
            className={cn(
              'cursor-pointer accent-primary-600',
              'focus:shadow-none focus:outline-none focus-visible:outline-none',
              className
            )}
          />
          {label && <span className='text-gray-base text-[12px] select-none'>{label}</span>}
        </label>
      </FieldWrapper>
    )
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
        // Use text type for email to avoid native browser validation tooltips; rely on custom validation instead.
        type={isEmail ? 'text' : suitableType(fieldType)}
        inputMode={isEmail ? 'email' : rest.inputMode}
        prefix={prefixComponent}
        suffix={suffixComponent}
        status={error ? 'error' : undefined}
        classNames={restClasses}
        className={cn(
          InputSizeConfig[inputSize || 'md'],
          '!border-[0.5px] !border-gray-300 !outline-none',
          'hover:!border-primary-600',
          'focus:!border-[0.5px] focus:!border-primary-600 focus:!ring-0 focus:!shadow-none focus:!outline-none',
          'focus-visible:!shadow-none focus-visible:!outline-none',
          'focus-within:!border-primary-600 focus-within:!shadow-none',
          className,
          {
            '!border-red-500 focus:!border-red-500 hover:!border-red-500 focus:!shadow-ShadowError100 focus:!outline-none':
              error
          }
        )}
      />
    </FieldWrapper>
  )
}

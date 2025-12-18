import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { useInputId } from '@/ui/utils/useInputId'
import { cn } from '@/ui/utils/cn'
import { Checkbox } from 'antd'
import React from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

type InputConfig = {
  showLabel?: boolean
  showError?: boolean
  showOptional?: boolean
}
export interface TestProps extends React.HTMLProps<HTMLSelectElement> {
  name: string
  className?: string
  label?: string
  classNames?: {
    wrapper?: string
    label?: string
  }
  config?: InputConfig
  error?: string
  placeholder?: string
  value?: string[]
  required?: boolean
  field?: ControllerRenderProps<FieldValues, string>
  constant: {
    key: string | number | readonly string[]
    value: string
  }[]
}

export const MultiCheckBox = ({
  label,
  classNames = {},
  error,
  className,
  constant,
  disabled,
  field,
  required,
  config,
  name
}: TestProps) => {
  const { label: labelClass, wrapper } = classNames
  const inputId = useInputId(undefined, name, 'multicheckbox')

  return (
    <FieldWrapper
      labelClass={labelClass}
      label={label}
      config={config}
      error={error}
      required={required}
      className={cn('flex flex-col gap-[6px]', wrapper)}
      inputId={inputId}
    >
      <div
        id={inputId}
        aria-labelledby={inputId ? `${inputId}-label` : undefined}
        style={{ width: '100%' }}
      >
        <Checkbox.Group {...field} className={className} disabled={disabled}>
          <div className='flex gap-[10px] flex-wrap'>
            {constant.map((item, index) => (
              <div key={index}>
                <Checkbox value={item.key}>{item.value}</Checkbox>
              </div>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </FieldWrapper>
  )
}

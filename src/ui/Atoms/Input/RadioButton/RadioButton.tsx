import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputClassNames, InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { useInputId } from '@/ui/utils/useInputId'
import { cn } from '@/ui/utils/cn'
import { Radio, RadioProps } from 'antd'
import { JSX } from 'react'
import { FieldValues, Path } from 'react-hook-form'

export type RadioButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Props<T, V> extends RadioProps, IResponsive {
  name: Path<T>
  label?: string
  required?: boolean
  error?: string
  classNames?: InputClassNames
  config?: InputConfig
  radioButtonSize?: RadioButtonSize
  defaultValue?: string | boolean | number
  renderer?: (value: V, checked: boolean, error?: boolean) => JSX.Element
  constant: {
    key: string | number | boolean | readonly string[] | undefined
    value: V
  }[]
}

export const RadioButton = <T extends FieldValues, V>({
  label,
  error,
  constant = [],
  required,
  renderer,
  className,
  classNames = {},
  config,
  responsive,
  name,
  ...rest
}: Props<T, V>) => {
  const { label: labelClass, wrapper } = classNames
  const inputId = useInputId(rest.id, name as string, 'radio')

  return (
    <Responsive responsive={responsive}>
      <FieldWrapper
        labelClass={labelClass}
        label={label}
        config={config}
        error={error}
        required={required}
        className={cn('flex flex-col gap-[6px]', wrapper)}
        inputId={inputId}
      >
        <div id={inputId} aria-labelledby={inputId ? `${inputId}-label` : undefined}>
          <Radio.Group {...rest} className={cn(className)}>
            {constant.map((item, index) => (
              <Radio type='button' key={index} value={item.key}>
                {renderer ? (
                  <div
                    onClick={() => {
                      if (rest.onChange) {
                        rest.onChange({
                          target: {
                            value: item.key
                          }
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } as any)
                      }
                    }}
                  >
                    {renderer(item.value, item.key === rest.value, !!error)}
                  </div>
                ) : (
                  (item.value as string)
                )}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </FieldWrapper>
    </Responsive>
  )
}

import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputClassNames, InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { ConditionalRender } from '@/ui/Atoms/Wrapper/ConditionalRender'
import { useInputId } from '@/ui/utils/useInputId'
import { cn } from '@/ui/utils/cn'
import { Select as AntSelect, SelectProps } from 'antd'
import { ReactNode } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

export type SelectSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Props extends Omit<SelectProps, 'classNames'> {
  name: string
  label?: string
  constant?:
    | { key: string | number | boolean | readonly string[] | undefined; value: string }[]
    | undefined
  mode?: 'multiple' | 'tags' | undefined
  error?: string
  required?: boolean
  prefixComponent?: ReactNode
  selectSize?: SelectSize
  classNames?: InputClassNames
  config?: InputConfig
  field?: ControllerRenderProps<FieldValues, string>
}

type SelectSizes = {
  [key in SelectSize]: string
}

const SelectSizeConfig: SelectSizes = {
  '2xl': '!text-[18px] h-[45px] !py-[16px] !px-[28px] ',
  lg: '!text-[16px] h-[45px] !py-[10px] !px-[18px] ',
  md: '!text-[14px] h-[45px] !py-[10px] !px-[16px]',
  sm: '!text-[14px] h-[45px] !py-[8px] !px-[12px]',
  xl: '!text-[16px] h-[45px] !py-[12px] !px-[20px]'
}

export const Select = ({
  label,
  constant,
  error,
  mode,
  required,
  prefixComponent,
  selectSize,
  className,
  config,
  showSearch = true,
  popupMatchSelectWidth = true,
  classNames = { label: '' },
  name,
  ...rest
}: Props) => {
  const { label: labelClass, wrapper } = classNames
  const inputId = useInputId(rest.id, name, 'select')

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
      <ConditionalRender render={!prefixComponent}>
        <AntSelect
          id={inputId}
          aria-labelledby={inputId ? `${inputId}-label` : undefined}
          popupMatchSelectWidth={popupMatchSelectWidth}
          {...rest}
          showSearch={showSearch}
          className={cn(
            SelectSizeConfig[selectSize || 'sm'],
            'w-full h-auto flex items-center text-gray-500 bg-white border border-gray-300 rounded-[8px]',
            className,
            {
              '!border-red-500 focus:!border-red-500 hover:!border-red-500 focus:shadow-ShadowError100':
                error
            }
          )}
          mode={mode}
          variant='borderless'
        >
          {constant?.map((item, index) => (
            <AntSelect.Option key={index} value={item.key}>
              <div className='text-wrap'>{item.value}</div>
            </AntSelect.Option>
          ))}
        </AntSelect>
      </ConditionalRender>
      <ConditionalRender render={!!prefixComponent}>
        <div className='border border-gray-300 rounded-[8px]'>
          <div className='flex items-center '>
            <div className={' text-center w-[10%]'}> {prefixComponent}</div>
            <AntSelect
              id={inputId}
              aria-labelledby={inputId ? `${inputId}-label` : undefined}
              {...rest}
              popupMatchSelectWidth={popupMatchSelectWidth}
              showSearch
              className={cn(
                SelectSizeConfig[selectSize || 'sm'],
                'w-full flex items-center text-gray-500 bg-white rounded-[8px]',
                className,
                {
                  '!border-red-500 focus:!border-red-500 hover:!border-red-500 focus:shadow-ShadowError100':
                    error
                }
              )}
              mode={mode}
              variant='borderless'
            >
              {constant?.map((item, index) => (
                <AntSelect.Option key={index} value={item.key}>
                  {item.value}
                </AntSelect.Option>
              ))}
            </AntSelect>
          </div>
        </div>
      </ConditionalRender>
    </FieldWrapper>
  )
}

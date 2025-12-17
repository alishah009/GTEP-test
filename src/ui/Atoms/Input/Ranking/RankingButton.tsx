/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { FieldWrapper } from '@/ui/Atoms/Input/utils/FieldWrapper'
import { InputClassNames, InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { useInputId } from '@/ui/utils/useInputId'
import { cn } from '@/ui/utils/cn'
import { Rate, RateProps } from 'antd'
import { useState } from 'react'
import { FieldValues, Path, UseFormSetValue } from 'react-hook-form'

export type RankingButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Props<T> extends RateProps, IResponsive {
  name: Path<T>
  label?: string
  required?: boolean
  error?: string
  classNames: InputClassNames
  config?: InputConfig
  radioButtonSize?: RankingButtonSize
  defaultValue?: number
  setValue: UseFormSetValue<FieldValues>
}

export const RankingButton = <T extends FieldValues>({
  label,
  error,
  required,
  classNames,
  config,
  responsive,
  setValue,
  ...rest
}: Props<T>) => {
  const [rankingValue, setRankingValue] = useState(0)
  const { label: labelClass, wrapper } = classNames
  const inputId = useInputId(rest.id, rest.name as string, 'ranking')

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
        <style>{`
          li.ant-rate-star {
            margin: 2vw 5vw; /* Vertical margin based on viewport width, horizontal margin as well */
            padding: 10px;    /* Keep padding fixed or adjust similarly if needed */
            background: #f0f0f0;
            border: 1px solid #ccc;
            text-align: center;
            box-sizing: border-box;
          }
        `}</style>
        <input type='hidden' name={rest?.name} value={rankingValue} />
        <Rate
          id={inputId}
          aria-labelledby={label ? `${inputId}-label` : undefined}
          disabled={rest.disabled}
          value={rest?.value}
          onChange={(value: any) => {
            setRankingValue(value)
            setValue(`${rest.name}`, value)
          }}
        />
      </FieldWrapper>
    </Responsive>
  )
}

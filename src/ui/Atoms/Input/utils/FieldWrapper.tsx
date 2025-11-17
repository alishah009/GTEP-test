import { Error } from '@/ui/Atoms/Input/utils/Error'
import { InputConfig } from '@/ui/Atoms/Input/utils/InputConfig'
import { FieldLabel, FieldLabelProps } from '@/ui/Atoms/Label/FieldLabel'
import { ConditionalRender } from '@/ui/Atoms/Wrapper/ConditionalRender'
import { cn } from '@/ui/utils/cn'
import { JSX } from 'react'

export interface FieldWrapperProps extends FieldLabelProps {
  children: JSX.Element | JSX.Element[]
  error?: string
  config?: InputConfig
  labelClass?: string
}
export const FieldWrapper = ({
  config = { showError: true, showLabel: true, showOptional: true, showLabelContainer: true },
  className,
  label,
  required,
  children,
  error,
  labelClass
}: FieldWrapperProps) => {
  config = {
    showError: true,
    showLabel: true,
    showOptional: true,
    showLabelContainer: true,
    ...config
  }

  return (
    <div className={cn('flex flex-col gap-y-[6px]', className)}>
      <FieldLabel
        config={{
          showLabel: config.showLabel,
          showOptional: config.showOptional,
          showLabelContainer: config.showLabelContainer
        }}
        className={labelClass}
        key='FormLabel'
        label={label}
        required={required}
      />
      {children}
      {/* Input Field Error
       * Render only is showError is true, and error object is not undefined
       */}
      <ConditionalRender render={config.showError}>
        <Error errorName={error} />
      </ConditionalRender>
    </div>
  )
}

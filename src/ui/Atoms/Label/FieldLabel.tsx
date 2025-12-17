import { OptionalText } from '@/ui/Atoms/Input/utils/OptionalText'
import { ConditionalRender } from '@/ui/Atoms/Wrapper/ConditionalRender'
import { cn } from '@/ui/utils/cn'

export interface FieldLabelProps {
  label?: string
  config?: {
    showLabel?: boolean
    showOptional?: boolean
    showLabelContainer?: boolean
  }
  required?: boolean
  className?: string
  inputId?: string
}

export const FieldLabel = ({
  className,
  config = { showLabel: true, showOptional: true, showLabelContainer: true },
  label,
  required,
  inputId
}: FieldLabelProps) => {
  {
    /* Input Field Label
     * Render and occupy height id showLabel is true
     * Will show optional text with label if showOptional is true and not required
     */
  }

  config = { showLabel: true, showOptional: true, showLabelContainer: true, ...config }

  const labelContent = (
    <ConditionalRender render={config.showLabel}>
      <>
        {label}
        <ConditionalRender render={config.showOptional && !required}>
          <OptionalText />
        </ConditionalRender>
      </>
    </ConditionalRender>
  )

  return (
    <ConditionalRender render={config.showLabelContainer}>
      {inputId ? (
        <label
          id={inputId ? `${inputId}-label` : undefined}
          htmlFor={inputId}
          className={cn('font-medium text-[14px] text-gray-base min-h-0', className)}
        >
          {labelContent}
        </label>
      ) : (
        <div className={cn('font-medium text-[14px] text-gray-base min-h-0', className)}>
          {labelContent}
        </div>
      )}
    </ConditionalRender>
  )
}

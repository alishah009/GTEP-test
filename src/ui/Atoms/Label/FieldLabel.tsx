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
}

export const FieldLabel = ({
  className,
  config = { showLabel: true, showOptional: true, showLabelContainer: true },
  label,
  required
}: FieldLabelProps) => {
  {
    /* Input Field Label
     * Render and occupy height id showLabel is true
     * Will show optional text with label if showOptional is true and not required
     */
  }

  config = { showLabel: true, showOptional: true, showLabelContainer: true, ...config }

  return (
    <ConditionalRender render={config.showLabelContainer}>
      <div
        className={cn('font-medium text-[14px] text-gray-base min-h-0', className)}
      >
        <ConditionalRender render={config.showLabel}>
          <>
            {label}
            <ConditionalRender render={config.showOptional && !required}>
              <OptionalText />
            </ConditionalRender>
          </>
        </ConditionalRender>
      </div>
    </ConditionalRender>
  )
}

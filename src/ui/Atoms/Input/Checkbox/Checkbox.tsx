import { CustomInputProps, Input } from '@/ui/Atoms/Input/Input'
import { cn } from '@/ui/utils/cn'

export const Checkbox = ({ label, classNames, ...rest }: CustomInputProps) => {
 

  return (
    <Input
      disabled={rest.disabled}
      label={label}
      config={{}}
      classNames={classNames}
      type='Checkbox'
      {...rest}
      className={cn('!px-2 !py-2 w-min')}
    />
  )
}

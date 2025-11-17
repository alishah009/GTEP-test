import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import {
  RadioButton,
  Props as RadioProps
} from '@/ui/Atoms/Input/RadioButton/RadioButton'
import { FieldValues, Path } from 'react-hook-form'

export interface Props<T> extends Omit<RadioProps<T, unknown>, 'constant'>, IResponsive {
  name: Path<T>
  label?: string
  required?: boolean
  defaultValue?: boolean
  error?: string
}

export const RadioButtonAction = <T extends FieldValues>({
  required,
  responsive,
  ...rest
}: Props<T>) => {
  return (
    <Responsive responsive={responsive}>
      <RadioButton
        {...rest}
        constant={[
          { key: 1, value: 'Yes' },
          { key: 0, value: 'No' }
        ]}
        required={required}
      ></RadioButton>
    </Responsive>
  )
}

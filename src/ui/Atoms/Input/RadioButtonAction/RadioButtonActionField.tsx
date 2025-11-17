import { Responsive } from '@/ui/Atoms/Grid/Responsive'
import {
  ChildrenProps,
  RadioButtonField
} from '@/ui/Atoms/Input/RadioButton/RadioButtonField'
import { FieldValues } from 'react-hook-form'

export const RadioButtonActionField = <T extends FieldValues>({
  name,
  responsive,
  ...rest
}: Omit<ChildrenProps<T>, 'constant'>) => {
  return (
    <Responsive responsive={responsive || [1, 2]}>
      <RadioButtonField
        name={name}
        defaultChecked={false}
        config={{ showOptional: false }}
        {...rest}
        required={true}
        constant={[
          { key: true, value: 'Yes' },
          { key: false, value: 'No' }
        ]}
      ></RadioButtonField>
    </Responsive>
  )
}

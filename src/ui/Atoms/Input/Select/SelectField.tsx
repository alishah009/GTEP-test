import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { Props, Select } from '@/ui/Atoms/Input/Select/Select'
import { InputFieldClassNames } from '@/ui/Atoms/Input/utils/InputConfig'
import { getNestedError } from '@/ui/Atoms/Input/utils/getNestedError'

import { cn } from '@/ui/utils/cn'
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form'

interface ChildrenProps<T> extends Props, IResponsive {
  name: Path<T>
}

interface SelectFieldProps<T extends FieldValues> extends ChildrenProps<T> {
  classNames?: InputFieldClassNames
}

export const SelectField = <T extends FieldValues>({
  label,
  constant,
  error,
  name,
  mode,
  required,
  prefixComponent,
  selectSize,
  responsive,
  className,
  classNames = {},
  disabled,
  showSearch,
  ...rest
}: SelectFieldProps<T>) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()


  const getError = () => {
    return error || getNestedError(errors, name)
  }

  const { root, ...restClasses } = classNames

  return (
    <Responsive
      responsive={responsive || [1, 1]}
      className={cn('flex flex-col gap-[6px] FormInput w-full ', root)}
    >
      <Controller
        name={name}
        control={control}
        defaultValue={rest.defaultValue}
        rules={{
          required: !required ? false : `${label || 'This'} is required!`
        }}
        render={({ field }) => {
          return (
            <Select
              {...rest}
              {...field}
              showSearch={showSearch}
              label={label}
              constant={constant}
              error={getError()}
              mode={mode}
              required={required}
              className={cn(className)}
              classNames={restClasses}
              prefixComponent={prefixComponent}
              selectSize={selectSize}
              disabled={disabled }
              filterOption={(input, option) => {
                return (
                  option?.props?.children?.props?.children
                    ?.toString()
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0 ||
                  option?.props?.value?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >=
                    0 ||
                  option?.props?.key?.toString()?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                )
              }}
            />
          )
        }}
      />
    </Responsive>
  )
}

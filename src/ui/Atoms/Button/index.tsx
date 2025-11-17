import {
  DangerButton,
  GrayOutlineButton,
  LinkDefaultButton,
  LinkGrayButton,
  PrimaryButton,
  PrimaryOutlineButton,
  SecondaryButton,
  SecondaryGrayButton,
  SuccessButton,
  TertiaryButton,
  TertiaryPrimaryButton
} from '@/ui/Atoms/Button/Button'
import { JSX } from 'react'

export {
  DangerButton,
  GrayOutlineButton,
  LinkDefaultButton,
  LinkGrayButton,
  PrimaryButton,
  SecondaryButton,
  SecondaryGrayButton,
  TertiaryButton,
  TertiaryPrimaryButton
}

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface NativeButtonProps extends React.HTMLProps<HTMLButtonElement> {
  PrefixIcon?: JSX.Element
  PostfixIcon?: JSX.Element
  loading?: boolean
  buttonSize?: ButtonSize
  type?: 'submit' | 'reset' | 'button'
}

export interface ButtonProps extends NativeButtonProps {
  Destructive?: boolean
}

export interface GenericButtonProps extends ButtonProps {
  buttonType:
    | 'LinkGray'
    | 'Secondary'
    | 'SecondaryGray'
    | 'Primary'
    | 'Tertiary'
    | 'TertiaryPrimary'
    | 'Link'
    | 'Success'
    | 'Danger'
    | 'GrayOutline'
    | 'PrimaryOutline'
}

export const Button = ({ buttonType, ...rest }: GenericButtonProps) => {
  switch (buttonType) {
    case 'Link':
      return <LinkDefaultButton {...rest} />
    case 'LinkGray':
      return <LinkGrayButton {...rest} />
    case 'Primary':
      return <PrimaryButton {...rest} />
    case 'Secondary':
      return <SecondaryButton {...rest} />
    case 'SecondaryGray':
      return <SecondaryGrayButton {...rest} />
    case 'Tertiary':
      return <TertiaryButton {...rest} />
    case 'TertiaryPrimary':
      return <TertiaryPrimaryButton {...rest} />
    case 'Success':
      return <SuccessButton {...rest} />
    case 'Danger':
      return <DangerButton {...rest} />
    case 'GrayOutline':
      return <GrayOutlineButton {...rest} />
    case 'PrimaryOutline':
      return <PrimaryOutlineButton {...rest} />
  }
}

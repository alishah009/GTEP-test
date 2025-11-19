import { JSX } from 'react'

export interface NativeButtonProps extends React.HTMLProps<HTMLButtonElement> {
  PrefixIcon?: JSX.Element
  PostfixIcon?: JSX.Element
  Destructive?: boolean
}

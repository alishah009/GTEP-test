import { JSX } from "react"

export const ConditionalRender = ({
  render,
  children
}: {
  render?: boolean
  children: JSX.Element[] | JSX.Element
}) => {
  if (render) {
    return <>{children}</>
  } else {
    return <></>
  }
}

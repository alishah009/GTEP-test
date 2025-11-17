import React from 'react'

type Props = {
  errorName?: string
}

export const Error = ({ errorName }: Props) => {
  return (
    <>{errorName && <span className='text-red-400 text-base font-medium mt-1'>{errorName}</span>}</>
  )
}

import Image from 'next/image'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex min-h-screen w-full flex-col bg-white lg:flex-row'>
      {/* Illustration panel */}
      <div className='relative hidden min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#fff5f3] lg:flex'>
        <Image
          src='/assets/elipse_top.png'
          alt=''
          width={600}
          height={600}
          priority
          className='pointer-events-none absolute -left-32 -top-24 w-[65%] max-w-[620px] select-none'
        />
        <Image
          src='/assets/elipse_bottom.png'
          alt=''
          width={600}
          height={600}
          priority
          className='pointer-events-none absolute -right-24 -bottom-32 w-[65%] max-w-[620px] select-none'
        />
        <Image
          src='/assets/pryze_main.png'
          alt='Product preview'
          width={900}
          height={600}
          priority
          className='relative z-10 max-w-[80%]'
        />
      </div>

      {/* Content panel */}
      <main className='flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[35%] lg:px-12'>
        <div className='w-full max-w-md  bg-white '>{children}</div>
      </main>
    </div>
  )
}

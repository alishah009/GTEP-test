'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLogin } from '@/hooks/mutation/useAuth'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { message } from 'antd'
import { Button } from '@/ui/Atoms/Button'

type LoginFormType = {
  email: string
  password: string
}
export default function LoginPage() {
  const methods = useForm<LoginFormType>({})

  const { handleSubmit } = methods
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync, isPending } = useLogin(messageApi)

  const login = async ({ email, password }: LoginFormType) => {
    try {
      await mutateAsync({ email, password })
    } catch {
      // noImp
    }
  }

  return (
    <div className='max-w-md mx-auto mt-20 p-6 bg-white rounded shadow'>
      <form
        onSubmit={handleSubmit(
          (e) => {
            login(e)
          },
          () => {
            // noImp
          }
        )}
        className='flex w-full flex-col items-center gap-[28px] self-stretch '
      >
        {contextHolder}

        <Image height={40} width={100} src='next.svg' className='mx-auto' alt='logo'></Image>
        <div className='text-lg font-medium'>Log In</div>
        <FormProvider {...methods}>
          <InputField label='Email' type='email' name='email' required={true} />
          <InputField label='Password' type='password' name='password' required={true} />
          {contextHolder}
          <Button
            buttonType='Primary'
            className='!w-full'
            type='submit'
            disabled={isPending}
            loading={isPending}
          >
            Log In
          </Button>
        </FormProvider>
      </form>

      <p className='text-center mt-4 text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/signup' className='text-blue-600 hover:underline'>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

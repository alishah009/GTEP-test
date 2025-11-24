'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLogin } from '@/hooks/mutation/useAuth'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { message } from 'antd'
import { Button } from '@/ui/Atoms/Button'
import { AuthLayout } from '@/layout/AuthLayout'

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
    <AuthLayout>
      <form
        onSubmit={handleSubmit(
          (e) => {
            login(e)
          },
          () => {
            // noImp
          }
        )}
        className='flex w-full flex-col items-center gap-[28px] self-stretch'
      >
        {contextHolder}
        <Image height={40} width={160} src='/gtep.png' className='self-start' alt='logo' />
        <div className='w-full text-left'>
          <h1 className='mt-2 text-2xl font-semibold'>Welcome!</h1>
          <p className='text-lg text-gray-500 '>Please sign in to continue</p>
        </div>

        <FormProvider {...methods}>
          <InputField label='Email' type='email' name='email' required={true} />
          <div className='w-full space-y-2'>
            <InputField label='Password' type='password' name='password' required={true} />
            <div className='flex w-full justify-end text-sm text-gray-500'>
              <Link
                href='/forgot-password'
                className='font-semibold text-primary-600 hover:text-primary-700'
              >
                Forgot password?
              </Link>
            </div>
          </div>

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
        <div className='text-center justify-between text-sm text-gray-500'>
          <p>
            New here?{' '}
            <Link href='/signup' className='font-semibold text-primary-600 hover:text-primary-700'>
              Create an account
            </Link>
          </p>

          <div />
        </div>
      </form>
    </AuthLayout>
  )
}

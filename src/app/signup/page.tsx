'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useSignup } from '@/hooks/mutation/useAuth'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { message } from 'antd'
import { Button } from '@/ui/Atoms/Button'
import { User } from '@/entity/User'
import { AuthLayout } from '@/layout/AuthLayout'

export default function SignUpPage() {
  const methods = useForm<User>({})

  const { handleSubmit } = methods
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync, isPending } = useSignup(messageApi)

  const login = async ({ email, password, full_name }: User) => {
    try {
      await mutateAsync({ email, password, full_name, id: '' })
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
          <h1 className='mt-2 text-2xl font-semibold '>Create an account</h1>
          <p className='text-lg text-gray-500'>Please fill in the form to create an account</p>
        </div>
        <FormProvider {...methods}>
          <InputField label='Full Name' name='full_name' required={true} />
          <InputField label='Email' type='email' name='email' required={true} />
          <InputField label='Password' type='password' name='password' required={true} />
          <Button
            buttonType='Primary'
            className='!w-full'
            type='submit'
            disabled={isPending}
            loading={isPending}
          >
            Sign Up
          </Button>
        </FormProvider>
        <p className='text-center mt-4 text-sm'>
          Already have an account?{' '}
          <Link href='/login' className='text-primary-600 hover:underline font-bold'>
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

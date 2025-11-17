'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useSignup } from '@/hooks/mutation/useAuth'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { message } from 'antd'
import { Button } from '@/ui/Atoms/Button'
import { User } from '@/entity/User'

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
        <div className='text-lg font-medium'>Sign Up</div>
        <FormProvider {...methods}>
          <InputField label='Full Name' name='full_name' required={true} />

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
            Sign Up
          </Button>
        </FormProvider>
      </form>

      <p className='text-center mt-4 text-sm'>
        Already have an account?{' '}
        <Link href='/login' className='text-blue-600 hover:underline'>
          Log In
        </Link>
      </p>
    </div>
  )
}

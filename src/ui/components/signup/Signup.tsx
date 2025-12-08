'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSignup } from '@/hooks/mutation/useAuth'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { message } from 'antd'
import { Button } from '@/ui/Atoms/Button'
import { User } from '@/entity/User'
import { useDictionary } from '@/hooks/i18n/useDictionary'

export function Signup() {
  const { dict, loading: dictLoading, locale } = useDictionary()
  const methods = useForm<User>({})

  const { handleSubmit } = methods
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync, isPending } = useSignup(messageApi)

  const signup = async ({ email, password, full_name }: User) => {
    try {
      await mutateAsync({ email, password, full_name, id: '' })
    } catch {
      // noImp
    }
  }

  if (!dict || dictLoading) {
    return null
  }

  return (
    <form
      onSubmit={handleSubmit(
        (e) => {
          signup(e)
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
        <h1 className='mt-2 text-2xl font-semibold '>{dict.auth.signup.title}</h1>
        <p className='text-lg text-gray-500'>{dict.auth.signup.subtitle}</p>
      </div>
      <FormProvider {...methods}>
        <InputField label={dict.auth.signup.fullName} name='full_name' required={true} />
        <InputField label={dict.auth.signup.email} type='email' name='email' required={true} />
        <InputField
          label={dict.auth.signup.password}
          type='password'
          name='password'
          required={true}
        />
        <Button
          buttonType='Primary'
          className='w-full!'
          type='submit'
          disabled={isPending}
          loading={isPending}
        >
          {dict.auth.signup.submitButton}
        </Button>
      </FormProvider>
      <p className='text-center mt-4 text-sm'>
        {dict.auth.signup.loginLink}{' '}
        <Link href={`/${locale}/login`} className='text-primary-600 hover:underline font-bold'>
          {dict.auth.signup.signIn}
        </Link>
      </p>
    </form>
  )
}

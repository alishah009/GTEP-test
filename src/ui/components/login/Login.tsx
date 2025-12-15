'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLogin } from '@/hooks/mutation/useAuth'
import { FormProvider, useForm } from 'react-hook-form'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { message } from 'antd'
import { Button } from '@/ui/Atoms/Button'
import { useDictionary } from '@/hooks/i18n/useDictionary'
import { CheckboxField } from '@/ui/Atoms/Input/Checkbox'

type LoginFormType = {
  email: string
  password: string
  rememberMe?: boolean
}

export function Login() {
  const { dict, loading: dictLoading, locale } = useDictionary()
  const methods = useForm<LoginFormType>({ defaultValues: { rememberMe: false } })

  const { handleSubmit } = methods
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync, isPending } = useLogin(messageApi, { redirectTo: `/${locale}/` })

  const login = async ({ email, password, rememberMe }: LoginFormType) => {
    try {
      await mutateAsync({ email, password, rememberMe })
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
        <h1 className='mt-2 text-[32px] font-semibold'>{dict.auth.login.title}</h1>
        <p className='text-[25px] text-gray-500'>{dict.auth.login.subtitle}</p>
      </div>

      <FormProvider {...methods}>
        <InputField
          label={dict.auth.login.email}
          type='email'
          name='email'
          required={true}
          className='px-[14px]! py-[16px]! rounded-[15px]!'
        />
        <div className='w-full space-y-[21px]'>
          <InputField
            label={dict.auth.login.password}
            type='password'
            name='password'
            required={true}
            className='px-[14px]! py-[16px]! rounded-[15px]!'
          />
          <div className='flex w-full items-center justify-between text-sm text-gray-500'>
            <CheckboxField
              name='rememberMe'
              label={
                (dict.auth.login as Record<string, string | undefined>).rememberMe ?? 'Remember me'
              }
              className='w-auto'
              classNames={{
                wrapper: 'flex-row items-center gap-[6px]',
                root: 'm-0 p-0'
              }}
              config={{ showOptional: false }}
            />
            <Link
              href={`/${locale}/forgot-password`}
              className='font-semibold text-primary-600 hover:text-primary-700'
            >
              {dict.auth.login.forgotPassword}
            </Link>
          </div>
        </div>

        <Button
          buttonType='Primary'
          className='w-full! h-[48px]! cursor-pointer'
          type='submit'
          disabled={isPending}
          loading={isPending}
        >
          {dict.auth.login.submitButton}
        </Button>
      </FormProvider>
      <div className='text-center justify-between text-sm text-gray-500'>
        <p>
          {dict.auth.login.signupLink}{' '}
          <Link
            href={`/${locale}/signup`}
            className='font-semibold text-primary-600 hover:text-primary-700'
          >
            {dict.auth.login.createAccount}
          </Link>
        </p>

        <div />
      </div>
    </form>
  )
}

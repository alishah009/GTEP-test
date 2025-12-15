'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useLogin } from '@/hooks/mutation/useAuth'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { Checkbox } from '@/ui/Atoms/Input/Checkbox/CheckboxField'
import { Button } from '@/ui/Atoms/Button'
import { useDictionary } from '@/hooks/i18n/useDictionary'

type LoginFormType = {
  email: string
  password: string
  rememberMe?: boolean
}

export function Login() {
  const { dict, loading: dictLoading, locale } = useDictionary()
  const methods = useForm<LoginFormType>({ defaultValues: { rememberMe: false } })
  const [showPassword, setShowPassword] = useState(false)

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
        <h1 className='mt-2 text-2xl font-semibold'>{dict.auth.login.title}</h1>
        <p className='text-lg text-gray-500 '>{dict.auth.login.subtitle}</p>
      </div>

      <FormProvider {...methods}>
        <InputField
          label={dict.auth.login.email}
          type='email'
          name='email'
          required={true}
          autoFocus
        />
        <div className='w-full space-y-2'>
          <InputField
            label={dict.auth.login.password}
            type={showPassword ? 'text' : 'password'}
            suffixComponent={
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className='flex h-full items-center text-gray-500 hover:text-primary-600'
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            }
            name='password'
            required={true}
          />
          <div className='flex w-full items-center justify-between text-sm text-gray-500'>
            <Checkbox
              name='rememberMe'
              label={
                (dict.auth.login as Record<string, string | undefined>).rememberMe ?? 'Remember me'
              }
              className='w-auto accent-primary-600'
              classNames={{
                wrapper: 'flex-row items-center gap-2',
                label: 'text-gray-900 text-sm',
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
          className='w-full!'
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

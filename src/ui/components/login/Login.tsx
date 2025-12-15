'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useLogin } from '@/hooks/mutation/useAuth'
import { InputField } from '@/ui/Atoms/Input/InputField'
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
        <p className='text-lg font-normal'>{dict.auth.login.subtitle}</p>
      </div>

      <FormProvider {...methods}>
        <InputField
          label={dict.auth.login.email}
          type='email'
          name='email'
          required={true}
          className='!px-[14px] !py-[16px] !rounded-[15px]'
          autoFocus
          classNames={{
            label: 'text-gray-500 font-medium text-sm' // Change this to any color you want, e.g., 'text-primary-600', 'text-red-500', etc.
          }}
        />
        <div className='w-full space-y-[21px]'>
          <InputField
            label={dict.auth.login.password}
            type={showPassword ? 'text' : 'password'}
            suffixComponent={
              <button
                type='button'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowPassword((prev) => !prev)
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className='flex h-full items-center cursor-pointer text-gray-500 hover:text-primary-600 [&_svg]:cursor-pointer'
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            }
            name='password'
            required={true}
            className='!px-[14px] !py-[16px] !rounded-[15px]'
            classNames={{
              label: 'text-gray-500 font-medium text-sm' // Change this to any color you want, e.g., 'text-primary-600', 'text-red-500', etc.
            }}
          />
          <div className='flex w-full items-center justify-between text-sm text-gray-500'>
            <CheckboxField
              name='rememberMe'
              label={
                (dict.auth.login as Record<string, string | undefined>).rememberMe ?? 'Remember Me'
              }
              className='w-auto'
              classNames={{
                wrapper: 'flex-row items-center gap-2',
                label: 'text-gray-900 text-sm',
                root: 'm-0 p-0'
              }}
              config={{ showOptional: false }}
            />
            <Link
              href={`/${locale}/forgot-password`}
              className='font-bold text-primary-600 hover:text-primary-700'
            >
              {dict.auth.login.forgotPassword}
            </Link>
          </div>
        </div>

        <Button
          buttonType='Primary'
          className='!w-full !h-[48px] cursor-pointer'
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

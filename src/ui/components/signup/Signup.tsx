'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { message, Alert } from 'antd'
import { useSignup } from '@/hooks/mutation/useAuth'
import { InputField } from '@/ui/Atoms/Input/InputField'
import { Button } from '@/ui/Atoms/Button'
import { User } from '@/entity/User'
import { useDictionary } from '@/hooks/i18n/useDictionary'

export function Signup() {
  const { dict, loading: dictLoading, locale } = useDictionary()
  const methods = useForm<User>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { handleSubmit } = methods
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync, isPending } = useSignup(messageApi)

  const signup = async ({ email, password, full_name }: User) => {
    try {
      await mutateAsync({ email, password, full_name, id: '' })
      setShowSuccessMessage(true)
    } catch {
      setShowSuccessMessage(false)
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
        <p className='text-lg font-normal'>{dict.auth.signup.subtitle}</p>
      </div>
      <FormProvider {...methods}>
        <InputField
          label={dict.auth.signup.fullName}
          name='full_name'
          required={true}
          classNames={{
            label: 'text-gray-500 font-medium text-sm' // Change this to any color you want, e.g., 'text-primary-600', 'text-red-500', etc.
          }}
        />
        <InputField
          label={dict.auth.signup.email}
          type='email'
          name='email'
          required={true}
          classNames={{
            label: 'text-gray-500 font-medium text-sm' // Change this to any color you want, e.g., 'text-primary-600', 'text-red-500', etc.
          }}
        />
        <InputField
          label={dict.auth.signup.password}
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
              {showPassword ? (
                <EyeInvisibleOutlined aria-hidden='true' />
              ) : (
                <EyeOutlined aria-hidden='true' />
              )}
            </button>
          }
          name='password'
          required={true}
          classNames={{
            label: 'text-gray-500 font-medium text-sm' // Change this to any color you want, e.g., 'text-primary-600', 'text-red-500', etc.
          }}
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
        {showSuccessMessage && (
          <Alert
            message='An email has been sent to you. Please verify your email and then login.'
            type='success'
            showIcon
            className='w-full'
            closable
            onClose={() => setShowSuccessMessage(false)}
          />
        )}
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

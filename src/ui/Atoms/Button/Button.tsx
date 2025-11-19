/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonProps, ButtonSize, NativeButtonProps } from '@/ui/Atoms/Button'
import { ConditionalRender } from '@/ui/Atoms/Wrapper/ConditionalRender'
import { cn } from '@/ui/utils/cn'
import { twMerge } from 'tailwind-merge'

type ButtonSizes = {
  [key in ButtonSize]: string
}

const ButtonSizeConfig: ButtonSizes = {
  '2xl': '!text-[18px] !py-[16px] !px-[28px]',
  lg: '!text-[16px] !py-[10px] !px-[18px]',
  md: '!text-[14px] !py-[10px] !px-[16px]',
  sm: '!text-[14px] !py-[8px] !px-[14px]',
  xl: '!text-[16px] !py-[12px] !px-[20px]'
}

const Button = ({
  className,
  onClick,
  children,
  loading,
  PrefixIcon,
  PostfixIcon,
  buttonSize,
  disabled,
  ...rest
}: NativeButtonProps) => (
  <button
    disabled={disabled || loading}
    className={twMerge(
      `${loading && 'cursor-wait'} ${ButtonSizeConfig[buttonSize || 'sm']} min-w-max`,
      className
    )}
    onKeyDown={(e) => {
      if (!loading && onClick && !disabled && e.key === 'Enter') {
         
        onClick(1 as any)
      }
    }}
    onClick={(e) => {
      if (!loading && onClick && !disabled) {
        onClick(e)
      }
    }}
    {...rest}
  >
    <>
      <ConditionalRender render={!loading}>
        <>
          {!!PrefixIcon && PrefixIcon}
          {children}
          {!!PostfixIcon && PostfixIcon}
        </>
      </ConditionalRender>

      <ConditionalRender render={loading}>
        <svg
          aria-hidden='true'
          className='w-5 h-5 animate-spin'
          viewBox='0 0 100 101'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
            fill='none'
          />
          <path
            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
            fill='currentColor'
          />
        </svg>
      </ConditionalRender>
    </>
  </button>
)

export const SecondaryGrayButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-xs py-[8px] px-[14px] font-semibold border-gray-300 text-gray-700 hover:text-gray-800 hover:bg-gray-50',
        'text-sm gap-[8px] bg-white w-max h-max border-[1px]  rounded-[8px]  focus:outline-none',
        {
          'border-error-300 text-error-700 hover:text-error-800 hover:bg-error-50': Destructive
        },
        { 'focus:shadow-ShadowError100': !disabled && Destructive },
        { 'focus:shadow-ShadowGray100': !disabled && !Destructive },
        {
          'text-error-300 bg-white border-error-200 cursor-no-drop hover:border-error-200 hover:bg-white hover:text-error-300':
            disabled && Destructive
        },
        {
          'text-gray-300 bg-white border-gray-200 cursor-no-drop hover:border-gray-200 hover:bg-white hover:text-gray-300 ':
            disabled && !Destructive
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const SecondaryButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      disabled={disabled}
      type={type as any}
      className={cn(
        'flex justify-center items-center shadow-xs py-[8px] px-[14px] font-semibold text-sm gap-[8px] bg-primary-50 border-primary-50 text-primary-700 hover:text-primary-800 hover:bg-primary-100   w-max h-max border-[1px]  rounded-[8px] focus:outline-none ',
        {
          'bg-error-50 border-error-50 text-error-700 hover:text-error-800 hover:bg-error-100':
            Destructive
        },
        {
          'focus:shadow-ShadowError100': !disabled && Destructive,
          'focus:shadow-ShadowPrimary100`': !disabled && !Destructive
        },
        {
          'cursor-no-drop': disabled,
          'text-error-300 bg-error-25 border-error-25  hover:border-error-25 hover:bg-error-25 hover:text-error-300':
            disabled && Destructive,
          'text-primary-300 bg-primary-25 border-primary-25  hover:border-primary-25 hover:bg-primary-25 hover:text-primary-300`':
            disabled && !Destructive
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const TertiaryButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      disabled={disabled}
      type={type as any}
      className={cn(
        'flex justify-center items-center shadow-xs py-[8px] px-[14px] focus:outline-none gap-[8px] font-semibold text-sm bg-none w-max h-max rounded-[8px] text-gray-600 hover:text-gray-700 hover:bg-gray-50',
        {
          'text-error-600 hover:text-error-700 hover:bg-error-50': Destructive
        },
        {
          'bg-none cursor-no-drop hover:!bg-transparent': disabled,
          'text-error-300    hover:text-error-300': disabled && Destructive,
          'text-gray-300  hover:text-gray-300': disabled && !Destructive
        },

        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const TertiaryPrimaryButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-xs py-[8px] px-[14px] gap-[8px] font-semibold text-sm bg-none w-max h-max rounded-[8px] text-primary-700 hover:text-primary-800 hover:bg-primary-50 focus:outline-none',
        {
          'text-error-700 hover:text-error-800 hover:bg-error-50': Destructive
        },
        {
          'cursor-no-drop hover:bg-transparent': disabled,
          'text-error-300  hover:text-error-300': disabled && Destructive,
          'text-gray-300  hover:text-gray-300 ': disabled && !Destructive
        },

        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const LinkGrayButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-xs py-[8px] px-[14px] gap-[8px] font-semibold text-sm bg-none w-max h-max rounded-[8px] focus:outline-none text-gray-600 hover:text-gray-700',
        { 'text-error-700 hover:text-error-800': Destructive },
        {
          'cursor-no-drop': disabled,
          'text-error-300  hover:bg-transparent hover:text-error-300': disabled && Destructive,
          'text-gray-300  hover:bg-transparent hover:text-gray-300': disabled && !Destructive
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const LinkDefaultButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      disabled={disabled}
      type={type}
      className={cn(
        'flex justify-center items-center shadow-xs py-[8px] px-[14px] gap-[8px] font-semibold text-sm bg-none w-max h-max rounded-[8px] text-primary-700 hover:text-primary-800 focus:outline-none',
        { 'text-error-700 hover:text-error-800': Destructive },
        {
          '!text-error-300 !bg-none cursor-no-drop hover:!bg-transparent hover:!text-error-300':
            Destructive && disabled
        },
        {
          '!text-gray-300 !bg-none cursor-no-drop hover:!bg-transparent hover:!text-gray-300 ':
            !Destructive && disabled
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const PrimaryButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      disabled={disabled}
      type={type}
      className={cn(
        'flex justify-center items-center shadow-ButtonPrimary py-[8px] px-[14px] gap-[8px] font-semibold text-sm w-max h-max',
        ' border-[1px] rounded-[8px] text-white hover:text-white focus:outline-none',
        'bg-primary-600 border-primary-600 hover:bg-primary-700',
        {
          'bg-error-600 border-error-600 hover:bg-error-700': Destructive,
          'focus:shadow-ShadowError100': Destructive && !disabled,
          'focus:shadow-ButtonFocus': !Destructive && !disabled
        },
        {
          'text-white cursor-no-drop hover:text-white': disabled,
          'bg-error-200 border-error-200  hover:border-error-200 hover:bg-error-200':
            Destructive && disabled,
          ' bg-primary-200 border-primary-200  hover:border-primary-200 hover:bg-primary-200':
            !Destructive && disabled
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const SuccessButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-ButtonPrimary py-[8px] px-[14px] gap-[8px] font-semibold text-sm bg-green-500 border-green-500 hover:bg-green-600 w-max h-max border-[1px] rounded-[8px] text-white hover:text-white focus:outline-none',
        {
          'bg-error-600 border-error-600 hover:bg-error-700': Destructive,
          'focus:shadow-ShadowError100': !disabled && Destructive,
          'focus:shadow-ShadowSuccess100': !disabled && Destructive
        },
        {
          'text-white cursor-no-drop hover:text-white': disabled,
          ' bg-error-200 border-error-200 c hover:border-error-200 hover:bg-error-200':
            Destructive && disabled,
          ' bg-success-200 border-success-200  hover:border-success-200 hover:bg-success-200':
            !Destructive && disabled
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const DangerButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-ButtonPrimary py-[8px] px-[14px] gap-[8px] font-semibold text-sm bg-error-600 border-error-600 hover:bg-error-700 w-max h-max border-[1px] rounded-[8px] text-white hover:text-white focus:outline-none',
        {
          'bg-error-600 border-error-600 hover:bg-error-700': Destructive,
          'focus:shadow-ShadowError100': !disabled && Destructive,
          'focus:shadow-ShadowSuccess100': !disabled && Destructive
        },
        {
          'text-white cursor-no-drop hover:text-white': disabled,
          ' bg-error-200 border-error-200 c hover:border-error-200 hover:bg-error-200':
            Destructive && disabled,
          ' bg-success-200 border-success-200  hover:border-success-200 hover:bg-success-200':
            !Destructive && disabled
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const GrayOutlineButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-ButtonPrimary py-[8px] px-[14px] gap-[8px] font-semibold text-sm text-gray-700  border-gray-300 hover:bg-gray-300 w-max h-max border-[1px] rounded-[8px] hover:text-white focus:outline-none',
        {
          'bg-error-600 border-error-600 hover:bg-error-700': Destructive,
          'focus:shadow-ShadowError100': !disabled && Destructive,
          'focus:shadow-ShadowSuccess100': !disabled && Destructive
        },
        {
          'text-white cursor-no-drop hover:text-white': disabled,
          ' bg-error-200 border-error-200 c hover:border-error-200 hover:bg-error-200':
            Destructive && disabled,
          ' bg-success-200 border-success-200  hover:border-success-200 hover:bg-success-200':
            !Destructive && disabled
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

export const PrimaryOutlineButton = ({
  children,
  disabled,
  type,
  PrefixIcon,
  PostfixIcon,
  Destructive,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <Button
      {...rest}
      type={type as any}
      disabled={disabled}
      className={cn(
        'flex justify-center items-center shadow-ButtonPrimary py-[8px] px-[14px] gap-[8px] font-semibold text-sm text-primary-600  border-primary-600 hover:bg-primary-600 w-max h-max border-[1px] rounded-[8px] hover:text-white focus:outline-none',
        {
          'bg-error-600 border-error-600 hover:bg-error-700': Destructive,
          'focus:shadow-ShadowError100': !disabled && Destructive,
          'focus:shadow-ShadowSuccess100': !disabled && Destructive
        },
        {
          'text-gray-400 cursor-no-drop hover:text-gray-400': disabled,
          ' bg-error-200 border-error-200 c hover:border-error-200 hover:bg-error-200':
            Destructive && disabled,
          '  border-primary-200  hover:border-primary-200 hover:bg-white': !Destructive && disabled
        },
        className
      )}
    >
      {!!PrefixIcon && PrefixIcon}
      {children}
      {!!PostfixIcon && PostfixIcon}
    </Button>
  )
}

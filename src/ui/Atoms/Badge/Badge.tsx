import { ConditionalRender } from '@/ui/Atoms/Wrapper/ConditionalRender'
import { cn } from '@/ui/utils/cn'
import { Tag as AntTag } from 'antd'
import { JSX } from 'react'

export type TagColor =
  | 'Gray'
  | 'Primary'
  | 'Error'
  | 'Warning'
  | 'Success'
  | 'BlueGray'
  | 'BlueLight'
  | 'Blue'
  | 'Indigo'
  | 'Purple'
  | 'Pink'
  | 'Rose'
  | 'Orange'
  | 'Green'

export const colorPool: TagColor[] = [
  'Gray',
  'Primary',
  'Error',
  'Warning',
  'Success',
  'BlueGray',
  'BlueLight',
  'Blue',
  'Indigo',
  'Purple',
  'Pink',
  'Rose',
  'Orange',
  'Green'
] as TagColor[]

export const TagColorConfig: {
  [key in TagColor]: { bg: string; text: string; icon: string; border: string }
} = {
  Blue: {
    bg: 'bg-[#EFF8FF]',
    text: 'text-[#175CD3]',
    icon: 'bg-[#2E90FA]',
    border: 'border-[#2E90FA]'
  },
  Gray: {
    bg: 'bg-gray-100',
    text: 'texy-gray-700',
    icon: 'bg-gray-500',
    border: 'border-gray-500'
  },
  Primary: {
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    icon: 'bg-primary-500',
    border: 'border-primary-500'
  },
  Error: {
    bg: 'bg-error-50',
    text: 'text-error-700',
    icon: 'bg-[#F04438]',
    border: 'border-[#F04438]'
  },
  Warning: {
    bg: 'bg-[#FFFAEB]',
    text: 'text-[#B54708]',
    icon: 'bg-[#F79009]',
    border: 'border-[#F79009]'
  },
  Success: {
    bg: 'bg-success-50',
    text: 'text-success-700',
    icon: 'bg-success-500',
    border: 'border-success-500'
  },
  BlueGray: {
    bg: 'bg-[#F8F9FC]',
    text: 'text-[#363F72]',
    icon: 'bg-[#4E5BA6]',
    border: 'border-[#4E5BA6]'
  },
  BlueLight: {
    bg: 'bg-[#F0F9FF]',
    text: 'text-[#026AA2]',
    icon: 'bg-[#0BA5EC]',
    border: 'border-[#0BA5EC]'
  },
  Indigo: {
    bg: 'bg-[#EEF4FF]',
    text: 'text-[#3538CD]',
    icon: 'bg-[#6172F3]',
    border: 'border-[#6172F3]'
  },
  Purple: {
    bg: 'bg-[#F4F3FF]',
    text: 'text-[#5925DC]',
    icon: 'bg-[#7A5AF8]',
    border: 'border-[#7A5AF8]'
  },
  Pink: {
    bg: 'bg-[#FDF2FA]',
    text: 'text-[#C11574]',
    icon: 'bg-[#EE46BC]',
    border: 'border-[#EE46BC]'
  },
  Rose: {
    bg: 'bg-[#FFF1F3]',
    text: 'text-[#C01048]',
    icon: 'bg-[#F63D68]',
    border: 'border-[#F63D68]'
  },
  Orange: {
    bg: 'bg-[#FFF4ED]',
    text: 'text-[#B93815]',
    icon: 'bg-[#EF6820]',
    border: 'border-[#EF6820]'
  },
  Green: {
    bg: 'bg-[#ECFDF3]',
    text: 'text-[#027A48]',
    icon: 'bg-[#12B76A]',
    border: 'border-[#12B76A]'
  }
}

type Size = 'sm' | 'md' | 'lg'

const SizeConfig: { [key in Size]: string } = {
  lg: 'pl-[12px] pr-[12px] py-[4px] text-[14px]',
  md: 'pl-[10px] pr-[10px] py-[2px] text-[14px]',
  sm: 'pl-[8px] pr-[8px] py-[2px] text-[12px]'
}

export const TagImp = ({
  PrefixIcon,
  PostfixIcon,
  dot,
  size = 'md',
  outline,
  color = 'Gray',
  children,
  className
}: TagProps) => {
  return (
    <AntTag
      className={cn(
        'rounded-[16px] border-none font-medium',
        TagColorConfig[color].text,
        TagColorConfig[color].bg,
        SizeConfig[size],
        TagColorConfig[color].border,
        { 'bg-transparent border-solid': outline },
        className
      )}
    >
      <div className='flex items-center gap-x-[4px]'>
        <ConditionalRender render={dot}>
          <div className={cn(`h-[8px] w-[8px] rounded-full `, TagColorConfig[color].icon)}></div>
        </ConditionalRender>
        <ConditionalRender render={!!PrefixIcon}>
          <div className={cn(` !bg-transparent`, TagColorConfig[color].icon)}>{PrefixIcon}</div>
        </ConditionalRender>
        <ConditionalRender render={!!children}>
          <div>{children}</div>
        </ConditionalRender>
        <ConditionalRender render={!!PostfixIcon}>
          <div className={cn(` !bg-transparent`, TagColorConfig[color].icon)}>{PostfixIcon}</div>
        </ConditionalRender>
      </div>
    </AntTag>
  )
}

export type TagProps = {
  color?: TagColor
  PrefixIcon?: JSX.Element
  PostfixIcon?: JSX.Element
  dot?: boolean
  size?: Size
  outline?: boolean
  children?: JSX.Element | string
  className?: string
}

export const Tag = ({ color = 'Gray', ...rest }: TagProps) => {
  return <TagImp color={color} {...rest} />
}

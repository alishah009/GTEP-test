import { cn } from '@/ui/utils/cn'

export interface IResponsive {
  responsive?: [number, number] | [number, number, number] | [number, number, number, number]
}

export interface IResponsiveComponent extends IResponsive {
  children?: React.ReactNode
  className?: string
}

export const Responsive = ({ responsive, children, className }: IResponsiveComponent) => {
  return (
    <div
      className={cn(
        {
          [`md:col-span-${responsive?.[1]} col-span-${responsive?.[0]}`]: responsive?.length === 2,
          [`lg:col-span-${responsive?.[2]} md:col-span-${responsive?.[1]} col-span-${responsive?.[0]}`]:
            responsive?.length === 3,
          [`lg:col-span-${responsive?.[3]} md:col-span-${responsive?.[2]} sm:col-span-${responsive?.[1]} col-span-${responsive?.[0]}`]:
            responsive?.length === 4
        },
        className
      )}
    >
      {children}
    </div>
  )
}

import { IResponsive, Responsive } from '@/ui/Atoms/Grid/Responsive'
import { cn } from '@/ui/utils/cn'

export interface IResponsiveGrid extends IResponsive {
  grid?: [number] | [number, number] | [number, number, number] | [number, number, number, number]
}

export interface IGridComponent extends IResponsiveGrid {
  children?: React.ReactNode
  className?: string
}

export const Grid = ({ children, className, grid, responsive }: IGridComponent) => {
  return (
    <Responsive
      responsive={responsive}
      className={cn(
        {
          'grid grid-cols-12': grid,
          [`grid-cols-${grid?.[0]}`]: grid?.length === 1,
          [`md:grid-cols-${grid?.[1]} grid-cols-${grid?.[0]}`]: grid?.length === 2,
          [`lg:grid-cols-${grid?.[2]} md:grid-cols-${grid?.[1]} grid-cols-${grid?.[0]}`]:
            responsive?.length === 3,
          [`lg:grid-cols-${grid?.[3]} md:grid-cols-${grid?.[2]} sm:grid-cols-${grid?.[1]} grid-cols-${grid?.[0]}`]:
            responsive?.length === 4
        },
        className
      )}
    >
      {children}
    </Responsive>
  )
}

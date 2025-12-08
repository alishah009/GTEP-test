/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { Tag, TagImp, TagColor, colorPool } from '@/ui/Atoms/Badge/Badge'

// Mock ConditionalRender component
jest.mock('@/ui/Atoms/Wrapper/ConditionalRender', () => ({
  ConditionalRender: ({ render: shouldRender, children }: any) => (shouldRender ? children : null)
}))

// Mock Ant Design Tag component
jest.mock('antd', () => ({
  Tag: ({ children, className }: any) => <span className={className} data-testid='ant-tag'>{children}</span>
}))

describe('Badge/Tag Component', () => {
  describe('Rendering', () => {
    it('renders with children text', () => {
      render(<Tag>Badge Text</Tag>)
      expect(screen.getByText('Badge Text')).toBeInTheDocument()
    })

    it('renders with children as JSX element', () => {
      render(
        <Tag>
          <span>JSX Badge</span>
        </Tag>
      )
      expect(screen.getByText('JSX Badge')).toBeInTheDocument()
    })

    it('renders TagImp component directly', () => {
      render(<TagImp>Direct Tag</TagImp>)
      expect(screen.getByText('Direct Tag')).toBeInTheDocument()
    })
  })

  describe('Default Values', () => {
    it('uses Gray color by default', () => {
      render(<Tag>Default Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toBeInTheDocument()
      expect(tag).toHaveClass('bg-gray-100')
    })

    it('uses md size by default', () => {
      render(<Tag>Default Size</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('text-[14px]')
    })
  })

  describe('Tag Colors', () => {
    const colors: TagColor[] = [
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
    ]

    colors.forEach((color) => {
      it(`renders with ${color} color`, () => {
        render(<Tag color={color}>{`${color} Badge`}</Tag>)
        expect(screen.getByText(`${color} Badge`)).toBeInTheDocument()
      })
    })

    it('renders Primary color badge', () => {
      render(<Tag color='Primary'>Primary Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('bg-primary-50')
      expect(tag).toHaveClass('text-primary-700')
    })

    it('renders Error color badge', () => {
      render(<Tag color='Error'>Error Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('bg-error-50')
      expect(tag).toHaveClass('text-error-700')
    })

    it('renders Success color badge', () => {
      render(<Tag color='Success'>Success Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('bg-success-50')
      expect(tag).toHaveClass('text-success-700')
    })

    it('renders Warning color badge', () => {
      render(<Tag color='Warning'>Warning Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('bg-[#FFFAEB]')
      expect(tag).toHaveClass('text-[#B54708]')
    })
  })

  describe('Tag Sizes', () => {
    it('renders with sm size', () => {
      render(<Tag size='sm'>Small Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('text-[12px]')
      expect(tag).toHaveClass('pl-[8px]')
      expect(tag).toHaveClass('pr-[8px]')
    })

    it('renders with md size', () => {
      render(<Tag size='md'>Medium Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('text-[14px]')
      expect(tag).toHaveClass('pl-[10px]')
      expect(tag).toHaveClass('pr-[10px]')
    })

    it('renders with lg size', () => {
      render(<Tag size='lg'>Large Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('text-[14px]')
      expect(tag).toHaveClass('pl-[12px]')
      expect(tag).toHaveClass('pr-[12px]')
    })
  })

  describe('Outline Variant', () => {
    it('renders with outline style', () => {
      render(<Tag outline>Outline Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('bg-transparent')
      expect(tag).toHaveClass('border-solid')
    })

    it('renders without outline by default', () => {
      render(<Tag>Regular Badge</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).not.toHaveClass('bg-transparent')
    })
  })

  describe('Dot Indicator', () => {
    it('renders dot when dot prop is true', () => {
      render(<Tag dot>With Dot</Tag>)
      const tag = screen.getByTestId('ant-tag')
      const dot = tag.querySelector('.rounded-full')
      expect(dot).toBeInTheDocument()
    })

    it('does not render dot by default', () => {
      render(<Tag>No Dot</Tag>)
      const tag = screen.getByTestId('ant-tag')
      const dot = tag.querySelector('.rounded-full')
      expect(dot).not.toBeInTheDocument()
    })

    it('renders dot with correct color classes', () => {
      render(<Tag dot color='Primary'>Primary Dot</Tag>)
      const tag = screen.getByTestId('ant-tag')
      const dot = tag.querySelector('.rounded-full')
      expect(dot).toBeInTheDocument()
      expect(dot).toHaveClass('bg-primary-500')
    })
  })

  describe('Icons', () => {
    it('renders PrefixIcon when provided', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>📝</span>
      render(<Tag PrefixIcon={PrefixIcon}>With Prefix</Tag>)

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      expect(screen.getByText('With Prefix')).toBeInTheDocument()
    })

    it('renders PostfixIcon when provided', () => {
      const PostfixIcon = <span data-testid='postfix-icon'>→</span>
      render(<Tag PostfixIcon={PostfixIcon}>With Postfix</Tag>)

      expect(screen.getByTestId('postfix-icon')).toBeInTheDocument()
      expect(screen.getByText('With Postfix')).toBeInTheDocument()
    })

    it('renders both PrefixIcon and PostfixIcon', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>📝</span>
      const PostfixIcon = <span data-testid='postfix-icon'>→</span>
      render(
        <Tag PrefixIcon={PrefixIcon} PostfixIcon={PostfixIcon}>
          With Icons
        </Tag>
      )

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      expect(screen.getByTestId('postfix-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icons')).toBeInTheDocument()
    })

    it('does not render icons when not provided', () => {
      render(<Tag>No Icons</Tag>)
      expect(screen.queryByTestId('prefix-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('postfix-icon')).not.toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      render(<Tag className='custom-badge-class'>Custom</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('custom-badge-class')
    })

    it('combines custom className with default classes', () => {
      render(<Tag className='my-custom-class'>Combined</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('my-custom-class')
      expect(tag).toHaveClass('rounded-[16px]')
    })
  })

  describe('Combined Props', () => {
    it('renders with color, size, and outline', () => {
      render(
        <Tag color='Primary' size='lg' outline>
          Combined Props
        </Tag>
      )
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('bg-transparent')
      expect(tag).toHaveClass('border-solid')
      expect(tag).toHaveClass('text-primary-700')
      expect(screen.getByText('Combined Props')).toBeInTheDocument()
    })

    it('renders with dot and icon', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>⭐</span>
      render(
        <Tag dot PrefixIcon={PrefixIcon} color='Success'>
          Dot and Icon
        </Tag>
      )

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      const tag = screen.getByTestId('ant-tag')
      const dot = tag.querySelector('.rounded-full')
      expect(dot).toBeInTheDocument()
      expect(screen.getByText('Dot and Icon')).toBeInTheDocument()
    })

    it('renders with all optional props', () => {
      const PrefixIcon = <span data-testid='prefix-icon'>📌</span>
      const PostfixIcon = <span data-testid='postfix-icon'>✓</span>
      render(
        <Tag
          color='Error'
          size='sm'
          outline
          dot
          PrefixIcon={PrefixIcon}
          PostfixIcon={PostfixIcon}
          className='full-featured'
        >
          Full Featured
        </Tag>
      )

      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument()
      expect(screen.getByTestId('postfix-icon')).toBeInTheDocument()
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('full-featured')
      expect(tag).toHaveClass('bg-transparent')
      expect(screen.getByText('Full Featured')).toBeInTheDocument()
    })
  })

  describe('Color Pool', () => {
    it('exports all colors in colorPool', () => {
      expect(colorPool).toContain('Gray')
      expect(colorPool).toContain('Primary')
      expect(colorPool).toContain('Error')
      expect(colorPool).toContain('Success')
      expect(colorPool.length).toBeGreaterThanOrEqual(14)
    })

    it('can render badges for all colors in colorPool', () => {
      colorPool.forEach((color) => {
        const { unmount } = render(<Tag color={color}>{`${color} Badge`}</Tag>)
        expect(screen.getByText(`${color} Badge`)).toBeInTheDocument()
        unmount()
      })
    })
  })

  describe('Edge Cases', () => {
    it('renders empty badge when no children provided', () => {
      render(<Tag></Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toBeInTheDocument()
    })

    it('handles empty string children', () => {
      render(<Tag>{''}</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toBeInTheDocument()
    })

    it('renders with number as children', () => {
      render(<Tag>123</Tag>)
      expect(screen.getByText('123')).toBeInTheDocument()
    })
  })

  describe('Styling Classes', () => {
    it('applies rounded corners', () => {
      render(<Tag>Rounded</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('rounded-[16px]')
    })

    it('applies border-none by default', () => {
      render(<Tag>No Border</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('border-none')
    })

    it('applies font-medium', () => {
      render(<Tag>Medium Font</Tag>)
      const tag = screen.getByTestId('ant-tag')
      expect(tag).toHaveClass('font-medium')
    })
  })
})


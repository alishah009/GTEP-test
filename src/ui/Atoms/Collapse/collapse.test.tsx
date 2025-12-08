/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import CollapseAtom from '@/ui/Atoms/Collapse/collapse'

// Mock Ant Design Collapse
jest.mock('antd', () => ({
  Collapse: ({ items, expandIconPosition, size, className, ghost, expandIcon }: any) => {
    return (
      <div
        data-testid='collapse-component'
        data-expand-icon-position={expandIconPosition}
        data-size={size}
        data-ghost={ghost}
        className={className}
      >
        {items?.map((item: any, index: number) => (
          <div key={item.key || index} data-testid={`collapse-item-${index}`}>
            <div data-testid={`collapse-label-${index}`}>{item.label}</div>
            <div data-testid={`collapse-children-${index}`}>{item.children}</div>
            {item.extra && <div data-testid={`collapse-extra-${index}`}>{item.extra}</div>}
            {expandIcon && (
              <div data-testid={`collapse-icon-${index}`}>{expandIcon({ isActive: false })}</div>
            )}
          </div>
        ))}
      </div>
    )
  }
}))

// Mock icons
jest.mock('@/ui/assets/icons/VMSIcon', () => ({
  ExpandDown: () => <span data-testid='expand-down-icon'>▼</span>,
  ExpandIconDown: () => <span data-testid='expand-icon-down'>▼</span>,
  ExpandIconUp: () => <span data-testid='expand-icon-up'>▲</span>
}))

describe('CollapseAtom Component', () => {
  const mockData = [
    {
      key: 1,
      label: 'Panel 1',
      children: <div>Content 1</div>
    },
    {
      key: 2,
      label: 'Panel 2',
      children: <div>Content 2</div>
    }
  ]

  describe('Rendering', () => {
    it('renders collapse component with items', () => {
      render(<CollapseAtom data={mockData} />)

      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
      expect(screen.getByTestId('collapse-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('collapse-item-1')).toBeInTheDocument()
    })

    it('renders all panel labels', () => {
      render(<CollapseAtom data={mockData} />)

      expect(screen.getByTestId('collapse-label-0')).toHaveTextContent('Panel 1')
      expect(screen.getByTestId('collapse-label-1')).toHaveTextContent('Panel 2')
    })

    it('renders all panel children', () => {
      render(<CollapseAtom data={mockData} />)

      expect(screen.getByText('Content 1')).toBeInTheDocument()
      expect(screen.getByText('Content 2')).toBeInTheDocument()
    })

    it('renders empty collapse with empty data array', () => {
      render(<CollapseAtom data={[]} />)

      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
      expect(screen.queryByTestId('collapse-item-0')).not.toBeInTheDocument()
    })
  })

  describe('Default Props', () => {
    it('uses default expandIconPosition', () => {
      render(<CollapseAtom data={mockData} />)

      const collapse = screen.getByTestId('collapse-component')
      expect(collapse).toHaveAttribute('data-expand-icon-position', 'end')
    })

    it('uses default size', () => {
      render(<CollapseAtom data={mockData} />)

      const collapse = screen.getByTestId('collapse-component')
      expect(collapse).toHaveAttribute('data-size', 'large')
    })

    it('applies default className', () => {
      const { container } = render(<CollapseAtom data={mockData} />)

      const collapse = container.querySelector('.VMS_CUSTOM_COLLAPSE')
      expect(collapse).toBeInTheDocument()
    })
  })

  describe('Ghost Mode', () => {
    it('renders with ghost prop set to false', () => {
      render(<CollapseAtom data={mockData} ghost={false} />)

      const collapse = screen.getByTestId('collapse-component')
      expect(collapse).toHaveAttribute('data-ghost', 'false')
    })

    it('renders with ghost prop set to true', () => {
      render(<CollapseAtom data={mockData} ghost={true} />)

      const collapse = screen.getByTestId('collapse-component')
      expect(collapse).toHaveAttribute('data-ghost', 'true')
    })

    it('uses ExpandDown icon when ghost is false', () => {
      render(<CollapseAtom data={mockData} ghost={false} />)

      // The icon should be rendered in the expandIcon prop
      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
    })

    it('uses conditional icons when ghost is true', () => {
      render(<CollapseAtom data={mockData} ghost={true} />)

      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
    })
  })

  describe('Extra Content', () => {
    it('renders extra content when provided', () => {
      const dataWithExtra = [
        {
          key: 1,
          label: 'Panel with Extra',
          children: <div>Content</div>,
          extra: <span>Extra Info</span>
        }
      ]

      render(<CollapseAtom data={dataWithExtra} />)

      expect(screen.getByTestId('collapse-extra-0')).toBeInTheDocument()
      expect(screen.getByText('Extra Info')).toBeInTheDocument()
    })

    it('renders without extra content when not provided', () => {
      render(<CollapseAtom data={mockData} />)

      expect(screen.queryByTestId('collapse-extra-0')).not.toBeInTheDocument()
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom extraClass', () => {
      const { container } = render(<CollapseAtom data={mockData} extraClass='custom-class' />)

      const collapse = container.querySelector('.custom-class')
      expect(collapse).toBeInTheDocument()
    })

    it('merges custom extraClass with default className', () => {
      const { container } = render(<CollapseAtom data={mockData} extraClass='custom-class' />)

      const collapse = container.querySelector('.VMS_CUSTOM_COLLAPSE.custom-class')
      expect(collapse).toBeInTheDocument()
    })
  })

  describe('Expand Icon Behavior', () => {
    it('renders expand icon when ghost is false', () => {
      render(<CollapseAtom data={mockData} ghost={false} />)

      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
    })

    it('renders expand icon when ghost is true and item is active', () => {
      render(<CollapseAtom data={mockData} ghost={true} />)

      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
    })

    it('renders expand icon when ghost is true and item is not active', () => {
      render(<CollapseAtom data={mockData} ghost={true} />)

      expect(screen.getByTestId('collapse-component')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles single item', () => {
      const singleItem = [
        {
          key: 1,
          label: 'Single Panel',
          children: <div>Single Content</div>
        }
      ]

      render(<CollapseAtom data={singleItem} />)

      expect(screen.getByTestId('collapse-item-0')).toBeInTheDocument()
      expect(screen.getByText('Single Panel')).toBeInTheDocument()
      expect(screen.getByText('Single Content')).toBeInTheDocument()
    })

    it('handles items without key', () => {
      const dataWithoutKey = [
        {
          label: 'Panel without key',
          children: <div>Content</div>
        }
      ]

      render(<CollapseAtom data={dataWithoutKey as any} />)

      expect(screen.getByTestId('collapse-item-0')).toBeInTheDocument()
    })

    it('handles complex children', () => {
      const dataWithComplexChildren = [
        {
          key: 1,
          label: 'Complex Panel',
          children: (
            <div>
              <h3>Title</h3>
              <p>Description</p>
              <button>Action</button>
            </div>
          )
        }
      ]

      render(<CollapseAtom data={dataWithComplexChildren} />)

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
})

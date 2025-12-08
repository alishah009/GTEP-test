import { render, screen } from '@testing-library/react'
import { Responsive } from '@/ui/Atoms/Grid/Responsive'

describe('Responsive Component', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <Responsive>
          <div data-testid='child'>Child Content</div>
        </Responsive>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('renders without responsive prop', () => {
      render(
        <Responsive>
          <div>Content</div>
        </Responsive>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <Responsive>
          <div data-testid='child-1'>Child 1</div>
          <div data-testid='child-2'>Child 2</div>
        </Responsive>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Responsive Breakpoints - 2 columns', () => {
    it('applies correct classes for 2-column responsive', () => {
      const { container } = render(
        <Responsive responsive={[6, 8]}>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('col-span-6')
      expect(element.className).toContain('md:col-span-8')
    })

    it('handles different 2-column values', () => {
      const { container } = render(
        <Responsive responsive={[12, 6]}>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('col-span-12')
      expect(element.className).toContain('md:col-span-6')
    })
  })

  describe('Responsive Breakpoints - 3 columns', () => {
    it('applies correct classes for 3-column responsive', () => {
      const { container } = render(
        <Responsive responsive={[12, 6, 4]}>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('col-span-12')
      expect(element.className).toContain('md:col-span-6')
      expect(element.className).toContain('lg:col-span-4')
    })

    it('handles different 3-column values', () => {
      const { container } = render(
        <Responsive responsive={[6, 4, 3]}>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('col-span-6')
      expect(element.className).toContain('md:col-span-4')
      expect(element.className).toContain('lg:col-span-3')
    })
  })

  describe('Responsive Breakpoints - 4 columns', () => {
    it('applies correct classes for 4-column responsive', () => {
      const { container } = render(
        <Responsive responsive={[12, 6, 4, 3]}>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('col-span-12')
      expect(element.className).toContain('sm:col-span-6')
      expect(element.className).toContain('md:col-span-4')
      expect(element.className).toContain('lg:col-span-3')
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Responsive className='custom-class'>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('custom-class')
    })

    it('merges custom className with responsive classes', () => {
      const { container } = render(
        <Responsive responsive={[6, 8]} className='custom-class'>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('custom-class')
      expect(element.className).toContain('col-span-6')
      expect(element.className).toContain('md:col-span-8')
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined responsive prop', () => {
      render(
        <Responsive responsive={undefined}>
          <div>Content</div>
        </Responsive>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles empty children', () => {
      render(<Responsive>{null}</Responsive>)

      // Should render without error
      expect(true).toBe(true)
    })

    it('handles single column value in array (edge case)', () => {
      const { container } = render(
        <Responsive responsive={[12] as any}>
          <div>Content</div>
        </Responsive>
      )

      const element = container.firstChild as HTMLElement
      expect(element).toBeInTheDocument()
    })
  })

  describe('Nested Components', () => {
    it('renders nested components correctly', () => {
      const NestedComponent = () => <div data-testid='nested'>Nested</div>

      render(
        <Responsive>
          <NestedComponent />
        </Responsive>
      )

      expect(screen.getByTestId('nested')).toBeInTheDocument()
    })

    it('preserves component hierarchy', () => {
      render(
        <Responsive>
          <div data-testid='wrapper'>
            <div data-testid='inner'>Inner Content</div>
          </div>
        </Responsive>
      )

      expect(screen.getByTestId('wrapper')).toBeInTheDocument()
      expect(screen.getByTestId('inner')).toBeInTheDocument()
    })
  })
})


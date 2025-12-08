/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { Grid } from '@/ui/Atoms/Grid/Grid'

// Mock Responsive component
jest.mock('@/ui/Atoms/Grid/Responsive', () => ({
  Responsive: ({ children, className, responsive }: any) => (
    <div className={className} data-responsive={JSON.stringify(responsive)}>
      {children}
    </div>
  )
}))

describe('Grid Component', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <Grid>
          <div data-testid='child'>Child Content</div>
        </Grid>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <Grid>
          <div data-testid='child-1'>Child 1</div>
          <div data-testid='child-2'>Child 2</div>
        </Grid>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Grid Layout - Single Column', () => {
    it('applies grid-cols class for single column grid', () => {
      const { container } = render(
        <Grid grid={[12]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid')
      expect(element.className).toContain('grid-cols-12')
    })

    it('handles different single column values', () => {
      const { container } = render(
        <Grid grid={[6]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid-cols-6')
    })
  })

  describe('Grid Layout - Two Columns', () => {
    it('applies correct classes for 2-column grid', () => {
      const { container } = render(
        <Grid grid={[6, 8]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid')
      expect(element.className).toContain('grid-cols-6')
      expect(element.className).toContain('md:grid-cols-8')
    })

    it('handles different 2-column values', () => {
      const { container } = render(
        <Grid grid={[12, 6]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid-cols-12')
      expect(element.className).toContain('md:grid-cols-6')
    })
  })

  describe('Grid Layout - Three Columns', () => {
    it('applies correct classes for 3-column grid when responsive length is 3', () => {
      const { container } = render(
        <Grid grid={[12, 6, 4]} responsive={[12, 6, 4]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid')
      expect(element.className).toContain('grid-cols-12')
      expect(element.className).toContain('md:grid-cols-6')
      expect(element.className).toContain('lg:grid-cols-4')
    })

    it('handles different 3-column values when responsive length is 3', () => {
      const { container } = render(
        <Grid grid={[6, 4, 3]} responsive={[6, 4, 3]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid-cols-6')
      expect(element.className).toContain('md:grid-cols-4')
      expect(element.className).toContain('lg:grid-cols-3')
    })
  })

  describe('Grid Layout - Four Columns', () => {
    it('applies correct classes for 4-column grid when responsive length is 4', () => {
      const { container } = render(
        <Grid grid={[12, 6, 4, 3]} responsive={[12, 6, 4, 3]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('grid')
      // For 4-column, it uses responsive length to determine breakpoints
      expect(element.className).toContain('grid-cols-12')
    })
  })

  describe('Custom ClassName', () => {
    it('applies custom className', () => {
      const { container } = render(
        <Grid className='custom-class'>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('custom-class')
    })

    it('merges custom className with grid classes', () => {
      const { container } = render(
        <Grid grid={[12]} className='custom-class'>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      expect(element.className).toContain('custom-class')
      expect(element.className).toContain('grid')
      expect(element.className).toContain('grid-cols-12')
    })
  })

  describe('Responsive Prop', () => {
    it('passes responsive prop to Responsive component', () => {
      const { container } = render(
        <Grid responsive={[6, 8]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      const responsive = element.getAttribute('data-responsive')
      expect(responsive).toBe(JSON.stringify([6, 8]))
    })

    it('handles 3-column responsive', () => {
      const { container } = render(
        <Grid responsive={[12, 6, 4]}>
          <div>Content</div>
        </Grid>
      )

      const element = container.firstChild as HTMLElement
      const responsive = element.getAttribute('data-responsive')
      expect(responsive).toBe(JSON.stringify([12, 6, 4]))
    })
  })

  describe('Grid Without Props', () => {
    it('renders without grid prop', () => {
      render(
        <Grid>
          <div>Content</div>
        </Grid>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders without responsive prop', () => {
      render(
        <Grid grid={[12]}>
          <div>Content</div>
        </Grid>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined grid prop', () => {
      render(
        <Grid grid={undefined}>
          <div>Content</div>
        </Grid>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('handles empty children', () => {
      render(<Grid>{null}</Grid>)

      // Should render without error
      expect(true).toBe(true)
    })

    it('handles nested components', () => {
      const NestedComponent = () => <div data-testid='nested'>Nested</div>

      render(
        <Grid>
          <NestedComponent />
        </Grid>
      )

      expect(screen.getByTestId('nested')).toBeInTheDocument()
    })
  })
})

import { render, screen } from '@testing-library/react'
import { ConditionalRender } from '@/ui/Atoms/Wrapper/ConditionalRender'

describe('ConditionalRender Component', () => {
  describe('Rendering', () => {
    it('renders children when render prop is true', () => {
      render(
        <ConditionalRender render={true}>
          <div data-testid='test-content'>Test Content</div>
        </ConditionalRender>
      )

      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('does not render children when render prop is false', () => {
      render(
        <ConditionalRender render={false}>
          <div data-testid='test-content'>Test Content</div>
        </ConditionalRender>
      )

      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument()
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('does not render children when render prop is undefined', () => {
      render(
        <ConditionalRender render={undefined}>
          <div data-testid='test-content'>Test Content</div>
        </ConditionalRender>
      )

      expect(screen.queryByTestId('test-content')).not.toBeInTheDocument()
    })

    it('renders multiple children when render is true', () => {
      render(
        <ConditionalRender render={true}>
          <div data-testid='child-1'>Child 1</div>
          <div data-testid='child-2'>Child 2</div>
          <div data-testid='child-3'>Child 3</div>
        </ConditionalRender>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })
  })

  describe('Boolean Conditions', () => {
    it('renders when render prop is explicitly true', () => {
      const shouldRender = true
      render(
        <ConditionalRender render={shouldRender}>
          <span>Visible Content</span>
        </ConditionalRender>
      )

      expect(screen.getByText('Visible Content')).toBeInTheDocument()
    })

    it('does not render when render prop is explicitly false', () => {
      const shouldRender = false
      render(
        <ConditionalRender render={shouldRender}>
          <span>Hidden Content</span>
        </ConditionalRender>
      )

      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument()
    })
  })

  describe('Dynamic Rendering', () => {
    it('updates when render prop changes from false to true', () => {
      const { rerender } = render(
        <ConditionalRender render={false}>
          <div data-testid='dynamic-content'>Dynamic Content</div>
        </ConditionalRender>
      )

      expect(screen.queryByTestId('dynamic-content')).not.toBeInTheDocument()

      rerender(
        <ConditionalRender render={true}>
          <div data-testid='dynamic-content'>Dynamic Content</div>
        </ConditionalRender>
      )

      expect(screen.getByTestId('dynamic-content')).toBeInTheDocument()
    })

    it('updates when render prop changes from true to false', () => {
      const { rerender } = render(
        <ConditionalRender render={true}>
          <div data-testid='dynamic-content'>Dynamic Content</div>
        </ConditionalRender>
      )

      expect(screen.getByTestId('dynamic-content')).toBeInTheDocument()

      rerender(
        <ConditionalRender render={false}>
          <div data-testid='dynamic-content'>Dynamic Content</div>
        </ConditionalRender>
      )

      expect(screen.queryByTestId('dynamic-content')).not.toBeInTheDocument()
    })
  })

  describe('Children Types', () => {
    it('renders single element child', () => {
      render(
        <ConditionalRender render={true}>
          <div>Single Child</div>
        </ConditionalRender>
      )

      expect(screen.getByText('Single Child')).toBeInTheDocument()
    })

    it('renders array of children', () => {
      render(
        <ConditionalRender render={true}>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </ConditionalRender>
      )

      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
      expect(screen.getByText('Third')).toBeInTheDocument()
    })

    it('renders nested components', () => {
      const NestedComponent = () => <div data-testid='nested'>Nested</div>

      render(
        <ConditionalRender render={true}>
          <NestedComponent />
        </ConditionalRender>
      )

      expect(screen.getByTestId('nested')).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('renders empty fragment when render is false', () => {
      const { container } = render(
        <ConditionalRender render={false}>
          <div>Should not render</div>
        </ConditionalRender>
      )

      // When render is false, it returns empty fragment, so container should be empty or have no visible content
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument()
    })

    it('handles empty fragment children gracefully', () => {
      render(
        <ConditionalRender render={true}>
          <></>
        </ConditionalRender>
      )

      // Should not throw error
      expect(true).toBe(true)
    })
  })
})


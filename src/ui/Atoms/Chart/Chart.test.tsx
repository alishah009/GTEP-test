/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock chart.js first (before imports)
jest.mock('chart.js', () => {
  const mockRegister = jest.fn()
  return {
    Chart: {
      register: mockRegister
    },
    CategoryScale: {},
    LinearScale: {},
    PointElement: {},
    LineElement: {},
    Title: {},
    Tooltip: {},
    Legend: {},
    TimeScale: {},
    TimeSeriesScale: {}
  }
})

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div
      data-testid='chart-line'
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
    >
      Chart Line Component
    </div>
  )
}))

import { render, screen } from '@testing-library/react'
import ChartAtom from '@/ui/Atoms/Chart/Chart'

describe('ChartAtom Component', () => {
  const mockChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Sales',
        data: [10, 20, 30]
      }
    ]
  }

  const mockChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    }
  }

  describe('Rendering', () => {
    it('renders Line chart component', () => {
      render(<ChartAtom data={mockChartData} options={mockChartOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })

    it('passes data prop to Line component', () => {
      render(<ChartAtom data={mockChartData} options={mockChartOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartData = chart.getAttribute('data-chart-data')
      expect(chartData).toBe(JSON.stringify(mockChartData))
    })

    it('passes options prop to Line component', () => {
      render(<ChartAtom data={mockChartData} options={mockChartOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartOptions = chart.getAttribute('data-chart-options')
      expect(chartOptions).toBe(JSON.stringify(mockChartOptions))
    })
  })

  describe('Chart Data', () => {
    it('renders chart with labels and datasets', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [1, 2, 3]
          }
        ]
      }

      render(<ChartAtom data={data} options={mockChartOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartData = chart.getAttribute('data-chart-data')
      expect(chartData).toContain('A')
      expect(chartData).toContain('B')
      expect(chartData).toContain('C')
    })

    it('renders chart with multiple datasets', () => {
      const data = {
        labels: ['Jan', 'Feb'],
        datasets: [
          {
            label: 'Sales',
            data: [10, 20]
          },
          {
            label: 'Profit',
            data: [5, 15]
          }
        ]
      }

      render(<ChartAtom data={data} options={mockChartOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartData = chart.getAttribute('data-chart-data')
      expect(chartData).toContain('Sales')
      expect(chartData).toContain('Profit')
    })

    it('handles empty data', () => {
      const emptyData = {
        labels: [],
        datasets: []
      }

      render(<ChartAtom data={emptyData} options={mockChartOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })
  })

  describe('Chart Options', () => {
    it('renders chart with custom options', () => {
      const customOptions = {
        responsive: false,
        plugins: {
          legend: {
            position: 'bottom' as const
          },
          title: {
            display: true,
            text: 'Custom Chart'
          }
        }
      }

      render(<ChartAtom data={mockChartData} options={customOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartOptions = chart.getAttribute('data-chart-options')
      expect(chartOptions).toContain('Custom Chart')
      expect(chartOptions).toContain('bottom')
    })

    it('handles minimal options', () => {
      const minimalOptions = {}

      render(<ChartAtom data={mockChartData} options={minimalOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })

    it('handles complex options structure', () => {
      const complexOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top' as const
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }

      render(<ChartAtom data={mockChartData} options={complexOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartOptions = chart.getAttribute('data-chart-options')
      expect(chartOptions).toBeTruthy()
    })
  })

  describe('Component Props', () => {
    it('accepts any data structure', () => {
      const anyData = {
        labels: ['X', 'Y'],
        datasets: [
          {
            data: [100, 200],
            backgroundColor: 'red'
          }
        ]
      } as any

      render(<ChartAtom data={anyData} options={mockChartOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })

    it('accepts any options structure', () => {
      const anyOptions = {
        custom: 'option',
        nested: {
          value: true
        }
      } as any

      render(<ChartAtom data={mockChartData} options={anyOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined data gracefully', () => {
      render(<ChartAtom data={undefined as any} options={mockChartOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })

    it('handles undefined options gracefully', () => {
      render(<ChartAtom data={mockChartData} options={undefined as any} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })

    it('handles null data', () => {
      render(<ChartAtom data={null as any} options={mockChartOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })

    it('handles null options', () => {
      render(<ChartAtom data={mockChartData} options={null as any} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('renders complete chart with both data and options', () => {
      render(<ChartAtom data={mockChartData} options={mockChartOptions} />)

      const chart = screen.getByTestId('chart-line')
      expect(chart).toBeInTheDocument()
      expect(chart.getAttribute('data-chart-data')).toBeTruthy()
      expect(chart.getAttribute('data-chart-options')).toBeTruthy()
    })

    it('updates when props change', () => {
      const { rerender } = render(<ChartAtom data={mockChartData} options={mockChartOptions} />)

      expect(screen.getByTestId('chart-line')).toBeInTheDocument()

      const newData = {
        labels: ['Apr', 'May'],
        datasets: [
          {
            label: 'New Data',
            data: [40, 50]
          }
        ]
      }

      rerender(<ChartAtom data={newData} options={mockChartOptions} />)

      const chart = screen.getByTestId('chart-line')
      const chartData = chart.getAttribute('data-chart-data')
      expect(chartData).toContain('Apr')
      expect(chartData).toContain('May')
    })
  })
})

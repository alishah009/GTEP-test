/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
)

interface ChartProps {
  data: any
  options: any
}

const ChartAtom = ({ options, data }: ChartProps) => {
  return <Line options={options} data={data} />
}

export default ChartAtom

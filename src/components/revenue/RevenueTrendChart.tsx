import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../../lib/utils'
import type { MonthlyRevenue } from '../../types'
import './RevenueTrendChart.css'

interface RevenueTrendChartProps {
  data: MonthlyRevenue[]
}

function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#a8a8a8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
            tick={{ fill: '#a8a8a8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 13,
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={((value: any, name: any) => [
              formatCurrency(Number(value) || 0),
              name === 'mrr' ? 'Actual MRR' : 'Target',
            ]) as any}
            labelStyle={{ color: '#a8a8a8', marginBottom: 4 }}
          />
          <Bar dataKey="mrr" fill="#FFEB03" radius={[4, 4, 0, 0]} name="mrr" />
          <Line
            dataKey="target"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            name="target"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueTrendChart

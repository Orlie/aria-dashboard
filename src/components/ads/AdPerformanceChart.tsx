import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useAdsStore } from '../../stores/ads-store'
import { formatCurrency, formatDateShort } from '../../lib/utils'

interface AdPerformanceChartProps {
  campaignId: string
}

function AdPerformanceChart({ campaignId }: AdPerformanceChartProps) {
  const { getLogsForCampaign } = useAdsStore()
  const logs = getLogsForCampaign(campaignId)

  if (logs.length === 0) {
    return (
      <div className="text-muted" style={{ padding: '20px 0', textAlign: 'center', fontSize: 13 }}>
        No data to display. Log daily performance to see trends.
      </div>
    )
  }

  const chartData = logs.map((log) => ({
    date: formatDateShort(log.date),
    roas: Number(log.roas.toFixed(2)),
    spend: log.spend,
    gmv: log.gmv,
  }))

  return (
    <div className="chart-container" style={{ marginTop: 12 }}>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a8a8a8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#a8a8a8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value: number) =>
              value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`
            }
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
            formatter={((value: any, name: any) => {
              if (name === 'roas') return [`${Number(value).toFixed(2)}x`, 'ROAS']
              return [formatCurrency(Number(value) || 0), name === 'spend' ? 'Spend' : 'GMV']
            }) as any}
            labelStyle={{ color: '#a8a8a8', marginBottom: 4 }}
          />
          <ReferenceLine
            yAxisId="left"
            y={1.5}
            stroke="var(--aria-red)"
            strokeDasharray="4 4"
            label={{ value: 'Min', position: 'left', fill: 'var(--aria-red)', fontSize: 10 }}
          />
          <ReferenceLine
            yAxisId="left"
            y={4.0}
            stroke="var(--aria-green)"
            strokeDasharray="4 4"
            label={{ value: 'Scale', position: 'left', fill: 'var(--aria-green)', fontSize: 10 }}
          />
          <Bar
            yAxisId="right"
            dataKey="spend"
            fill="var(--aria-blue)"
            fillOpacity={0.3}
            radius={[4, 4, 0, 0]}
            name="spend"
          />
          <Line
            yAxisId="left"
            dataKey="roas"
            stroke="var(--aria-yellow)"
            strokeWidth={2}
            dot={{ fill: 'var(--aria-yellow)', r: 3 }}
            name="roas"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AdPerformanceChart

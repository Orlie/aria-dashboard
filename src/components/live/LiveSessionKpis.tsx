import KpiCard from '../shared/KpiCard'
import { formatCurrency } from '../../lib/utils'
import type { LiveSession } from '../../types'

interface LiveSessionKpisProps {
  sessions: LiveSession[]
  label?: string
}

function LiveSessionKpis({ sessions, label }: LiveSessionKpisProps) {
  const totalSessions = sessions.length
  const totalGmv = sessions.reduce((sum, s) => sum + s.gmv, 0)
  const avgViewers =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.averageViewers, 0) / totalSessions
        )
      : 0
  const avgGmvPerSession = totalSessions > 0 ? totalGmv / totalSessions : 0
  const bestGmv =
    totalSessions > 0 ? Math.max(...sessions.map((s) => s.gmv)) : 0
  const totalOrders = sessions.reduce((sum, s) => sum + s.totalOrders, 0)

  return (
    <div className="kpi-row">
      <KpiCard
        label="Total Sessions"
        value={String(totalSessions)}
        subtext={label}
      />
      <KpiCard
        label="Total GMV"
        value={formatCurrency(totalGmv)}
        variant="highlight"
      />
      <KpiCard
        label="Avg Viewers"
        value={avgViewers.toLocaleString()}
      />
      <KpiCard
        label="Avg GMV/Session"
        value={formatCurrency(avgGmvPerSession)}
      />
      <KpiCard
        label="Best Session"
        value={formatCurrency(bestGmv)}
        variant="positive"
      />
      <KpiCard
        label="Total Orders"
        value={totalOrders.toLocaleString()}
      />
    </div>
  )
}

export default LiveSessionKpis

import KpiCard from '../shared/KpiCard'
import { formatCurrency, formatPercent } from '../../lib/utils'
import type { RevenueSnapshot } from '../../types'

interface RevenueKpiBarProps {
  snapshot: RevenueSnapshot
}

function RevenueKpiBar({ snapshot }: RevenueKpiBarProps) {
  return (
    <div className="kpi-sticky-bar">
      <div className="kpi-row">
        <KpiCard
          label="Current MRR"
          value={formatCurrency(snapshot.currentMrr)}
          variant="highlight"
        />
        <KpiCard
          label="Target"
          value={formatCurrency(snapshot.target)}
        />
        <KpiCard
          label="Gap"
          value={formatCurrency(snapshot.gap)}
          variant={snapshot.gap > 0 ? 'negative' : 'positive'}
        />
        <KpiCard
          label="% to Goal"
          value={formatPercent(snapshot.percentToGoal)}
          variant={snapshot.percentToGoal >= 100 ? 'positive' : 'default'}
        />
      </div>
    </div>
  )
}

export default RevenueKpiBar

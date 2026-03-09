import { formatCurrency, formatPercent } from '../../lib/utils'
import type { RevenueSnapshot } from '../../types'
import './GapAnalysis.css'

interface GapAnalysisProps {
  snapshot: RevenueSnapshot
}

function GapAnalysis({ snapshot }: GapAnalysisProps) {
  const avgRevenue = snapshot.averageRevenuePerClient
  const clientsNeeded =
    snapshot.gap > 0 && avgRevenue > 0
      ? Math.ceil(snapshot.gap / avgRevenue)
      : 0
  const progressPercent = Math.min(snapshot.percentToGoal, 100)

  return (
    <div className="gap-analysis">
      {snapshot.gap > 0 && avgRevenue > 0 ? (
        <p style={{ fontSize: 15, marginBottom: 4 }}>
          You need <strong style={{ color: 'var(--aria-yellow)' }}>{clientsNeeded} more client{clientsNeeded !== 1 ? 's' : ''}</strong> at{' '}
          <strong style={{ color: 'var(--aria-yellow)' }}>{formatCurrency(Math.round(avgRevenue))}</strong> average to reach{' '}
          <strong>$1M/month</strong>
        </p>
      ) : snapshot.gap <= 0 ? (
        <p style={{ fontSize: 15, marginBottom: 4, color: 'var(--aria-green)' }}>
          <strong>Target reached!</strong> You have exceeded $1M/month.
        </p>
      ) : (
        <p style={{ fontSize: 15, marginBottom: 4, color: 'var(--aria-gray-text)' }}>
          Add clients to begin tracking your gap to $1M/month.
        </p>
      )}

      <div className="gap-progress-bar">
        <div
          className="gap-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div style={{ fontSize: 12, color: 'var(--aria-gray-text)', textAlign: 'right' }}>
        {formatPercent(snapshot.percentToGoal)} of target
      </div>

      <div className="gap-stats">
        <div className="gap-stat">
          <div className="gap-stat-label">Current MRR</div>
          <div className="gap-stat-value" style={{ color: 'var(--aria-yellow)' }}>
            {formatCurrency(snapshot.currentMrr)}
          </div>
        </div>
        <div className="gap-stat">
          <div className="gap-stat-label">Gap to Target</div>
          <div
            className="gap-stat-value"
            style={{ color: snapshot.gap > 0 ? 'var(--aria-red)' : 'var(--aria-green)' }}
          >
            {formatCurrency(Math.max(snapshot.gap, 0))}
          </div>
        </div>
        <div className="gap-stat">
          <div className="gap-stat-label">Total Expenses</div>
          <div className="gap-stat-value" style={{ color: 'var(--aria-red)' }}>
            {formatCurrency(snapshot.totalExpenses)}
          </div>
        </div>
        <div className="gap-stat">
          <div className="gap-stat-label">Net Profit</div>
          <div
            className="gap-stat-value"
            style={{ color: snapshot.netProfit >= 0 ? 'var(--aria-green)' : 'var(--aria-red)' }}
          >
            {formatCurrency(snapshot.netProfit)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GapAnalysis

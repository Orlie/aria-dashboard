import { Pencil, Trash2, ClipboardPlus, ChevronDown } from 'lucide-react'
import { useAdsStore } from '../../stores/ads-store'
import { formatCurrency } from '../../lib/utils'
import type { AdCampaign, AdCampaignStatus, AdAlert } from '../../types'

interface AdCampaignCardProps {
  campaign: AdCampaign
  onEdit: () => void
  onLogDay: () => void
  onDelete: () => void
  expanded: boolean
  onToggleExpand: () => void
}

function statusBadgeClass(status: AdCampaignStatus): string {
  switch (status) {
    case 'active': return 'badge-active'
    case 'paused': return 'badge-paused'
    case 'ended': return 'badge-churned'
  }
}

function alertBadgeClass(alert: NonNullable<AdAlert>): string {
  switch (alert) {
    case 'pause_recommended': return 'badge-overdue'
    case 'over_budget': return 'badge-overdue'
    case 'scale_recommended': return 'badge-meeting'
    case 'good_performance': return 'badge-active'
  }
}

function alertLabel(alert: NonNullable<AdAlert>): string {
  switch (alert) {
    case 'pause_recommended': return 'Pause Recommended'
    case 'over_budget': return 'Over Budget'
    case 'scale_recommended': return 'Scale Recommended'
    case 'good_performance': return 'Good Performance'
  }
}

function roasColor(roas: number): string {
  if (roas < 1.5) return 'var(--aria-red)'
  if (roas < 3.0) return 'var(--aria-white)'
  if (roas < 4.0) return 'var(--aria-green)'
  return 'var(--aria-yellow)'
}

function AdCampaignCard({ campaign, onEdit, onLogDay, onDelete, expanded, onToggleExpand }: AdCampaignCardProps) {
  const { getLogsForCampaign, getCampaignAlert } = useAdsStore()
  const logs = getLogsForCampaign(campaign.id)
  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null
  const alert = getCampaignAlert(campaign.id)

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{campaign.campaignName}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <span className={`badge ${statusBadgeClass(campaign.status)}`}>
              {campaign.status}
            </span>
            {alert && (
              <span className={`badge ${alertBadgeClass(alert)}`}>
                {alertLabel(alert)}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn-icon btn-ghost" onClick={onEdit} title="Edit">
            <Pencil size={14} />
          </button>
          <button className="btn-icon btn-ghost" onClick={onDelete} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {latestLog ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <div className="text-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spend</div>
            <div style={{ fontWeight: 600 }}>{formatCurrency(latestLog.spend)}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>GMV</div>
            <div style={{ fontWeight: 600 }}>{formatCurrency(latestLog.gmv)}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ROAS</div>
            <div style={{ fontWeight: 600, color: roasColor(latestLog.roas) }}>
              {latestLog.roas.toFixed(2)}x
            </div>
          </div>
        </div>
      ) : (
        <div className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          No daily logs yet
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-sm btn-primary" onClick={onLogDay}>
          <ClipboardPlus size={14} style={{ marginRight: 4 }} />
          Log Today
        </button>
        <button className="btn btn-sm btn-ghost" onClick={onToggleExpand}>
          <ChevronDown size={14} style={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginRight: 4,
          }} />
          {expanded ? 'Hide Chart' : 'Show Chart'}
        </button>
      </div>
    </div>
  )
}

export default AdCampaignCard

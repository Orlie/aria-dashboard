import { LEAD_STATUS_LABELS, LEAD_STATUS_BADGE } from '../../types'
import type { LeadStatus, ClientStatus } from '../../types'

interface StatusBadgeProps {
  status: LeadStatus | ClientStatus | 'pending' | 'done' | 'overdue' | 'skipped'
}

const EXTRA_BADGES: Record<string, { className: string; label: string }> = {
  pending: { className: 'badge-pending', label: 'Pending' },
  done: { className: 'badge-done', label: 'Done' },
  overdue: { className: 'badge-overdue', label: 'Overdue' },
  skipped: { className: 'badge-paused', label: 'Skipped' },
  paused: { className: 'badge-paused', label: 'Paused' },
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isLeadStatus = status in LEAD_STATUS_LABELS
  const className = isLeadStatus
    ? LEAD_STATUS_BADGE[status as LeadStatus]
    : EXTRA_BADGES[status]?.className || 'badge-new'
  const label = isLeadStatus
    ? LEAD_STATUS_LABELS[status as LeadStatus]
    : EXTRA_BADGES[status]?.label || status

  return <span className={`badge ${className}`}>{label}</span>
}

export default StatusBadge

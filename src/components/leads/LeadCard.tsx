import { useState } from 'react'
import type { Lead, LeadStatus } from '../../types'
import { PRODUCT_CATEGORY_LABELS, LEAD_STATUS_LABELS } from '../../types'
import ScoreIndicator from '../shared/ScoreIndicator'
import { useLeadsStore } from '../../stores/leads-store'
import { showSuccess } from '../../stores/toast-store'
import './LeadCard.css'

interface LeadCardProps {
  lead: Lead
  onClick: () => void
}

const ALL_STATUSES: LeadStatus[] = [
  'new', 'contacted', 'replied', 'meeting_set', 'negotiating', 'closed', 'active', 'churned',
]

function getDaysAgo(dateString: string): number {
  const then = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - then.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function LeadCard({ lead, onClick }: LeadCardProps) {
  const { updateLeadStatus } = useLeadsStore()
  const [isDragging, setIsDragging] = useState(false)
  const daysAgo = lead.lastContactedAt ? getDaysAgo(lead.lastContactedAt) : null

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    const newStatus = e.target.value as LeadStatus
    if (newStatus !== lead.status) {
      updateLeadStatus(lead.id, newStatus)
      showSuccess(`Status updated to ${LEAD_STATUS_LABELS[newStatus]}`)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('leadId', lead.id)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={`lead-card${isDragging ? ' dragging' : ''}`}
      onClick={onClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="lead-card-header">
        <span className="lead-card-brand">{lead.brandName}</span>
        <ScoreIndicator score={lead.score.overall} />
      </div>
      <div className="lead-card-contact">{lead.contactName}</div>
      <div className="lead-card-footer">
        <span className="badge badge-new" style={{ fontSize: 10 }}>
          {PRODUCT_CATEGORY_LABELS[lead.productCategory]}
        </span>
        {daysAgo !== null && (
          <span className="lead-card-meta">
            Last contacted: {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
          </span>
        )}
      </div>
      <select
        className="lead-card-status-select"
        value={lead.status}
        onChange={handleStatusChange}
        onClick={(e) => e.stopPropagation()}
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  )
}

export default LeadCard

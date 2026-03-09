import { useState } from 'react'
import type { Lead, LeadStatus } from '../../types'
import { LEAD_STATUS_LABELS, PRODUCT_CATEGORY_LABELS } from '../../types'
import Modal from '../shared/Modal'
import ConfirmDialog from '../shared/ConfirmDialog'
import StatusBadge from '../shared/StatusBadge'
import ScoreIndicator from '../shared/ScoreIndicator'
import LeadScoreForm from './LeadScoreForm'
import { useLeadsStore } from '../../stores/leads-store'
import { formatCurrency, formatDate } from '../../lib/utils'
import { showSuccess, showInfo } from '../../stores/toast-store'

interface LeadBriefProps {
  lead: Lead
  onClose: () => void
}

const ALL_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'replied',
  'meeting_set',
  'negotiating',
  'closed',
  'active',
  'churned',
]

function LeadBrief({ lead, onClose }: LeadBriefProps) {
  const { updateLead, updateLeadStatus, updateLeadScore, deleteLead } = useLeadsStore()
  const [notes, setNotes] = useState(lead.notes)
  const [briefOverview, setBriefOverview] = useState(lead.brief.brandOverview)
  const [fitAnalysis, setFitAnalysis] = useState(lead.brief.fitAnalysis)
  const [pitchAngle, setPitchAngle] = useState(lead.brief.recommendedPitchAngle)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleStatusChange = (status: LeadStatus) => {
    updateLeadStatus(lead.id, status)
  }

  const handleNotesBlur = () => {
    if (notes !== lead.notes) {
      updateLead(lead.id, { notes })
      showInfo('Changes saved')
    }
  }

  const handleBriefBlur = () => {
    const changed =
      briefOverview !== lead.brief.brandOverview ||
      fitAnalysis !== lead.brief.fitAnalysis ||
      pitchAngle !== lead.brief.recommendedPitchAngle
    const updatedBrief = {
      ...lead.brief,
      brandOverview: briefOverview,
      fitAnalysis: fitAnalysis,
      recommendedPitchAngle: pitchAngle,
    }
    updateLead(lead.id, { brief: updatedBrief })
    if (changed) {
      showInfo('Changes saved')
    }
  }

  return (
    <Modal title={lead.brandName} onClose={onClose}>
      {/* Status & Score Header */}
      <div className="flex-between mb-16">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusBadge status={lead.status} />
          <select
            className="form-select"
            style={{ width: 'auto', padding: '6px 32px 6px 10px', fontSize: 12 }}
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <ScoreIndicator score={lead.score.overall} />
      </div>

      {/* Brand Overview Section */}
      <div className="section">
        <div className="section-title">Brand Overview</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <span className="text-muted text-sm">Category</span>
            <div style={{ fontSize: 14 }}>{PRODUCT_CATEGORY_LABELS[lead.productCategory]}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Product Type</span>
            <div style={{ fontSize: 14 }}>{lead.productType || '---'}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Est. Monthly GMV</span>
            <div style={{ fontSize: 14 }}>{formatCurrency(lead.estimatedMonthlyGmv)}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Commission Rate</span>
            <div style={{ fontSize: 14 }}>{lead.commissionRate}%</div>
          </div>
          <div>
            <span className="text-muted text-sm">Source</span>
            <div style={{ fontSize: 14 }}>{lead.source || '---'}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Created</span>
            <div style={{ fontSize: 14 }}>{formatDate(lead.createdAt)}</div>
          </div>
        </div>
        <textarea
          className="form-textarea"
          placeholder="Brand overview notes..."
          value={briefOverview}
          onChange={(e) => setBriefOverview(e.target.value)}
          onBlur={handleBriefBlur}
          style={{ minHeight: 60 }}
        />
      </div>

      {/* Contact Info Section */}
      <div className="section">
        <div className="section-title">Contact Info</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <span className="text-muted text-sm">Name</span>
            <div style={{ fontSize: 14 }}>{lead.contactName}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Role</span>
            <div style={{ fontSize: 14 }}>{lead.contactRole || '---'}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Email</span>
            <div style={{ fontSize: 14 }}>{lead.email || '---'}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Phone</span>
            <div style={{ fontSize: 14 }}>{lead.phone || '---'}</div>
          </div>
          <div>
            <span className="text-muted text-sm">TikTok</span>
            <div style={{ fontSize: 14 }}>{lead.tiktokHandle || '---'}</div>
          </div>
          <div>
            <span className="text-muted text-sm">Website</span>
            <div style={{ fontSize: 14 }}>{lead.website || '---'}</div>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="section">
        <div className="section-title">Lead Score</div>
        <LeadScoreForm
          score={lead.score}
          onChange={(score) => updateLeadScore(lead.id, score)}
        />
      </div>

      {/* Fit Analysis Section */}
      <div className="section">
        <div className="section-title">Fit Analysis</div>
        <textarea
          className="form-textarea"
          placeholder="Why is this brand a good fit for live selling?"
          value={fitAnalysis}
          onChange={(e) => setFitAnalysis(e.target.value)}
          onBlur={handleBriefBlur}
          style={{ minHeight: 60 }}
        />
      </div>

      {/* Recommended Pitch Angle */}
      <div className="section">
        <div className="section-title">Recommended Pitch Angle</div>
        <textarea
          className="form-textarea"
          placeholder="How should we pitch to this brand?"
          value={pitchAngle}
          onChange={(e) => setPitchAngle(e.target.value)}
          onBlur={handleBriefBlur}
          style={{ minHeight: 60 }}
        />
      </div>

      {/* Follow-up Schedule */}
      {lead.brief.followUpSchedule.length > 0 && (
        <div className="section">
          <div className="section-title">Follow-up Schedule</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lead.brief.followUpSchedule.map((item, idx) => (
              <div
                key={idx}
                className="flex-between"
                style={{
                  padding: '8px 12px',
                  background: 'var(--aria-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>Day {item.day}</span>
                  <span className="text-muted" style={{ marginLeft: 8 }}>{item.action}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="section">
        <div className="section-title">Notes</div>
        <textarea
          className="form-textarea"
          placeholder="General notes about this lead..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          style={{ minHeight: 80 }}
        />
      </div>

      {/* Delete Button */}
      <div style={{ borderTop: '1px solid var(--aria-gray-border)', paddingTop: 16 }}>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Lead
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Lead"
          message="Are you sure you want to delete this lead? This action cannot be undone."
          onConfirm={() => {
            deleteLead(lead.id)
            showSuccess('Lead deleted')
            onClose()
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </Modal>
  )
}

export default LeadBrief

import { useState, useEffect } from 'react'
import type { Creator, CreatorStatus } from '../../types'
import { CREATOR_STATUS_LABELS } from '../../types'
import { useCreatorsStore } from '../../stores/creators-store'
import { useClientsStore } from '../../stores/clients-store'
import { showSuccess } from '../../stores/toast-store'
import { getDaysFromNow } from '../../lib/utils'
import Modal from '../shared/Modal'

interface CreatorFormProps {
  isOpen: boolean
  onClose: () => void
  creator?: Creator
  defaultClientId?: string
}

const ALL_STATUSES: CreatorStatus[] = [
  'identified', 'outreached', 'replied', 'vetting', 'approved',
  'sample_shipped', 'content_due', 'content_posted', 'active_partner',
  'paused', 'removed',
]

function CreatorForm({ isOpen, onClose, creator, defaultClientId }: CreatorFormProps) {
  const { addCreator, updateCreator } = useCreatorsStore()
  const { clients } = useClientsStore()
  const activeClients = clients.filter((c) => c.status === 'active')

  const [clientId, setClientId] = useState(creator?.clientId ?? defaultClientId ?? '')
  const [tiktokHandle, setTiktokHandle] = useState(creator?.tiktokHandle ?? '')
  const [fullName, setFullName] = useState(creator?.fullName ?? '')
  const [followerCount, setFollowerCount] = useState(creator?.followerCount ?? 0)
  const [engagementRate, setEngagementRate] = useState(
    creator ? creator.engagementRate * 100 : 0
  )
  const [niche, setNiche] = useState(creator?.niche ?? '')
  const [status, setStatus] = useState<CreatorStatus>(creator?.status ?? 'identified')
  const [productSent, setProductSent] = useState(creator?.productSent ?? '')
  const [sampleShippedDate, setSampleShippedDate] = useState(creator?.sampleShippedDate ?? '')
  const [contentDueDate, setContentDueDate] = useState(creator?.contentDueDate ?? '')
  const [contentPostedDate, setContentPostedDate] = useState(creator?.contentPostedDate ?? '')
  const [contentUrl, setContentUrl] = useState(creator?.contentUrl ?? '')
  const [commissionRate, setCommissionRate] = useState(
    creator ? creator.commissionRate * 100 : 5
  )
  const [notes, setNotes] = useState(creator?.notes ?? '')

  // Auto-fill clientId when defaultClientId changes
  useEffect(() => {
    if (!creator && defaultClientId) {
      setClientId(defaultClientId)
    }
  }, [defaultClientId, creator])

  // Auto-calculate contentDueDate when sampleShippedDate changes
  useEffect(() => {
    if (sampleShippedDate && !contentDueDate) {
      setContentDueDate(getDaysFromNow(7))
    }
  }, [sampleShippedDate])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId || !tiktokHandle.trim()) return

    const data = {
      clientId,
      tiktokHandle: tiktokHandle.trim().replace(/^@/, ''),
      fullName: fullName.trim(),
      followerCount,
      engagementRate: engagementRate / 100,
      niche: niche.trim(),
      status,
      shippingAddress: creator?.shippingAddress ?? '',
      productSent: productSent.trim(),
      sampleShippedDate: sampleShippedDate || undefined,
      contentDueDate: contentDueDate || undefined,
      contentPostedDate: contentPostedDate || undefined,
      contentUrl: contentUrl.trim() || undefined,
      commissionRate: commissionRate / 100,
      totalGmv: creator?.totalGmv ?? 0,
      notes: notes.trim(),
    }

    if (creator) {
      updateCreator(creator.id, data)
      showSuccess('Creator updated')
    } else {
      addCreator(data as Omit<Creator, 'id' | 'createdAt' | 'updatedAt'>)
      showSuccess('Creator added')
    }
    onClose()
  }

  return (
    <Modal
      title={creator ? 'Edit Creator' : 'Add Creator'}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {creator ? 'Update' : 'Add Creator'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label required">Client</label>
          <select
            className="form-select"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select client...</option>
            {activeClients.map((c) => (
              <option key={c.id} value={c.id}>{c.brandName}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">TikTok Handle</label>
            <input
              className="form-input"
              type="text"
              value={tiktokHandle}
              onChange={(e) => setTiktokHandle(e.target.value)}
              placeholder="@handle"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Creator's name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Follower Count</label>
            <input
              className="form-input"
              type="number"
              value={followerCount || ''}
              onChange={(e) => setFollowerCount(Number(e.target.value))}
              min={0}
              placeholder="50000"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Engagement Rate (%)</label>
            <input
              className="form-input"
              type="number"
              value={engagementRate || ''}
              onChange={(e) => setEngagementRate(Number(e.target.value))}
              min={0}
              max={100}
              step={0.1}
              placeholder="3.5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Niche</label>
            <input
              className="form-input"
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="beauty, lifestyle..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as CreatorStatus)}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{CREATOR_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Product to Send</label>
          <input
            className="form-input"
            type="text"
            value={productSent}
            onChange={(e) => setProductSent(e.target.value)}
            placeholder="Which product are they promoting?"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Sample Shipped Date</label>
            <input
              className="form-input"
              type="date"
              value={sampleShippedDate}
              onChange={(e) => setSampleShippedDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content Due Date</label>
            <input
              className="form-input"
              type="date"
              value={contentDueDate}
              onChange={(e) => setContentDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Content Posted Date</label>
            <input
              className="form-input"
              type="date"
              value={contentPostedDate}
              onChange={(e) => setContentPostedDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Commission Rate (%)</label>
            <input
              className="form-input"
              type="number"
              value={commissionRate || ''}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              min={0}
              max={100}
              step={0.5}
              placeholder="5"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Content URL</label>
          <input
            className="form-input"
            type="text"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
            placeholder="https://tiktok.com/..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Notes about this creator..."
          />
        </div>
      </form>
    </Modal>
  )
}

export default CreatorForm

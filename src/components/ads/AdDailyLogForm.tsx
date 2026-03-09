import { useState } from 'react'
import Modal from '../shared/Modal'
import { getToday } from '../../lib/utils'
import { useAdsStore } from '../../stores/ads-store'
import { showSuccess } from '../../stores/toast-store'
import type { AdDailyLog } from '../../types'

interface AdDailyLogFormProps {
  campaignId: string
  clientId: string
  onClose: () => void
  existingLog?: AdDailyLog
}

function AdDailyLogForm({ campaignId, clientId, onClose, existingLog }: AdDailyLogFormProps) {
  const { addDailyLog, updateDailyLog } = useAdsStore()

  const [date, setDate] = useState(existingLog?.date ?? getToday())
  const [spend, setSpend] = useState(existingLog?.spend ?? 0)
  const [gmv, setGmv] = useState(existingLog?.gmv ?? 0)
  const [orders, setOrders] = useState(existingLog?.orders ?? 0)
  const [impressions, setImpressions] = useState(existingLog?.impressions ?? 0)
  const [notes, setNotes] = useState(existingLog?.notes ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const computedRoas = spend > 0 ? gmv / spend : 0

  const roasColor = computedRoas < 1.5
    ? 'var(--aria-red)'
    : computedRoas < 3.0
      ? 'var(--aria-orange)'
      : 'var(--aria-green)'

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {}
    if (spend < 0) errs.spend = 'Spend must be 0 or greater'
    if (gmv < 0) errs.gmv = 'GMV must be 0 or greater'
    if (!date) errs.date = 'Date is required'
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    if (existingLog) {
      updateDailyLog(existingLog.id, { date, spend, gmv, roas: computedRoas, orders, impressions, notes })
      showSuccess('Daily log updated')
    } else {
      addDailyLog({ campaignId, clientId, date, spend, gmv, roas: computedRoas, orders, impressions, notes })
      showSuccess('Daily log added')
    }
    onClose()
  }

  return (
    <Modal
      title={existingLog ? 'Edit Daily Log' : 'Log Daily Performance'}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {existingLog ? 'Update' : 'Save Log'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* ROAS Preview */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--aria-surface)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: roasColor }}>
            {computedRoas.toFixed(2)}x ROAS
          </div>
          <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>Auto-calculated from GMV / Spend</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Date</label>
            <input
              className={`form-input ${submitted && errors.date ? 'error' : ''}`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {submitted && errors.date && <div className="form-error">{errors.date}</div>}
          </div>
          <div className="form-group">
            <label className="form-label required">Ad Spend ($)</label>
            <input
              className={`form-input ${submitted && errors.spend ? 'error' : ''}`}
              type="number"
              value={spend || ''}
              onChange={(e) => setSpend(Number(e.target.value))}
              min={0}
              step={0.01}
              placeholder="0.00"
            />
            {submitted && errors.spend && <div className="form-error">{errors.spend}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">GMV Generated ($)</label>
            <input
              className={`form-input ${submitted && errors.gmv ? 'error' : ''}`}
              type="number"
              value={gmv || ''}
              onChange={(e) => setGmv(Number(e.target.value))}
              min={0}
              step={0.01}
              placeholder="0.00"
            />
            {submitted && errors.gmv && <div className="form-error">{errors.gmv}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Orders</label>
            <input
              className="form-input"
              type="number"
              value={orders || ''}
              onChange={(e) => setOrders(Number(e.target.value))}
              min={0}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Impressions</label>
            <input
              className="form-input"
              type="number"
              value={impressions || ''}
              onChange={(e) => setImpressions(Number(e.target.value))}
              min={0}
              placeholder="0"
            />
          </div>
          <div className="form-group" />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Optional notes about today's performance..."
          />
        </div>
      </form>
    </Modal>
  )
}

export default AdDailyLogForm

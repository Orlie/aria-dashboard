import { useState } from 'react'
import Modal from '../shared/Modal'
import { useClientsStore } from '../../stores/clients-store'
import { useLiveSessionsStore } from '../../stores/live-sessions-store'
import { showSuccess } from '../../stores/toast-store'
import { getToday } from '../../lib/utils'
import type { LiveSession } from '../../types'

interface LiveSessionFormProps {
  onClose: () => void
  editSession?: LiveSession
  clientId?: string
}

function validate(data: Record<string, unknown>): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!data.clientId) errs.clientId = 'Client is required'
  if (!data.date) errs.date = 'Date is required'
  if (typeof data.durationMinutes === 'number' && data.durationMinutes <= 0) {
    errs.durationMinutes = 'Duration must be greater than 0'
  }
  if (!data.durationMinutes) errs.durationMinutes = 'Duration is required'
  if (typeof data.peakViewers === 'number' && data.peakViewers < 0) {
    errs.peakViewers = 'Must be 0 or greater'
  }
  if (typeof data.averageViewers === 'number' && data.averageViewers < 0) {
    errs.averageViewers = 'Must be 0 or greater'
  }
  if (typeof data.totalOrders === 'number' && data.totalOrders < 0) {
    errs.totalOrders = 'Must be 0 or greater'
  }
  if (typeof data.gmv === 'number' && data.gmv < 0) {
    errs.gmv = 'Must be 0 or greater'
  }
  return errs
}

function LiveSessionForm({ onClose, editSession, clientId }: LiveSessionFormProps) {
  const activeClients = useClientsStore((s) => s.clients.filter((c) => c.status === 'active'))

  const [selectedClientId, setSelectedClientId] = useState(
    editSession?.clientId ?? clientId ?? ''
  )
  const [date, setDate] = useState(editSession?.date ?? getToday())
  const [durationMinutes, setDurationMinutes] = useState(editSession?.durationMinutes ?? 0)
  const [peakViewers, setPeakViewers] = useState(editSession?.peakViewers ?? 0)
  const [averageViewers, setAverageViewers] = useState(editSession?.averageViewers ?? 0)
  const [totalOrders, setTotalOrders] = useState(editSession?.totalOrders ?? 0)
  const [gmv, setGmv] = useState(editSession?.gmv ?? 0)
  const [topProduct, setTopProduct] = useState(editSession?.topProduct ?? '')
  const [hostName, setHostName] = useState(editSession?.hostName ?? '')
  const [notes, setNotes] = useState(editSession?.notes ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const formData = {
      clientId: selectedClientId,
      date,
      durationMinutes,
      peakViewers,
      averageViewers,
      totalOrders,
      gmv,
      topProduct,
      hostName,
      notes,
    }

    const validationErrors = validate(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    if (editSession) {
      useLiveSessionsStore.getState().updateSession(editSession.id, formData)
    } else {
      useLiveSessionsStore.getState().addSession(formData)
    }

    showSuccess(editSession ? 'Session updated' : 'Session logged')
    onClose()
  }

  return (
    <Modal
      title={editSession ? 'Edit LIVE Session' : 'Log LIVE Session'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editSession ? 'Update' : 'Log Session'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Client</label>
            <select
              className={`form-select ${submitted && errors.clientId ? 'error' : ''}`}
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              required
            >
              <option value="">Select a client</option>
              {activeClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brandName}
                </option>
              ))}
            </select>
            {submitted && errors.clientId && <div className="form-error">{errors.clientId}</div>}
          </div>
          <div className="form-group">
            <label className="form-label required">Date</label>
            <input
              className={`form-input ${submitted && errors.date ? 'error' : ''}`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {submitted && errors.date && <div className="form-error">{errors.date}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Duration (minutes)</label>
            <input
              className={`form-input ${submitted && errors.durationMinutes ? 'error' : ''}`}
              type="number"
              value={durationMinutes || ''}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              placeholder="120"
              min={1}
              required
            />
            {submitted && errors.durationMinutes && <div className="form-error">{errors.durationMinutes}</div>}
          </div>
          <div className="form-group">
            <label className="form-label required">Peak Viewers</label>
            <input
              className={`form-input ${submitted && errors.peakViewers ? 'error' : ''}`}
              type="number"
              value={peakViewers || ''}
              onChange={(e) => setPeakViewers(Number(e.target.value))}
              min={0}
              required
            />
            {submitted && errors.peakViewers && <div className="form-error">{errors.peakViewers}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Average Viewers</label>
            <input
              className={`form-input ${submitted && errors.averageViewers ? 'error' : ''}`}
              type="number"
              value={averageViewers || ''}
              onChange={(e) => setAverageViewers(Number(e.target.value))}
              min={0}
              required
            />
            {submitted && errors.averageViewers && <div className="form-error">{errors.averageViewers}</div>}
          </div>
          <div className="form-group">
            <label className="form-label required">Total Orders</label>
            <input
              className={`form-input ${submitted && errors.totalOrders ? 'error' : ''}`}
              type="number"
              value={totalOrders || ''}
              onChange={(e) => setTotalOrders(Number(e.target.value))}
              min={0}
              required
            />
            {submitted && errors.totalOrders && <div className="form-error">{errors.totalOrders}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">GMV ($)</label>
            <div className="form-input-with-icon">
              <span className="form-input-prefix">$</span>
              <input
                className={`form-input ${submitted && errors.gmv ? 'error' : ''}`}
                type="number"
                value={gmv || ''}
                onChange={(e) => setGmv(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            {submitted && errors.gmv && <div className="form-error">{errors.gmv}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Top Product</label>
            <input
              className="form-input"
              type="text"
              value={topProduct}
              onChange={(e) => setTopProduct(e.target.value)}
              placeholder="Which product sold best?"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Host Name</label>
            <input
              className="form-input"
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Host's name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: '1 1 100%' }}>
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default LiveSessionForm

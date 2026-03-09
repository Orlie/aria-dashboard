import { useState } from 'react'
import Modal from '../shared/Modal'
import { getToday } from '../../lib/utils'
import type { Client, ClientStatus } from '../../types'

interface ClientFormProps {
  client?: Client
  onSave: (data: Omit<Client, 'id' | 'monthlyRevenue'>) => void
  onClose: () => void
}

function validate(data: Record<string, unknown>): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!data.brandName) errs.brandName = 'Brand name is required'
  if (!data.contactName) errs.contactName = 'Contact name is required'
  if (typeof data.contractValue === 'number' && data.contractValue < 0) {
    errs.contractValue = 'Must be 0 or greater'
  }
  if (typeof data.gmvTarget === 'number' && data.gmvTarget < 0) {
    errs.gmvTarget = 'Must be 0 or greater'
  }
  if (typeof data.actualGmv === 'number' && data.actualGmv < 0) {
    errs.actualGmv = 'Must be 0 or greater'
  }
  if (typeof data.commissionRate === 'number' && (data.commissionRate < 0 || data.commissionRate > 100)) {
    errs.commissionRate = 'Must be between 0 and 100'
  }
  return errs
}

function ClientForm({ client, onSave, onClose }: ClientFormProps) {
  const [brandName, setBrandName] = useState(client?.brandName ?? '')
  const [contactName, setContactName] = useState(client?.contactName ?? '')
  const [contractValue, setContractValue] = useState(client?.contractValue ?? 0)
  const [gmvTarget, setGmvTarget] = useState(client?.gmvTarget ?? 0)
  const [actualGmv, setActualGmv] = useState(client?.actualGmv ?? 0)
  const [commissionRate, setCommissionRate] = useState(
    client ? client.commissionRate * 100 : 10
  )
  const [status, setStatus] = useState<ClientStatus>(client?.status ?? 'active')
  const [startDate, setStartDate] = useState(client?.startDate ?? getToday())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const formData = { brandName, contactName, contractValue, gmvTarget, actualGmv, commissionRate }
    const validationErrors = validate(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSave({
      brandName,
      contactName,
      contractValue,
      gmvTarget,
      actualGmv,
      commissionRate: commissionRate / 100,
      status,
      startDate,
    })
  }

  return (
    <Modal
      title={client ? 'Edit Client' : 'Add Client'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {client ? 'Update' : 'Add Client'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label required">Brand Name</label>
            <input
              className={`form-input ${submitted && errors.brandName ? 'error' : ''}`}
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Brand name"
              required
            />
            {submitted && errors.brandName && <div className="form-error">{errors.brandName}</div>}
          </div>
          <div className="form-group">
            <label className="form-label required">Contact Name</label>
            <input
              className={`form-input ${submitted && errors.contactName ? 'error' : ''}`}
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact person"
              required
            />
            {submitted && errors.contactName && <div className="form-error">{errors.contactName}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Contract Value (USD)</label>
            <div className="form-input-with-icon">
              <span className="form-input-prefix">$</span>
              <input
                className={`form-input ${submitted && errors.contractValue ? 'error' : ''}`}
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            {submitted && errors.contractValue && <div className="form-error">{errors.contractValue}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">GMV Target (USD)</label>
            <div className="form-input-with-icon">
              <span className="form-input-prefix">$</span>
              <input
                className={`form-input ${submitted && errors.gmvTarget ? 'error' : ''}`}
                type="number"
                value={gmvTarget}
                onChange={(e) => setGmvTarget(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            {submitted && errors.gmvTarget && <div className="form-error">{errors.gmvTarget}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Actual GMV (USD)</label>
            <div className="form-input-with-icon">
              <span className="form-input-prefix">$</span>
              <input
                className={`form-input ${submitted && errors.actualGmv ? 'error' : ''}`}
                type="number"
                value={actualGmv}
                onChange={(e) => setActualGmv(Number(e.target.value))}
                min={0}
                required
              />
            </div>
            {submitted && errors.actualGmv && <div className="form-error">{errors.actualGmv}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Commission Rate (%)</label>
            <input
              className={`form-input ${submitted && errors.commissionRate ? 'error' : ''}`}
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              min={0}
              max={100}
              step={0.1}
              required
            />
            {submitted && errors.commissionRate && <div className="form-error">{errors.commissionRate}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as ClientStatus)}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="churned">Churned</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              className="form-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default ClientForm

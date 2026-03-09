import { useState } from 'react'
import type { Lead, ProductCategory } from '../../types'
import { PRODUCT_CATEGORY_LABELS } from '../../types'

interface LeadFormProps {
  lead?: Lead
  onSave: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

const DEFAULT_SCORE = {
  revenuePotential: 5,
  brandFit: 5,
  easeOfClosing: 5,
  productMargins: 5,
  overall: 5,
}

const DEFAULT_BRIEF = {
  brandOverview: '',
  fitAnalysis: '',
  recommendedPitchAngle: '',
  followUpSchedule: [],
}

function validate(data: Record<string, unknown>): Record<string, string> {
  const errs: Record<string, string> = {}
  if (!data.brandName) errs.brandName = 'Brand name is required'
  if (!data.contactName) errs.contactName = 'Contact name is required'
  if (data.email && typeof data.email === 'string' && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errs.email = 'Invalid email format'
  }
  if (typeof data.estimatedMonthlyGmv === 'number' && data.estimatedMonthlyGmv < 0) {
    errs.estimatedMonthlyGmv = 'Must be 0 or greater'
  }
  if (typeof data.commissionRate === 'number' && (data.commissionRate < 0 || data.commissionRate > 100)) {
    errs.commissionRate = 'Must be between 0 and 100'
  }
  return errs
}

function LeadForm({ lead, onSave, onClose }: LeadFormProps) {
  const [brandName, setBrandName] = useState(lead?.brandName ?? '')
  const [contactName, setContactName] = useState(lead?.contactName ?? '')
  const [contactRole, setContactRole] = useState(lead?.contactRole ?? '')
  const [email, setEmail] = useState(lead?.email ?? '')
  const [phone, setPhone] = useState(lead?.phone ?? '')
  const [tiktokHandle, setTiktokHandle] = useState(lead?.tiktokHandle ?? '')
  const [website, setWebsite] = useState(lead?.website ?? '')
  const [productCategory, setProductCategory] = useState<ProductCategory>(
    lead?.productCategory ?? 'beauty'
  )
  const [productType, setProductType] = useState(lead?.productType ?? '')
  const [estimatedMonthlyGmv, setEstimatedMonthlyGmv] = useState(
    lead?.estimatedMonthlyGmv ?? 0
  )
  const [commissionRate, setCommissionRate] = useState(lead?.commissionRate ?? 15)
  const [source, setSource] = useState(lead?.source ?? '')
  const [notes, setNotes] = useState(lead?.notes ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const formData = { brandName, contactName, email, estimatedMonthlyGmv, commissionRate }
    const validationErrors = validate(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSave({
      brandName,
      contactName,
      contactRole,
      email,
      phone,
      tiktokHandle,
      website,
      productCategory,
      productType,
      estimatedMonthlyGmv,
      commissionRate,
      status: lead?.status ?? 'new',
      score: lead?.score ?? DEFAULT_SCORE,
      brief: lead?.brief ?? DEFAULT_BRIEF,
      notes,
      source,
      lastContactedAt: lead?.lastContactedAt,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label required">Brand Name</label>
          <input
            className={`form-input ${submitted && errors.brandName ? 'error' : ''}`}
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. GlowUp PH"
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
            placeholder="e.g. Maria Santos"
            required
          />
          {submitted && errors.contactName && <div className="form-error">{errors.contactName}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Contact Role</label>
        <input
          className="form-input"
          type="text"
          value={contactRole}
          onChange={(e) => setContactRole(e.target.value)}
          placeholder="e.g. Marketing Manager"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className={`form-input ${submitted && errors.email ? 'error' : ''}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@brand.com"
          />
          {submitted && errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+63 917 123 4567"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">TikTok Handle</label>
          <input
            className="form-input"
            type="text"
            value={tiktokHandle}
            onChange={(e) => setTiktokHandle(e.target.value)}
            placeholder="@brandhandle"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Website</label>
          <input
            className="form-input"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://brand.com"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Product Category</label>
          <select
            className="form-select"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
          >
            {Object.entries(PRODUCT_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Product Type</label>
          <input
            className="form-input"
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="e.g. Skincare serums"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Estimated Monthly GMV (USD)</label>
          <div className="form-input-with-prefix">
            <span className="form-input-prefix">$</span>
            <input
              className={`form-input ${submitted && errors.estimatedMonthlyGmv ? 'error' : ''}`}
              type="number"
              value={estimatedMonthlyGmv || ''}
              onChange={(e) => setEstimatedMonthlyGmv(Number(e.target.value))}
              placeholder="500000"
              min={0}
            />
          </div>
          {submitted && errors.estimatedMonthlyGmv && <div className="form-error">{errors.estimatedMonthlyGmv}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Commission Rate (%)</label>
          <input
            className={`form-input ${submitted && errors.commissionRate ? 'error' : ''}`}
            type="number"
            value={commissionRate || ''}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            placeholder="15"
            min={0}
            max={100}
          />
          {submitted && errors.commissionRate && <div className="form-error">{errors.commissionRate}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Source</label>
        <input
          className="form-input"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g. TikTok search, Referral, Cold outreach"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          className="form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes about this lead..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  )
}

export default LeadForm

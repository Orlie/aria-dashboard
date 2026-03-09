import { useState } from 'react'
import type { ProductCategory } from '../../types'
import { PRODUCT_CATEGORY_LABELS } from '../../types'
import { useLeadsStore } from '../../stores/leads-store'
import { showSuccess } from '../../stores/toast-store'
import Modal from '../shared/Modal'

interface QuickAddLeadFormProps {
  isOpen: boolean
  onClose: () => void
}

function QuickAddLeadForm({ isOpen, onClose }: QuickAddLeadFormProps) {
  const { addLead } = useLeadsStore()
  const [brandName, setBrandName] = useState('')
  const [tiktokHandle, setTiktokHandle] = useState('')
  const [tiktokShopUrl, setTiktokShopUrl] = useState('')
  const [estimatedMonthlyGmv, setEstimatedMonthlyGmv] = useState<number>(0)
  const [productCategory, setProductCategory] = useState<ProductCategory>('beauty')
  const [contactName, setContactName] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const resetForm = () => {
    setBrandName('')
    setTiktokHandle('')
    setTiktokShopUrl('')
    setEstimatedMonthlyGmv(0)
    setProductCategory('beauty')
    setContactName('')
    setNotes('')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName.trim()) {
      setError('Brand name is required')
      return
    }
    addLead({
      brandName: brandName.trim(),
      contactName: contactName.trim(),
      contactRole: '',
      email: '',
      phone: '',
      tiktokHandle: tiktokHandle.trim(),
      website: '',
      tiktokShopUrl: tiktokShopUrl.trim(),
      productCategory,
      productType: '',
      estimatedMonthlyGmv,
      commissionRate: 0,
      status: 'new',
      score: {
        revenuePotential: 5,
        brandFit: 5,
        easeOfClosing: 5,
        productMargins: 5,
        overall: 5,
      },
      brief: {
        brandOverview: '',
        fitAnalysis: '',
        recommendedPitchAngle: '',
        followUpSchedule: [],
      },
      notes: notes.trim(),
      source: 'KaloData',
    })
    showSuccess('Lead added from KaloData')
    resetForm()
    onClose()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal title="Quick Add — KaloData Import" onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label required">Brand Name</label>
          <input
            className={`form-input${error ? ' error' : ''}`}
            type="text"
            value={brandName}
            onChange={(e) => { setBrandName(e.target.value); setError('') }}
            placeholder="e.g. GlowUp Skincare"
            autoFocus
          />
          {error && <div className="form-error">{error}</div>}
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
            <label className="form-label">Contact Name</label>
            <input
              className="form-input"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">TikTok Shop URL</label>
          <input
            className="form-input"
            type="text"
            value={tiktokShopUrl}
            onChange={(e) => setTiktokShopUrl(e.target.value)}
            placeholder="https://www.tiktok.com/view/shop/..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Est. Monthly GMV ($)</label>
            <input
              className="form-input"
              type="number"
              value={estimatedMonthlyGmv || ''}
              onChange={(e) => setEstimatedMonthlyGmv(Number(e.target.value))}
              placeholder="50000"
              min={0}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Product Category</label>
            <select
              className="form-select"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
            >
              {Object.entries(PRODUCT_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any quick notes from KaloData..."
            rows={2}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Lead
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default QuickAddLeadForm

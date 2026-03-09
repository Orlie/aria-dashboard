import { useState, useRef, useCallback } from 'react'
import { Upload, CheckCircle, AlertTriangle, ArrowLeft, FileSpreadsheet } from 'lucide-react'
import Modal from '../shared/Modal'
import { useLeadsStore } from '../../stores/leads-store'
import { showSuccess, showError } from '../../stores/toast-store'
import { parseKaloDataCSV, kaloDataLeadsToAria } from '../../lib/kalodata-parser'
import type { ParsedKaloDataLead } from '../../lib/kalodata-parser'
import { formatCurrency } from '../../lib/utils'
import { PRODUCT_CATEGORY_LABELS } from '../../types'

interface KaloDataImportProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'upload' | 'preview' | 'done'

function KaloDataImport({ isOpen, onClose }: KaloDataImportProps) {
  const [step, setStep] = useState<Step>('upload')
  const [parsedLeads, setParsedLeads] = useState<ParsedKaloDataLead[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [dragOver, setDragOver] = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setStep('upload')
    setParsedLeads([])
    setSelected(new Set())
    setDragOver(false)
    setImportedCount(0)
    setError('')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const leads = parseKaloDataCSV(text)
      if (leads.length === 0) {
        setError('No valid leads found in this CSV. Check that it has a header row with column names like "Shop Name", "Monthly GMV", etc.')
        return
      }
      setParsedLeads(leads)
      setSelected(new Set(leads.map((_, i) => i)))
      setStep('preview')
    }
    reader.onerror = () => setError('Failed to read file')
    reader.readAsText(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const toggleSelect = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === parsedLeads.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(parsedLeads.map((_, i) => i)))
    }
  }

  const handleImport = () => {
    const selectedLeads = parsedLeads.filter((_, i) => selected.has(i))
    if (selectedLeads.length === 0) {
      showError('No leads selected')
      return
    }
    const ariaLeads = kaloDataLeadsToAria(selectedLeads)
    const store = useLeadsStore.getState()
    ariaLeads.forEach(lead => store.addLead(lead))
    setImportedCount(ariaLeads.length)
    showSuccess(`Imported ${ariaLeads.length} leads from KaloData`)
    setStep('done')
  }

  if (!isOpen) return null

  const title = step === 'upload' ? 'Import KaloData CSV'
    : step === 'preview' ? 'Preview & Select Leads'
    : 'Import Complete'

  return (
    <Modal title={title} onClose={handleClose}>
      {/* Step 1: Upload */}
      {step === 'upload' && (
        <div>
          <div
            className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload size={40} style={{ color: 'var(--aria-yellow)', marginBottom: 12 }} />
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              Drop your KaloData CSV here
            </p>
            <p className="text-muted text-sm">or click to browse</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
          {error && (
            <div style={{ color: '#ef4444', marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} />
              {error}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 'preview' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span className="text-muted text-sm">
              {parsedLeads.length} leads found — {selected.size} selected
            </span>
          </div>
          <div className="table-wrapper" style={{ maxHeight: 400, overflow: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={selected.size === parsedLeads.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Brand Name</th>
                  <th>TikTok Handle</th>
                  <th>Est. GMV</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {parsedLeads.map((lead, i) => {
                  const hasWarning = !lead.brandName || lead.estimatedMonthlyGmv === 0
                  return (
                    <tr
                      key={i}
                      style={hasWarning ? { background: 'rgba(245, 158, 11, 0.08)' } : undefined}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(i)}
                          onChange={() => toggleSelect(i)}
                        />
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {lead.brandName || <span className="text-muted">—</span>}
                          {hasWarning && <AlertTriangle size={14} style={{ color: '#f59e0b' }} />}
                        </span>
                      </td>
                      <td>{lead.tiktokHandle || '—'}</td>
                      <td>{lead.estimatedMonthlyGmv ? formatCurrency(lead.estimatedMonthlyGmv) : '—'}</td>
                      <td>{PRODUCT_CATEGORY_LABELS[lead.productCategory]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => { setStep('upload'); setError('') }}>
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={selected.size === 0}
            >
              <FileSpreadsheet size={16} />
              Import {selected.size} Lead{selected.size !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <CheckCircle size={48} style={{ color: '#22c55e', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>Successfully imported {importedCount} leads</h3>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            All leads added with "New" status and "KaloData" source
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={() => reset()}>
              Import Another
            </button>
            <button className="btn btn-primary" onClick={handleClose}>
              Done
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default KaloDataImport

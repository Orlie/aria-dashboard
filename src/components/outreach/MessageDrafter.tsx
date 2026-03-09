import { useState, useMemo, useCallback, useEffect } from 'react'
import { Copy, Send } from 'lucide-react'
import { OUTREACH_TEMPLATES, renderTemplate, getUnfilledVariables } from '../../lib/templates'
import { useLeadsStore } from '../../stores/leads-store'
import { useOutreachStore } from '../../stores/outreach-store'
import { OUTREACH_CHANNEL_LABELS, PRODUCT_CATEGORY_LABELS } from '../../types'
import type { MessageTemplateId, OutreachChannel } from '../../types'
import { formatCurrencyCompact } from '../../lib/utils'
import { showSuccess } from '../../stores/toast-store'
import './MessageDrafter.css'

interface MessageDrafterProps {
  initialLeadId?: string
}

function MessageDrafter({ initialLeadId }: MessageDrafterProps) {
  const { leads } = useLeadsStore()
  const { addRecord } = useOutreachStore()

  const [selectedTemplateId, setSelectedTemplateId] = useState<MessageTemplateId>('cold_dm')
  const [selectedLeadId, setSelectedLeadId] = useState<string>('')
  const [channel, setChannel] = useState<OutreachChannel>('tiktok_dm')
  const [variableOverrides, setVariableOverrides] = useState<Record<string, string>>({})

  // Auto-select lead when initialLeadId is provided
  useEffect(() => {
    if (initialLeadId) {
      setSelectedLeadId(initialLeadId)
    }
  }, [initialLeadId])

  const selectedTemplate = useMemo(
    () => OUTREACH_TEMPLATES.find((t) => t.id === selectedTemplateId) || OUTREACH_TEMPLATES[0],
    [selectedTemplateId]
  )

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId),
    [leads, selectedLeadId]
  )

  // Auto-fill variables from lead data
  const autoFilledVars = useMemo<Record<string, string>>(() => {
    if (!selectedLead) return {} as Record<string, string>
    return {
      contactName: selectedLead.contactName,
      brandName: selectedLead.brandName,
      productType: selectedLead.productType,
      productCategory: PRODUCT_CATEGORY_LABELS[selectedLead.productCategory],
      estimatedGmv: formatCurrencyCompact(selectedLead.estimatedMonthlyGmv),
      commissionRate: `${(selectedLead.commissionRate * 100).toFixed(0)}%`,
    }
  }, [selectedLead])

  // Merge auto-filled with overrides
  const mergedVars = useMemo<Record<string, string>>(() => {
    const merged: Record<string, string> = { ...autoFilledVars }
    for (const [key, value] of Object.entries(variableOverrides)) {
      if (value.trim()) {
        merged[key] = value
      }
    }
    return merged
  }, [autoFilledVars, variableOverrides])

  const renderedMessage = useMemo(
    () => renderTemplate(selectedTemplate.body, mergedVars),
    [selectedTemplate.body, mergedVars]
  )

  const unfilledVars = useMemo(
    () => getUnfilledVariables(selectedTemplate.body, mergedVars),
    [selectedTemplate.body, mergedVars]
  )

  const handleOverrideChange = useCallback((varName: string, value: string) => {
    setVariableOverrides((prev) => ({ ...prev, [varName]: value }))
  }, [])

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId as MessageTemplateId)
    setVariableOverrides({})
  }

  const handleLeadChange = (leadId: string) => {
    setSelectedLeadId(leadId)
    setVariableOverrides({})
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedMessage)
      showSuccess('Copied to clipboard')
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = renderedMessage
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showSuccess('Copied to clipboard')
    }
  }

  const handleLogOutreach = () => {
    if (!selectedLead) return

    addRecord({
      leadId: selectedLead.id,
      brandName: selectedLead.brandName,
      templateUsed: selectedTemplate.id,
      channel,
      message: renderedMessage,
      sentAt: new Date().toISOString(),
      gotResponse: false,
      responseNotes: '',
    })
    showSuccess('Outreach logged successfully')
  }

  return (
    <div className="drafter-container">
      {/* Left: Form */}
      <div className="drafter-form">
        <div className="form-group">
          <label className="form-label">Template</label>
          <select
            className="form-select"
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {OUTREACH_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Select Lead</label>
          <select
            className="form-select"
            value={selectedLeadId}
            onChange={(e) => handleLeadChange(e.target.value)}
          >
            <option value="">-- Select a lead --</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.brandName} ({l.contactName})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Channel</label>
          <select
            className="form-select"
            value={channel}
            onChange={(e) => setChannel(e.target.value as OutreachChannel)}
          >
            {Object.entries(OUTREACH_CHANNEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Variable override fields */}
        {selectedTemplate.variables.map((varName) => (
          <div className="form-group" key={varName}>
            <label className="form-label">
              {varName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </label>
            <input
              className="form-input"
              placeholder={autoFilledVars[varName] || `Enter ${varName}`}
              value={variableOverrides[varName] || ''}
              onChange={(e) => handleOverrideChange(varName, e.target.value)}
            />
            {autoFilledVars[varName] && !variableOverrides[varName] && (
              <span className="text-sm text-muted" style={{ marginTop: 2, display: 'block' }}>
                Auto-filled: {autoFilledVars[varName]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Right: Preview */}
      <div>
        <div className="drafter-preview">
          <div className="drafter-preview-label">Live Preview</div>
          {selectedTemplate.subject && (
            <div style={{ marginBottom: 12 }}>
              <span className="text-sm text-muted">Subject: </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {renderTemplate(selectedTemplate.subject, mergedVars)}
              </span>
            </div>
          )}
          <div className="drafter-preview-text">{renderedMessage}</div>

          {unfilledVars.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <span className="text-sm text-red">
                Missing variables: {unfilledVars.join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="drafter-actions">
          <button className="btn btn-secondary" onClick={handleCopy}>
            <Copy size={14} />
            Copy to Clipboard
          </button>
          <button
            className="btn btn-primary"
            onClick={handleLogOutreach}
            disabled={!selectedLead || unfilledVars.length > 0}
          >
            <Send size={14} />
            Log Outreach
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageDrafter

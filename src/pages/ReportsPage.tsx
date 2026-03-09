import { useState, useMemo } from 'react'
import { FileText, Copy, Download, Save, Trash2 } from 'lucide-react'
import { useClientsStore } from '../stores/clients-store'
import { useLiveSessionsStore } from '../stores/live-sessions-store'
import { useCreatorsStore } from '../stores/creators-store'
import { useAdsStore } from '../stores/ads-store'
import { useReportsStore } from '../stores/reports-store'
import { generateWeeklyReport, reportToMarkdown } from '../lib/report-generator'
import { formatDate } from '../lib/utils'
import { showSuccess, showError } from '../stores/toast-store'
import type { WeeklyReport } from '../types'
import './ReportsPage.css'

function getMonday(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

function getSunday(mondayStr: string): string {
  const d = new Date(mondayStr + 'T00:00:00')
  d.setDate(d.getDate() + 6)
  return d.toISOString().split('T')[0]
}

function getPreviousWeekRange(mondayStr: string): { start: string; end: string } {
  const d = new Date(mondayStr + 'T00:00:00')
  d.setDate(d.getDate() - 7)
  const start = d.toISOString().split('T')[0]
  const end = getSunday(start)
  return { start, end }
}

function renderMarkdownToHtml(md: string): string {
  let html = md
  // Headings
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />')
  // Tables
  html = html.replace(
    /(\|.+\|\n\|[-| ]+\|\n(?:\|.+\|\n?)+)/g,
    (match) => {
      const rows = match.trim().split('\n')
      const headerCells = rows[0].split('|').filter(c => c.trim())
      const dataRows = rows.slice(2)
      let table = '<table><thead><tr>'
      headerCells.forEach(c => { table += `<th>${c.trim()}</th>` })
      table += '</tr></thead><tbody>'
      dataRows.forEach(row => {
        const cells = row.split('|').filter(c => c.trim())
        table += '<tr>'
        cells.forEach(c => { table += `<td>${c.trim()}</td>` })
        table += '</tr>'
      })
      table += '</tbody></table>'
      return table
    }
  )
  // Line breaks for remaining lines (not already wrapped in tags)
  html = html
    .split('\n')
    .map(line => {
      const trimmed = line.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('<')) return trimmed
      return `<p>${trimmed}</p>`
    })
    .join('\n')
  return html
}

function ReportsPage() {
  const { getActiveClients } = useClientsStore()
  const activeClients = getActiveClients()

  const { getSessionsForWeek } = useLiveSessionsStore()
  const { getCreatorsByClient } = useCreatorsStore()
  const { getLogsForDateRange, getCampaignsByClient } = useAdsStore()
  const { reports, saveReport, updateReport, deleteReport, getReportsByClient } = useReportsStore()

  const [selectedClientId, setSelectedClientId] = useState(activeClients[0]?.id ?? '')
  const [weekDate, setWeekDate] = useState(() => getMonday(new Date().toISOString().split('T')[0]))
  const [currentReport, setCurrentReport] = useState<WeeklyReport | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const weekStart = getMonday(weekDate)
  const weekEnd = getSunday(weekStart)
  const weekLabel = `${formatDate(weekStart)} – ${formatDate(weekEnd)}`

  const selectedClient = activeClients.find(c => c.id === selectedClientId)

  const clientHistory = useMemo(() => {
    if (!selectedClientId) return []
    return getReportsByClient(selectedClientId).slice(0, 4)
  }, [selectedClientId, reports])

  function handleGenerate() {
    if (!selectedClient) {
      showError('Select a client first')
      return
    }

    // Get live sessions for this week and client
    const allWeekSessions = getSessionsForWeek(weekStart, weekEnd)
    const liveSessions = allWeekSessions.filter(s => s.clientId === selectedClientId)

    // Get creators for this client
    const creators = getCreatorsByClient(selectedClientId)

    // Get ad data
    const adLogs = getLogsForDateRange(selectedClientId, weekStart, weekEnd)
    const adCampaigns = getCampaignsByClient(selectedClientId)

    // Get previous week GMV for WoW comparison
    const prevWeek = getPreviousWeekRange(weekStart)
    const prevSessions = getSessionsForWeek(prevWeek.start, prevWeek.end)
      .filter(s => s.clientId === selectedClientId)
    const previousWeekGmv = prevSessions.length > 0
      ? prevSessions.reduce((sum, s) => sum + s.gmv, 0)
      : undefined

    const report = generateWeeklyReport({
      client: selectedClient,
      weekStart,
      weekEnd,
      liveSessions,
      creators,
      adCampaigns,
      adLogs,
      previousWeekGmv,
    })

    setCurrentReport(report)
    setIsSaved(false)
    showSuccess('Report generated')
  }

  function handleCopy() {
    if (!currentReport) return
    const md = reportToMarkdown(currentReport)
    navigator.clipboard.writeText(md).then(
      () => showSuccess('Copied to clipboard'),
      () => showError('Failed to copy')
    )
  }

  function handleDownload() {
    if (!currentReport) return
    const md = reportToMarkdown(currentReport)
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentReport.clientName}-report-${currentReport.weekStart}.md`
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('Report downloaded')
  }

  function handleSave() {
    if (!currentReport) return
    if (isSaved) {
      updateReport(currentReport.id, currentReport)
      showSuccess('Report updated')
    } else {
      saveReport(currentReport)
      setIsSaved(true)
      showSuccess('Report saved')
    }
  }

  function handleLoadReport(report: WeeklyReport) {
    setCurrentReport(report)
    setSelectedClientId(report.clientId)
    setWeekDate(report.weekStart)
    setIsSaved(true)
  }

  function handleDeleteReport(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    deleteReport(id)
    if (currentReport?.id === id) {
      setCurrentReport(null)
      setIsSaved(false)
    }
    showSuccess('Report deleted')
  }

  function handleManualFieldChange(field: 'manualWins' | 'manualNextWeek' | 'manualNeeded', value: string) {
    if (!currentReport) return
    setCurrentReport({ ...currentReport, [field]: value })
  }

  const previewHtml = currentReport ? renderMarkdownToHtml(reportToMarkdown(currentReport)) : ''

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={24} /> Weekly Reports
        </h1>
      </div>

      <div className="reports-layout">
        {/* Left Column — Controls */}
        <div className="reports-controls">
          <div className="reports-controls-title">Generate Report</div>

          {/* Client Selector */}
          <div className="form-group">
            <label className="form-label">Client</label>
            <select
              className="form-select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">Select a client...</option>
              {activeClients.map(c => (
                <option key={c.id} value={c.id}>{c.brandName}</option>
              ))}
            </select>
          </div>

          {/* Week Selector */}
          <div className="form-group">
            <label className="form-label">Week</label>
            <input
              className="form-input"
              type="date"
              value={weekDate}
              onChange={(e) => setWeekDate(e.target.value || weekDate)}
            />
            <div className="reports-week-label">{weekLabel}</div>
          </div>

          {/* Generate Button */}
          <button
            className="btn btn-primary reports-generate-btn"
            onClick={handleGenerate}
            disabled={!selectedClientId}
          >
            Generate Report
          </button>

          {/* Manual Fields (visible when report generated) */}
          {currentReport && (
            <div className="reports-manual-section">
              <div className="form-group">
                <label className="form-label">Key Wins This Week</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentReport.manualWins}
                  onChange={(e) => handleManualFieldChange('manualWins', e.target.value)}
                  placeholder="- Best GMV day ever&#10;- New creator partnership&#10;- Hit 100 orders milestone"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Next Week Plan</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentReport.manualNextWeek}
                  onChange={(e) => handleManualFieldChange('manualNextWeek', e.target.value)}
                  placeholder="- Scale ad budget by 20%&#10;- Launch 3 new creator collabs&#10;- Test evening LIVE slot"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Items Needed from Client</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={currentReport.manualNeeded}
                  onChange={(e) => handleManualFieldChange('manualNeeded', e.target.value)}
                  placeholder="- Approve new product bundle&#10;- Send 10 more samples&#10;- Confirm holiday schedule"
                />
              </div>
            </div>
          )}

          {/* Report History */}
          {clientHistory.length > 0 && (
            <div className="reports-history">
              <div className="reports-history-title">Saved Reports</div>
              {clientHistory.map(r => (
                <div
                  key={r.id}
                  className={`reports-history-item ${currentReport?.id === r.id ? 'active' : ''}`}
                  onClick={() => handleLoadReport(r)}
                >
                  <span>{formatDate(r.weekStart)} – {formatDate(r.weekEnd)}</span>
                  <button
                    className="reports-history-delete"
                    onClick={(e) => handleDeleteReport(e, r.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column — Preview */}
        <div className="reports-preview">
          <div className="reports-preview-header">
            <span className="reports-preview-title">Report Preview</span>
            {currentReport && (
              <div className="reports-preview-actions">
                <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                  <Copy size={14} /> Copy
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
                  <Download size={14} /> Download
                </button>
                <button className="btn btn-primary btn-sm" onClick={handleSave}>
                  <Save size={14} /> {isSaved ? 'Update' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="reports-preview-body">
            {currentReport ? (
              <div
                className="report-markdown"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="reports-preview-empty">
                <FileText size={48} className="reports-preview-empty-icon" />
                <div className="reports-preview-empty-text">
                  Select a client and week, then click<br />
                  <strong>Generate Report</strong> to preview
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage

import { useRef } from 'react'
import { Settings, Download, Upload, Database } from 'lucide-react'
import SheetsConnector from '../components/sheets/SheetsConnector'
import SyncStatus from '../components/sheets/SyncStatus'
import { useSheetsStore } from '../stores/sheets-store'
import { useLeadsStore } from '../stores/leads-store'
import { useClientsStore } from '../stores/clients-store'
import { useOutreachStore } from '../stores/outreach-store'
import { showSuccess, showError } from '../stores/toast-store'

function SettingsPage() {
  const { config, setConfig } = useSheetsStore()
  const leadsStore = useLeadsStore()
  const clientsStore = useClientsStore()
  const outreachStore = useOutreachStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSpreadsheetIdChange = (value: string) => {
    setConfig({ spreadsheetId: value })
  }

  const handleTabNameChange = (key: keyof typeof config.tabs, value: string) => {
    setConfig({
      tabs: {
        ...config.tabs,
        [key]: value,
      },
    } as Partial<typeof config>)
  }

  const handleExport = () => {
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      leads: leadsStore.leads,
      clients: clientsStore.clients,
      expenses: clientsStore.expenses,
      monthlyRevenue: clientsStore.monthlyRevenue,
      outreachRecords: outreachStore.records,
      sheetsConfig: config,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aria-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showSuccess('Data exported successfully')
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        if (data.leads) leadsStore.setLeads(data.leads)
        if (data.clients) clientsStore.setClients(data.clients)
        if (data.outreachRecords) outreachStore.setRecords(data.outreachRecords)
        if (data.sheetsConfig) setConfig(data.sheetsConfig)

        showSuccess('Data imported successfully')
      } catch {
        showError('Failed to import data. Check the file format.')
      }
    }
    reader.readAsText(file)

    // Reset the input so the same file can be re-imported
    e.target.value = ''
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={22} style={{ color: 'var(--aria-yellow)' }} />
            Settings
          </h1>
          <div className="page-header-subtitle">
            Manage Google Sheets integration, sync, and data
          </div>
        </div>
      </div>

      {/* Google Sheets Connection */}
      <div className="section">
        <SheetsConnector />
      </div>

      {/* Spreadsheet Configuration */}
      <div className="section">
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="section-title">
            <Database size={18} className="section-title-icon" />
            Spreadsheet Configuration
          </div>

          <div className="form-group">
            <label className="form-label">Spreadsheet ID</label>
            <input
              className="form-input"
              placeholder="Enter your Google Spreadsheet ID"
              value={config.spreadsheetId}
              onChange={(e) => handleSpreadsheetIdChange(e.target.value)}
            />
            <span className="text-sm text-muted" style={{ marginTop: 4, display: 'block' }}>
              Found in the spreadsheet URL: docs.google.com/spreadsheets/d/<strong>SPREADSHEET_ID</strong>/edit
            </span>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="form-label" style={{ marginBottom: 12 }}>Tab Names</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Lead Tracker</label>
                <input
                  className="form-input"
                  value={config.tabs.leadTracker}
                  onChange={(e) => handleTabNameChange('leadTracker', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Active Clients</label>
                <input
                  className="form-input"
                  value={config.tabs.activeClients}
                  onChange={(e) => handleTabNameChange('activeClients', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Revenue Dashboard</label>
                <input
                  className="form-input"
                  value={config.tabs.revenueDashboard}
                  onChange={(e) => handleTabNameChange('revenueDashboard', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Outreach Log</label>
                <input
                  className="form-input"
                  value={config.tabs.outreachLog}
                  onChange={(e) => handleTabNameChange('outreachLog', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="section">
        <SyncStatus />
      </div>

      {/* Data Management */}
      <div className="section">
        <div className="card">
          <div className="section-title">
            <Database size={18} className="section-title-icon" />
            Data Management
          </div>

          <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
            Export all your ARIA data as a JSON file for backup, or import a previously exported file to restore your data.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" onClick={handleExport}>
              <Download size={14} />
              Export All Data
            </button>
            <button className="btn btn-secondary" onClick={handleImport}>
              <Upload size={14} />
              Import Data
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

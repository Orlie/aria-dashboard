import { Upload, Download, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useSheetsStore } from '../../stores/sheets-store'
import { useLeadsStore } from '../../stores/leads-store'
import { useClientsStore } from '../../stores/clients-store'
import { useOutreachStore } from '../../stores/outreach-store'
import { formatDate } from '../../lib/utils'
import { showSuccess, showError } from '../../stores/toast-store'
import { pushToSheets, pullFromSheets } from '../../lib/sync-service'

function SyncStatus() {
  const {
    lastSyncAt,
    syncInProgress,
    error,
    isConnected,
    config,
    setSyncInProgress,
    setLastSyncAt,
    setError,
  } = useSheetsStore()

  const leadsStore = useLeadsStore()
  const clientsStore = useClientsStore()
  const outreachStore = useOutreachStore()

  const canSync = isConnected && !!config.spreadsheetId && !syncInProgress

  const handlePush = async () => {
    if (!canSync) return
    setSyncInProgress(true)
    setError(null)
    try {
      await pushToSheets(config, {
        leads: leadsStore.leads,
        clients: clientsStore.clients,
        monthlyRevenue: clientsStore.monthlyRevenue,
        expenses: clientsStore.expenses,
        outreachRecords: outreachStore.records,
      })
      setLastSyncAt(new Date().toISOString())
      showSuccess('Uploaded to Google Sheets')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setError(msg)
      showError('Upload failed — check console for details')
      console.error('[ARIA Sync] Push error:', err)
    } finally {
      setSyncInProgress(false)
    }
  }

  const handlePull = async () => {
    if (!canSync) return
    setSyncInProgress(true)
    setError(null)
    try {
      const data = await pullFromSheets(config)
      if (data.leads.length > 0) leadsStore.setLeads(data.leads)
      if (data.clients.length > 0) clientsStore.setClients(data.clients)
      if (data.outreachRecords.length > 0) outreachStore.setRecords(data.outreachRecords)
      setLastSyncAt(new Date().toISOString())
      showSuccess(`Downloaded from Google Sheets — ${data.leads.length} leads, ${data.clients.length} clients`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Download failed'
      setError(msg)
      showError('Download failed — check console for details')
      console.error('[ARIA Sync] Pull error:', err)
    } finally {
      setSyncInProgress(false)
    }
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="section-title">
        <RefreshCw size={18} className="section-title-icon" />
        Sync Controls
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="form-label" style={{ marginBottom: 4 }}>Last Synced</div>
        <div style={{ fontSize: 14 }}>
          {lastSyncAt ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={14} style={{ color: 'var(--aria-green)' }} />
              {formatDate(lastSyncAt)}
            </span>
          ) : (
            <span className="text-muted">Never synced</span>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--aria-red-muted)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--aria-red)',
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {!config.spreadsheetId && isConnected && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--aria-yellow-muted, rgba(234,179,8,0.1))',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--aria-yellow, #ca8a04)',
            fontSize: 13,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={14} />
          Enter your Spreadsheet ID below to enable sync.
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-primary"
          onClick={handlePush}
          disabled={!canSync}
          title="Upload ARIA data → Google Sheets"
          style={{ flex: 1 }}
        >
          {syncInProgress ? (
            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Upload size={14} />
          )}
          {syncInProgress ? 'Syncing…' : 'Upload to Sheets'}
        </button>

        <button
          className="btn btn-secondary"
          onClick={handlePull}
          disabled={!canSync}
          title="Download Google Sheets → ARIA"
          style={{ flex: 1 }}
        >
          {syncInProgress ? (
            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Download size={14} />
          )}
          {syncInProgress ? 'Syncing…' : 'Download from Sheets'}
        </button>
      </div>

      {!isConnected && (
        <p className="text-sm text-muted" style={{ marginTop: 8 }}>
          Connect Google Sheets above to enable syncing.
        </p>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default SyncStatus

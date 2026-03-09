import { useState, useEffect, useCallback } from 'react'
import { Link2, Unlink, AlertCircle, CheckCircle } from 'lucide-react'
import { useSheetsStore } from '../../stores/sheets-store'
import {
  initGoogleApi,
  initTokenClient,
  signIn,
  signOut,
  isSignedIn,
} from '../../lib/google-sheets'
import ConfirmDialog from '../shared/ConfirmDialog'
import { showSuccess, showError, showInfo } from '../../stores/toast-store'

function SheetsConnector() {
  const { isConnected, setConnected, error, setError } = useSheetsStore()
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)

  const initialize = useCallback(async () => {
    try {
      await initGoogleApi()
      initTokenClient((success) => {
        setConnected(success)
        if (!success) {
          setError('Failed to authenticate with Google.')
          showError('Failed to connect')
        } else {
          setError(null)
          showSuccess('Connected to Google Sheets')
        }
        setLoading(false)
      })
      setInitialized(true)
    } catch {
      setError('Failed to load Google API. Check your API key.')
      setInitialized(true)
    }
  }, [setConnected, setError])

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleConnect = () => {
    if (!initialized) return
    setLoading(true)
    setError(null)
    signIn()
  }

  const handleDisconnect = () => {
    signOut()
    setConnected(false)
    setError(null)
    showInfo('Google Sheets disconnected')
    setShowDisconnectConfirm(false)
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="section-title">
        <Link2 size={18} className="section-title-icon" />
        Google Sheets Connection
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span className="text-sm" style={{ fontWeight: 600 }}>Status:</span>
        {isConnected || isSignedIn() ? (
          <span className="badge badge-done">
            <CheckCircle size={12} />
            Connected
          </span>
        ) : (
          <span className="badge badge-overdue">
            <AlertCircle size={12} />
            Disconnected
          </span>
        )}
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

      {isConnected || isSignedIn() ? (
        <button className="btn btn-danger btn-sm" onClick={() => setShowDisconnectConfirm(true)}>
          <Unlink size={14} />
          Disconnect
        </button>
      ) : (
        <button
          className="btn btn-primary"
          onClick={handleConnect}
          disabled={loading || !initialized}
        >
          <Link2 size={14} />
          {loading ? 'Connecting...' : 'Connect Google Sheets'}
        </button>
      )}

      {showDisconnectConfirm && (
        <ConfirmDialog
          title="Disconnect Google Sheets"
          message="This will disconnect your Google Sheets integration. You can reconnect anytime."
          confirmLabel="Disconnect"
          variant="warning"
          onConfirm={handleDisconnect}
          onCancel={() => setShowDisconnectConfirm(false)}
        />
      )}
    </div>
  )
}

export default SheetsConnector

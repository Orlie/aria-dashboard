import { useEffect, useRef } from 'react'
import { useSheetsStore } from '../stores/sheets-store'
import { useLeadsStore } from '../stores/leads-store'
import { useClientsStore } from '../stores/clients-store'
import { useOutreachStore } from '../stores/outreach-store'
import { pushToSheets } from './sync-service'

const SYNC_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

export function useAutoSync() {
  const isConnected = useSheetsStore((s) => s.isConnected)
  const config = useSheetsStore((s) => s.config)
  const syncInProgress = useSheetsStore((s) => s.syncInProgress)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const syncInProgressRef = useRef(syncInProgress)

  // Keep ref in sync so interval callback sees latest value
  useEffect(() => {
    syncInProgressRef.current = syncInProgress
  }, [syncInProgress])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isConnected || !config.spreadsheetId) return

    const runSync = async () => {
      if (syncInProgressRef.current) return

      const { setSyncInProgress, setLastSyncAt, setError } = useSheetsStore.getState()
      setSyncInProgress(true)

      try {
        const leads = useLeadsStore.getState().leads
        const { clients, monthlyRevenue, expenses } = useClientsStore.getState()
        const outreachRecords = useOutreachStore.getState().records
        const currentConfig = useSheetsStore.getState().config

        await pushToSheets(
          {
            spreadsheetId: currentConfig.spreadsheetId,
            tabs: currentConfig.tabs,
          },
          { leads, clients, monthlyRevenue, expenses, outreachRecords }
        )

        setLastSyncAt(new Date().toISOString())
        setError(null)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Auto-sync failed'
        setError(message)
        console.warn('ARIA auto-sync error:', message)
      } finally {
        setSyncInProgress(false)
      }
    }

    intervalRef.current = setInterval(runSync, SYNC_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isConnected, config.spreadsheetId])
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SheetsConfig, SyncState } from '../types'

interface SheetsStoreState extends SyncState {
  config: SheetsConfig

  setConnected: (connected: boolean) => void
  setConfig: (config: Partial<SheetsConfig>) => void
  setSyncInProgress: (inProgress: boolean) => void
  setLastSyncAt: (time: string) => void
  setError: (error: string | null) => void
}

const DEFAULT_CONFIG: SheetsConfig = {
  spreadsheetId: '',
  tabs: {
    leadTracker: 'Lead Tracker',
    activeClients: 'Active Clients',
    revenueDashboard: 'Revenue Dashboard',
    outreachLog: 'Outreach Log',
  },
}

export const useSheetsStore = create<SheetsStoreState>()(
  persist(
    (set) => ({
      isConnected: false,
      lastSyncAt: null,
      syncInProgress: false,
      error: null,
      config: DEFAULT_CONFIG,

      setConnected: (isConnected) => set({ isConnected }),
      setConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config },
        })),
      setSyncInProgress: (syncInProgress) => set({ syncInProgress }),
      setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),
      setError: (error) => set({ error }),
    }),
    { name: 'aria-sheets' }
  )
)

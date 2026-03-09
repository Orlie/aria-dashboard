import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdCampaign, AdDailyLog, AdAlert } from '../types'
import { generateId, getToday } from '../lib/utils'

interface AdsState {
  campaigns: AdCampaign[]
  dailyLogs: AdDailyLog[]

  addCampaign: (campaign: Omit<AdCampaign, 'id' | 'createdAt'>) => void
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void
  deleteCampaign: (id: string) => void

  addDailyLog: (log: Omit<AdDailyLog, 'id' | 'createdAt'>) => void
  updateDailyLog: (id: string, updates: Partial<AdDailyLog>) => void
  deleteDailyLog: (id: string) => void

  getCampaignsByClient: (clientId: string) => AdCampaign[]
  getLogsForCampaign: (campaignId: string) => AdDailyLog[]
  getLogsForClient: (clientId: string) => AdDailyLog[]
  getLogsForDateRange: (clientId: string, startDate: string, endDate: string) => AdDailyLog[]
  getCampaignAlert: (campaignId: string) => AdAlert
}

export const useAdsStore = create<AdsState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      dailyLogs: [],

      addCampaign: (campaignData) => {
        const campaign: AdCampaign = {
          ...campaignData,
          id: generateId(),
          createdAt: getToday(),
        }
        set((state) => ({ campaigns: [...state.campaigns, campaign] }))
      },

      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }))
      },

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
          dailyLogs: state.dailyLogs.filter((l) => l.campaignId !== id),
        }))
      },

      addDailyLog: (logData) => {
        const roas = logData.roas || (logData.spend > 0 ? logData.gmv / logData.spend : 0)
        const log: AdDailyLog = {
          ...logData,
          roas,
          id: generateId(),
          createdAt: getToday(),
        }
        set((state) => ({ dailyLogs: [...state.dailyLogs, log] }))
      },

      updateDailyLog: (id, updates) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        }))
      },

      deleteDailyLog: (id) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.filter((l) => l.id !== id),
        }))
      },

      getCampaignsByClient: (clientId) => {
        return get().campaigns.filter((c) => c.clientId === clientId)
      },

      getLogsForCampaign: (campaignId) => {
        return get().dailyLogs
          .filter((l) => l.campaignId === campaignId)
          .sort((a, b) => a.date.localeCompare(b.date))
      },

      getLogsForClient: (clientId) => {
        return get().dailyLogs.filter((l) => l.clientId === clientId)
      },

      getLogsForDateRange: (clientId, startDate, endDate) => {
        return get().dailyLogs.filter(
          (l) => l.clientId === clientId && l.date >= startDate && l.date <= endDate
        )
      },

      getCampaignAlert: (campaignId) => {
        const logs = get()
          .getLogsForCampaign(campaignId)
          .slice(-3)
        if (logs.length === 0) return null

        const campaign = get().campaigns.find((c) => c.id === campaignId)
        if (!campaign) return null

        const latestLog = logs[logs.length - 1]

        // Over budget check (120% of daily budget)
        if (latestLog.spend > campaign.dailyBudget * 1.2) return 'over_budget'

        // ROAS < 1.5 for 3+ consecutive days → pause
        if (logs.length >= 3) {
          const allLowRoas = logs.every((l) => l.roas < 1.5)
          if (allLowRoas) return 'pause_recommended'
        }

        // ROAS > 4.0 → scale
        if (latestLog.roas > 4.0) return 'scale_recommended'

        // ROAS 3.0-4.0 → good performance
        if (latestLog.roas >= 3.0) return 'good_performance'

        return null
      },
    }),
    { name: 'aria-ads' }
  )
)

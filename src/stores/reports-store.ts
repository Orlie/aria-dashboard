import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeeklyReport } from '../types'

interface ReportsState {
  reports: WeeklyReport[]
  saveReport: (report: WeeklyReport) => void
  updateReport: (id: string, updates: Partial<WeeklyReport>) => void
  deleteReport: (id: string) => void
  getReportsByClient: (clientId: string) => WeeklyReport[]
  getReportForWeek: (clientId: string, weekStart: string) => WeeklyReport | undefined
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],

      saveReport: (report) => {
        set((state) => ({ reports: [...state.reports, report] }))
      },

      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }))
      },

      deleteReport: (id) => {
        set((state) => ({ reports: state.reports.filter((r) => r.id !== id) }))
      },

      getReportsByClient: (clientId) => {
        return get()
          .reports.filter((r) => r.clientId === clientId)
          .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
      },

      getReportForWeek: (clientId, weekStart) => {
        return get().reports.find(
          (r) => r.clientId === clientId && r.weekStart === weekStart
        )
      },
    }),
    { name: 'aria-reports' }
  )
)

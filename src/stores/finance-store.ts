import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MonthlyFinance } from '../types'

interface FinanceState {
  months: MonthlyFinance[]
  importMonth: (data: MonthlyFinance) => void
  removeMonth: (monthLabel: string) => void
  clearAll: () => void
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      months: [],

      importMonth: (data) =>
        set((state) => ({
          months: [
            ...state.months.filter((m) => m.month !== data.month),
            data,
          ].sort((a, b) => a.month.localeCompare(b.month)),
        })),

      removeMonth: (monthLabel) =>
        set((state) => ({
          months: state.months.filter((m) => m.month !== monthLabel),
        })),

      clearAll: () => set({ months: [] }),
    }),
    { name: 'aria-personal-finance' }
  )
)

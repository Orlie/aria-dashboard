import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OutreachRecord } from '../types'
import { generateId } from '../lib/utils'

interface OutreachState {
  records: OutreachRecord[]
  setRecords: (records: OutreachRecord[]) => void
  addRecord: (record: Omit<OutreachRecord, 'id'>) => void
  updateRecord: (id: string, updates: Partial<OutreachRecord>) => void
  deleteRecord: (id: string) => void
}

export const useOutreachStore = create<OutreachState>()(
  persist(
    (set) => ({
      records: [],

      setRecords: (records) => set({ records }),

      addRecord: (recordData) =>
        set((state) => ({
          records: [
            { ...recordData, id: generateId() },
            ...state.records,
          ],
        })),

      updateRecord: (id, updates) =>
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
    }),
    { name: 'aria-outreach' }
  )
)

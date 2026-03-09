import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lead, LeadStatus, LeadScore } from '../types'
import { calculateOverallScore } from '../lib/scoring'
import { generateId, getToday } from '../lib/utils'
import { DEMO_LEADS } from '../lib/demo-data'

interface LeadsState {
  leads: Lead[]
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
  updateLeadScore: (id: string, score: Omit<LeadScore, 'overall'>) => void
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set) => ({
      leads: DEMO_LEADS,

      setLeads: (leads) => set({ leads }),

      addLead: (leadData) =>
        set((state) => ({
          leads: [
            ...state.leads,
            {
              ...leadData,
              id: generateId(),
              createdAt: getToday(),
              updatedAt: getToday(),
            },
          ],
        })),

      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: getToday() } : l
          ),
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),

      updateLeadStatus: (id, status) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                ...l,
                status,
                updatedAt: getToday(),
                ...(status !== l.status &&
                  ['contacted', 'replied', 'meeting_set', 'negotiating'].includes(status)
                  ? { lastContactedAt: getToday() }
                  : {}),
              }
              : l
          ),
        })),

      updateLeadScore: (id, score) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? {
                ...l,
                score: { ...score, overall: calculateOverallScore(score) },
                updatedAt: getToday(),
              }
              : l
          ),
        })),
    }),
    { name: 'aria-leads' }
  )
)

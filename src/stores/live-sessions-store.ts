import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LiveSession } from '../types'
import { generateId, getToday } from '../lib/utils'

interface LiveSessionsState {
  sessions: LiveSession[]
  addSession: (session: Omit<LiveSession, 'id' | 'createdAt'>) => void
  updateSession: (id: string, updates: Partial<LiveSession>) => void
  deleteSession: (id: string) => void
  getSessionsByClient: (clientId: string) => LiveSession[]
  getSessionsThisWeek: () => LiveSession[]
  getSessionsForWeek: (startDate: string, endDate: string) => LiveSession[]
}

export const useLiveSessionsStore = create<LiveSessionsState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (sessionData) => {
        const session: LiveSession = {
          ...sessionData,
          id: generateId(),
          createdAt: getToday(),
        }
        set((state) => ({ sessions: [...state.sessions, session] }))
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }))
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        }))
      },

      getSessionsByClient: (clientId) => {
        return get().sessions.filter((s) => s.clientId === clientId)
      },

      getSessionsThisWeek: () => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        const startStr = startOfWeek.toISOString().split('T')[0]
        return get().sessions.filter((s) => s.date >= startStr)
      },

      getSessionsForWeek: (startDate, endDate) => {
        return get().sessions.filter(
          (s) => s.date >= startDate && s.date <= endDate
        )
      },
    }),
    { name: 'aria-live-sessions' }
  )
)

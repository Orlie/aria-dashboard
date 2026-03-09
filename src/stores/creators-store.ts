import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Creator, CreatorStatus } from '../types'
import { generateId, getToday } from '../lib/utils'

interface CreatorsState {
  creators: Creator[]
  addCreator: (creator: Omit<Creator, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCreator: (id: string, updates: Partial<Creator>) => void
  updateCreatorStatus: (id: string, status: CreatorStatus) => void
  deleteCreator: (id: string) => void
  getCreatorsByClient: (clientId: string) => Creator[]
}

export const useCreatorsStore = create<CreatorsState>()(
  persist(
    (set, get) => ({
      creators: [],

      addCreator: (creatorData) => {
        const creator: Creator = {
          ...creatorData,
          id: generateId(),
          createdAt: getToday(),
          updatedAt: getToday(),
        }
        set((state) => ({ creators: [...state.creators, creator] }))
      },

      updateCreator: (id, updates) => {
        set((state) => ({
          creators: state.creators.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: getToday() } : c
          ),
        }))
      },

      updateCreatorStatus: (id, status) => {
        set((state) => ({
          creators: state.creators.map((c) =>
            c.id === id ? { ...c, status, updatedAt: getToday() } : c
          ),
        }))
      },

      deleteCreator: (id) => {
        set((state) => ({
          creators: state.creators.filter((c) => c.id !== id),
        }))
      },

      getCreatorsByClient: (clientId) => {
        return get().creators.filter((c) => c.clientId === clientId)
      },
    }),
    { name: 'aria-creators' }
  )
)

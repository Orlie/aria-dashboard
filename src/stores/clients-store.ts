import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Client, MonthlyRevenue, Expense, RevenueSnapshot } from '../types'
import { generateId } from '../lib/utils'

const REVENUE_TARGET = 1_000_000

interface ClientsState {
  clients: Client[]
  monthlyRevenue: MonthlyRevenue[]
  expenses: Expense[]

  setClients: (clients: Client[]) => void
  addClient: (client: Omit<Client, 'id' | 'monthlyRevenue'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void

  addExpense: (expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: string) => void

  addMonthlyRevenue: (data: Omit<MonthlyRevenue, 'gap' | 'percentToGoal'>) => void

  getRevenueSnapshot: () => RevenueSnapshot
  getActiveClients: () => Client[]
}

function computeClientRevenue(client: Omit<Client, 'id' | 'monthlyRevenue'> & { id?: string }): number {
  return client.contractValue + (client.actualGmv * client.commissionRate)
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      monthlyRevenue: [],
      expenses: [],

      setClients: (clients) => set({ clients }),

      addClient: (clientData) =>
        set((state) => ({
          clients: [
            ...state.clients,
            {
              ...clientData,
              id: generateId(),
              monthlyRevenue: computeClientRevenue(clientData),
            },
          ],
        })),

      updateClient: (id, updates) =>
        set((state) => ({
          clients: state.clients.map((c) => {
            if (c.id !== id) return c
            const updated = { ...c, ...updates }
            updated.monthlyRevenue = computeClientRevenue(updated)
            return updated
          }),
        })),

      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      addExpense: (expenseData) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expenseData, id: generateId() },
          ],
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addMonthlyRevenue: (data) =>
        set((state) => ({
          monthlyRevenue: [
            ...state.monthlyRevenue.filter((m) => m.month !== data.month),
            {
              ...data,
              gap: REVENUE_TARGET - data.mrr,
              percentToGoal: (data.mrr / REVENUE_TARGET) * 100,
            },
          ].sort((a, b) => a.month.localeCompare(b.month)),
        })),

      getRevenueSnapshot: () => {
        const state = get()
        const activeClients = state.clients.filter((c) => c.status === 'active')
        const currentMrr = activeClients.reduce((sum, c) => sum + c.monthlyRevenue, 0)
        const totalExpenses = state.expenses
          .filter((e) => e.recurring || e.date.startsWith(new Date().toISOString().slice(0, 7)))
          .reduce((sum, e) => sum + e.amount, 0)

        return {
          currentMrr,
          target: REVENUE_TARGET,
          gap: REVENUE_TARGET - currentMrr,
          percentToGoal: (currentMrr / REVENUE_TARGET) * 100,
          totalExpenses,
          netProfit: currentMrr - totalExpenses,
          clientCount: activeClients.length,
          averageRevenuePerClient: activeClients.length > 0 ? currentMrr / activeClients.length : 0,
        }
      },

      getActiveClients: () => {
        return get().clients.filter((c) => c.status === 'active')
      },
    }),
    { name: 'aria-clients' }
  )
)

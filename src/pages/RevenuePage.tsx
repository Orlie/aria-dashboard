import { useState } from 'react'
import { DollarSign, TrendingUp, Users, BarChart3, Receipt, Wallet, ChevronDown } from 'lucide-react'
import { useClientsStore } from '../stores/clients-store'
import RevenueKpiBar from '../components/revenue/RevenueKpiBar'
import RevenueTrendChart from '../components/revenue/RevenueTrendChart'
import ClientRevenueTable from '../components/revenue/ClientRevenueTable'
import ClientForm from '../components/revenue/ClientForm'
import GapAnalysis from '../components/revenue/GapAnalysis'
import ExpenseTracker from '../components/revenue/ExpenseTracker'
import PersonalFinance from '../components/revenue/PersonalFinance'
import EmptyState from '../components/shared/EmptyState'
import type { Client } from '../types'
import { showSuccess } from '../stores/toast-store'

type SectionKey = 'trend' | 'clients' | 'gap' | 'expenses' | 'finance'

function RevenuePage() {
  const {
    clients,
    monthlyRevenue,
    expenses,
    addClient,
    updateClient,
    addExpense,
    deleteExpense,
    getRevenueSnapshot,
    getActiveClients,
  } = useClientsStore()

  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined)
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    trend: false,
    clients: false,
    gap: false,
    expenses: false,
    finance: false,
  })

  const toggleSection = (key: SectionKey) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const snapshot = getRevenueSnapshot()
  const activeClients = getActiveClients()

  const handleSaveClient = (data: Omit<Client, 'id' | 'monthlyRevenue'>) => {
    if (editingClient) {
      updateClient(editingClient.id, data)
    } else {
      addClient(data)
    }
    showSuccess(editingClient ? 'Client updated' : 'Client added')
    setShowClientForm(false)
    setEditingClient(undefined)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setShowClientForm(true)
  }

  const handleCloseForm = () => {
    setShowClientForm(false)
    setEditingClient(undefined)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Revenue Dashboard</h1>
          <div className="page-header-subtitle">
            Track MRR, clients, expenses, and your path to $1M/month
          </div>
        </div>
      </div>

      <RevenueKpiBar snapshot={snapshot} />

      {/* Revenue Trend */}
      <div className="section">
        <div className="section-header-toggle" onClick={() => toggleSection('trend')}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <TrendingUp size={18} className="section-title-icon" />
            Revenue Trend
          </div>
          <ChevronDown size={18} className={`section-toggle-icon${collapsed.trend ? ' collapsed' : ''}`} />
        </div>
        <div className={`section-content${collapsed.trend ? ' collapsed' : ''}`}>
          {monthlyRevenue.length > 0 ? (
            <RevenueTrendChart data={monthlyRevenue} />
          ) : (
            <div className="card">
              <EmptyState
                icon={<BarChart3 size={40} />}
                title="No Revenue Data Yet"
                description="Monthly revenue data will appear here as you track client performance."
              />
            </div>
          )}
        </div>
      </div>

      {/* Active Clients */}
      <div className="section">
        <div className="section-header-toggle" onClick={() => toggleSection('clients')}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <Users size={18} className="section-title-icon" />
            Active Clients ({activeClients.length})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => { e.stopPropagation(); setShowClientForm(true) }}
            >
              <DollarSign size={14} />
              Add Client
            </button>
            <ChevronDown size={18} className={`section-toggle-icon${collapsed.clients ? ' collapsed' : ''}`} />
          </div>
        </div>
        <div className={`section-content${collapsed.clients ? ' collapsed' : ''}`}>
          {clients.length > 0 ? (
            <ClientRevenueTable clients={clients} onEdit={handleEditClient} />
          ) : (
            <div className="card">
              <EmptyState
                icon={<Users size={40} />}
                title="No Clients Yet"
                description="Add your first client to start tracking revenue."
                action={
                  <button className="btn btn-primary" onClick={() => setShowClientForm(true)}>
                    <DollarSign size={14} />
                    Add Client
                  </button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="section">
        <div className="section-header-toggle" onClick={() => toggleSection('gap')}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <BarChart3 size={18} className="section-title-icon" />
            Gap Analysis
          </div>
          <ChevronDown size={18} className={`section-toggle-icon${collapsed.gap ? ' collapsed' : ''}`} />
        </div>
        <div className={`section-content${collapsed.gap ? ' collapsed' : ''}`}>
          <GapAnalysis snapshot={snapshot} />
        </div>
      </div>

      {/* Expense Tracker */}
      <div className="section">
        <div className="section-header-toggle" onClick={() => toggleSection('expenses')}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <Receipt size={18} className="section-title-icon" />
            Expense Tracker
          </div>
          <ChevronDown size={18} className={`section-toggle-icon${collapsed.expenses ? ' collapsed' : ''}`} />
        </div>
        <div className={`section-content${collapsed.expenses ? ' collapsed' : ''}`}>
          <ExpenseTracker
            expenses={expenses}
            onAdd={addExpense}
            onDelete={deleteExpense}
            netProfit={snapshot.netProfit}
          />
        </div>
      </div>

      {/* Personal Finance */}
      <div className="section">
        <div className="section-header-toggle" onClick={() => toggleSection('finance')}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <Wallet size={18} className="section-title-icon" />
            Personal Finance
          </div>
          <ChevronDown size={18} className={`section-toggle-icon${collapsed.finance ? ' collapsed' : ''}`} />
        </div>
        <div className={`section-content${collapsed.finance ? ' collapsed' : ''}`}>
          <PersonalFinance />
        </div>
      </div>

      {/* Client Form Modal */}
      {showClientForm && (
        <ClientForm
          client={editingClient}
          onSave={handleSaveClient}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default RevenuePage

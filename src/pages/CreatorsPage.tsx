import { useState, useMemo, useEffect } from 'react'
import { Users, Plus } from 'lucide-react'
import { useCreatorsStore } from '../stores/creators-store'
import { useClientsStore } from '../stores/clients-store'
import KpiCard from '../components/shared/KpiCard'
import EmptyState from '../components/shared/EmptyState'
import CreatorPipeline from '../components/creators/CreatorPipeline'
import CreatorForm from '../components/creators/CreatorForm'
import { formatCurrency, isOverdue } from '../lib/utils'
import type { Creator } from '../types'

function CreatorsPage() {
  const { creators } = useCreatorsStore()
  const { clients } = useClientsStore()
  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [clients])

  const [selectedTab, setSelectedTab] = useState<'overview' | string>('overview')
  const [showForm, setShowForm] = useState(false)
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null)

  // Auto-select first client if no overview data
  useEffect(() => {
    if (selectedTab === 'overview' && activeClients.length === 1) {
      setSelectedTab(activeClients[0].id)
    }
  }, [activeClients])

  const selectedClientCreators = useMemo(() => {
    if (selectedTab === 'overview') return creators
    return creators.filter((c) => c.clientId === selectedTab)
  }, [creators, selectedTab])

  const stats = useMemo(() => {
    const list = selectedClientCreators
    const activePartners = list.filter((c) => c.status === 'active_partner').length
    const totalGmv = list.reduce((sum, c) => sum + c.totalGmv, 0)
    const contentDue = list.filter((c) => c.status === 'content_due').length
    const overdue = list.filter(
      (c) => c.contentDueDate && !c.contentPostedDate && isOverdue(c.contentDueDate)
    ).length
    return { activePartners, totalGmv, contentDue, overdue }
  }, [selectedClientCreators])

  function handleSelectCreator(creator: Creator) {
    setEditingCreator(creator)
    setShowForm(true)
  }

  function handleAddCreator() {
    setEditingCreator(null)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingCreator(null)
  }

  // No active clients
  if (activeClients.length === 0) {
    return (
      <div>
        <div className="flex-between" style={{ marginBottom: 24 }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={24} /> Creator Program
          </h1>
        </div>
        <EmptyState
          icon={<Users size={40} />}
          title="No Active Clients"
          description="Add clients in the Revenue module first, then manage their creator programs here."
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={24} /> Creator Program
        </h1>
        <button className="btn btn-primary" onClick={handleAddCreator}>
          <Plus size={16} style={{ marginRight: 4 }} /> Add Creator
        </button>
      </div>

      {/* Client Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {activeClients.length > 1 && (
          <button
            className={`tab-item ${selectedTab === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
        )}
        {activeClients.map((client) => (
          <button
            key={client.id}
            className={`tab-item ${selectedTab === client.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(client.id)}
          >
            {client.brandName}
          </button>
        ))}
      </div>

      {/* KPI Row */}
      <div className="kpi-row" style={{ marginBottom: 24 }}>
        <KpiCard label="Active Partners" value={String(stats.activePartners)} />
        <KpiCard label="Total GMV" value={formatCurrency(stats.totalGmv)} variant="positive" />
        <KpiCard label="Content Due" value={String(stats.contentDue)} />
        <KpiCard
          label="Overdue"
          value={String(stats.overdue)}
          variant={stats.overdue > 0 ? 'negative' : 'default'}
        />
      </div>

      {/* Content */}
      {selectedTab === 'overview' ? (
        // Overview table
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Active Creators</th>
                <th>Total GMV</th>
                <th>Content Pending</th>
                <th>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {activeClients.map((client) => {
                const clientCreators = creators.filter((c) => c.clientId === client.id)
                const active = clientCreators.filter((c) => c.status === 'active_partner').length
                const gmv = clientCreators.reduce((sum, c) => sum + c.totalGmv, 0)
                const pending = clientCreators.filter((c) => c.status === 'content_due').length
                const overdue = clientCreators.filter(
                  (c) => c.contentDueDate && !c.contentPostedDate && isOverdue(c.contentDueDate)
                ).length

                return (
                  <tr key={client.id}>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedTab(client.id)}
                        style={{ fontWeight: 600 }}
                      >
                        {client.brandName}
                      </button>
                    </td>
                    <td>{active}</td>
                    <td>{formatCurrency(gmv)}</td>
                    <td>{pending}</td>
                    <td style={{ color: overdue > 0 ? 'var(--aria-red)' : undefined }}>
                      {overdue}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Pipeline view for selected client
        selectedClientCreators.length === 0 ? (
          <EmptyState
            icon={<Users size={40} />}
            title="No Creators Yet"
            description="Start recruiting creators for this client's free sample program."
            action={
              <button className="btn btn-primary" onClick={handleAddCreator}>
                <Plus size={14} style={{ marginRight: 4 }} /> Add Creator
              </button>
            }
          />
        ) : (
          <CreatorPipeline
            clientId={selectedTab}
            onSelectCreator={handleSelectCreator}
            onAddCreator={handleAddCreator}
          />
        )
      )}

      {/* Creator Form Modal */}
      <CreatorForm
        isOpen={showForm}
        onClose={handleCloseForm}
        creator={editingCreator ?? undefined}
        defaultClientId={selectedTab !== 'overview' ? selectedTab : undefined}
      />
    </div>
  )
}

export default CreatorsPage

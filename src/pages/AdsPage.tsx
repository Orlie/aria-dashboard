import { useState, useMemo, useEffect } from 'react'
import { Megaphone, Plus } from 'lucide-react'
import { useAdsStore } from '../stores/ads-store'
import { useClientsStore } from '../stores/clients-store'
import KpiCard from '../components/shared/KpiCard'
import Modal from '../components/shared/Modal'
import EmptyState from '../components/shared/EmptyState'
import AdCampaignCard from '../components/ads/AdCampaignCard'
import AdDailyLogForm from '../components/ads/AdDailyLogForm'
import AdPerformanceChart from '../components/ads/AdPerformanceChart'
import { formatCurrency, getToday } from '../lib/utils'
import { showSuccess } from '../stores/toast-store'
import type { AdCampaign, AdCampaignStatus } from '../types'

function AdsPage() {
  const { campaigns, dailyLogs, addCampaign, updateCampaign, deleteCampaign } = useAdsStore()
  const { clients } = useClientsStore()
  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [clients])

  const [selectedClientId, setSelectedClientId] = useState('')
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null)
  const [loggingCampaign, setLoggingCampaign] = useState<AdCampaign | null>(null)
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null)

  // Campaign form state
  const [formName, setFormName] = useState('')
  const [formBudget, setFormBudget] = useState(0)
  const [formStatus, setFormStatus] = useState<AdCampaignStatus>('active')
  const [formStartDate, setFormStartDate] = useState(getToday())
  const [formNotes, setFormNotes] = useState('')

  // Auto-select first client
  useEffect(() => {
    if (!selectedClientId && activeClients.length > 0) {
      setSelectedClientId(activeClients[0].id)
    }
  }, [activeClients, selectedClientId])

  const clientCampaigns = useMemo(
    () => campaigns.filter((c) => c.clientId === selectedClientId),
    [campaigns, selectedClientId]
  )

  const clientLogs = useMemo(
    () => dailyLogs.filter((l) => l.clientId === selectedClientId),
    [dailyLogs, selectedClientId]
  )

  const stats = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const cutoff = thirtyDaysAgo.toISOString().split('T')[0]

    const recentLogs = clientLogs.filter((l) => l.date >= cutoff)
    const totalSpend = recentLogs.reduce((sum, l) => sum + l.spend, 0)
    const totalGmv = recentLogs.reduce((sum, l) => sum + l.gmv, 0)
    const avgRoas = totalSpend > 0 ? totalGmv / totalSpend : 0
    const activeCampaigns = clientCampaigns.filter((c) => c.status === 'active').length

    return { totalSpend, totalGmv, avgRoas, activeCampaigns }
  }, [clientCampaigns, clientLogs])

  const selectedClient = activeClients.find((c) => c.id === selectedClientId)

  function resetForm() {
    setFormName('')
    setFormBudget(0)
    setFormStatus('active')
    setFormStartDate(getToday())
    setFormNotes('')
  }

  function handleOpenAdd() {
    resetForm()
    setEditingCampaign(null)
    setShowCampaignForm(true)
  }

  function handleOpenEdit(campaign: AdCampaign) {
    setFormName(campaign.campaignName)
    setFormBudget(campaign.dailyBudget)
    setFormStatus(campaign.status)
    setFormStartDate(campaign.startDate)
    setFormNotes(campaign.notes)
    setEditingCampaign(campaign)
    setShowCampaignForm(true)
  }

  function handleCloseForm() {
    setShowCampaignForm(false)
    setEditingCampaign(null)
    resetForm()
  }

  function handleSaveCampaign(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        campaignName: formName.trim(),
        dailyBudget: formBudget,
        status: formStatus,
        startDate: formStartDate,
        notes: formNotes,
      })
      showSuccess('Campaign updated')
    } else {
      addCampaign({
        clientId: selectedClientId,
        campaignName: formName.trim(),
        dailyBudget: formBudget,
        status: formStatus,
        startDate: formStartDate,
        notes: formNotes,
      })
      showSuccess('Campaign added')
    }
    handleCloseForm()
  }

  function handleDeleteCampaign(id: string) {
    if (window.confirm('Delete this campaign and all its daily logs?')) {
      deleteCampaign(id)
      showSuccess('Campaign deleted')
    }
  }

  // No active clients
  if (activeClients.length === 0) {
    return (
      <div>
        <div className="flex-between" style={{ marginBottom: 24 }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Megaphone size={24} /> Ad Campaigns
          </h1>
        </div>
        <EmptyState
          icon={<Megaphone size={40} />}
          title="No Active Clients"
          description="Add clients in the Revenue module first, then track their ad campaigns here."
        />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Megaphone size={24} /> Ad Campaigns
        </h1>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} style={{ marginRight: 4 }} /> Add Campaign
        </button>
      </div>

      {/* Client Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {activeClients.map((client) => (
          <button
            key={client.id}
            className={`tab-item ${selectedClientId === client.id ? 'active' : ''}`}
            onClick={() => setSelectedClientId(client.id)}
          >
            {client.brandName}
          </button>
        ))}
      </div>

      {/* KPI Row */}
      <div className="kpi-row" style={{ marginBottom: 24 }}>
        <KpiCard label="Active Campaigns" value={String(stats.activeCampaigns)} />
        <KpiCard label="Total Spend (30d)" value={formatCurrency(stats.totalSpend)} variant="negative" />
        <KpiCard label="Total GMV (30d)" value={formatCurrency(stats.totalGmv)} variant="positive" />
        <KpiCard
          label="Avg ROAS"
          value={`${stats.avgRoas.toFixed(2)}x`}
          variant={stats.avgRoas >= 3.0 ? 'positive' : stats.avgRoas < 1.5 ? 'negative' : 'default'}
        />
      </div>

      {/* Campaign Cards */}
      {clientCampaigns.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={40} />}
          title="No Campaigns Yet"
          description={`Add your first ad campaign for ${selectedClient?.brandName ?? 'this client'} to start tracking performance.`}
          action={
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add Campaign
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {clientCampaigns.map((campaign) => (
            <div key={campaign.id}>
              <AdCampaignCard
                campaign={campaign}
                onEdit={() => handleOpenEdit(campaign)}
                onLogDay={() => setLoggingCampaign(campaign)}
                onDelete={() => handleDeleteCampaign(campaign.id)}
                expanded={expandedCampaignId === campaign.id}
                onToggleExpand={() =>
                  setExpandedCampaignId(expandedCampaignId === campaign.id ? null : campaign.id)
                }
              />
              {expandedCampaignId === campaign.id && (
                <AdPerformanceChart campaignId={campaign.id} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Campaign Modal */}
      {showCampaignForm && (
        <Modal
          title={editingCampaign ? 'Edit Campaign' : 'Add Campaign'}
          onClose={handleCloseForm}
          footer={
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={handleCloseForm}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveCampaign}>
                {editingCampaign ? 'Update' : 'Add Campaign'}
              </button>
            </div>
          }
        >
          <form onSubmit={handleSaveCampaign}>
            <div className="form-group">
              <label className="form-label required">Campaign Name</label>
              <input
                className="form-input"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., GMV Max - Skincare Bundle"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Daily Budget ($)</label>
                <input
                  className="form-input"
                  type="number"
                  value={formBudget || ''}
                  onChange={(e) => setFormBudget(Number(e.target.value))}
                  min={0}
                  step={1}
                  placeholder="0"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as AdCampaignStatus)}
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                className="form-input"
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes..."
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Daily Log Modal */}
      {loggingCampaign && (
        <AdDailyLogForm
          campaignId={loggingCampaign.id}
          clientId={loggingCampaign.clientId}
          onClose={() => setLoggingCampaign(null)}
        />
      )}
    </div>
  )
}

export default AdsPage

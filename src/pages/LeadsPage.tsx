import { useState } from 'react'
import { Plus, Target, LayoutGrid, List, Download, Zap, Upload } from 'lucide-react'
import type { Lead } from '../types'
import { PRODUCT_CATEGORY_LABELS } from '../types'
import { useLeadsStore } from '../stores/leads-store'
import { DEMO_LEADS } from '../lib/demo-data'
import KpiCard from '../components/shared/KpiCard'
import Modal from '../components/shared/Modal'
import EmptyState from '../components/shared/EmptyState'
import SearchBar from '../components/shared/SearchBar'
import DataTable from '../components/shared/DataTable'
import type { Column } from '../components/shared/DataTable'
import StatusBadge from '../components/shared/StatusBadge'
import ScoreIndicator from '../components/shared/ScoreIndicator'
import LeadForm from '../components/leads/LeadForm'
import LeadBrief from '../components/leads/LeadBrief'
import LeadPipeline from '../components/leads/LeadPipeline'
import QuickAddLeadForm from '../components/leads/QuickAddLeadForm'
import KaloDataImport from '../components/leads/KaloDataImport'
import { formatPercent, formatCurrency, formatDate } from '../lib/utils'
import { showSuccess } from '../stores/toast-store'

function LeadsPage() {
  const { leads, addLead, setLeads } = useLeadsStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline')

  // Recompute selectedLead from store to reflect live updates
  const activeLead = selectedLead
    ? leads.find((l) => l.id === selectedLead.id) ?? null
    : null

  // KPI calculations
  const totalLeads = leads.length
  const pipelineStatuses = ['new', 'contacted', 'replied', 'meeting_set', 'negotiating']
  const inPipeline = leads.filter((l) => pipelineStatuses.includes(l.status)).length
  const avgScore =
    totalLeads > 0
      ? leads.reduce((sum, l) => sum + l.score.overall, 0) / totalLeads
      : 0
  const closedCount = leads.filter((l) => l.status === 'closed').length
  const conversionRate = totalLeads > 0 ? (closedCount / totalLeads) * 100 : 0

  const filteredLeads = leads.filter(l =>
    l.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const leadColumns: Column<Lead>[] = [
    { key: 'brandName', label: 'Brand', render: (l) => <span style={{ fontWeight: 600 }}>{l.brandName}</span>, sortValue: (l) => l.brandName },
    { key: 'contactName', label: 'Contact', render: (l) => l.contactName, sortValue: (l) => l.contactName },
    { key: 'status', label: 'Status', render: (l) => <StatusBadge status={l.status} />, sortValue: (l) => l.status },
    { key: 'score', label: 'Score', render: (l) => <ScoreIndicator score={l.score.overall} />, sortValue: (l) => l.score.overall },
    { key: 'category', label: 'Category', render: (l) => PRODUCT_CATEGORY_LABELS[l.productCategory], sortValue: (l) => l.productCategory },
    { key: 'gmv', label: 'Est. GMV', render: (l) => formatCurrency(l.estimatedMonthlyGmv), sortValue: (l) => l.estimatedMonthlyGmv },
    { key: 'lastContacted', label: 'Last Contact', render: (l) => l.lastContactedAt ? formatDate(l.lastContactedAt) : '--', sortValue: (l) => l.lastContactedAt || '' },
  ]

  const handleAddLead = (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    addLead(data)
    showSuccess('Lead added successfully')
    setShowAddForm(false)
  }

  const handleImportDemoLeads = () => {
    // Only import if they aren't already imported (using generic ID match or just append)
    setLeads([...leads, ...(DEMO_LEADS as unknown as Lead[])])
    showSuccess(`Imported ${DEMO_LEADS.length} leads successfully`)
  }

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead)
  }

  const handleCloseBrief = () => {
    setSelectedLead(null)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Lead Intelligence</h1>
          <div className="page-header-subtitle">
            Track and score brand partnership leads
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => setIsImportOpen(true)}>
            <Upload size={16} />
            Import CSV
          </button>
          <button className="btn btn-secondary" onClick={handleImportDemoLeads}>
            <Download size={16} />
            Import Demo Data
          </button>
          <button className="btn btn-secondary" onClick={() => setIsQuickAddOpen(true)}>
            <Zap size={16} />
            Quick Add
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={16} />
            Add Lead
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard label="Total Leads" value={String(totalLeads)} />
        <KpiCard
          label="In Pipeline"
          value={String(inPipeline)}
          variant="highlight"
        />
        <KpiCard
          label="Avg Score"
          value={avgScore > 0 ? avgScore.toFixed(1) : '---'}
        />
        <KpiCard
          label="Conversion Rate"
          value={totalLeads > 0 ? formatPercent(conversionRate) : '---'}
          subtext={`${closedCount} closed`}
          variant={conversionRate >= 20 ? 'positive' : 'default'}
        />
      </div>

      {/* Toolbar Row */}
      <div className="toolbar-row">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search leads by brand or contact..."
        />
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
            onClick={() => setViewMode('pipeline')}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {totalLeads > 0 ? (
        viewMode === 'pipeline' ? (
          <LeadPipeline leads={filteredLeads} onSelectLead={handleSelectLead} />
        ) : (
          <DataTable columns={leadColumns} data={filteredLeads} onRowClick={handleSelectLead} />
        )
      ) : (
        <EmptyState
          icon={<Target size={48} />}
          title="No leads yet"
          description="Start adding brand leads to track your pipeline and score potential partnerships."
          action={
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={handleImportDemoLeads}>
                <Download size={16} />
                Import Demo Data
              </button>
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                <Plus size={16} />
                Add Your First Lead
              </button>
            </div>
          }
        />
      )}

      {/* Add Lead Modal */}
      {showAddForm && (
        <Modal title="Add New Lead" onClose={() => setShowAddForm(false)}>
          <LeadForm onSave={handleAddLead} onClose={() => setShowAddForm(false)} />
        </Modal>
      )}

      {/* Quick Add Modal */}
      <QuickAddLeadForm isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />

      {/* KaloData CSV Import Modal */}
      <KaloDataImport isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      {/* Lead Brief Modal */}
      {activeLead && (
        <LeadBrief lead={activeLead} onClose={handleCloseBrief} />
      )}
    </div>
  )
}

export default LeadsPage

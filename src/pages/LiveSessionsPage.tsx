import { useState, useMemo } from 'react'
import { Plus, BarChart3 } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useLiveSessionsStore } from '../stores/live-sessions-store'
import { useClientsStore } from '../stores/clients-store'
import LiveSessionKpis from '../components/live/LiveSessionKpis'
import LiveSessionForm from '../components/live/LiveSessionForm'
import LiveSessionTable from '../components/live/LiveSessionTable'
import EmptyState from '../components/shared/EmptyState'
import { showSuccess } from '../stores/toast-store'
import { formatCurrency, formatDateShort } from '../lib/utils'
import type { LiveSession } from '../types'

function LiveSessionsPage() {
  const { sessions, deleteSession, getSessionsThisWeek } = useLiveSessionsStore()
  const { getActiveClients } = useClientsStore()
  const activeClients = getActiveClients()

  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState<LiveSession | undefined>(undefined)

  const thisWeekSessions = getSessionsThisWeek()

  const filteredSessions = useMemo(() => {
    if (selectedClient === 'all') return sessions
    return sessions.filter((s) => s.clientId === selectedClient)
  }, [sessions, selectedClient])

  const chartData = useMemo(() => {
    return [...filteredSessions]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((s) => ({
        date: formatDateShort(s.date),
        gmv: s.gmv,
      }))
  }, [filteredSessions])

  const handleEdit = (session: LiveSession) => {
    setEditingSession(session)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteSession(id)
    showSuccess('Session deleted')
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingSession(undefined)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>LIVE Sessions</h1>
          <div className="page-header-subtitle">
            Track TikTok LIVE selling sessions and performance metrics
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Log Session
        </button>
      </div>

      {/* This Week KPIs */}
      <LiveSessionKpis sessions={thisWeekSessions} label="This Week" />

      {/* Client Filter Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-item ${selectedClient === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedClient('all')}
        >
          All
        </button>
        {activeClients.map((client) => (
          <button
            key={client.id}
            className={`tab-item ${selectedClient === client.id ? 'active' : ''}`}
            onClick={() => setSelectedClient(client.id)}
          >
            {client.brandName}
          </button>
        ))}
      </div>

      {/* Sessions Table */}
      <div className="section">
        <LiveSessionTable
          sessions={filteredSessions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* GMV Trend Chart */}
      {chartData.length > 0 && (
        <div className="section">
          <div className="section-title">
            <BarChart3 size={18} className="section-title-icon" />
            GMV Trend
          </div>
          <div className="card">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#a8a8a8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                  tick={{ fill: '#a8a8a8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 13,
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [formatCurrency(Number(value) || 0), 'GMV']) as any}
                  labelStyle={{ color: '#a8a8a8', marginBottom: 4 }}
                />
                <Line
                  dataKey="gmv"
                  stroke="var(--aria-yellow)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--aria-yellow)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="GMV"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {chartData.length === 0 && filteredSessions.length === 0 && (
        <div className="section">
          <div className="section-title">
            <BarChart3 size={18} className="section-title-icon" />
            GMV Trend
          </div>
          <div className="card">
            <EmptyState
              icon={<BarChart3 size={40} />}
              title="No Chart Data"
              description="Log sessions to see GMV trends over time."
            />
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <LiveSessionForm
          onClose={handleCloseForm}
          editSession={editingSession}
        />
      )}

    </div>
  )
}

export default LiveSessionsPage

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useLeadsStore } from '../stores/leads-store'
import { useClientsStore } from '../stores/clients-store'
import { useLiveSessionsStore } from '../stores/live-sessions-store'
import { useAdsStore } from '../stores/ads-store'
import KpiCard from '../components/shared/KpiCard'
import RevenueTrendChart from '../components/revenue/RevenueTrendChart'
import { formatCurrency, formatPercent } from '../lib/utils'
import type { LeadStatus } from '../types'
import './AnalyticsPage.css'

const LEAD_STATUS_ORDER: LeadStatus[] = [
  'new', 'contacted', 'replied', 'meeting_set', 'negotiating', 'closed', 'active', 'churned',
]

const LEAD_STATUS_DISPLAY: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  replied: 'Replied',
  meeting_set: 'Meeting Set',
  negotiating: 'Negotiating',
  closed: 'Closed',
  active: 'Active',
  churned: 'Churned',
}

const FUNNEL_COLORS = [
  '#666666', '#888888', '#aaaaaa', '#cccc00', '#dddd00', '#FFEB03', '#22c55e', '#ef4444',
]

const SOURCE_COLORS = ['#FFEB03', '#3b82f6', '#22c55e', '#a855f7']

type TimeRange = '7d' | '30d' | '90d' | 'all'

function getDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('all')
  const allLeads = useLeadsStore((s) => s.leads)
  const clients = useClientsStore((s) => s.clients)
  const monthlyRevenue = useClientsStore((s) => s.monthlyRevenue)
  const snapshot = useClientsStore((s) => s.getRevenueSnapshot())
  const sessions = useLiveSessionsStore((s) => s.sessions)
  const { dailyLogs, campaigns } = useAdsStore()

  // Filter leads by time range
  const leads = useMemo(() => {
    if (timeRange === 'all') return allLeads
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const cutoff = getDaysAgo(days)
    return allLeads.filter((l) => l.createdAt >= cutoff)
  }, [allLeads, timeRange])

  // ─── Pipeline KPIs ───────────────────────────────────────────
  const closedLeads = leads.filter((l) => l.status === 'closed' || l.status === 'active')
  const conversionRate = leads.length > 0 ? (closedLeads.length / leads.length) * 100 : 0

  const avgDaysToClose = useMemo(() => {
    if (closedLeads.length === 0) return 0
    return (
      closedLeads.reduce((sum, l) => {
        const created = new Date(l.createdAt)
        const updated = new Date(l.updatedAt)
        return sum + Math.max(0, (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      }, 0) / closedLeads.length
    )
  }, [closedLeads])

  const pipelineLeads = leads.filter((l) =>
    ['replied', 'meeting_set', 'negotiating'].includes(l.status)
  )
  const pipelineValue = pipelineLeads.length * 2500

  // ─── Revenue KPIs ────────────────────────────────────────────
  const monthlyGrowthRate = 0.15
  const monthsToGoal =
    snapshot.currentMrr > 0 && monthlyGrowthRate > 0
      ? Math.log(snapshot.target / snapshot.currentMrr) / Math.log(1 + monthlyGrowthRate)
      : null

  // ─── Pipeline Funnel Data ────────────────────────────────────
  const funnelData = useMemo(() => {
    return LEAD_STATUS_ORDER.map((status) => ({
      name: LEAD_STATUS_DISPLAY[status],
      count: leads.filter((l) => l.status === status).length,
    }))
  }, [leads])

  // ─── Lead Source Data ────────────────────────────────────────
  const sourceData = useMemo(() => {
    const groups: Record<string, number> = {}
    leads.forEach((l) => {
      const src = l.source?.toLowerCase().includes('kalodata')
        ? 'KaloData'
        : l.source?.toLowerCase().includes('referral')
          ? 'Referral'
          : l.source || 'Other'
      groups[src] = (groups[src] || 0) + 1
    })
    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }, [leads])

  // ─── Client Performance Data ─────────────────────────────────
  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [clients])
  const thirtyDaysAgo = useMemo(() => getDaysAgo(30), [])

  const clientPerformance = useMemo(() => {
    return activeClients.map((client) => {
      const clientSessions = sessions.filter(
        (s) => s.clientId === client.id && s.date >= thirtyDaysAgo
      )
      const sessionCount = clientSessions.length
      const avgGmv =
        sessionCount > 0
          ? clientSessions.reduce((s, sess) => s + sess.gmv, 0) / sessionCount
          : 0

      const clientLogs = dailyLogs.filter(
        (l) => l.clientId === client.id && l.date >= thirtyDaysAgo
      )
      const latestLog = clientLogs.sort((a, b) => b.date.localeCompare(a.date))[0]
      const roas = latestLog?.roas ?? 0

      const activeCampaigns = campaigns.filter(
        (c) => c.clientId === client.id && c.status === 'active'
      ).length

      // Health score: sessions (max 3) + roas (max 3) + campaigns proxy for creators (max 4)
      const sessionScore = sessionCount > 4 ? 3 : (sessionCount / 4) * 3
      const roasScore = roas > 3 ? 3 : roas
      const campaignScore = activeCampaigns > 5 ? 4 : (activeCampaigns / 5) * 4
      const healthScore = Math.round((sessionScore + roasScore + campaignScore) * 10) / 10

      return {
        id: client.id,
        name: client.brandName,
        mrr: client.monthlyRevenue,
        sessions: sessionCount,
        avgGmv,
        activeCampaigns,
        roas,
        healthScore: Math.min(10, healthScore),
      }
    })
  }, [activeClients, sessions, dailyLogs, campaigns, thirtyDaysAgo])

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-header-subtitle">Agency performance overview</p>
        </div>
        <div className="analytics-time-range">
          {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
            <button
              key={range}
              className={`analytics-range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : range === '90d' ? 'Last 90 days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline KPIs */}
      <div className="kpi-row">
        <KpiCard label="Total Leads" value={String(leads.length)} subtext={`${pipelineLeads.length} in pipeline`} />
        <KpiCard label="Conversion Rate" value={formatPercent(conversionRate)} variant={conversionRate > 10 ? 'positive' : 'default'} subtext={`${closedLeads.length} closed/active`} />
        <KpiCard label="Avg Days to Close" value={avgDaysToClose > 0 ? avgDaysToClose.toFixed(1) : '--'} subtext={closedLeads.length > 0 ? `from ${closedLeads.length} leads` : 'No closed leads yet'} />
        <KpiCard label="Pipeline Value" value={formatCurrency(pipelineValue)} variant="highlight" subtext={`${pipelineLeads.length} prospects`} />
      </div>

      {/* Revenue KPIs */}
      <div className="kpi-row">
        <KpiCard label="Current MRR" value={formatCurrency(snapshot.currentMrr)} variant="highlight" subtext={`${snapshot.clientCount} active clients`} />
        <KpiCard label="MRR Growth (est)" value={formatPercent(monthlyGrowthRate * 100)} subtext="Estimated MoM growth" />
        <KpiCard label="Revenue Runway" value={monthsToGoal ? `${Math.ceil(monthsToGoal)} mo` : '--'} subtext={monthsToGoal ? `to ${formatCurrency(snapshot.target)}` : 'No revenue yet'} />
        <KpiCard label="Goal Progress" value={formatPercent(snapshot.percentToGoal)} variant={snapshot.percentToGoal > 50 ? 'positive' : 'default'} subtext={`Gap: ${formatCurrency(snapshot.gap)}`} />
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-row">
        <div className="analytics-chart-card card">
          <h3 className="analytics-chart-title">Pipeline Funnel</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#a8a8a8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#a8a8a8', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 13 }}
                labelStyle={{ color: '#a8a8a8', marginBottom: 4 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {funnelData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart-card card">
          <h3 className="analytics-chart-title">Lead Sources</h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`pie-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ color: '#a8a8a8', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="analytics-no-data">No lead source data</div>
          )}
        </div>
      </div>

      {/* MRR Trend */}
      <div className="section">
        <h3 className="section-title">MRR Trend</h3>
        {monthlyRevenue.length > 0 ? (
          <RevenueTrendChart data={monthlyRevenue} />
        ) : (
          <div className="analytics-empty-section card">
            <p className="analytics-empty-title">No revenue data yet</p>
            <p className="analytics-empty-hint">Add monthly revenue entries in the <strong>Revenue</strong> page to track your MRR trend.</p>
          </div>
        )}
      </div>

      {/* Client Performance Table */}
      <div className="section">
        <h3 className="section-title">Client Performance (Last 30 Days)</h3>
        {clientPerformance.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>MRR</th>
                  <th>Sessions (30d)</th>
                  <th>Avg GMV/Session</th>
                  <th>Active Campaigns</th>
                  <th>Ad ROAS</th>
                  <th>Health</th>
                </tr>
              </thead>
              <tbody>
                {clientPerformance.map((cp) => (
                  <tr key={cp.id}>
                    <td style={{ fontWeight: 600 }}>{cp.name}</td>
                    <td>{formatCurrency(cp.mrr)}</td>
                    <td>{cp.sessions}</td>
                    <td>{formatCurrency(cp.avgGmv)}</td>
                    <td>{cp.activeCampaigns}</td>
                    <td>{cp.roas > 0 ? cp.roas.toFixed(1) + 'x' : '--'}</td>
                    <td>
                      <span
                        className={`analytics-health-badge ${
                          cp.healthScore < 4 ? 'health-low' : cp.healthScore <= 7 ? 'health-mid' : 'health-high'
                        }`}
                      >
                        {cp.healthScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="analytics-empty-section card">
            <p className="analytics-empty-title">No active clients yet</p>
            <p className="analytics-empty-hint">Add clients with <strong>Active</strong> status in the <strong>Revenue</strong> page to see performance metrics here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsPage

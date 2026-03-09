import { NavLink } from 'react-router-dom'
import { Target, Video, Users, TrendingUp, Send, Megaphone, FileText, BarChart2, Settings } from 'lucide-react'
import { useLeadsStore } from '../../stores/leads-store'
import { useSheetsStore } from '../../stores/sheets-store'
import { isOverdue, getDaysUntil } from '../../lib/utils'
import './Sidebar.css'

const NAV_ITEMS = [
  { path: '/leads', label: 'Leads', icon: <Target size={18} /> },
  { path: '/live', label: 'LIVE', icon: <Video size={18} /> },
  { path: '/creators', label: 'Creators', icon: <Users size={18} /> },
  { path: '/revenue', label: 'Revenue', icon: <TrendingUp size={18} /> },
  { path: '/outreach', label: 'Outreach', icon: <Send size={18} /> },
  { path: '/ads', label: 'Ads', icon: <Megaphone size={18} /> },
  { path: '/reports', label: 'Reports', icon: <FileText size={18} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

function getRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function Sidebar() {
  const { leads } = useLeadsStore()
  const { isConnected, lastSyncAt } = useSheetsStore()

  // Count pending follow-ups that are overdue or due within 1 day
  const pendingFollowUpCount = leads.reduce((count, lead) => {
    if (!lead.brief?.followUpSchedule) return count
    return count + lead.brief.followUpSchedule.filter(
      (item) =>
        item.status === 'pending' &&
        (isOverdue(item.scheduledDate) || getDaysUntil(item.scheduledDate) <= 1)
    ).length
  }, 0)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">ARIA</span>
        <span className="sidebar-brand-tag">v1.0</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Modules</div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.label === 'Outreach' && pendingFollowUpCount > 0 && (
              <span className="sidebar-link-badge">{pendingFollowUpCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-sync-status">
        <span className={`sidebar-sync-dot ${isConnected ? '' : 'disconnected'}`} />
        <span>
          {isConnected && lastSyncAt
            ? `Synced ${getRelativeTime(lastSyncAt)}`
            : 'Not synced'}
        </span>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">TikTok Shop Live Selling</div>
        <div className="sidebar-footer-goal">Goal: USD 1,000,000/mo</div>
      </div>
    </aside>
  )
}

export default Sidebar

import { NavLink } from 'react-router-dom'
import { Target, TrendingUp, Send, Settings } from 'lucide-react'
import { useLeadsStore } from '../../stores/leads-store'
import { isOverdue, getDaysUntil } from '../../lib/utils'
import './Sidebar.css'

const NAV_ITEMS = [
  { path: '/leads', label: 'Leads', icon: <Target size={18} /> },
  { path: '/revenue', label: 'Revenue', icon: <TrendingUp size={18} /> },
  { path: '/outreach', label: 'Outreach', icon: <Send size={18} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

function Sidebar() {
  const { leads } = useLeadsStore()

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

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">TikTok Shop Live Selling</div>
        <div className="sidebar-footer-goal">Goal: USD 1,000,000/mo</div>
      </div>
    </aside>
  )
}

export default Sidebar

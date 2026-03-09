import { NavLink } from 'react-router-dom'
import { Target, Video, Users, TrendingUp, Send, Megaphone, FileText, BarChart2, Settings } from 'lucide-react'
import './MobileNav.css'

const NAV_ITEMS = [
  { path: '/leads', label: 'Leads', icon: <Target size={20} /> },
  { path: '/live', label: 'LIVE', icon: <Video size={20} /> },
  { path: '/creators', label: 'Creators', icon: <Users size={20} /> },
  { path: '/revenue', label: 'Revenue', icon: <TrendingUp size={20} /> },
  { path: '/outreach', label: 'Outreach', icon: <Send size={20} /> },
  { path: '/ads', label: 'Ads', icon: <Megaphone size={20} /> },
  { path: '/reports', label: 'Reports', icon: <FileText size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
]

function MobileNav() {
  return (
    <nav className="mobile-nav">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav

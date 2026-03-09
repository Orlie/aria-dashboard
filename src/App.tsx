import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import MobileNav from './components/Layout/MobileNav'
import ToastContainer from './components/shared/Toast'
import LeadsPage from './pages/LeadsPage'
import RevenuePage from './pages/RevenuePage'
import OutreachPage from './pages/OutreachPage'
import AdsPage from './pages/AdsPage'
import SettingsPage from './pages/SettingsPage'
import LiveSessionsPage from './pages/LiveSessionsPage'
import CreatorsPage from './pages/CreatorsPage'
import ReportsPage from './pages/ReportsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import { useAutoSync } from './lib/useAutoSync'

function App() {
  useAutoSync()

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/live" element={<LiveSessionsPage />} />
          <Route path="/creators" element={<CreatorsPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/outreach" element={<OutreachPage />} />
          <Route path="/ads" element={<AdsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <MobileNav />
      <ToastContainer />
    </div>
  )
}

export default App

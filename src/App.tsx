import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import MobileNav from './components/Layout/MobileNav'
import ToastContainer from './components/shared/Toast'
import LeadsPage from './pages/LeadsPage'
import RevenuePage from './pages/RevenuePage'
import OutreachPage from './pages/OutreachPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/outreach" element={<OutreachPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <MobileNav />
      <ToastContainer />
    </div>
  )
}

export default App

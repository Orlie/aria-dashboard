import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send } from 'lucide-react'
import DailyActivityBar from '../components/outreach/DailyActivityBar'
import MessageDrafter from '../components/outreach/MessageDrafter'
import FollowUpQueue from '../components/outreach/FollowUpQueue'
import OutreachLog from '../components/outreach/OutreachLog'
import TimingRecommender from '../components/outreach/TimingRecommender'

type OutreachTab = 'templates' | 'followups' | 'log'

function OutreachPage() {
  const [searchParams] = useSearchParams()
  const leadIdFromUrl = searchParams.get('leadId') || undefined
  const [activeTab, setActiveTab] = useState<OutreachTab>('templates')

  // Auto-switch to templates tab when leadId is in URL
  useEffect(() => {
    if (leadIdFromUrl) {
      setActiveTab('templates')
    }
  }, [leadIdFromUrl])

  const tabs: { id: OutreachTab; label: string }[] = [
    { id: 'templates', label: 'Templates' },
    { id: 'followups', label: 'Follow-ups' },
    { id: 'log', label: 'Log' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Send size={22} style={{ color: 'var(--aria-yellow)' }} />
            Outreach System
          </h1>
          <div className="page-header-subtitle">
            Draft messages, manage follow-ups, and track outreach results
          </div>
        </div>
      </div>

      <DailyActivityBar />

      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div className="tab-content-enter" key={activeTab}>
          <TimingRecommender />
          <MessageDrafter initialLeadId={leadIdFromUrl} />
        </div>
      )}

      {activeTab === 'followups' && (
        <div className="tab-content-enter" key={activeTab}>
          <FollowUpQueue />
        </div>
      )}

      {activeTab === 'log' && (
        <div className="tab-content-enter" key={activeTab}>
          <OutreachLog />
        </div>
      )}
    </div>
  )
}

export default OutreachPage

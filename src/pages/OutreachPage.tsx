import { useState } from 'react'
import { Send } from 'lucide-react'
import MessageDrafter from '../components/outreach/MessageDrafter'
import FollowUpQueue from '../components/outreach/FollowUpQueue'
import OutreachLog from '../components/outreach/OutreachLog'
import TimingRecommender from '../components/outreach/TimingRecommender'

type OutreachTab = 'templates' | 'followups' | 'log'

function OutreachPage() {
  const [activeTab, setActiveTab] = useState<OutreachTab>('templates')

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
          <MessageDrafter />
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

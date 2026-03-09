import { useState } from 'react'
import type { Lead, LeadStatus } from '../../types'
import { LEAD_STATUS_LABELS } from '../../types'
import { useLeadsStore } from '../../stores/leads-store'
import LeadCard from './LeadCard'

interface LeadPipelineProps {
  leads: Lead[]
  onSelectLead: (lead: Lead) => void
}

const PIPELINE_COLUMNS: LeadStatus[] = [
  'new',
  'contacted',
  'replied',
  'meeting_set',
  'negotiating',
  'closed',
  'active',
  'churned',
]

function LeadPipeline({ leads, onSelectLead }: LeadPipelineProps) {
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null)

  const getLeadsByStatus = (status: LeadStatus): Lead[] =>
    leads.filter((l) => l.status === status)

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault()
    setDragOverColumn(status)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('leadId')
    if (leadId) {
      useLeadsStore.getState().updateLeadStatus(leadId, status)
    }
    setDragOverColumn(null)
  }

  return (
    <div className="pipeline-container">
      {PIPELINE_COLUMNS.map((status) => {
        const columnLeads = getLeadsByStatus(status)

        return (
          <div
            className={`pipeline-column${dragOverColumn === status ? ' pipeline-column--drag-over' : ''}`}
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="pipeline-column-header">
              <span className="pipeline-column-title">
                {LEAD_STATUS_LABELS[status]}
              </span>
              <span className="pipeline-column-count">{columnLeads.length}</span>
            </div>
            <div className="pipeline-cards">
              {columnLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => onSelectLead(lead)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default LeadPipeline

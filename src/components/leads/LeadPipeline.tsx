import type { Lead, LeadStatus } from '../../types'
import { LEAD_STATUS_LABELS } from '../../types'
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
  const getLeadsByStatus = (status: LeadStatus): Lead[] =>
    leads.filter((l) => l.status === status)

  return (
    <div className="pipeline-container">
      {PIPELINE_COLUMNS.map((status) => {
        const columnLeads = getLeadsByStatus(status)

        return (
          <div className="pipeline-column" key={status}>
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

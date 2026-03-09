import { useMemo } from 'react'
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { useLeadsStore } from '../../stores/leads-store'
import StatusBadge from '../shared/StatusBadge'
import EmptyState from '../shared/EmptyState'
import { formatDate, getDaysUntil, isOverdue } from '../../lib/utils'
import { showSuccess } from '../../stores/toast-store'

interface FollowUpEntry {
  leadId: string
  brandName: string
  action: string
  scheduledDate: string
  daysUntil: number
  isOverdue: boolean
  status: 'pending' | 'done' | 'skipped'
  dayIndex: number
}

function FollowUpQueue() {
  const { leads, updateLead } = useLeadsStore()

  const followUps = useMemo<FollowUpEntry[]>(() => {
    const entries: FollowUpEntry[] = []

    for (const lead of leads) {
      if (!lead.brief?.followUpSchedule) continue

      lead.brief.followUpSchedule.forEach((item, index) => {
        entries.push({
          leadId: lead.id,
          brandName: lead.brandName,
          action: item.action,
          scheduledDate: item.scheduledDate,
          daysUntil: getDaysUntil(item.scheduledDate),
          isOverdue: isOverdue(item.scheduledDate) && item.status === 'pending',
          status: item.status,
          dayIndex: index,
        })
      })
    }

    // Sort: overdue first, then by nearest due date
    return entries
      .filter((e) => e.status === 'pending')
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1
        if (!a.isOverdue && b.isOverdue) return 1
        return a.daysUntil - b.daysUntil
      })
  }, [leads])

  const handleMarkDone = (entry: FollowUpEntry) => {
    const lead = leads.find((l) => l.id === entry.leadId)
    if (!lead) return

    const updatedSchedule = [...lead.brief.followUpSchedule]
    updatedSchedule[entry.dayIndex] = {
      ...updatedSchedule[entry.dayIndex],
      status: 'done',
      completedDate: new Date().toISOString().split('T')[0],
    }

    updateLead(lead.id, {
      brief: {
        ...lead.brief,
        followUpSchedule: updatedSchedule,
      },
    })
    showSuccess('Follow-up marked as done')
  }

  if (followUps.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={40} />}
        title="No Pending Follow-ups"
        description="All follow-ups are completed or no leads have follow-up schedules yet."
      />
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {followUps.map((entry, i) => (
          <div
            key={`${entry.leadId}-${entry.dayIndex}-${i}`}
            className="card"
            style={{
              borderLeftWidth: 3,
              borderLeftStyle: 'solid',
              borderLeftColor: entry.isOverdue
                ? 'var(--aria-red)'
                : entry.daysUntil <= 1
                  ? 'var(--aria-orange)'
                  : 'var(--aria-green)',
            }}
          >
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{entry.brandName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {entry.isOverdue ? (
                  <StatusBadge status="overdue" />
                ) : (
                  <StatusBadge status="pending" />
                )}
              </div>
            </div>

            <div style={{ fontSize: 14, marginBottom: 8 }}>{entry.action}</div>

            <div className="flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="text-sm text-muted">
                  {formatDate(entry.scheduledDate)}
                </span>
                {entry.isOverdue ? (
                  <span
                    className="text-sm"
                    style={{
                      color: 'var(--aria-red)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <AlertTriangle size={12} />
                    {Math.abs(entry.daysUntil)} day{Math.abs(entry.daysUntil) !== 1 ? 's' : ''} overdue
                  </span>
                ) : (
                  <span className="text-sm text-muted">
                    {entry.daysUntil === 0
                      ? 'Due today'
                      : `${entry.daysUntil} day${entry.daysUntil !== 1 ? 's' : ''} from now`}
                  </span>
                )}
              </div>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleMarkDone(entry)}
              >
                <CheckCircle size={14} />
                Mark Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FollowUpQueue

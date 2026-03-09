import { useState } from 'react'
import { Pencil, Trash2, Video } from 'lucide-react'
import DataTable from '../shared/DataTable'
import type { Column } from '../shared/DataTable'
import ConfirmDialog from '../shared/ConfirmDialog'
import EmptyState from '../shared/EmptyState'
import { formatDate, formatCurrency } from '../../lib/utils'
import type { LiveSession } from '../../types'

interface LiveSessionTableProps {
  sessions: LiveSession[]
  onEdit: (session: LiveSession) => void
  onDelete: (id: string) => void
}

function LiveSessionTable({ sessions, onEdit, onDelete }: LiveSessionTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<LiveSession | null>(null)

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<Video size={40} />}
        title="No sessions logged yet"
        description="Log your first LIVE session to start tracking performance."
      />
    )
  }

  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date))

  const columns: Column<LiveSession>[] = [
    {
      key: 'date',
      label: 'Date',
      render: (s) => formatDate(s.date),
      sortValue: (s) => s.date,
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (s) => `${s.durationMinutes}m`,
      sortValue: (s) => s.durationMinutes,
    },
    {
      key: 'peakViewers',
      label: 'Peak',
      render: (s) => s.peakViewers.toLocaleString(),
      sortValue: (s) => s.peakViewers,
    },
    {
      key: 'avgViewers',
      label: 'Avg Viewers',
      render: (s) => s.averageViewers.toLocaleString(),
      sortValue: (s) => s.averageViewers,
    },
    {
      key: 'orders',
      label: 'Orders',
      render: (s) => s.totalOrders.toLocaleString(),
      sortValue: (s) => s.totalOrders,
    },
    {
      key: 'gmv',
      label: 'GMV',
      render: (s) => formatCurrency(s.gmv),
      sortValue: (s) => s.gmv,
    },
    {
      key: 'topProduct',
      label: 'Top Product',
      render: (s) => s.topProduct || '—',
      sortValue: (s) => s.topProduct,
    },
    {
      key: 'host',
      label: 'Host',
      render: (s) => s.hostName || '—',
      sortValue: (s) => s.hostName,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (session) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onEdit(session) }}>
            <Pencil size={14} />
          </button>
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setDeleteTarget(session) }}>
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={sorted} />

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Session"
          message={`Delete the session from ${formatDate(deleteTarget.date)}? This cannot be undone.`}
          onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}

export default LiveSessionTable

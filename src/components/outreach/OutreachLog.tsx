import { useState, useMemo } from 'react'
import { MessageSquare, Inbox, CheckCircle, XCircle } from 'lucide-react'
import DataTable from '../shared/DataTable'
import type { Column } from '../shared/DataTable'
import EmptyState from '../shared/EmptyState'
import SearchBar from '../shared/SearchBar'
import { useOutreachStore } from '../../stores/outreach-store'
import { showSuccess } from '../../stores/toast-store'
import { OUTREACH_CHANNEL_LABELS } from '../../types'
import type { OutreachRecord, MessageTemplateId } from '../../types'
import { OUTREACH_TEMPLATES } from '../../lib/templates'
import { formatDate } from '../../lib/utils'

function OutreachLog() {
  const { records, updateRecord } = useOutreachStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [responseFilter, setResponseFilter] = useState<string>('all')
  const [templateFilter, setTemplateFilter] = useState<string>('all')

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!r.brandName.toLowerCase().includes(q) && !r.message.toLowerCase().includes(q)) return false
      }
      if (channelFilter !== 'all' && r.channel !== channelFilter) return false
      if (responseFilter === 'yes' && !r.gotResponse) return false
      if (responseFilter === 'no' && r.gotResponse) return false
      if (templateFilter !== 'all' && r.templateUsed !== templateFilter) return false
      return true
    })
  }, [records, searchQuery, channelFilter, responseFilter, templateFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setChannelFilter('all')
    setResponseFilter('all')
    setTemplateFilter('all')
  }

  const getTemplateName = (id: MessageTemplateId): string => {
    return OUTREACH_TEMPLATES.find((t) => t.id === id)?.name || id
  }

  const columns: Column<OutreachRecord>[] = [
    {
      key: 'sentAt',
      label: 'Date',
      render: (r) => formatDate(r.sentAt),
      sortValue: (r) => r.sentAt,
    },
    {
      key: 'brandName',
      label: 'Brand',
      render: (r) => <span style={{ fontWeight: 600 }}>{r.brandName}</span>,
      sortValue: (r) => r.brandName,
    },
    {
      key: 'templateUsed',
      label: 'Template',
      render: (r) => getTemplateName(r.templateUsed),
      sortValue: (r) => getTemplateName(r.templateUsed),
    },
    {
      key: 'channel',
      label: 'Channel',
      render: (r) => OUTREACH_CHANNEL_LABELS[r.channel],
      sortValue: (r) => r.channel,
    },
    {
      key: 'message',
      label: 'Message',
      render: (r) => (
        <span
          title={r.message}
          style={{ maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {r.message.length > 60 ? `${r.message.slice(0, 60)}...` : r.message}
        </span>
      ),
    },
    {
      key: 'gotResponse',
      label: 'Response',
      render: (r) => (
        <span
          className={`badge ${r.gotResponse ? 'badge-done' : 'badge-paused'}`}
        >
          {r.gotResponse ? 'Yes' : 'No'}
        </span>
      ),
      sortValue: (r) => (r.gotResponse ? 1 : 0),
    },
    {
      key: 'toggleResponse',
      label: 'Toggle',
      render: (r) => (
        <button
          className="btn btn-ghost btn-sm"
          onClick={(e) => {
            e.stopPropagation()
            updateRecord(r.id, { gotResponse: !r.gotResponse })
            showSuccess(r.gotResponse ? 'Marked as no response' : 'Marked as responded')
          }}
        >
          {r.gotResponse ? <XCircle size={14} /> : <CheckCircle size={14} />}
        </button>
      ),
    },
    {
      key: 'responseNotes',
      label: 'Notes',
      render: (r) => (
        <span className="text-muted" style={{ maxWidth: 150, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {r.responseNotes || '--'}
        </span>
      ),
    },
  ]

  if (records.length === 0) {
    return (
      <EmptyState
        icon={<Inbox size={40} />}
        title="No Outreach Records"
        description="Your outreach messages will appear here once you start logging them through the Templates tab."
      />
    )
  }

  return (
    <div>
      {/* Search + Filter bar */}
      <div style={{ marginBottom: 12 }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by brand or message..."
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
          <label className="form-label">Channel</label>
          <select
            className="form-select"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
          >
            <option value="all">All Channels</option>
            {Object.entries(OUTREACH_CHANNEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
          <label className="form-label">Response</label>
          <select
            className="form-select"
            value={responseFilter}
            onChange={(e) => setResponseFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="yes">Got Response</option>
            <option value="no">No Response</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0, minWidth: 140 }}>
          <label className="form-label">Template</label>
          <select
            className="form-select"
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
          >
            <option value="all">All Templates</option>
            {OUTREACH_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <span className="text-sm text-muted">
            <MessageSquare size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredRecords} />
    </div>
  )
}

export default OutreachLog

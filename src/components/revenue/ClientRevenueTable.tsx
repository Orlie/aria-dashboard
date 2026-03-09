import { useState } from 'react'
import { ChevronUp, ChevronDown, ClipboardList, Check } from 'lucide-react'
import StatusBadge from '../shared/StatusBadge'
import OnboardingChecklist from '../clients/OnboardingChecklist'
import { useClientsStore } from '../../stores/clients-store'
import { formatCurrency, formatPercent } from '../../lib/utils'
import type { Client } from '../../types'

interface ClientRevenueTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
}

function ClientRevenueTable({ clients, onEdit }: ClientRevenueTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null)
  const getOnboarding = useClientsStore((s) => s.getOnboarding)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const sortFns: Record<string, (c: Client) => string | number> = {
    brandName: (c) => c.brandName,
    contractValue: (c) => c.contractValue,
    gmvTarget: (c) => c.gmvTarget,
    actualGmv: (c) => c.actualGmv,
    commissionRate: (c) => c.commissionRate,
    monthlyRevenue: (c) => c.monthlyRevenue,
    status: (c) => c.status,
  }

  const sortedClients = [...clients]
  if (sortKey && sortFns[sortKey]) {
    sortedClients.sort((a, b) => {
      const aVal = sortFns[sortKey](a)
      const bVal = sortFns[sortKey](b)
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal
      }
      return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortKey !== col) return null
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  const getOnboardingStatus = (clientId: string) => {
    const ob = getOnboarding(clientId)
    if (!ob) return { label: 'Start', type: 'none' as const, percent: 0 }
    const done = ob.tasks.filter((t) => t.completed).length
    const total = ob.tasks.length
    const pct = Math.round((done / total) * 100)
    if (done === total) return { label: 'Onboarded', type: 'complete' as const, percent: 100 }
    return { label: `${pct}%`, type: 'progress' as const, percent: pct }
  }

  const toggleExpand = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedClientId((prev) => (prev === clientId ? null : clientId))
  }

  const columns = [
    { key: 'brandName', label: 'Brand' },
    { key: 'contractValue', label: 'Contract' },
    { key: 'gmvTarget', label: 'GMV Target' },
    { key: 'actualGmv', label: 'Actual GMV' },
    { key: 'commissionRate', label: 'Commission' },
    { key: 'monthlyRevenue', label: 'Revenue' },
    { key: 'status', label: 'Status' },
  ]

  const totalCols = columns.length + 1 // +1 for onboarding column

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={sortKey === col.key ? 'sorted' : ''}
                onClick={() => handleSort(col.key)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  <SortIcon col={col.key} />
                </span>
              </th>
            ))}
            <th>Onboarding</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((client) => {
            const obStatus = getOnboardingStatus(client.id)
            const isExpanded = expandedClientId === client.id

            return [
              <tr key={client.id} style={{ cursor: 'pointer' }} onClick={() => onEdit(client)}>
                <td><strong>{client.brandName}</strong></td>
                <td>{formatCurrency(client.contractValue)}</td>
                <td>{formatCurrency(client.gmvTarget)}</td>
                <td>{formatCurrency(client.actualGmv)}</td>
                <td>{formatPercent(client.commissionRate * 100)}</td>
                <td><span className="text-yellow">{formatCurrency(client.monthlyRevenue)}</span></td>
                <td><StatusBadge status={client.status} /></td>
                <td>
                  {client.status === 'active' && (
                    <button
                      className={`btn btn-sm ${
                        obStatus.type === 'complete'
                          ? 'btn-ghost'
                          : obStatus.type === 'progress'
                          ? 'btn-secondary'
                          : 'btn-primary'
                      }`}
                      onClick={(e) => toggleExpand(client.id, e)}
                      style={
                        obStatus.type === 'complete'
                          ? { color: 'var(--aria-green)', gap: 4 }
                          : { gap: 4 }
                      }
                    >
                      {obStatus.type === 'complete' && <Check size={12} />}
                      {obStatus.type === 'none' && <ClipboardList size={12} />}
                      {obStatus.type === 'complete'
                        ? 'Onboarded'
                        : obStatus.type === 'progress'
                        ? `Onboarding ${obStatus.label}`
                        : 'Start'}
                    </button>
                  )}
                </td>
              </tr>,
              isExpanded && client.status === 'active' && (
                <tr key={`${client.id}-onboarding`}>
                  <td colSpan={totalCols} style={{ padding: 0 }}>
                    <OnboardingChecklist clientId={client.id} />
                  </td>
                </tr>
              ),
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ClientRevenueTable

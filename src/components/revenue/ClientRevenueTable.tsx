import DataTable from '../shared/DataTable'
import StatusBadge from '../shared/StatusBadge'
import { formatCurrency, formatPercent } from '../../lib/utils'
import type { Column } from '../shared/DataTable'
import type { Client } from '../../types'

interface ClientRevenueTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
}

function ClientRevenueTable({ clients, onEdit }: ClientRevenueTableProps) {
  const columns: Column<Client>[] = [
    {
      key: 'brandName',
      label: 'Brand Name',
      render: (client) => <strong>{client.brandName}</strong>,
      sortValue: (client) => client.brandName,
    },
    {
      key: 'contractValue',
      label: 'Contract Value',
      render: (client) => formatCurrency(client.contractValue),
      sortValue: (client) => client.contractValue,
    },
    {
      key: 'gmvTarget',
      label: 'GMV Target',
      render: (client) => formatCurrency(client.gmvTarget),
      sortValue: (client) => client.gmvTarget,
    },
    {
      key: 'actualGmv',
      label: 'Actual GMV',
      render: (client) => formatCurrency(client.actualGmv),
      sortValue: (client) => client.actualGmv,
    },
    {
      key: 'commissionRate',
      label: 'Commission %',
      render: (client) => formatPercent(client.commissionRate * 100),
      sortValue: (client) => client.commissionRate,
    },
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      render: (client) => (
        <span className="text-yellow">{formatCurrency(client.monthlyRevenue)}</span>
      ),
      sortValue: (client) => client.monthlyRevenue,
    },
    {
      key: 'status',
      label: 'Status',
      render: (client) => <StatusBadge status={client.status} />,
      sortValue: (client) => client.status,
    },
  ]

  return (
    <DataTable<Client>
      columns={columns}
      data={clients}
      onRowClick={onEdit}
    />
  )
}

export default ClientRevenueTable

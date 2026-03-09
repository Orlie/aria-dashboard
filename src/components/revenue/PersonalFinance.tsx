import { useState, useRef, useCallback, useMemo } from 'react'
import { Upload, X } from 'lucide-react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useFinanceStore } from '../../stores/finance-store'
import { useClientsStore } from '../../stores/clients-store'
import { parseFinancialCsv, extractMonthFromFilename } from '../../lib/csv-parser'
import { formatCurrency, formatPercent } from '../../lib/utils'
import { showSuccess, showError } from '../../stores/toast-store'
import KpiCard from '../shared/KpiCard'
import './PersonalFinance.css'

const DONUT_COLORS = [
  '#FFEB03',
  '#ef4444',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
  '#f97316',
  '#06b6d4',
  '#ec4899',
  '#6b7280',
]

function PersonalFinance() {
  const { months, importMonth, removeMonth } = useFinanceStore()
  const { getRevenueSnapshot } = useClientsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  // --- CSV import logic ---
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      let imported = 0
      let failed = 0

      for (const file of Array.from(files)) {
        if (!file.name.endsWith('.csv')) {
          failed++
          continue
        }
        try {
          const text = await file.text()
          const monthLabel = extractMonthFromFilename(file.name)
          const data = parseFinancialCsv(text, monthLabel)
          importMonth(data)
          imported++
        } catch {
          failed++
        }
      }

      if (imported > 0) {
        showSuccess(`Imported ${imported} month${imported > 1 ? 's' : ''} successfully`)
      }
      if (failed > 0) {
        showError(`Failed to parse ${failed} file${failed > 1 ? 's' : ''}`)
      }
    },
    [importMonth]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
        e.target.value = ''
      }
    },
    [handleFiles]
  )

  // --- Filtered data ---
  const filteredMonths = useMemo(() => {
    if (selectedMonth === 'all') return months
    return months.filter((m) => m.month === selectedMonth)
  }, [months, selectedMonth])

  const totals = useMemo(() => {
    const totalIncome = filteredMonths.reduce((s, m) => s + m.totalIncome, 0)
    const totalExpenses = filteredMonths.reduce((s, m) => s + m.totalExpenses, 0)
    const netCashFlow = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (netCashFlow / totalIncome) * 100 : 0
    return { totalIncome, totalExpenses, netCashFlow, savingsRate }
  }, [filteredMonths])

  // --- Chart data: Income vs Expenses per month ---
  const barChartData = useMemo(() => {
    return filteredMonths.map((m) => ({
      month: m.month,
      income: m.totalIncome,
      expenses: m.totalExpenses,
    }))
  }, [filteredMonths])

  // --- Donut data: Spending by category ---
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    filteredMonths.forEach((m) => {
      m.expenses.forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount
      })
    })

    const sorted = Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    if (sorted.length <= 8) return sorted

    const top = sorted.slice(0, 8)
    const otherSum = sorted.slice(8).reduce((s, c) => s + c.value, 0)
    return [...top, { name: 'Other', value: otherSum }]
  }, [filteredMonths])

  // --- Agency connection ---
  const snapshot = getRevenueSnapshot()
  const agencyMrr = snapshot.currentMrr
  const agencyPercent =
    totals.totalIncome > 0 ? (agencyMrr / totals.totalIncome) * 100 : 0

  return (
    <div>
      {/* Import Zone */}
      <div
        className={`pf-import-zone${dragOver ? ' drag-over' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="pf-import-zone-icon">
          <Upload size={32} />
        </div>
        <div className="pf-import-zone-text">
          Drag &amp; drop monthly expense CSVs here
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          Or select files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          multiple
          style={{ display: 'none' }}
          onChange={onFileSelect}
        />
      </div>

      {/* Imported Months Bar */}
      {months.length > 0 && (
        <div className="pf-months-bar">
          {months.map((m) => (
            <span key={m.month} className="pf-month-badge">
              {m.month}
              <button onClick={() => removeMonth(m.month)} title="Remove month">
                <X size={12} />
              </button>
            </span>
          ))}

          <select
            className="btn btn-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ marginLeft: 'auto' }}
          >
            <option value="all">All Months</option>
            {months.map((m) => (
              <option key={m.month} value={m.month}>
                {m.month}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* KPI Row */}
      {months.length > 0 && (
        <>
          <div className="kpi-row" style={{ marginTop: 16 }}>
            <KpiCard
              label="Total Income"
              value={formatCurrency(totals.totalIncome)}
              variant="positive"
            />
            <KpiCard
              label="Total Expenses"
              value={formatCurrency(totals.totalExpenses)}
              variant="negative"
            />
            <KpiCard
              label="Net Cash Flow"
              value={formatCurrency(totals.netCashFlow)}
              variant={totals.netCashFlow >= 0 ? 'positive' : 'negative'}
            />
            <KpiCard
              label="Savings Rate"
              value={formatPercent(totals.savingsRate)}
              variant={totals.savingsRate >= 0 ? 'positive' : 'negative'}
            />
          </div>

          {/* Charts Grid */}
          <div className="pf-charts-grid">
            {/* Income vs Expenses Chart */}
            <div className="pf-chart-card">
              <div className="pf-chart-title">Income vs Expenses</div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  data={barChartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#a8a8a8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value: number) =>
                      `${(value / 1000).toFixed(0)}K`
                    }
                    tick={{ fill: '#a8a8a8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#141414',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 13,
                    }}
                    formatter={((value: number, name: string) => [
                      formatCurrency(Number(value) || 0),
                      name === 'income' ? 'Income' : 'Expenses',
                    ]) as never}
                    labelStyle={{ color: '#a8a8a8', marginBottom: 4 }}
                  />
                  <Bar
                    dataKey="income"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    name="income"
                  />
                  <Bar
                    dataKey="expenses"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    name="expenses"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Spending by Category Donut */}
            <div className="pf-chart-card">
              <div className="pf-chart-title">Spending by Category</div>
              {categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#141414',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 8,
                          color: '#fff',
                          fontSize: 13,
                        }}
                        formatter={(value: number | string | Array<any> | undefined) => [
                          formatCurrency(Number(value) || 0),
                          'Amount',
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pf-category-legend">
                    {categoryData.map((cat, idx) => (
                      <span key={cat.name} className="pf-category-legend-item">
                        <span
                          className="pf-category-legend-dot"
                          style={{
                            backgroundColor:
                              DONUT_COLORS[idx % DONUT_COLORS.length],
                          }}
                        />
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--aria-gray-text)', fontSize: 13 }}>
                  No expense data to display.
                </div>
              )}
            </div>
          </div>

          {/* Agency Connection Card */}
          <div className="pf-agency-card">
            <div className="pf-agency-card-title">Agency Connection</div>
            <div className="pf-agency-stats">
              <div className="pf-agency-stat">
                <div style={{ color: 'var(--aria-gray-text)' }}>
                  Your agency generates
                </div>
                <div className="pf-agency-stat-value" style={{ color: '#FFEB03' }}>
                  {formatCurrency(agencyMrr)}/month
                </div>
              </div>
              <div className="pf-agency-stat">
                <div style={{ color: 'var(--aria-gray-text)' }}>
                  This represents
                </div>
                <div className="pf-agency-stat-value" style={{ color: '#FFEB03' }}>
                  {formatPercent(agencyPercent)} of your total income
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PersonalFinance

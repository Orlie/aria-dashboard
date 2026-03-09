import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { formatCurrency, getToday } from '../../lib/utils'
import type { Expense } from '../../types'
import ConfirmDialog from '../shared/ConfirmDialog'
import { showSuccess } from '../../stores/toast-store'

interface ExpenseTrackerProps {
  expenses: Expense[]
  onAdd: (expense: Omit<Expense, 'id'>) => void
  onDelete: (id: string) => void
  netProfit: number
}

function ExpenseTracker({ expenses, onAdd, onDelete, netProfit }: ExpenseTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(getToday())
  const [recurring, setRecurring] = useState(false)
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !description || amount <= 0) return
    onAdd({ category, description, amount, date, recurring })
    showSuccess('Expense added')
    setCategory('')
    setDescription('')
    setAmount(0)
    setDate(getToday())
    setRecurring(false)
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex-between mb-16">
        <span />
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} />
          Add Expense
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          style={{
            background: 'var(--aria-card-bg)',
            border: '1px solid var(--aria-gray-border)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className="form-input"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Salary, Software, Ads"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input
                className="form-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              id="recurring-checkbox"
            />
            <label htmlFor="recurring-checkbox" style={{ fontSize: 13, color: 'var(--aria-gray-text)' }}>
              Recurring monthly
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Expense
            </button>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Recurring</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--aria-gray-text)', padding: 24 }}>
                  No expenses recorded yet.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td className="text-red">{formatCurrency(expense.amount)}</td>
                  <td>{expense.date}</td>
                  <td>{expense.recurring ? 'Yes' : 'No'}</td>
                  <td>
                    <button
                      className="btn-icon btn-ghost"
                      onClick={() => setDeleteExpenseId(expense.id)}
                      title="Delete expense"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 24,
          marginTop: 16,
          fontSize: 14,
        }}
      >
        <div>
          <span className="text-muted">Total Expenses: </span>
          <strong className="text-red">{formatCurrency(totalExpenses)}</strong>
        </div>
        <div>
          <span className="text-muted">Net Profit: </span>
          <strong style={{ color: netProfit >= 0 ? 'var(--aria-green)' : 'var(--aria-red)' }}>
            {formatCurrency(netProfit)}
          </strong>
        </div>
      </div>

      {deleteExpenseId && (
        <ConfirmDialog
          title="Delete Expense"
          message="Are you sure you want to delete this expense? This action cannot be undone."
          onConfirm={() => {
            onDelete(deleteExpenseId)
            showSuccess('Expense deleted')
            setDeleteExpenseId(null)
          }}
          onCancel={() => setDeleteExpenseId(null)}
        />
      )}
    </div>
  )
}

export default ExpenseTracker

import type { PersonalExpense, PersonalIncome, MonthlyFinance } from '../types'

// Parse $1,700.00 or -$5,615.00 to number
export function parseCurrency(raw: string): number {
  if (!raw) return 0
  const cleaned = raw.replace(/[$₱,\s"]/g, '').replace(/^P/, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

// Normalize inconsistent category names
const CATEGORY_MAP: Record<string, string> = {
  'needs': 'Needs',
  'HOUSE NEEDS': 'Housing',
  'wants': 'Wants',
  'HOUSE LOAN': 'House Loan',
  'CAR LOAN': 'Car Loan',
  'SALARY': 'Salary',
  'MAMA': 'Family Support',
  'MAMA BILLS': 'Family Support',
  'PARENTS': 'Family',
  'CAR': 'Car',
  'ONLINE SUB': 'Subscriptions',
  'business': 'Business',
  'BUSINESS': 'Business',
  'CATHY': 'Partner',
  'SOLAR': 'Solar',
  'LOAN': 'Loans',
  'COMMISSION': 'Commission',
  'ANNIVERSARY': 'Travel/Events',
  'TREXIE HOSPITAL': 'Medical',
  'RESELL': 'Resale Income',
  'HEALTH INSURANCE': 'Insurance',
}

export function normalizeCategory(raw: string): string {
  const trimmed = raw.trim()
  return CATEGORY_MAP[trimmed] || trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

// Split CSV line handling quoted fields
function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

export function parseFinancialCsv(csvText: string, monthLabel: string): MonthlyFinance {
  const lines = csvText.split(/\r?\n/)
  const expenses: PersonalExpense[] = []
  const income: PersonalIncome[] = []
  let totalIncome = 0
  let totalExpenses = 0
  let endingBalance = 0

  // Parse summary from top rows
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const cols = splitCsvLine(lines[i])
    for (let j = 0; j < cols.length; j++) {
      const cell = cols[j]?.toLowerCase().trim()
      if (cell === 'income' && cols[j + 1]) {
        totalIncome = parseCurrency(cols[j + 1])
      }
      if ((cell === 'expenses' || cell === 'total expenses') && cols[j + 1]) {
        totalExpenses = parseCurrency(cols[j + 1])
      }
      if ((cell === 'ending balance' || cell === 'end balance') && cols[j + 1]) {
        endingBalance = parseCurrency(cols[j + 1])
      }
    }
  }

  // Parse data rows (skip first ~10 header rows)
  for (let i = 8; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i])
    if (cols.length < 3) continue

    // Try to parse as expense (columns A-F)
    const status = cols[0]?.toUpperCase().trim()
    const date = cols[1]?.trim()
    const amount = parseCurrency(cols[2] || '')
    const description = cols[3]?.trim() || ''
    const category = cols[4]?.trim() || ''
    const wallet = cols[5]?.trim() || ''

    if ((status === 'PAID' || status === 'UNPAID') && date && amount > 0) {
      expenses.push({
        status: status as 'PAID' | 'UNPAID',
        date,
        amount,
        description,
        category: normalizeCategory(category),
        wallet,
      })
    }

    // Try to parse income from later columns (around index 12+)
    // Income columns typically: Date, Amount, Description, Category
    if (cols.length > 13) {
      const incDate = cols[12]?.trim()
      const incAmount = parseCurrency(cols[13] || '')
      const incDesc = cols[14]?.trim() || ''
      const incCat = cols[15]?.trim() || ''

      if (incDate && incAmount > 0) {
        income.push({
          date: incDate,
          amount: incAmount,
          description: incDesc,
          category: normalizeCategory(incCat || 'Income'),
        })
      }
    }
  }

  // If we couldn't parse totals from summary, calculate from entries
  if (totalExpenses === 0 && expenses.length > 0) {
    totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  }
  if (totalIncome === 0 && income.length > 0) {
    totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  }
  if (endingBalance === 0) {
    endingBalance = totalIncome - totalExpenses
  }

  return {
    month: monthLabel,
    totalIncome,
    totalExpenses,
    endingBalance,
    expenses,
    income,
  }
}

// Extract month label from filename like "01 - January 2026.csv"
export function extractMonthFromFilename(filename: string): string {
  const match = filename.match(/(\d{2})\s*-\s*(\w+\s+\d{4})/)
  if (match) return match[2]
  return filename.replace('.csv', '').trim()
}

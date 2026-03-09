import type { Lead, ProductCategory, LeadStatus } from '../types'
import { getDaysFromNow } from './utils'

// Default KaloData column name mappings
export interface KaloDataColumnMap {
  shopName: string
  tiktokHandle: string
  monthlyGmv: string
  category: string
  productCount: string
  liveFrequency: string
  shopUrl: string
  rating: string
}

export const DEFAULT_KALODATA_COLUMNS: KaloDataColumnMap = {
  shopName: 'Shop Name',
  tiktokHandle: 'TikTok Account',
  monthlyGmv: 'Monthly GMV',
  category: 'Category',
  productCount: 'Product Count',
  liveFrequency: 'Live Frequency',
  shopUrl: 'Shop URL',
  rating: 'Store Rating',
}

// Parse a CSV text string into an array of raw row objects
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const parseRow = (line: string): string[] => {
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

  const headers = parseRow(lines[0])
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values = parseRow(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h.trim()] = (values[i] || '').trim() })
    return row
  })
}

// Find a column value case-insensitively across common aliases
function findCol(row: Record<string, string>, ...aliases: string[]): string {
  for (const alias of aliases) {
    const key = Object.keys(row).find(k => k.toLowerCase() === alias.toLowerCase())
    if (key && row[key]) return row[key]
  }
  return ''
}

// Parse a GMV string like "$50,000", "50K", "50,000" into a number
function parseGmv(raw: string): number {
  if (!raw) return 0
  const cleaned = raw.replace(/[$,\s]/g, '').toLowerCase()
  if (cleaned.endsWith('k')) return parseFloat(cleaned) * 1000
  if (cleaned.endsWith('m')) return parseFloat(cleaned) * 1_000_000
  return parseFloat(cleaned) || 0
}

// Map a KaloData category string to ARIA ProductCategory
function mapCategory(raw: string): ProductCategory {
  const lower = raw.toLowerCase()
  if (lower.includes('beauty') || lower.includes('cosmetic') || lower.includes('skincare')) return 'beauty'
  if (lower.includes('fashion') || lower.includes('clothing') || lower.includes('apparel')) return 'fashion'
  if (lower.includes('food') || lower.includes('beverage') || lower.includes('snack')) return 'food'
  if (lower.includes('health') || lower.includes('wellness') || lower.includes('supplement')) return 'health'
  if (lower.includes('home') || lower.includes('kitchen') || lower.includes('decor')) return 'home'
  if (lower.includes('electronics') || lower.includes('tech') || lower.includes('gadget')) return 'electronics'
  return 'other'
}

export interface ParsedKaloDataLead {
  brandName: string
  tiktokHandle: string
  website: string
  estimatedMonthlyGmv: number
  productCategory: ProductCategory
  notes: string
  _rawRow: Record<string, string>
}

export function parseKaloDataCSV(
  csvText: string,
  columnMap: Partial<KaloDataColumnMap> = {}
): ParsedKaloDataLead[] {
  const cols = { ...DEFAULT_KALODATA_COLUMNS, ...columnMap }
  const rows = parseCSV(csvText)

  return rows.map(row => ({
    brandName: findCol(row, cols.shopName, 'shop name', 'store name', 'brand', 'name'),
    tiktokHandle: findCol(row, cols.tiktokHandle, 'tiktok', 'handle', 'account'),
    website: findCol(row, cols.shopUrl, 'shop url', 'store url', 'url', 'link'),
    estimatedMonthlyGmv: parseGmv(findCol(row, cols.monthlyGmv, 'gmv', 'revenue', 'monthly gmv')),
    productCategory: mapCategory(findCol(row, cols.category, 'category', 'niche', 'product type')),
    notes: `Imported from KaloData. Live frequency: ${findCol(row, cols.liveFrequency, 'live', 'frequency') || 'unknown'}. Rating: ${findCol(row, cols.rating, 'rating', 'score') || 'N/A'}`,
    _rawRow: row,
  })).filter(lead => lead.brandName)
}

// Convert parsed leads to ARIA Lead format for import
export function kaloDataLeadsToAria(leads: ParsedKaloDataLead[]): Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>[] {
  return leads.map(l => ({
    brandName: l.brandName,
    contactName: '',
    contactRole: '',
    email: '',
    phone: '',
    tiktokHandle: l.tiktokHandle,
    website: l.website,
    productCategory: l.productCategory,
    productType: '',
    estimatedMonthlyGmv: l.estimatedMonthlyGmv,
    commissionRate: 0,
    status: 'new' as LeadStatus,
    source: 'KaloData',
    notes: l.notes,
    score: {
      revenuePotential: 5,
      brandFit: 5,
      easeOfClosing: 5,
      productMargins: 5,
      overall: 5,
    },
    brief: {
      brandOverview: '',
      fitAnalysis: '',
      recommendedPitchAngle: '',
      followUpSchedule: [
        { day: 3, action: 'Follow-up DM', status: 'pending' as const, scheduledDate: getDaysFromNow(3) },
        { day: 7, action: 'Second follow-up or different channel', status: 'pending' as const, scheduledDate: getDaysFromNow(7) },
      ],
    },
  }))
}

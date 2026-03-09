# Agent Task: Batch 3B — KaloData CSV Import

**BATCH 3 — Can run simultaneously with Batch 3A (Report Generator).**
**These two plans touch different files — no conflicts.**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context:** Every morning (9-10 AM), Orlie exports 15-20 shops from KaloData and manually types each one into ARIA. This takes 30-45 minutes. KaloData exports CSV files with columns like shop name, estimated GMV, TikTok handle, category, etc. This plan adds a CSV import that lets Orlie upload the file and import all leads in one click, saving 30-45 minutes per day = ~175 hours/year.

**This plan only touches files in the Leads domain — no changes to shared layout/nav files.**

---

## Files to Read First

1. `src/lib/csv-parser.ts` — existing CSV parser (for personal finance data — understand pattern, do NOT modify it, create a new file)
2. `src/types/index.ts` — see Lead type, ProductCategory type, LeadStatus type
3. `src/stores/leads-store.ts` — see addLead action
4. `src/pages/LeadsPage.tsx` — add "Import CSV" button to toolbar
5. `src/lib/utils.ts` — see generateId, getToday
6. `src/components/shared/Modal.tsx` — reuse for import dialog

---

## Step 1: Create `src/lib/kalodata-parser.ts`

KaloData CSV export format (typical columns — Orlie should confirm exact column names from her export, so we build a CONFIGURABLE parser):

```typescript
import { Lead, ProductCategory, LeadStatus } from '../types'
import { generateId, getToday } from './utils'

// Default KaloData column name mappings
// User can override these in the import UI if KaloData changes its format
export interface KaloDataColumnMap {
  shopName: string       // default: "Shop Name" or "Store Name"
  tiktokHandle: string   // default: "TikTok Account" or "TikTok Handle"
  monthlyGmv: string     // default: "Monthly GMV" or "Estimated GMV"
  category: string       // default: "Category" or "Product Category"
  productCount: string   // default: "Product Count" or "Products"
  liveFrequency: string  // default: "Live Frequency" or "LIVE Sessions"
  shopUrl: string        // default: "Shop URL" or "Store URL"
  rating: string         // default: "Store Rating" or "Rating"
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

  // Handle quoted fields
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
  website: string // TikTok Shop URL
  estimatedMonthlyGmv: number
  productCategory: ProductCategory
  notes: string
  _rawRow: Record<string, string> // keep original for display in preview
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
  })).filter(lead => lead.brandName) // skip rows with no brand name
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
        { day: 3, action: 'Follow-up DM', completed: false },
        { day: 7, action: 'Second follow-up or different channel', completed: false },
      ],
    },
  }))
}
```

---

## Step 2: Create `src/components/leads/KaloDataImport.tsx`

A modal with a 3-step import flow.

**Props:** `{ isOpen: boolean; onClose: () => void }`

**Step 1 — Upload:**
- File drop zone (drag and drop) OR a "Browse File" button
- Accepts `.csv` files only
- On file selected: read with `FileReader`, parse with `parseKaloDataCSV()`, advance to Step 2
- Show error if no valid rows found

**Step 2 — Preview & Select:**
- Show a table of parsed leads with checkboxes (all checked by default)
- Columns: ✓ | Brand Name | TikTok Handle | Est. GMV | Category | Notes
- "Select All" / "Deselect All" header checkbox
- Show count: "15 leads found — 15 selected"
- If a brand name is empty or GMV is 0, flag that row in orange with a warning icon
- "Import Selected" button (primary, yellow) + "Back" button

**Step 3 — Confirmation:**
- "Successfully imported X leads" message with green checkmark
- Brief summary: X leads added to New status
- "View in Pipeline" button (navigates to /leads) + "Import Another" button

**Import logic on Step 3:**
```typescript
const ariaLeads = kaloDataLeadsToAria(selectedLeads)
const store = useLeadsStore.getState()
ariaLeads.forEach(lead => store.addLead(lead))
showSuccess(`Imported ${ariaLeads.length} leads from KaloData`)
```

**Styling for file drop zone:**
```css
.file-drop-zone {
  border: 2px dashed #333;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.file-drop-zone:hover,
.file-drop-zone.drag-over {
  border-color: var(--aria-yellow);
  background: rgba(255, 235, 3, 0.03);
}
```

---

## Step 3: Update `src/pages/LeadsPage.tsx`

1. Read the file to understand the current toolbar
2. Add "Import KaloData CSV" button to the toolbar (next to Quick Add and Add Lead buttons)
3. Import `KaloDataImport` component
4. Add `isImportOpen` state
5. Render `<KaloDataImport isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />`
6. Button style: `.btn .btn-ghost` with `Upload` icon from lucide-react

---

## Done Criteria

- [ ] `kalodata-parser.ts` correctly parses CSV text into `ParsedKaloDataLead[]`
- [ ] GMV parsing handles $50,000 format and 50K format
- [ ] Category mapping covers all ARIA ProductCategory values
- [ ] File drop zone accepts .csv files via drag-and-drop and browse
- [ ] Preview table shows all parsed rows with checkboxes
- [ ] Only checked rows are imported
- [ ] Each imported lead has `status: 'new'` and `source: 'KaloData'`
- [ ] Success message shows correct count
- [ ] "Import KaloData CSV" button visible in Leads page toolbar
- [ ] No TypeScript errors, `npm run build` succeeds

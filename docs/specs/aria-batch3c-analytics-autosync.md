# Agent Task: Batch 3C — Analytics Dashboard + Auto-Sync

**BATCH 3 — Run AFTER 3A and 3B complete (this plan touches App.tsx, Sidebar.tsx, MobileNav.tsx).**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context (Analytics):** After 2-3 months of operation, ARIA will have rich data: hundreds of leads at different pipeline stages, multiple clients with session history, creator performance, ad ROAS trends. An analytics page answers: How fast does the pipeline convert? Which categories close fastest? What is the agency's revenue trajectory? Are clients churning or growing?

**Business context (Auto-Sync):** The Google Sheets sync is currently manual (click a button). If Orlie forgets to sync, the spreadsheet backup falls behind. An automatic 30-minute sync ensures data is always backed up without manual intervention.

---

## Files to Read First

1. `src/stores/leads-store.ts` — understand Lead[] data and lead statuses
2. `src/stores/clients-store.ts` — understand Client[], getRevenueSnapshot
3. `src/stores/live-sessions-store.ts` — understand session data
4. `src/stores/ads-store.ts` — understand AdDailyLog data
5. `src/stores/sheets-store.ts` — understand isConnected, spreadsheetId, syncInProgress states
6. `src/lib/sync-service.ts` — understand pushToSheets function (we call this in auto-sync)
7. `src/components/revenue/RevenueTrendChart.tsx` — see Recharts pattern (LineChart, ComposedChart)
8. `src/App.tsx` — add route
9. `src/components/Layout/Sidebar.tsx` — add nav item + last sync display
10. `src/components/Layout/MobileNav.tsx` — add nav item
11. `src/lib/utils.ts` — see formatCurrency, formatPercent, getDaysUntil

---

## PART A: Analytics Dashboard

### Step A1: Create `src/pages/AnalyticsPage.tsx`

This page requires NO new store — it computes everything from existing stores.

**Page layout:**
```
[Page title: "Analytics"]
[Time range selector: Last 7 days | Last 30 days | Last 90 days | All Time]

[ROW 1 — Pipeline KPIs (4 cards)]
  [Total Leads] [Conversion Rate] [Avg Days to Close] [Pipeline Value]

[ROW 2 — Revenue KPIs (4 cards)]
  [Current MRR] [MRR Growth (MoM)] [Revenue Runway] [Goal Progress]

[ROW 3 — Charts, 2 columns]
  Left: Pipeline Funnel Chart (leads by status)
  Right: Lead Source Breakdown (KaloData vs other)

[ROW 4 — Charts, full width]
  MRR Trend (monthly, all time) — existing RevenueTrendChart reuse if possible

[ROW 5 — Performance Table]
  Per-client performance: Client | MRR | Sessions (30d) | Avg GMV/Session | Active Creators | Ad ROAS | Health Score
```

**KPI computations:**

```typescript
// From leads-store
const allLeads = useLeadsStore(s => s.leads)
const closedLeads = allLeads.filter(l => l.status === 'closed' || l.status === 'active')
const conversionRate = allLeads.length > 0
  ? (closedLeads.length / allLeads.length) * 100
  : 0

// Avg days to close — for leads that moved to 'closed' or 'active'
// Approximate: use lead.createdAt to lead.updatedAt for closed leads
const avgDaysToClose = closedLeads.length > 0
  ? closedLeads.reduce((sum, l) => {
      const created = new Date(l.createdAt)
      const updated = new Date(l.updatedAt)
      return sum + Math.max(0, (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    }, 0) / closedLeads.length
  : 0

// Pipeline value = sum of estimatedMonthlyGmv for leads in pipeline statuses
// ARIA charges $2,500/month + 10-15% commission — for display, show potential MRR
const pipelineLeads = allLeads.filter(l =>
  ['replied', 'meeting_set', 'negotiating'].includes(l.status)
)
const pipelineValue = pipelineLeads.length * 2500 // $2,500/client

// Revenue runway (months until $1M at current growth rate)
const snapshot = useClientsStore(s => s.getRevenueSnapshot())
const monthlyGrowthRate = 0.15 // estimate 15% MoM if unknown — show placeholder if no data
const monthsToGoal = snapshot.currentMrr > 0 && monthlyGrowthRate > 0
  ? Math.log(snapshot.target / snapshot.currentMrr) / Math.log(1 + monthlyGrowthRate)
  : null
```

**Pipeline Funnel Chart:**

Use Recharts `BarChart` (horizontal) showing count of leads at each status:
```
New          ████████████████ 45
Contacted    ████████████ 32
Replied      ████████ 18
Meeting Set  █████ 12
Negotiating  ███ 7
Closed       ██ 5
Active       █ 3
```
Colors: gradient from `--aria-gray-text` (left/early stages) to `--aria-yellow` (right/late stages).

**Lead Source Chart:**

Recharts `PieChart` showing leads grouped by `lead.source`:
- KaloData
- Referral
- Other
Use `--aria-yellow`, `--aria-blue`, `--aria-green` for colors.

**Client Performance Table:**

For each active client, show:
- Client name
- Monthly contract value
- LIVE sessions in last 30 days (from live-sessions-store)
- Avg GMV per session
- Active creators count
- Latest ad ROAS
- **Health Score** (computed 1-10): `(sessions > 4 ? 3 : sessions) + (roas > 3 ? 3 : roas) + (activeCreators > 5 ? 4 : activeCreators/5*4)` — simplified scoring

Color health score: < 4 = red, 4-7 = yellow, > 7 = green.

---

### Step A2: Add Analytics Navigation

### `src/App.tsx`
```typescript
import AnalyticsPage from './pages/AnalyticsPage'
<Route path="/analytics" element={<AnalyticsPage />} />
```

### `src/components/Layout/Sidebar.tsx`
Add (read file first):
```typescript
{ path: '/analytics', label: 'Analytics', icon: BarChart2 }
```
Import `BarChart2` from `lucide-react`.

### `src/components/Layout/MobileNav.tsx`
Add same item.

---

## PART B: Auto-Sync to Google Sheets

### Step B1: Create `src/lib/useAutoSync.ts`

A React hook that automatically pushes data to Google Sheets every 30 minutes when connected.

```typescript
import { useEffect, useRef } from 'react'
import { useSheetsStore } from '../stores/sheets-store'
import { pushToSheets } from './sync-service'
import { useToastStore } from '../stores/toast-store'

const SYNC_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

export function useAutoSync() {
  const { isConnected, config, syncInProgress, setLastSyncAt, setError } = useSheetsStore()
  const { showError } = useToastStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Only start if connected with a spreadsheet configured
    if (!isConnected || !config?.spreadsheetId) return

    const runSync = async () => {
      if (syncInProgress) return // Don't double-sync
      try {
        await pushToSheets()
        setLastSyncAt(new Date().toISOString())
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Auto-sync failed'
        setError(message)
        // Don't show toast for auto-sync errors — just log to store
        console.warn('ARIA auto-sync error:', message)
      }
    }

    // Run once immediately after connecting, then on interval
    intervalRef.current = setInterval(runSync, SYNC_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isConnected, config?.spreadsheetId])
}
```

### Step B2: Mount `useAutoSync` in `src/App.tsx`

Read `App.tsx` first. Add the hook call inside the `App` function component:
```typescript
import { useAutoSync } from './lib/useAutoSync'

function App() {
  useAutoSync() // Auto-syncs to Google Sheets every 30 min when connected
  // ... rest of component
}
```

### Step B3: Show Last Sync Time in `src/components/Layout/Sidebar.tsx`

Read `Sidebar.tsx` first to understand the current structure. Then:

1. Import `useSheetsStore`
2. At the bottom of the sidebar (before the closing `</nav>` or in a footer area), add a small sync status indicator:
   ```
   ☁ Synced 12 min ago
   ```
   or if not connected:
   ```
   ☁ Not synced
   ```

**Implementation:**
```typescript
const { isConnected, lastSyncAt } = useSheetsStore()

// Format relative time
function getRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
```

**Styling** (add to Sidebar.css or inline):
```css
.sidebar-sync-status {
  padding: 8px 16px;
  font-size: 11px;
  color: var(--aria-gray-text);
  display: flex;
  align-items: center;
  gap: 6px;
  border-top: 1px solid #1a1a1a;
}
.sidebar-sync-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--aria-green);
}
.sidebar-sync-dot.disconnected {
  background: #333;
}
```

---

## Done Criteria

**Analytics:**
- [ ] `/analytics` route renders AnalyticsPage
- [ ] "Analytics" in sidebar and mobile nav
- [ ] 8 KPI cards visible (4 pipeline + 4 revenue)
- [ ] Pipeline funnel bar chart shows leads by status
- [ ] Lead source pie chart shows KaloData vs other
- [ ] Client performance table shows all active clients with health scores
- [ ] Time range selector changes the data displayed

**Auto-Sync:**
- [ ] `useAutoSync` hook mounted in `App.tsx`
- [ ] When `isConnected = true`, interval is set for 30-minute push sync
- [ ] `lastSyncAt` updates in sheets-store after successful sync
- [ ] Sidebar shows "Synced X min ago" when connected and sync has run
- [ ] Sidebar shows "Not synced" when disconnected
- [ ] No sync attempt when `syncInProgress = true` (prevents double-sync)

**General:**
- [ ] No TypeScript errors, `npm run build` succeeds

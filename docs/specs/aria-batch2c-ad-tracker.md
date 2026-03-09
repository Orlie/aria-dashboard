# Agent Task: Batch 2C — Ad Campaign Tracker

**BATCH 2 — Run SEQUENTIALLY after 2B completes.**
**Reason: Modifies shared files (types/index.ts, App.tsx, Sidebar.tsx, MobileNav.tsx)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context:** GMV Max Ads is one of three core services. Orlie manages TikTok ads for each client. The SOP requires daily monitoring (15 min/day): check spend vs budget, ROAS, pause underperformers, scale winners. The weekly client report needs exact numbers: campaigns run, total ad spend, GMV generated, ROAS, orders. Without logging this in ARIA, Orlie must manually check TikTok Ads Manager for each client every morning.

**SOP scaling rules (build these as automated alerts):**
- ROAS < 1.5 for 3+ consecutive days → "Pause Recommended" (red alert)
- ROAS 1.5-3.0 → Normal (no alert)
- ROAS 3.0-4.0 → "Good Performance" (green)
- ROAS > 4.0 → "Scale Recommended" (yellow alert)
- Daily spend > 120% of budget → "Over Budget" (red alert)

**Zustand store pattern:** Follow `src/stores/clients-store.ts` exactly.

---

## Files to Read First

1. `src/types/index.ts` — add AdCampaign and AdDailyLog types here
2. `src/stores/clients-store.ts` — canonical store pattern
3. `src/App.tsx` — add `/ads` route
4. `src/components/Layout/Sidebar.tsx` — add "Ads" nav item
5. `src/components/Layout/MobileNav.tsx` — add "Ads" nav item
6. `src/components/revenue/RevenueTrendChart.tsx` — see Recharts chart pattern (LineChart with ResponsiveContainer)
7. `src/lib/utils.ts` — see `formatCurrency`, `formatPercent`, `generateId`, `getToday`
8. `src/components/shared/KpiCard.tsx` — reuse for ad KPIs

---

## Step 1: Add Types to `src/types/index.ts`

Add with clear section header:

```typescript
// ============================================================
// AD CAMPAIGN TYPES
// ============================================================

export type AdCampaignStatus = 'active' | 'paused' | 'ended'

export type AdAlert = 'pause_recommended' | 'scale_recommended' | 'over_budget' | 'good_performance' | null

export interface AdCampaign {
  id: string
  clientId: string
  campaignName: string
  status: AdCampaignStatus
  dailyBudget: number
  startDate: string
  endDate?: string
  notes: string
  createdAt: string
}

export interface AdDailyLog {
  id: string
  campaignId: string
  clientId: string
  date: string // YYYY-MM-DD
  spend: number
  gmv: number
  roas: number // computed: gmv / spend, but allow manual override
  orders: number
  impressions: number
  notes: string
  createdAt: string
}
```

---

## Step 2: Create `src/stores/ads-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AdCampaign, AdCampaignStatus, AdDailyLog, AdAlert } from '../types'
import { generateId, getToday } from '../lib/utils'

interface AdsState {
  campaigns: AdCampaign[]
  dailyLogs: AdDailyLog[]
  addCampaign: (campaign: Omit<AdCampaign, 'id' | 'createdAt'>) => void
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void
  deleteCampaign: (id: string) => void
  addDailyLog: (log: Omit<AdDailyLog, 'id' | 'createdAt'>) => void
  updateDailyLog: (id: string, updates: Partial<AdDailyLog>) => void
  deleteDailyLog: (id: string) => void
  getCampaignsByClient: (clientId: string) => AdCampaign[]
  getLogsForCampaign: (campaignId: string) => AdDailyLog[]
  getLogsForClient: (clientId: string) => AdDailyLog[]
  getLogsForWeek: (clientId: string, startDate: string, endDate: string) => AdDailyLog[]
  getCampaignAlert: (campaignId: string) => AdAlert
}

export const useAdsStore = create<AdsState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      dailyLogs: [],

      addCampaign: (campaignData) => {
        const campaign: AdCampaign = {
          ...campaignData,
          id: generateId(),
          createdAt: getToday(),
        }
        set((state) => ({ campaigns: [...state.campaigns, campaign] }))
      },

      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }))
      },

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
          dailyLogs: state.dailyLogs.filter((l) => l.campaignId !== id),
        }))
      },

      addDailyLog: (logData) => {
        // Auto-compute ROAS if not provided or if 0
        const roas = logData.roas || (logData.spend > 0 ? logData.gmv / logData.spend : 0)
        const log: AdDailyLog = {
          ...logData,
          roas,
          id: generateId(),
          createdAt: getToday(),
        }
        set((state) => ({ dailyLogs: [...state.dailyLogs, log] }))
      },

      updateDailyLog: (id, updates) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        }))
      },

      deleteDailyLog: (id) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.filter((l) => l.id !== id),
        }))
      },

      getCampaignsByClient: (clientId) => {
        return get().campaigns.filter((c) => c.clientId === clientId)
      },

      getLogsForCampaign: (campaignId) => {
        return get().dailyLogs
          .filter((l) => l.campaignId === campaignId)
          .sort((a, b) => a.date.localeCompare(b.date))
      },

      getLogsForClient: (clientId) => {
        return get().dailyLogs.filter((l) => l.clientId === clientId)
      },

      getLogsForWeek: (clientId, startDate, endDate) => {
        return get().dailyLogs.filter(
          (l) => l.clientId === clientId && l.date >= startDate && l.date <= endDate
        )
      },

      getCampaignAlert: (campaignId) => {
        const logs = get()
          .getLogsForCampaign(campaignId)
          .slice(-3) // last 3 days
        if (logs.length === 0) return null
        const campaign = get().campaigns.find((c) => c.id === campaignId)
        if (!campaign) return null

        const latestLog = logs[logs.length - 1]

        // Over budget check
        if (latestLog.spend > campaign.dailyBudget * 1.2) return 'over_budget'

        // ROAS checks on last 3 days
        if (logs.length >= 3) {
          const allLowRoas = logs.every((l) => l.roas < 1.5)
          if (allLowRoas) return 'pause_recommended'
        }

        if (latestLog.roas > 4.0) return 'scale_recommended'
        if (latestLog.roas >= 3.0) return 'good_performance'

        return null
      },
    }),
    { name: 'aria-ads' }
  )
)
```

---

## Step 3: Create `src/components/ads/AdCampaignCard.tsx`

A card for each ad campaign showing its status and latest performance.

**Props:** `{ campaign: AdCampaign; onEdit: () => void; onLogDay: () => void; onDelete: () => void }`

**Card content:**
- Campaign name (bold)
- Status badge (active = green, paused = orange, ended = gray)
- Alert badge from `getCampaignAlert` — use colors: red for pause/over-budget, yellow for scale, green for good
- Latest day stats: Spend, GMV, ROAS (pulled from last log entry)
- "Log Today" button (`.btn .btn-sm .btn-primary`)
- "Edit" and "Delete" icon buttons

**Alert badge text:**
- `pause_recommended`: "⚠ Pause Recommended"
- `scale_recommended`: "↑ Scale Recommended"
- `over_budget`: "🔴 Over Budget"
- `good_performance`: "✓ Good Performance"

---

## Step 4: Create `src/components/ads/AdDailyLogForm.tsx`

Modal form for logging a day's ad performance.

**Props:** `{ isOpen: boolean; onClose: () => void; campaignId: string; clientId: string }`

**Fields:**
1. Date (date, default: today)
2. Ad Spend ($) (number, required)
3. GMV Generated ($) (number, required)
4. ROAS (number, read-only, auto-computed as GMV/Spend, display only — shows "auto-calculated")
5. Orders (number)
6. Impressions (number, optional)
7. Notes (textarea, rows: 2, optional)

Show a live preview as user types: `ROAS = ${(gmv / spend).toFixed(2)}x` with color coding (red < 1.5, yellow 1.5-3, green > 3).

---

## Step 5: Create `src/components/ads/AdPerformanceChart.tsx`

A line chart showing ROAS and spend over time for a campaign.

**Props:** `{ campaignId: string }`

Use Recharts `ComposedChart` with:
- X axis: date (format: "Mar 5")
- Left Y axis: ROAS (line, `stroke="var(--aria-yellow)"`)
- Right Y axis: Spend in $ (bar, `fill="var(--aria-blue)"` at 30% opacity)
- Reference lines at ROAS = 1.5 (red, "Min") and ROAS = 4.0 (green, "Scale")
- `ResponsiveContainer width="100%" height={200}`

---

## Step 6: Create `src/pages/AdsPage.tsx`

```
[Page title: "Ad Campaigns"]
[Client selector tabs]
[Stats bar: Active Campaigns, Total Spend (30 days), Total GMV (30 days), Avg ROAS]
[Campaign cards grid — AdCampaignCard components]
[Add Campaign button (top right)]
[Per-campaign: expandable section with AdPerformanceChart]
```

For the stats bar, compute from last 30 days of `dailyLogs` for selected client:
- Total spend: sum all `log.spend`
- Total GMV: sum all `log.gmv`
- Avg ROAS: total GMV / total spend
- Active campaigns: count of campaigns with status = 'active'

---

## Step 7: Add Navigation

### `src/App.tsx`
```typescript
import AdsPage from './pages/AdsPage'
<Route path="/ads" element={<AdsPage />} />
```

### `src/components/Layout/Sidebar.tsx`
Add (read file first for exact array structure):
```typescript
{ path: '/ads', label: 'Ads', icon: TrendingUp }
```
Import `TrendingUp` from `lucide-react`. Place after Creators item.

### `src/components/Layout/MobileNav.tsx`
Add same item.

---

## Done Criteria

- [ ] `AdCampaign`, `AdDailyLog`, `AdAlert` types in `src/types/index.ts`
- [ ] `useAdsStore` persists to `aria-ads`
- [ ] ROAS auto-computed on `addDailyLog` when not provided
- [ ] Alert logic correctly identifies pause/scale/over-budget conditions
- [ ] "Ads" in sidebar and mobile nav
- [ ] `/ads` route renders `AdsPage`
- [ ] Campaign cards show latest stats and alert badges
- [ ] "Log Today" opens `AdDailyLogForm`, ROAS auto-computes as user types
- [ ] Performance chart renders with reference lines
- [ ] No TypeScript errors, `npm run build` succeeds

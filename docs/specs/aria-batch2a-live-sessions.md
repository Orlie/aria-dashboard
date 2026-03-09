# Agent Task: Batch 2A — LIVE Session Tracker

**BATCH 2 — Run SEQUENTIALLY (one at a time). 2A → 2B → 2C → 2D**
**Reason: Each Batch 2 plan modifies shared files (types/index.ts, App.tsx, Sidebar.tsx, MobileNav.tsx)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context:** When a client signs, Orlie needs to log every LIVE selling session (2-4 hours long, done on TikTok). Each session has stats: viewers, orders, GMV, top product. These stats feed the Monday weekly client report. Without this tracker, every report requires 2-3 hours of manual work.

**Zustand store pattern to follow** — read `src/stores/clients-store.ts` as the canonical example:
- `create<StateType>()(persist((set, get) => ({ ... }), { name: 'aria-KEY-NAME' }))`
- Actions accept minimal parameters and derive the rest
- Include getter functions that return computed/filtered arrays

**CSS pattern:** Cards use `.card` class. KPI bars use `.kpi-bar` with `.kpi-item` children. Tables use existing DataTable pattern.

---

## Files to Read First

1. `src/types/index.ts` — understand existing types; find a good place to add LiveSession type
2. `src/stores/clients-store.ts` — canonical store pattern to replicate exactly
3. `src/App.tsx` — see how routes are defined (add `/live` route)
4. `src/components/Layout/Sidebar.tsx` — see NAV_ITEMS array (add "LIVE" item)
5. `src/components/Layout/MobileNav.tsx` — see mobile nav items (add "LIVE" item)
6. `src/pages/RevenuePage.tsx` — see how a page uses collapsible sections and KPI bars
7. `src/components/shared/KpiCard.tsx` — reuse this for session KPI cards
8. `src/components/revenue/RevenueTrendChart.tsx` — see Recharts LineChart pattern
9. `src/lib/utils.ts` — see `formatCurrency`, `formatDate`, `generateId`, `getToday`

---

## Step 1: Add Types to `src/types/index.ts`

Add the following types to the LIVE Session section (add a clear comment header):

```typescript
// ============================================================
// LIVE SESSION TYPES
// ============================================================

export interface LiveSession {
  id: string
  clientId: string
  date: string // YYYY-MM-DD
  durationMinutes: number
  peakViewers: number
  averageViewers: number
  totalOrders: number
  gmv: number
  topProduct: string
  hostName: string
  notes: string
  createdAt: string
}
```

---

## Step 2: Create `src/stores/live-sessions-store.ts`

Follow `clients-store.ts` pattern exactly:

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LiveSession } from '../types'
import { generateId, getToday } from '../lib/utils'

interface LiveSessionsState {
  sessions: LiveSession[]
  addSession: (session: Omit<LiveSession, 'id' | 'createdAt'>) => void
  updateSession: (id: string, updates: Partial<LiveSession>) => void
  deleteSession: (id: string) => void
  getSessionsByClient: (clientId: string) => LiveSession[]
  getSessionsThisWeek: () => LiveSession[]
  getSessionsForWeek: (startDate: string, endDate: string) => LiveSession[]
}

export const useLiveSessionsStore = create<LiveSessionsState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (sessionData) => {
        const session: LiveSession = {
          ...sessionData,
          id: generateId(),
          createdAt: getToday(),
        }
        set((state) => ({ sessions: [...state.sessions, session] }))
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }))
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        }))
      },

      getSessionsByClient: (clientId) => {
        return get().sessions.filter((s) => s.clientId === clientId)
      },

      getSessionsThisWeek: () => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        const startStr = startOfWeek.toISOString().split('T')[0]
        return get().sessions.filter((s) => s.date >= startStr)
      },

      getSessionsForWeek: (startDate, endDate) => {
        return get().sessions.filter(
          (s) => s.date >= startDate && s.date <= endDate
        )
      },
    }),
    { name: 'aria-live-sessions' }
  )
)
```

---

## Step 3: Create `src/components/live/LiveSessionForm.tsx`

A modal form for logging a new LIVE session. Use `Modal` from `src/components/shared/Modal.tsx`.

**Props:**
```typescript
interface LiveSessionFormProps {
  isOpen: boolean
  onClose: () => void
  clientId?: string // if provided, pre-select this client
}
```

**Form fields:**
1. Client (select dropdown — pull from `useClientsStore.getState().getActiveClients()`, required)
2. Date (date input, default: today, required)
3. Duration (number input, label: "Duration (minutes)", placeholder: "120", required)
4. Peak Viewers (number, required)
5. Average Viewers (number, required)
6. Total Orders (number, required)
7. GMV ($) (number, required, label: "GMV ($)")
8. Top Product (text, placeholder: "Which product sold best?")
9. Host Name (text, placeholder: "Host's name")
10. Notes (textarea, rows: 3, optional)

**On submit:** Call `useLiveSessionsStore.getState().addSession(formData)`, show success toast, close.

---

## Step 4: Create `src/components/live/LiveSessionTable.tsx`

A sortable table of sessions for a specific client.

**Props:**
```typescript
interface LiveSessionTableProps {
  clientId: string
}
```

**Columns:** Date | Duration | Peak Viewers | Avg Viewers | Orders | GMV | Top Product | Host | Actions
**Actions column:** Edit button (opens LiveSessionForm pre-filled) + Delete button (with confirm dialog)
**Empty state:** Use `EmptyState` component from shared — "No sessions logged yet" with a Log Session button

Sort default: newest date first.

---

## Step 5: Create `src/components/live/LiveSessionKpis.tsx`

KPI cards for the LIVE sessions page.

**Props:**
```typescript
interface LiveSessionKpisProps {
  sessions: LiveSession[]
  label?: string // e.g., "This Week" or "All Time"
}
```

**Computed metrics:**
- Total Sessions: `sessions.length`
- Total GMV: sum of all `session.gmv` → format with `formatCurrency`
- Avg Viewers: average of `session.averageViewers` → round to whole number
- Avg GMV/Session: total GMV / count → format with `formatCurrency`
- Best Session GMV: max `session.gmv` → format with `formatCurrency`
- Total Orders: sum of `session.totalOrders`

**Layout:** Use `KpiCard` component (`.kpi-card` class) in a flex row grid (same pattern as RevenueKpiBar).

---

## Step 6: Create `src/pages/LiveSessionsPage.tsx`

Main page layout:

```
[Page Title: "LIVE Sessions"]
[LiveSessionKpis - "This Week" stats]
[Client filter tabs - one tab per active client + "All" tab]
[Log Session button (top right)]
[LiveSessionTable - filtered by selected client tab]
[GMV Trend Chart - Recharts LineChart, sessions.date on X, session.gmv on Y]
```

**Implementation details:**
- Import `useClientsStore` to get active clients list for tabs
- Import `useLiveSessionsStore` for sessions
- Use `useState` for selected client tab (`'all'` or a clientId)
- The "Log Session" button opens `LiveSessionForm`
- The GMV chart: use `ResponsiveContainer` + `LineChart` from recharts, `stroke="var(--aria-yellow)"`, data sorted by date ascending

---

## Step 7: Add Navigation

### `src/App.tsx`
Add the import and route:
```typescript
import LiveSessionsPage from './pages/LiveSessionsPage'
// Inside <Routes>:
<Route path="/live" element={<LiveSessionsPage />} />
```

### `src/components/Layout/Sidebar.tsx`
Read the file first to understand the NAV_ITEMS array structure, then add:
```typescript
{ path: '/live', label: 'LIVE', icon: Video }
```
Import `Video` from `lucide-react`. Insert it after the Leads item (second position) since it's the most frequently used operational module.

### `src/components/Layout/MobileNav.tsx`
Add the same item to the mobile nav array. Read the file first to see the exact structure.

---

## Done Criteria

- [ ] `LiveSession` type exists in `src/types/index.ts`
- [ ] `useLiveSessionsStore` persists to localStorage key `aria-live-sessions`
- [ ] "LIVE" nav item appears in sidebar and mobile nav
- [ ] `/live` route renders `LiveSessionsPage`
- [ ] "Log Session" button opens the form modal
- [ ] Submitting the form creates a session and shows a success toast
- [ ] Sessions table shows per-client sessions with delete/edit
- [ ] KPI cards show correct computed stats
- [ ] GMV trend chart renders with session data
- [ ] No TypeScript errors, `npm run build` succeeds

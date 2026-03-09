# Agent Task: Batch 2D — Client Onboarding Tracker

**BATCH 2 — Run SEQUENTIALLY after 2C completes.**
**Reason: Modifies shared files (types/index.ts, clients-store.ts)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context:** Every new client goes through a 7-day onboarding process (Days 0-7). The checklist has ~25 tasks across those days: getting access to TikTok Seller Center, setting up ad campaigns, recruiting creators, training the host, doing a test LIVE session, etc. If a task is missed, it risks the 20% GMV growth guarantee. This tracker makes onboarding systematic and visible.

**The onboarding checklist (from docs/onboarding-checklist.md — read it if available):**
- Day 0: Contract signed, payment confirmed, client added to ARIA, welcome email sent
- Day 1: Receive Seller Center access, Ads Manager access, product catalog, brand guidelines, product samples
- Day 2-3: Shop audit, KaloData competitor analysis, LIVE schedule agreed, ad campaigns created, creator recruitment brief, scripts drafted
- Day 4-5: Creator outreach started (20-30 DMs), samples coordination, LIVE setup tested
- Day 5-6: Host training session, test LIVE session (30 min), script adjustments
- Day 7: First official LIVE session, post-LIVE report, client debrief call
- Week 2: First weekly report, optimization review, creator follow-ups

This plan does NOT add a new page — onboarding is embedded as an expandable section within each client card on the Revenue page.

---

## Files to Read First

1. `src/types/index.ts` — add OnboardingTask and ClientOnboarding types
2. `src/stores/clients-store.ts` — add onboardings state here (not a new store)
3. `src/components/revenue/ClientRevenueTable.tsx` — this is where the onboarding section gets embedded
4. `src/pages/RevenuePage.tsx` — understand the page structure
5. `src/lib/utils.ts` — see `getToday`, `getDaysFromNow`, `formatDate`

---

## Step 1: Add Types to `src/types/index.ts`

Add with clear section header:

```typescript
// ============================================================
// CLIENT ONBOARDING TYPES
// ============================================================

export interface OnboardingTask {
  id: string
  day: number // 0, 1, 2, 3, 4, 5, 6, 7, 14 (week 2)
  label: string
  completed: boolean
  completedAt?: string
  notes?: string
}

export interface ClientOnboarding {
  clientId: string
  startDate: string // YYYY-MM-DD, the day the contract was signed
  assignedHost: string
  tasks: OnboardingTask[]
  completedAt?: string // set when all day-7 tasks are done
}
```

---

## Step 2: Create `src/lib/onboarding-template.ts`

A constant array of all onboarding tasks, keyed by day. This mirrors `docs/onboarding-checklist.md`.

```typescript
import { OnboardingTask } from '../types'
import { generateId } from './utils'

export const ONBOARDING_TASKS_TEMPLATE: Omit<OnboardingTask, 'id'>[] = [
  // Day 0 — Contract & Setup
  { day: 0, label: 'Contract signed and payment confirmed', completed: false },
  { day: 0, label: 'Client added to ARIA as Active', completed: false },
  { day: 0, label: 'Welcome email sent to client', completed: false },
  { day: 0, label: 'Kickoff call scheduled', completed: false },

  // Day 1 — Access
  { day: 1, label: 'TikTok Seller Center access received', completed: false },
  { day: 1, label: 'TikTok Ads Manager access received', completed: false },
  { day: 1, label: 'Product catalog reviewed', completed: false },
  { day: 1, label: 'Brand guidelines/assets received', completed: false },
  { day: 1, label: 'Physical product samples requested', completed: false },

  // Day 2-3 — Strategy
  { day: 2, label: 'Full shop audit completed (KaloData)', completed: false },
  { day: 2, label: 'Competitor research done', completed: false },
  { day: 2, label: 'LIVE session schedule agreed with client', completed: false },
  { day: 3, label: 'GMV Max ad campaigns created ($50/day)', completed: false },
  { day: 3, label: 'Creator recruitment brief written', completed: false },
  { day: 3, label: 'LIVE selling scripts drafted', completed: false },

  // Day 4-5 — Launch Prep
  { day: 4, label: 'Creator outreach started (20-30 DMs)', completed: false },
  { day: 4, label: 'Sample shipping coordination started', completed: false },
  { day: 5, label: 'LIVE setup tested (lighting, audio, stream key)', completed: false },
  { day: 5, label: 'Host training session completed', completed: false },
  { day: 5, label: 'Test LIVE done (30 min internal)', completed: false },

  // Day 6-7 — GO LIVE
  { day: 6, label: 'Script finalized based on test LIVE feedback', completed: false },
  { day: 7, label: 'First official LIVE session completed', completed: false },
  { day: 7, label: 'Post-LIVE report sent to client', completed: false },
  { day: 7, label: 'Client debrief call done', completed: false },

  // Week 2
  { day: 14, label: 'First weekly report sent (Monday)', completed: false },
  { day: 14, label: 'First creator content tracked', completed: false },
  { day: 14, label: 'Ad performance reviewed and optimized', completed: false },
]

export function createOnboardingTasks(): OnboardingTask[] {
  return ONBOARDING_TASKS_TEMPLATE.map((task) => ({
    ...task,
    id: generateId(),
  }))
}
```

---

## Step 3: Update `src/stores/clients-store.ts`

Read the file first. Then add `onboardings` to the store state and the following actions:

**Add to state interface:**
```typescript
onboardings: ClientOnboarding[]
```

**Add these actions:**
```typescript
startOnboarding: (clientId: string, assignedHost?: string) => void
updateOnboardingTask: (clientId: string, taskId: string, updates: Partial<OnboardingTask>) => void
getOnboarding: (clientId: string) => ClientOnboarding | undefined
```

**Implement the actions:**
```typescript
startOnboarding: (clientId, assignedHost = '') => {
  const existing = get().onboardings.find(o => o.clientId === clientId)
  if (existing) return // don't overwrite existing onboarding
  const onboarding: ClientOnboarding = {
    clientId,
    startDate: getToday(),
    assignedHost,
    tasks: createOnboardingTasks(),
  }
  set(state => ({ onboardings: [...state.onboardings, onboarding] }))
},

updateOnboardingTask: (clientId, taskId, updates) => {
  set(state => ({
    onboardings: state.onboardings.map(o =>
      o.clientId === clientId
        ? {
            ...o,
            tasks: o.tasks.map(t =>
              t.id === taskId
                ? { ...t, ...updates, completedAt: updates.completed ? getToday() : t.completedAt }
                : t
            ),
          }
        : o
    ),
  }))
},

getOnboarding: (clientId) => {
  return get().onboardings.find(o => o.clientId === clientId)
},
```

**Also add `onboardings: []` to the initial state and include it in the `persist` config.**

Import `createOnboardingTasks` from `../lib/onboarding-template`.

---

## Step 4: Create `src/components/clients/OnboardingChecklist.tsx`

An expandable checklist section embedded within the client's revenue card.

**Props:** `{ clientId: string }`

**Component behavior:**
1. Read `onboarding = useClientsStore(s => s.getOnboarding(clientId))`
2. If no onboarding exists, show a "Start Onboarding" button that calls `startOnboarding(clientId)`
3. If onboarding exists, show:
   - Progress header: "Onboarding — Day X of 7 — 14/25 tasks complete"
   - Progress bar: `completedTasks / totalTasks * 100%` in yellow
   - Tasks grouped by day in collapsible day sections (default: current day expanded)
   - Each task: checkbox + label + optional notes edit
   - Clicking checkbox calls `updateOnboardingTask(clientId, task.id, { completed: !task.completed })`

**Day grouping display:**
- "Day 0 — Contract & Setup (3/4)"
- "Day 1 — Access (0/5)"
- etc.

**Visual status for each day group:**
- All complete: green checkmark header
- Partially complete: yellow progress fraction
- Not started: gray

**Styling:** Use CSS from the design system. Checkboxes styled with yellow accent color.

---

## Step 5: Update `src/components/revenue/ClientRevenueTable.tsx`

Read this file first to understand the current row structure. Then:

1. Add a "Onboarding" expand toggle button to each active client's row (only show if client status is 'active')
2. Use `useState expandedClientId` to track which client's onboarding is expanded
3. When expanded, render `<OnboardingChecklist clientId={client.id} />` below the client row
4. The toggle button shows:
   - If no onboarding started: "Start Onboarding" (plus icon)
   - If onboarding in progress: progress percentage "Onboarding 60%"
   - If fully complete (all tasks done): green "Onboarded ✓"

---

## Done Criteria

- [ ] `OnboardingTask` and `ClientOnboarding` types in `src/types/index.ts`
- [ ] `ONBOARDING_TASKS_TEMPLATE` constant in `src/lib/onboarding-template.ts` with 25+ tasks
- [ ] `clients-store.ts` has `onboardings` array and `startOnboarding`, `updateOnboardingTask`, `getOnboarding` actions
- [ ] `OnboardingChecklist` component renders task list grouped by day
- [ ] Checking off a task updates the store and reflects immediately in UI
- [ ] `ClientRevenueTable` shows onboarding expand toggle per client
- [ ] Expanding shows the checklist inline
- [ ] "Start Onboarding" button creates the onboarding record with all 25+ tasks
- [ ] Progress bar and stats display correctly
- [ ] No TypeScript errors, `npm run build` succeeds

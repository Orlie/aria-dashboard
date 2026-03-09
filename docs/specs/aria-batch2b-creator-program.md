# Agent Task: Batch 2B — Creator Program Module

**BATCH 2 — Run SEQUENTIALLY after 2A completes.**
**Reason: Modifies shared files (types/index.ts, App.tsx, Sidebar.tsx, MobileNav.tsx)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context:** The Creator Free Sample Program is one of three core services sold to clients. For each client, Orlie recruits 20-30 TikTok creators (5K-500K followers, 3%+ engagement, US-based). She ships them free product samples, then tracks whether they post content and generates GMV. SOP requires tracking: outreach sent, approval, sample shipping, content due date, content posted date, and commission-based attribution. Each client can have 50-100+ creators at different pipeline stages.

**The creator pipeline has 11 stages:**
`identified → outreached → replied → vetting → approved → sample_shipped → content_due → content_posted → active_partner → paused → removed`

**Zustand store pattern:** Follow `src/stores/clients-store.ts` exactly as canonical template.

---

## Files to Read First

1. `src/types/index.ts` — add Creator types here (check what's already there first)
2. `src/stores/clients-store.ts` — canonical store pattern
3. `src/App.tsx` — see route definitions (add `/creators` route)
4. `src/components/Layout/Sidebar.tsx` — see NAV_ITEMS (add "Creators" item)
5. `src/components/Layout/MobileNav.tsx` — see mobile nav (add "Creators" item)
6. `src/components/leads/LeadPipeline.tsx` — see Kanban column pattern (replicate for creator pipeline)
7. `src/components/leads/LeadCard.tsx` — see card pattern (replicate for creator cards)
8. `src/components/shared/StatusBadge.tsx` — understand badge pattern (add creator status badges)
9. `src/lib/utils.ts` — see `generateId`, `formatDate`, `getDaysUntil`, `isOverdue`

---

## Step 1: Add Types to `src/types/index.ts`

Add after existing types, with a clear section header:

```typescript
// ============================================================
// CREATOR PROGRAM TYPES
// ============================================================

export type CreatorStatus =
  | 'identified'
  | 'outreached'
  | 'replied'
  | 'vetting'
  | 'approved'
  | 'sample_shipped'
  | 'content_due'
  | 'content_posted'
  | 'active_partner'
  | 'paused'
  | 'removed'

export interface Creator {
  id: string
  clientId: string
  tiktokHandle: string
  fullName: string
  followerCount: number
  engagementRate: number // decimal, e.g. 0.035 = 3.5%
  niche: string // e.g. "beauty", "lifestyle"
  status: CreatorStatus
  shippingAddress: string
  productSent: string
  sampleShippedDate?: string
  contentDueDate?: string
  contentPostedDate?: string
  contentUrl?: string
  commissionRate: number // decimal, e.g. 0.05 = 5%
  totalGmv: number // GMV attributed to this creator
  notes: string
  createdAt: string
  updatedAt: string
}
```

---

## Step 2: Create `src/stores/creators-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Creator, CreatorStatus } from '../types'
import { generateId, getToday } from '../lib/utils'

interface CreatorsState {
  creators: Creator[]
  addCreator: (creator: Omit<Creator, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCreator: (id: string, updates: Partial<Creator>) => void
  updateCreatorStatus: (id: string, status: CreatorStatus) => void
  deleteCreator: (id: string) => void
  getCreatorsByClient: (clientId: string) => Creator[]
  getActiveCreators: (clientId: string) => Creator[]
  getCreatorsByStatus: (clientId: string, status: CreatorStatus) => Creator[]
}

export const useCreatorsStore = create<CreatorsState>()(
  persist(
    (set, get) => ({
      creators: [],

      addCreator: (creatorData) => {
        const creator: Creator = {
          ...creatorData,
          id: generateId(),
          createdAt: getToday(),
          updatedAt: getToday(),
        }
        set((state) => ({ creators: [...state.creators, creator] }))
      },

      updateCreator: (id, updates) => {
        set((state) => ({
          creators: state.creators.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: getToday() } : c
          ),
        }))
      },

      updateCreatorStatus: (id, status) => {
        set((state) => ({
          creators: state.creators.map((c) =>
            c.id === id ? { ...c, status, updatedAt: getToday() } : c
          ),
        }))
      },

      deleteCreator: (id) => {
        set((state) => ({
          creators: state.creators.filter((c) => c.id !== id),
        }))
      },

      getCreatorsByClient: (clientId) => {
        return get().creators.filter((c) => c.clientId === clientId)
      },

      getActiveCreators: (clientId) => {
        return get().creators.filter(
          (c) => c.clientId === clientId && c.status === 'active_partner'
        )
      },

      getCreatorsByStatus: (clientId, status) => {
        return get().creators.filter(
          (c) => c.clientId === clientId && c.status === status
        )
      },
    }),
    { name: 'aria-creators' }
  )
)
```

---

## Step 3: Create `src/components/creators/CreatorCard.tsx`

A card displayed in the Kanban pipeline columns.

**Props:** `{ creator: Creator; onClick: () => void; onStatusChange: (status: CreatorStatus) => void }`

**Card content:**
- TikTok handle (bold, `@handle` format)
- Full name (muted text)
- Follower count: formatted compactly (e.g., "45.2K")
- Engagement rate: "3.5%" format
- If `contentDueDate` exists and is overdue: show red "Content Overdue" badge using `isOverdue(contentDueDate)`
- If `sampleShippedDate` and no `contentPostedDate`: show days until content due

**Card click:** opens edit/detail modal

---

## Step 4: Create `src/components/creators/CreatorForm.tsx`

Full add/edit form in a Modal.

**Props:** `{ isOpen: boolean; onClose: () => void; creator?: Creator; defaultClientId?: string }`

**Fields:**
1. Client (select from active clients, required)
2. TikTok Handle (text, placeholder: "@handle", required)
3. Full Name (text, optional)
4. Follower Count (number, required)
5. Engagement Rate (number, placeholder: "3.5", label: "Engagement Rate (%)")
6. Niche (text, placeholder: "beauty, lifestyle...")
7. Status (select from CreatorStatus values)
8. Product to Send (text, placeholder: "Which product are they promoting?")
9. Sample Shipped Date (date, optional)
10. Content Due Date (date, optional — auto-suggest 7 days after sample shipped)
11. Content Posted Date (date, optional)
12. Content URL (text, optional, placeholder: "https://tiktok.com/...")
13. Commission Rate (number, placeholder: "5", label: "Commission Rate (%)")
14. Notes (textarea, rows: 2)

**On submit:** call `addCreator` or `updateCreator`, show toast, close.

When `sampleShippedDate` changes, auto-calculate `contentDueDate = 7 days later` if `contentDueDate` is empty.

---

## Step 5: Create `src/components/creators/CreatorPipeline.tsx`

Kanban-style pipeline showing creators grouped by status for a specific client.

**Props:** `{ clientId: string }`

**Visible pipeline columns** (not all 11 statuses — only the active workflow ones):
1. Outreached
2. Replied / Vetting
3. Approved
4. Sample Shipped
5. Content Due
6. Content Posted
7. Active Partner

(Paused and Removed creators shown in a collapsed "Archived" section at the bottom)

**Column header:** Status name + count badge (e.g., "Sample Shipped (3)")

**Column content:** Render `<CreatorCard>` for each creator in that status. Include an "Add Creator" button at the bottom of the first column.

---

## Step 6: Create `src/pages/CreatorsPage.tsx`

```
[Page title: "Creator Program"]
[Client selector tabs — one per active client + "Overview" tab]
[Stats bar: Active Partners, Total GMV, Content Due, Overdue]
  — computed from creators for selected client
[CreatorPipeline - for selected client]
[Add Creator button (top right)]
```

For the "Overview" tab (all clients selected):
- Show a table/grid of per-client creator stats: Client Name | Active Creators | Total GMV | Content Pending | Overdue

---

## Step 7: Add Navigation

### `src/App.tsx`
```typescript
import CreatorsPage from './pages/CreatorsPage'
// Inside Routes:
<Route path="/creators" element={<CreatorsPage />} />
```

### `src/components/Layout/Sidebar.tsx`
Add to NAV_ITEMS (read file first to see exact structure):
```typescript
{ path: '/creators', label: 'Creators', icon: Users }
```
Import `Users` from `lucide-react`. Place after LIVE item.

### `src/components/Layout/MobileNav.tsx`
Add same item. Read file first to confirm structure.

---

## Done Criteria

- [ ] `Creator` and `CreatorStatus` types in `src/types/index.ts`
- [ ] `useCreatorsStore` persists to `aria-creators`
- [ ] "Creators" in sidebar and mobile nav
- [ ] `/creators` route renders CreatorsPage
- [ ] Client tabs at top of page
- [ ] Creator pipeline shows Kanban columns with correct stages
- [ ] Add Creator button opens CreatorForm modal
- [ ] Form submits correctly, shows toast, closes
- [ ] Content due dates auto-calculate (7 days after sample shipped)
- [ ] Overdue content due dates show red badge
- [ ] No TypeScript errors, `npm run build` succeeds

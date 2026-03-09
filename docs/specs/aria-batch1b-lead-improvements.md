# Agent Task: Batch 1B — Lead Improvements (Kanban DnD + Quick KaloData Form)

**BATCH 1 — Run simultaneously with Batch 1A and Batch 1C (no file conflicts)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).
CSS variables: `--aria-yellow: #FFEB03`, `--aria-bg: #0a0a0a`, `--aria-card-bg: #141414`, `--aria-surface: #1e1e1e`, `--aria-green`, `--aria-red`, `--aria-white`, `--aria-gray-text: #a8a8a8`.
Button classes: `.btn`, `.btn-primary` (yellow), `.btn-secondary`, `.btn-danger`, `.btn-ghost`.
Form classes: `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`.

**Lead status values** (TypeScript union): `'new' | 'contacted' | 'replied' | 'meeting_set' | 'negotiating' | 'closed' | 'active' | 'churned'`

**Lead status display order for Kanban columns:**
`['new', 'contacted', 'replied', 'meeting_set', 'negotiating', 'closed', 'active', 'churned']`

---

## Files to Read First

Before implementing, read these files to understand existing patterns:

1. `src/components/leads/LeadPipeline.tsx` — current static Kanban (add DnD here)
2. `src/components/leads/LeadCard.tsx` — card component (add draggable here)
3. `src/components/leads/LeadCard.css` — card styles (add drag styles here)
4. `src/stores/leads-store.ts` — find the `updateLeadStatus` action (use this on drop)
5. `src/types/index.ts` — see `Lead` type and `LeadStatus` type
6. `src/pages/LeadsPage.tsx` — where to add the Quick Add button
7. `src/components/leads/LeadForm.tsx` — existing full form (reference for quick form)
8. `src/lib/utils.ts` — see `generateId()` and `getToday()` helpers

---

## Task 1: Drag-and-Drop Kanban Pipeline

Add HTML5 drag-and-drop to the existing Kanban board. No new libraries needed — use native browser DnD API.

### LeadCard.tsx changes
- Add `draggable={true}` to the root card element
- Add `onDragStart` handler: store the lead ID in `e.dataTransfer.setData('leadId', lead.id)`
- Add CSS class `'dragging'` to the card while dragging (via `useState isDragging`)
- On `dragEnd`, clear the dragging state

### LeadPipeline.tsx changes
- Add `dragOverColumn` state: `useState<LeadStatus | null>(null)`
- On each column's drop zone div:
  - `onDragOver`: `e.preventDefault()`, set `dragOverColumn` to this column's status
  - `onDragLeave`: clear `dragOverColumn` if leaving this column
  - `onDrop`:
    1. `e.preventDefault()`
    2. Get `leadId = e.dataTransfer.getData('leadId')`
    3. Get `newStatus` from the column definition
    4. Call `useLeadsStore.getState().updateLeadStatus(leadId, newStatus)`
    5. Clear `dragOverColumn`
- Apply `.pipeline-column--drag-over` class to column when `dragOverColumn === column.status`

### LeadCard.css additions
```css
.lead-card[draggable="true"] {
  cursor: grab;
}
.lead-card[draggable="true"]:active {
  cursor: grabbing;
}
.lead-card.dragging {
  opacity: 0.4;
  transform: rotate(2deg);
}
```

Add to LeadPipeline CSS (inline in component or in a new `.pipeline-column--drag-over` rule):
```css
.pipeline-column--drag-over {
  background: rgba(255, 235, 3, 0.05);
  border: 1px solid rgba(255, 235, 3, 0.3);
}
```

---

## Task 2: Quick Add from KaloData Form

Create a streamlined lead entry form for the morning prospecting block. When Orlie exports from KaloData, she only has 7 fields — no need to fill out 15+ fields every time.

### Create `src/components/leads/QuickAddLeadForm.tsx`

This is a modal form with ONLY the fields available from a KaloData export. Pre-fills defaults for everything else.

**Fields to show:**
1. Brand Name (text, required)
2. TikTok Handle (text, placeholder: "@brandhandle")
3. TikTok Shop URL (text, placeholder: "https://www.tiktok.com/view/shop/...")
4. Estimated Monthly GMV (number, placeholder: "50000", label: "Est. Monthly GMV ($)")
5. Product Category (select: beauty, fashion, food, health, home, electronics, other)
6. Contact Name (text, optional)
7. Notes (textarea, optional, rows: 2, placeholder: "Any quick notes from KaloData...")

**Auto-filled on submit (not shown in form):**
- `status: 'new'`
- `source: 'KaloData'`
- `createdAt: getToday()`
- `score: { revenuePotential: 5, brandFit: 5, easeOfClosing: 5, productMargins: 5, overall: 5 }`
- All other Lead fields: empty strings or 0

**Component signature:**
```typescript
interface QuickAddLeadFormProps {
  isOpen: boolean
  onClose: () => void
}
```

**On submit:**
1. Validate: brandName is required
2. Call `useLeadsStore.getState().addLead({ ...formData, status: 'new', source: 'KaloData', ... })`
3. Call `showSuccess('Lead added from KaloData')` — import from toast store
4. Reset form and close modal

**Styling:** Use existing `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`, `.btn`, `.btn-primary`, `.btn-secondary` classes from the design system. Use `Modal` component from `src/components/shared/Modal.tsx`.

### LeadsPage.tsx changes

1. Read `src/pages/LeadsPage.tsx` first to understand the current toolbar layout
2. Add a "Quick Add" button to the toolbar NEXT TO the existing "Add Lead" button
3. Import `QuickAddLeadForm` and add its state (`isQuickAddOpen`, `setIsQuickAddOpen`)
4. The Quick Add button should have a `Zap` icon from lucide-react and use `.btn-secondary` styling
5. Add the `<QuickAddLeadForm>` component to the JSX with `isOpen` and `onClose` props

---

## Done Criteria

- [ ] Kanban cards are draggable — they visually lift (opacity 0.4, rotate 2deg) when dragged
- [ ] Dropping a card onto a different status column updates that lead's status instantly
- [ ] Drop column highlights (subtle yellow glow) when a card is dragged over it
- [ ] "Quick Add" button appears in the Leads page toolbar next to "Add Lead"
- [ ] Quick Add form opens in a modal with 7 fields
- [ ] Submitting Quick Add creates a lead with status 'new' and source 'KaloData'
- [ ] Form clears and closes after successful submit
- [ ] No TypeScript errors

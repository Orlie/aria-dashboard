# Agent Task: Batch 1C — Outreach Improvements

**BATCH 1 — Run simultaneously with Batch 1A and Batch 1B (no file conflicts)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).
CSS variables: `--aria-yellow: #FFEB03`, `--aria-bg: #0a0a0a`, `--aria-card-bg: #141414`, `--aria-surface: #1e1e1e`, `--aria-green: #22c55e`, `--aria-red: #ef4444`, `--aria-white`, `--aria-gray-text: #a8a8a8`.
Button classes: `.btn`, `.btn-primary` (yellow), `.btn-secondary`, `.btn-ghost`, `.btn-sm`.
Form classes: `.form-group`, `.form-label`, `.form-input`, `.form-select`, `.form-textarea`.

**Daily SOP targets (from business SOPs):**
- 10-20 new prospects added (new leads)
- 15-25 outreach messages sent
- 2-4 follow-up messages sent

**Outreach channels:** `'tiktok_dm' | 'instagram' | 'linkedin' | 'email' | 'phone' | 'other'`

---

## Files to Read First

Before implementing, read these files to understand existing patterns:

1. `src/pages/OutreachPage.tsx` — main outreach page (add daily bar here, add query param handling)
2. `src/components/outreach/MessageDrafter.tsx` — existing message composer (add lead pre-selection)
3. `src/components/leads/LeadBrief.tsx` — lead detail modal (add "Draft Message" button here)
4. `src/components/outreach/OutreachLog.tsx` — outreach history (add response marking)
5. `src/stores/outreach-store.ts` — outreach state (check `OutreachRecord` type and `updateRecord`)
6. `src/stores/leads-store.ts` — see `updateLeadStatus` action
7. `src/lib/utils.ts` — see `getToday()` helper
8. `src/types/index.ts` — see `OutreachRecord` type and `OutreachChannel` type

---

## Task 1: Daily Activity Bar

Add a progress tracker at the top of the Outreach page showing today's activity vs SOP targets.

### Create `src/components/outreach/DailyActivityBar.tsx`

This component reads from `useOutreachStore` and counts records where `sentAt` date matches today.

**Logic:**
```typescript
const today = getToday() // returns 'YYYY-MM-DD'
const todaysRecords = records.filter(r => r.sentAt.startsWith(today))
const messagesSent = todaysRecords.length
const followUps = todaysRecords.filter(r =>
  r.templateUsed === 'follow_up' ||
  r.templateUsed === 'post_call_followup'
).length
```

**UI Layout** — horizontal bar with 3 stat items:
```
[ Messages Sent: 8/15 ]  [ Follow-ups: 2/5 ]  [ Responses: 3 ]
```

Each stat shows:
- Label (e.g., "Messages Sent")
- Value with target: `8 / 15` in format `<span class="count">{value}</span> / <span class="target">{target}</span>`
- A thin progress bar underneath (width: `min(100%, value/target * 100)%`)
- Color: green if at/above target, yellow if 50-99%, gray if below 50%

Targets: messages = 15, follow-ups = 5, responses = no target (just show count)

**Styling:**
```css
/* Inline styles or add to OutreachPage.css */
.daily-activity-bar {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--aria-card-bg);
  border-radius: var(--radius-md);
  border: 1px solid #222;
  margin-bottom: 24px;
}
.daily-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.daily-stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--aria-gray-text);
}
.daily-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--aria-white);
}
.daily-stat-progress {
  height: 3px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
}
.daily-stat-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}
```

### OutreachPage.tsx changes

1. Import and render `<DailyActivityBar />` at the very top of the page content (before the tabs)
2. Add logic to read `?leadId` query parameter from the URL using `useSearchParams` from react-router-dom
3. Pass the leadId to the appropriate tab — when `leadId` param is present, auto-switch to the "Templates" tab and pass leadId to MessageDrafter

---

## Task 2: Lead → Outreach Shortcut

Add a "Draft Message" button inside the LeadBrief modal that navigates to the outreach page with the lead pre-selected.

### LeadBrief.tsx changes

1. Import `useNavigate` from react-router-dom
2. Add a "Draft Message" button to the LeadBrief modal — place it in the modal footer/action area alongside the delete button
3. Button style: `.btn .btn-secondary` with a `Send` or `MessageSquare` icon from lucide-react
4. On click: `navigate('/outreach?leadId=' + lead.id)` and then close the modal (`onClose()`)

### MessageDrafter.tsx changes

1. Add an optional `initialLeadId?: string` prop to the component
2. When `initialLeadId` is provided, auto-select that lead in the lead picker dropdown on mount (use `useEffect` to set the selected lead state)
3. Read the lead data from `useLeadsStore` using the provided ID

### OutreachPage.tsx changes (continued from Task 1)

Pass the leadId from the URL search params to `<MessageDrafter initialLeadId={leadIdFromUrl} />`.

---

## Task 3: Outreach Response Tracking

Allow marking an outreach record as "got response" and adding notes directly from the Outreach Log.

### outreach-store.ts changes

Check if `updateRecord` already accepts partial updates. If so, no change needed to the store. Just ensure you can call:
```typescript
updateRecord(id, { gotResponse: true, responseNotes: 'They asked for pricing' })
```

If `OutreachRecord` type doesn't have `responseNotes: string`, add it to the type (check `src/types/index.ts` first — the field may already exist).

### OutreachLog.tsx changes

1. For each record row in the log, add a "Mark Response" button (only show if `!record.gotResponse`)
2. When clicked, show a small inline form (not a full modal — just expand the row) with:
   - A textarea for response notes (placeholder: "What did they say?")
   - "Save Response" button (`.btn-primary .btn-sm`)
   - "Cancel" button (`.btn-ghost .btn-sm`)
3. On save: call `updateRecord(record.id, { gotResponse: true, responseNotes: notes })`
4. If `record.gotResponse` is already true, show a green "Responded" badge instead of the button
5. Show `record.responseNotes` as small italic text under the responded badge if notes exist

**Row expansion pattern:**
```typescript
const [expandedId, setExpandedId] = useState<string | null>(null)
const [responseNotes, setResponseNotes] = useState('')
```

---

## Done Criteria

- [ ] Daily Activity Bar shows at top of Outreach page with today's message count, follow-up count, and response count
- [ ] Progress bars fill and turn green when at/above daily SOP targets (15 messages, 5 follow-ups)
- [ ] "Draft Message" button appears in LeadBrief modal
- [ ] Clicking "Draft Message" navigates to `/outreach?leadId=xxx` and auto-selects that lead in the template drafter
- [ ] Outreach Log rows have "Mark Response" button for records without a response
- [ ] Clicking "Mark Response" expands the row with a notes textarea
- [ ] Saving marks `gotResponse: true` and shows a green "Responded" badge
- [ ] No TypeScript errors

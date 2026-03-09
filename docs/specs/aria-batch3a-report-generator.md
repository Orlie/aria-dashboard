# Agent Task: Batch 3A — Weekly Report Generator

**BATCH 3 — Run SEQUENTIALLY after all Batch 2 plans complete.**
**Can run simultaneously with Batch 3B (KaloData CSV Import) — no shared file conflicts.**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand, Recharts, Lucide React icons, custom CSS (no Tailwind).

**Business context:** Every Monday, Orlie sends each active client a performance report. The report template (in `docs/weekly-report-template.md`) has 7 sections: performance summary, LIVE selling stats, creator program update, ads performance, key wins, next week plan, items needed from client. At 5 clients, this is 2-3 hours of manual work. This feature assembles all data from ARIA into the report format automatically. Orlie then copies to email — no auto-send needed.

**Prerequisite:** This plan requires that Batch 2A (LIVE Sessions), 2B (Creators), and 2C (Ads) are all complete, since the report reads from those stores.

---

## Files to Read First

1. `docs/weekly-report-template.md` — the EXACT format the report must follow (READ THIS CAREFULLY)
2. `src/types/index.ts` — see Client, LiveSession, Creator, AdCampaign, AdDailyLog types
3. `src/stores/clients-store.ts` — see getActiveClients, getRevenueSnapshot
4. `src/stores/live-sessions-store.ts` — see getSessionsForWeek, getSessionsByClient
5. `src/stores/creators-store.ts` — see getCreatorsByClient
6. `src/stores/ads-store.ts` — see getLogsForWeek, getCampaignsByClient
7. `src/App.tsx` — add `/reports` route
8. `src/components/Layout/Sidebar.tsx` — add "Reports" nav item
9. `src/components/Layout/MobileNav.tsx` — add "Reports" nav item
10. `src/lib/utils.ts` — see formatCurrency, formatDate, formatPercent

---

## Step 1: Add Types to `src/types/index.ts`

```typescript
// ============================================================
// WEEKLY REPORT TYPES
// ============================================================

export interface WeeklyReportSection {
  title: string
  content: string // markdown-formatted content
}

export interface WeeklyReport {
  id: string
  clientId: string
  clientName: string
  weekStart: string // YYYY-MM-DD (Monday)
  weekEnd: string   // YYYY-MM-DD (Sunday)
  generatedAt: string
  sections: WeeklyReportSection[]
  manualWins: string    // editable before sending
  manualNextWeek: string // editable before sending
  manualNeeded: string   // editable before sending
}
```

---

## Step 2: Create `src/lib/report-generator.ts`

This is a pure function — no React, no side effects. It takes data and returns a report.

```typescript
import { Client, LiveSession, Creator, AdCampaign, AdDailyLog, WeeklyReport } from '../types'
import { formatCurrency, formatPercent, formatDate, generateId, getToday } from './utils'

export interface ReportInput {
  client: Client
  weekStart: string // YYYY-MM-DD
  weekEnd: string   // YYYY-MM-DD
  liveSessions: LiveSession[]
  creators: Creator[]
  adCampaigns: AdCampaign[]
  adLogs: AdDailyLog[]
  previousWeekGmv?: number // for week-over-week comparison
}

export function generateWeeklyReport(input: ReportInput): WeeklyReport {
  const { client, weekStart, weekEnd, liveSessions, creators, adCampaigns, adLogs } = input

  // --- Computed metrics ---

  // LIVE sessions
  const totalGmv = liveSessions.reduce((sum, s) => sum + s.gmv, 0)
  const totalOrders = liveSessions.reduce((sum, s) => sum + s.totalOrders, 0)
  const avgViewers = liveSessions.length > 0
    ? Math.round(liveSessions.reduce((sum, s) => sum + s.averageViewers, 0) / liveSessions.length)
    : 0
  const bestSession = liveSessions.reduce(
    (best, s) => (s.gmv > (best?.gmv ?? 0) ? s : best),
    null as LiveSession | null
  )
  const gmvChange = input.previousWeekGmv
    ? ((totalGmv - input.previousWeekGmv) / input.previousWeekGmv) * 100
    : null

  // Creators
  const activeCreators = creators.filter(c => c.status === 'active_partner')
  const samplesSent = creators.filter(c =>
    ['sample_shipped', 'content_due', 'content_posted', 'active_partner'].includes(c.status)
  ).length
  const contentPosted = creators.filter(c =>
    ['content_posted', 'active_partner'].includes(c.status)
  ).length
  const contentDue = creators.filter(c => c.status === 'content_due').length
  const creatorGmv = creators.reduce((sum, c) => sum + c.totalGmv, 0)

  // Ads
  const totalAdSpend = adLogs.reduce((sum, l) => sum + l.spend, 0)
  const totalAdGmv = adLogs.reduce((sum, l) => sum + l.gmv, 0)
  const overallRoas = totalAdSpend > 0 ? totalAdGmv / totalAdSpend : 0
  const totalAdOrders = adLogs.reduce((sum, l) => sum + l.orders, 0)

  // --- Build report sections ---
  const sections = [
    {
      title: '📊 Performance Summary',
      content: buildPerformanceSummary({
        totalGmv, totalOrders, avgViewers, gmvChange,
        weekStart, weekEnd, client
      }),
    },
    {
      title: '🎬 LIVE Selling Performance',
      content: buildLiveSummary({ liveSessions, totalGmv, totalOrders, avgViewers, bestSession }),
    },
    {
      title: '🤝 Creator Program Update',
      content: buildCreatorSummary({ activeCreators, samplesSent, contentPosted, contentDue, creatorGmv }),
    },
    {
      title: '📣 Ads Performance',
      content: buildAdsSummary({ adCampaigns, adLogs, totalAdSpend, totalAdGmv, overallRoas, totalAdOrders }),
    },
  ]

  return {
    id: generateId(),
    clientId: client.id,
    clientName: client.brandName,
    weekStart,
    weekEnd,
    generatedAt: getToday(),
    sections,
    manualWins: '',
    manualNextWeek: '',
    manualNeeded: '',
  }
}

// Helper builders — each returns a markdown string
function buildPerformanceSummary(data: {
  totalGmv: number; totalOrders: number; avgViewers: number
  gmvChange: number | null; weekStart: string; weekEnd: string; client: Client
}): string {
  const changeText = data.gmvChange !== null
    ? ` (${data.gmvChange >= 0 ? '+' : ''}${data.gmvChange.toFixed(1)}% WoW)`
    : ''
  return [
    `**Week:** ${formatDate(data.weekStart)} – ${formatDate(data.weekEnd)}`,
    `**Total GMV:** ${formatCurrency(data.totalGmv)}${changeText}`,
    `**Total Orders:** ${data.totalOrders}`,
    `**Avg Session Viewers:** ${data.avgViewers.toLocaleString()}`,
  ].join('\n')
}

function buildLiveSummary(data: {
  liveSessions: LiveSession[]; totalGmv: number
  totalOrders: number; avgViewers: number; bestSession: LiveSession | null
}): string {
  if (data.liveSessions.length === 0) {
    return '_No LIVE sessions this week._'
  }
  const rows = data.liveSessions.map(s =>
    `| ${formatDate(s.date)} | ${s.durationMinutes}min | ${s.peakViewers} | ${s.totalOrders} | ${formatCurrency(s.gmv)} | ${s.topProduct} |`
  )
  return [
    `**Sessions this week:** ${data.liveSessions.length}`,
    `**Total GMV:** ${formatCurrency(data.totalGmv)} | **Total Orders:** ${data.totalOrders} | **Avg Viewers:** ${data.avgViewers}`,
    '',
    '| Date | Duration | Peak Viewers | Orders | GMV | Top Product |',
    '|------|----------|--------------|--------|-----|-------------|',
    ...rows,
    '',
    data.bestSession
      ? `🏆 **Best Session:** ${formatDate(data.bestSession.date)} — ${formatCurrency(data.bestSession.gmv)}`
      : '',
  ].join('\n')
}

function buildCreatorSummary(data: {
  activeCreators: Creator[]; samplesSent: number
  contentPosted: number; contentDue: number; creatorGmv: number
}): string {
  return [
    `**Active Creator Partners:** ${data.activeCreators.length}`,
    `**Samples Sent (total):** ${data.samplesSent}`,
    `**Content Posted This Week:** ${data.contentPosted}`,
    `**Content Still Due:** ${data.contentDue}`,
    `**Creator-Driven GMV:** ${formatCurrency(data.creatorGmv)}`,
  ].join('\n')
}

function buildAdsSummary(data: {
  adCampaigns: AdCampaign[]; adLogs: AdDailyLog[]
  totalAdSpend: number; totalAdGmv: number; overallRoas: number; totalAdOrders: number
}): string {
  if (data.adCampaigns.length === 0) return '_No active ad campaigns._'
  return [
    `**Active Campaigns:** ${data.adCampaigns.filter(c => c.status === 'active').length}`,
    `**Total Ad Spend:** ${formatCurrency(data.totalAdSpend)}`,
    `**GMV from Ads:** ${formatCurrency(data.totalAdGmv)}`,
    `**Overall ROAS:** ${data.overallRoas.toFixed(2)}x`,
    `**Orders from Ads:** ${data.totalAdOrders}`,
  ].join('\n')
}

export function reportToMarkdown(report: WeeklyReport): string {
  const lines: string[] = [
    `# Weekly Report — ${report.clientName}`,
    `**Week of ${formatDate(report.weekStart)} – ${formatDate(report.weekEnd)}**`,
    '',
  ]

  for (const section of report.sections) {
    lines.push(`## ${section.title}`, '', section.content, '')
  }

  if (report.manualWins) {
    lines.push('## 🏆 Key Wins This Week', '', report.manualWins, '')
  }
  if (report.manualNextWeek) {
    lines.push('## 📅 Next Week Plan', '', report.manualNextWeek, '')
  }
  if (report.manualNeeded) {
    lines.push('## 🙏 Items Needed from You', '', report.manualNeeded, '')
  }

  lines.push('---', `_Generated by ARIA Dashboard on ${formatDate(report.generatedAt)}_`)
  return lines.join('\n')
}
```

---

## Step 3: Create `src/stores/reports-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WeeklyReport } from '../types'
import { generateId, getToday } from '../lib/utils'

interface ReportsState {
  reports: WeeklyReport[]
  saveReport: (report: WeeklyReport) => void
  updateReport: (id: string, updates: Partial<WeeklyReport>) => void
  deleteReport: (id: string) => void
  getReportsByClient: (clientId: string) => WeeklyReport[]
  getReportForWeek: (clientId: string, weekStart: string) => WeeklyReport | undefined
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      reports: [],
      saveReport: (report) => {
        set((state) => ({ reports: [...state.reports, report] }))
      },
      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }))
      },
      deleteReport: (id) => {
        set((state) => ({ reports: state.reports.filter((r) => r.id !== id) }))
      },
      getReportsByClient: (clientId) => {
        return get()
          .reports.filter((r) => r.clientId === clientId)
          .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
      },
      getReportForWeek: (clientId, weekStart) => {
        return get().reports.find(
          (r) => r.clientId === clientId && r.weekStart === weekStart
        )
      },
    }),
    { name: 'aria-reports' }
  )
)
```

---

## Step 4: Create `src/pages/ReportsPage.tsx`

Layout:
```
[Page title: "Weekly Reports"]
[Two-column layout: left = controls, right = report preview]

LEFT COLUMN:
  [Client selector (dropdown of active clients)]
  [Week selector (date picker — auto-snap to Monday of selected week)]
  [Generate Report button (yellow, primary)]
  [Previously Generated Reports list for this client — last 4 weeks, click to load]
  [Manual fields (editable textareas when report generated):]
    - Key Wins This Week
    - Next Week Plan
    - Items Needed from Client

RIGHT COLUMN:
  [Report preview — rendered markdown in a styled container]
  [Action buttons: "Copy to Clipboard", "Download .md"]
  [Save Report button (saves to reports-store)]
```

**Week selector logic:**
- Use a date input
- On change, snap to Monday: `const monday = new Date(date); monday.setDate(date.getDate() - date.getDay() + 1)`
- Show the week range label: "Mar 3 – Mar 9, 2026"

**Generate report logic:**
1. Get `client` from clients-store
2. Get `liveSessions` from live-sessions-store via `getSessionsForWeek(weekStart, weekEnd)`
3. Get `creators` from creators-store via `getCreatorsByClient(clientId)`
4. Get `adLogs` from ads-store via `getLogsForWeek(clientId, weekStart, weekEnd)`
5. Get `adCampaigns` from ads-store via `getCampaignsByClient(clientId)`
6. Call `generateWeeklyReport({ client, weekStart, weekEnd, liveSessions, creators, adCampaigns, adLogs })`
7. Store in component state, render preview

**Markdown preview:**
Render the markdown as formatted HTML using simple string replacements (no markdown library needed):
- `**text**` → `<strong>text</strong>`
- `## heading` → `<h3>`
- `# heading` → `<h2>`
- `| col |` table rows → `<table>`
- `\n` → `<br>` for paragraphs

OR just render in a `<pre>` block with monospace styling — simpler and still copy-pasteable.

**Copy to clipboard:** `navigator.clipboard.writeText(reportToMarkdown(report))`, show success toast.

**Download .md:** Create a Blob and trigger download:
```typescript
const blob = new Blob([reportToMarkdown(report)], { type: 'text/markdown' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `${report.clientName}-report-${report.weekStart}.md`
a.click()
URL.revokeObjectURL(url)
```

---

## Step 5: Add Navigation

### `src/App.tsx`
```typescript
import ReportsPage from './pages/ReportsPage'
<Route path="/reports" element={<ReportsPage />} />
```

### `src/components/Layout/Sidebar.tsx`
Add (read file first):
```typescript
{ path: '/reports', label: 'Reports', icon: FileText }
```
Import `FileText` from `lucide-react`.

### `src/components/Layout/MobileNav.tsx`
Add same item.

---

## Done Criteria

- [ ] `WeeklyReport` type in `src/types/index.ts`
- [ ] `report-generator.ts` produces correctly formatted markdown output
- [ ] `useReportsStore` persists to `aria-reports`
- [ ] "Reports" in sidebar and mobile nav
- [ ] `/reports` route renders ReportsPage
- [ ] Client + week selector visible
- [ ] "Generate Report" assembles data from all stores and shows preview
- [ ] Manual fields (Wins, Next Week, Needed) are editable textareas
- [ ] "Copy to Clipboard" copies full markdown, shows toast
- [ ] "Download .md" triggers file download
- [ ] "Save Report" saves to reports-store, shows in history list
- [ ] No TypeScript errors, `npm run build` succeeds

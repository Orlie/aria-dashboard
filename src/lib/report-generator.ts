import type { Client, LiveSession, Creator, AdCampaign, AdDailyLog, WeeklyReport } from '../types'
import { formatCurrency, formatDate, generateId, getToday } from './utils'

export interface ReportInput {
  client: Client
  weekStart: string
  weekEnd: string
  liveSessions: LiveSession[]
  creators: Creator[]
  adCampaigns: AdCampaign[]
  adLogs: AdDailyLog[]
  previousWeekGmv?: number
}

export function generateWeeklyReport(input: ReportInput): WeeklyReport {
  const { client, weekStart, weekEnd, liveSessions, creators, adCampaigns, adLogs } = input

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

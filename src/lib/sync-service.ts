/**
 * ARIA Google Sheets Sync Service
 *
 * Push = upload current ARIA data → overwrites Google Sheets
 * Pull = download from Google Sheets → overwrites ARIA local stores
 *
 * Schema (row 1 = headers, rows 2+ = data):
 *   Lead Tracker       → leads
 *   Active Clients     → clients
 *   Revenue Dashboard  → monthlyRevenue
 *   Outreach Log       → outreach records
 *   Expenses           → expenses (sub-tab of Revenue)
 */

import { readRange, writeRange } from './google-sheets'
import type { Lead, Client, MonthlyRevenue, Expense, OutreachRecord } from '../types'

// ─── SCHEMAS ────────────────────────────────────────────────────────────────

const LEAD_HEADERS = [
  'id', 'brandName', 'contactName', 'contactRole', 'email', 'phone',
  'tiktokHandle', 'website', 'productCategory', 'productType',
  'estimatedMonthlyGmv', 'commissionRate', 'status', 'notes', 'source',
  'tiktokShopUrl', 'kaloDataGmv', 'lastContactedAt', 'createdAt', 'updatedAt',
  'score_revenuePotential', 'score_brandFit', 'score_easeOfClosing',
  'score_productMargins', 'score_overall',
  'brief_brandOverview', 'brief_fitAnalysis', 'brief_recommendedPitchAngle',
  'brief_followUpSchedule',
]

const CLIENT_HEADERS = [
  'id', 'brandName', 'contactName', 'contractValue', 'gmvTarget',
  'actualGmv', 'commissionRate', 'monthlyRevenue', 'status', 'startDate', 'leadId',
]

const REVENUE_HEADERS = [
  'month', 'mrr', 'target', 'gap', 'percentToGoal', 'clientCount', 'totalGmv',
]

const EXPENSE_HEADERS = [
  'id', 'category', 'description', 'amount', 'date', 'recurring',
]

const OUTREACH_HEADERS = [
  'id', 'leadId', 'brandName', 'templateUsed', 'channel',
  'sentAt', 'gotResponse', 'responseNotes', 'followUpDay', 'message',
]

// ─── HELPERS ────────────────────────────────────────────────────────────────

function s(val: unknown): string {
  if (val === null || val === undefined) return ''
  return String(val)
}

function n(val: string): number {
  const num = parseFloat(val)
  return isNaN(num) ? 0 : num
}

function b(val: string): boolean {
  return val === 'true' || val === 'TRUE' || val === '1'
}

function rowToMap(headers: string[], row: string[]): Record<string, string> {
  const map: Record<string, string> = {}
  headers.forEach((h, i) => { map[h] = row[i] ?? '' })
  return map
}

// ─── PUSH (local → Sheets) ──────────────────────────────────────────────────

function leadsToRows(leads: Lead[]): string[][] {
  return leads.map(l => [
    l.id,
    l.brandName,
    l.contactName,
    l.contactRole,
    l.email,
    l.phone,
    l.tiktokHandle,
    l.website,
    l.productCategory,
    l.productType,
    s(l.estimatedMonthlyGmv),
    s(l.commissionRate),
    l.status,
    l.notes,
    l.source,
    l.tiktokShopUrl ?? '',
    s(l.kaloDataGmv ?? ''),
    l.lastContactedAt ?? '',
    l.createdAt,
    l.updatedAt,
    s(l.score.revenuePotential),
    s(l.score.brandFit),
    s(l.score.easeOfClosing),
    s(l.score.productMargins),
    s(l.score.overall),
    l.brief.brandOverview,
    l.brief.fitAnalysis,
    l.brief.recommendedPitchAngle,
    JSON.stringify(l.brief.followUpSchedule ?? []),
  ])
}

function clientsToRows(clients: Client[]): string[][] {
  return clients.map(c => [
    c.id,
    c.brandName,
    c.contactName,
    s(c.contractValue),
    s(c.gmvTarget),
    s(c.actualGmv),
    s(c.commissionRate),
    s(c.monthlyRevenue),
    c.status,
    c.startDate,
    c.leadId ?? '',
  ])
}

function revenueToRows(revenue: MonthlyRevenue[]): string[][] {
  return revenue.map(r => [
    r.month,
    s(r.mrr),
    s(r.target),
    s(r.gap),
    s(r.percentToGoal),
    s(r.clientCount),
    s(r.totalGmv),
  ])
}

function expensesToRows(expenses: Expense[]): string[][] {
  return expenses.map(e => [
    e.id,
    e.category,
    e.description,
    s(e.amount),
    e.date,
    s(e.recurring),
  ])
}

function outreachToRows(records: OutreachRecord[]): string[][] {
  return records.map(r => [
    r.id,
    r.leadId,
    r.brandName,
    r.templateUsed,
    r.channel,
    r.sentAt,
    s(r.gotResponse),
    r.responseNotes,
    s(r.followUpDay ?? ''),
    r.message,
  ])
}

// ─── PULL (Sheets → local) ──────────────────────────────────────────────────

function rowsToLeads(rows: string[][]): Lead[] {
  if (rows.length < 2) return []
  const [headerRow, ...dataRows] = rows
  return dataRows
    .filter(row => row.length > 0 && row[0])
    .map(row => {
      const r = rowToMap(headerRow, row)
      return {
        id: r.id,
        brandName: r.brandName,
        contactName: r.contactName,
        contactRole: r.contactRole,
        email: r.email,
        phone: r.phone,
        tiktokHandle: r.tiktokHandle,
        website: r.website,
        productCategory: r.productCategory as Lead['productCategory'],
        productType: r.productType,
        estimatedMonthlyGmv: n(r.estimatedMonthlyGmv),
        commissionRate: n(r.commissionRate),
        status: r.status as Lead['status'],
        notes: r.notes,
        source: r.source,
        tiktokShopUrl: r.tiktokShopUrl || undefined,
        kaloDataGmv: r.kaloDataGmv ? n(r.kaloDataGmv) : undefined,
        lastContactedAt: r.lastContactedAt || undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        score: {
          revenuePotential: n(r.score_revenuePotential),
          brandFit: n(r.score_brandFit),
          easeOfClosing: n(r.score_easeOfClosing),
          productMargins: n(r.score_productMargins),
          overall: n(r.score_overall),
        },
        brief: {
          brandOverview: r.brief_brandOverview,
          fitAnalysis: r.brief_fitAnalysis,
          recommendedPitchAngle: r.brief_recommendedPitchAngle,
          followUpSchedule: (() => {
            try { return JSON.parse(r.brief_followUpSchedule || '[]') }
            catch { return [] }
          })(),
        },
      } satisfies Lead
    })
}

function rowsToClients(rows: string[][]): Client[] {
  if (rows.length < 2) return []
  const [headerRow, ...dataRows] = rows
  return dataRows
    .filter(row => row.length > 0 && row[0])
    .map(row => {
      const r = rowToMap(headerRow, row)
      return {
        id: r.id,
        brandName: r.brandName,
        contactName: r.contactName,
        contractValue: n(r.contractValue),
        gmvTarget: n(r.gmvTarget),
        actualGmv: n(r.actualGmv),
        commissionRate: n(r.commissionRate),
        monthlyRevenue: n(r.monthlyRevenue),
        status: r.status as Client['status'],
        startDate: r.startDate,
        leadId: r.leadId || undefined,
      } satisfies Client
    })
}

function rowsToRevenue(rows: string[][]): MonthlyRevenue[] {
  if (rows.length < 2) return []
  const [headerRow, ...dataRows] = rows
  return dataRows
    .filter(row => row.length > 0 && row[0])
    .map(row => {
      const r = rowToMap(headerRow, row)
      return {
        month: r.month,
        mrr: n(r.mrr),
        target: n(r.target),
        gap: n(r.gap),
        percentToGoal: n(r.percentToGoal),
        clientCount: n(r.clientCount),
        totalGmv: n(r.totalGmv),
      } satisfies MonthlyRevenue
    })
}

function rowsToExpenses(rows: string[][]): Expense[] {
  if (rows.length < 2) return []
  const [headerRow, ...dataRows] = rows
  return dataRows
    .filter(row => row.length > 0 && row[0])
    .map(row => {
      const r = rowToMap(headerRow, row)
      return {
        id: r.id,
        category: r.category,
        description: r.description,
        amount: n(r.amount),
        date: r.date,
        recurring: b(r.recurring),
      } satisfies Expense
    })
}

function rowsToOutreach(rows: string[][]): OutreachRecord[] {
  if (rows.length < 2) return []
  const [headerRow, ...dataRows] = rows
  return dataRows
    .filter(row => row.length > 0 && row[0])
    .map(row => {
      const r = rowToMap(headerRow, row)
      return {
        id: r.id,
        leadId: r.leadId,
        brandName: r.brandName,
        templateUsed: r.templateUsed as OutreachRecord['templateUsed'],
        channel: r.channel as OutreachRecord['channel'],
        sentAt: r.sentAt,
        gotResponse: b(r.gotResponse),
        responseNotes: r.responseNotes,
        followUpDay: r.followUpDay ? n(r.followUpDay) : undefined,
        message: r.message,
      } satisfies OutreachRecord
    })
}

// ─── PUBLIC API ─────────────────────────────────────────────────────────────

export interface SyncPayload {
  leads: Lead[]
  clients: Client[]
  monthlyRevenue: MonthlyRevenue[]
  expenses: Expense[]
  outreachRecords: OutreachRecord[]
}

export interface SyncConfig {
  spreadsheetId: string
  tabs: {
    leadTracker: string
    activeClients: string
    revenueDashboard: string
    outreachLog: string
  }
}

/**
 * Push all ARIA data to Google Sheets.
 * Each tab is fully overwritten (headers + all rows).
 */
export async function pushToSheets(config: SyncConfig, payload: SyncPayload): Promise<void> {
  const { spreadsheetId, tabs } = config

  await Promise.all([
    writeRange(
      spreadsheetId,
      `${tabs.leadTracker}!A1`,
      [LEAD_HEADERS, ...leadsToRows(payload.leads)]
    ),
    writeRange(
      spreadsheetId,
      `${tabs.activeClients}!A1`,
      [CLIENT_HEADERS, ...clientsToRows(payload.clients)]
    ),
    writeRange(
      spreadsheetId,
      `${tabs.revenueDashboard}!A1`,
      [REVENUE_HEADERS, ...revenueToRows(payload.monthlyRevenue)]
    ),
    writeRange(
      spreadsheetId,
      `${tabs.revenueDashboard}!I1`,
      [EXPENSE_HEADERS, ...expensesToRows(payload.expenses)]
    ),
    writeRange(
      spreadsheetId,
      `${tabs.outreachLog}!A1`,
      [OUTREACH_HEADERS, ...outreachToRows(payload.outreachRecords)]
    ),
  ])
}

/**
 * Pull all data from Google Sheets into ARIA.
 * Returns the parsed data — caller is responsible for updating stores.
 */
export async function pullFromSheets(config: SyncConfig): Promise<SyncPayload> {
  const { spreadsheetId, tabs } = config

  const [leadRows, clientRows, revenueRows, expenseRows, outreachRows] = await Promise.all([
    readRange(spreadsheetId, `${tabs.leadTracker}!A:AC`),
    readRange(spreadsheetId, `${tabs.activeClients}!A:K`),
    readRange(spreadsheetId, `${tabs.revenueDashboard}!A:G`),
    readRange(spreadsheetId, `${tabs.revenueDashboard}!I:N`),
    readRange(spreadsheetId, `${tabs.outreachLog}!A:J`),
  ])

  return {
    leads: rowsToLeads(leadRows),
    clients: rowsToClients(clientRows),
    monthlyRevenue: rowsToRevenue(revenueRows),
    expenses: rowsToExpenses(expenseRows),
    outreachRecords: rowsToOutreach(outreachRows),
  }
}

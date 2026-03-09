// ============================================================
// LEAD INTELLIGENCE TYPES
// ============================================================

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'replied'
  | 'meeting_set'
  | 'negotiating'
  | 'closed'
  | 'active'
  | 'churned'

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  replied: 'Replied',
  meeting_set: 'Meeting Set',
  negotiating: 'Negotiating',
  closed: 'Closed',
  active: 'Active',
  churned: 'Churned',
}

export const LEAD_STATUS_BADGE: Record<LeadStatus, string> = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  replied: 'badge-replied',
  meeting_set: 'badge-meeting',
  negotiating: 'badge-negotiating',
  closed: 'badge-closed',
  active: 'badge-active',
  churned: 'badge-churned',
}

export type ProductCategory =
  | 'beauty'
  | 'fashion'
  | 'food'
  | 'health'
  | 'home'
  | 'electronics'
  | 'other'

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  beauty: 'Beauty & Skincare',
  fashion: 'Fashion & Apparel',
  food: 'Food & Beverage',
  health: 'Health Supplements',
  home: 'Home & Living',
  electronics: 'Electronics Accessories',
  other: 'Other',
}

export interface LeadScore {
  revenuePotential: number
  brandFit: number
  easeOfClosing: number
  productMargins: number
  overall: number
}

export interface FollowUpItem {
  day: number
  action: string
  status: 'pending' | 'done' | 'skipped'
  scheduledDate: string
  completedDate?: string
}

export interface LeadBrief {
  brandOverview: string
  fitAnalysis: string
  recommendedPitchAngle: string
  followUpSchedule: FollowUpItem[]
}

export interface Lead {
  id: string
  brandName: string
  contactName: string
  contactRole: string
  email: string
  phone: string
  tiktokHandle: string
  website: string
  productCategory: ProductCategory
  productType: string
  estimatedMonthlyGmv: number
  commissionRate: number
  status: LeadStatus
  score: LeadScore
  brief: LeadBrief
  notes: string
  source: string
  purchasedProduct?: string
  purchaseAmount?: number
  tiktokShopUrl?: string
  kaloDataGmv?: number
  createdAt: string
  updatedAt: string
  lastContactedAt?: string
}

// ============================================================
// REVENUE DASHBOARD TYPES
// ============================================================

export type ClientStatus = 'active' | 'paused' | 'churned'

export interface Client {
  id: string
  brandName: string
  contactName: string
  contractValue: number
  gmvTarget: number
  actualGmv: number
  commissionRate: number
  monthlyRevenue: number
  status: ClientStatus
  startDate: string
  leadId?: string
}

export interface MonthlyRevenue {
  month: string
  mrr: number
  target: number
  gap: number
  percentToGoal: number
  clientCount: number
  totalGmv: number
}

export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
  recurring: boolean
}

export interface RevenueSnapshot {
  currentMrr: number
  target: number
  gap: number
  percentToGoal: number
  totalExpenses: number
  netProfit: number
  clientCount: number
  averageRevenuePerClient: number
}

// ============================================================
// OUTREACH SYSTEM TYPES
// ============================================================

export type MessageTemplateId =
  | 'cold_dm'
  | 'video_demo_dm'
  | 'cold_email'
  | 'linkedin_outreach'
  | 'follow_up'
  | 'post_call_followup'
  | 'breakup_email'
  | 'pitch_deck_intro'
  | 'closing_proposal'
  | 'onboarding_welcome'
  | 'creator_recruit'

export type OutreachChannel = 'tiktok_dm' | 'instagram' | 'linkedin' | 'email' | 'phone' | 'other'

export const OUTREACH_CHANNEL_LABELS: Record<OutreachChannel, string> = {
  tiktok_dm: 'TikTok DM',
  instagram: 'Instagram DM',
  linkedin: 'LinkedIn',
  email: 'Email',
  phone: 'Phone',
  other: 'Other',
}

export interface OutreachRecord {
  id: string
  leadId: string
  brandName: string
  templateUsed: MessageTemplateId
  channel: OutreachChannel
  message: string
  sentAt: string
  gotResponse: boolean
  responseNotes: string
  followUpDay?: number
}

export interface OutreachTemplate {
  id: MessageTemplateId
  name: string
  subject?: string
  body: string
  variables: string[]
}

// ============================================================
// GOOGLE SHEETS INTEGRATION TYPES
// ============================================================

export type SyncDirection = 'pull' | 'push' | 'both'

export interface SheetsConfig {
  spreadsheetId: string
  tabs: {
    leadTracker: string
    activeClients: string
    revenueDashboard: string
    outreachLog: string
  }
}

export interface SyncState {
  isConnected: boolean
  lastSyncAt: string | null
  syncInProgress: boolean
  error: string | null
}

// ============================================================
// APP-LEVEL TYPES
// ============================================================

export type ModuleId = 'leads' | 'revenue' | 'outreach' | 'settings'

// ============================================================
// PERSONAL FINANCE TYPES
// ============================================================

export interface PersonalExpense {
  status: 'PAID' | 'UNPAID' | 'PENDING'
  date: string
  amount: number
  description: string
  category: string
  wallet: string
}

export interface PersonalIncome {
  date: string
  amount: number
  description: string
  category: string
}

export interface MonthlyFinance {
  month: string
  totalIncome: number
  totalExpenses: number
  endingBalance: number
  expenses: PersonalExpense[]
  income: PersonalIncome[]
}

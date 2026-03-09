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

// ============================================================
// APP-LEVEL TYPES
// ============================================================

export type ModuleId = 'leads' | 'revenue' | 'outreach' | 'ads' | 'analytics' | 'reports' | 'settings'

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

export const CREATOR_STATUS_LABELS: Record<CreatorStatus, string> = {
  identified: 'Identified',
  outreached: 'Outreached',
  replied: 'Replied',
  vetting: 'Vetting',
  approved: 'Approved',
  sample_shipped: 'Sample Shipped',
  content_due: 'Content Due',
  content_posted: 'Content Posted',
  active_partner: 'Active Partner',
  paused: 'Paused',
  removed: 'Removed',
}

export interface Creator {
  id: string
  clientId: string
  tiktokHandle: string
  fullName: string
  followerCount: number
  engagementRate: number
  niche: string
  status: CreatorStatus
  shippingAddress: string
  productSent: string
  sampleShippedDate?: string
  contentDueDate?: string
  contentPostedDate?: string
  contentUrl?: string
  commissionRate: number
  totalGmv: number
  notes: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// WEEKLY REPORT TYPES
// ============================================================

export interface WeeklyReportSection {
  title: string
  content: string
}

export interface WeeklyReport {
  id: string
  clientId: string
  clientName: string
  weekStart: string
  weekEnd: string
  generatedAt: string
  sections: WeeklyReportSection[]
  manualWins: string
  manualNextWeek: string
  manualNeeded: string
}

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

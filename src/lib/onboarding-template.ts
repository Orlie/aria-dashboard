import type { OnboardingTask } from '../types'
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

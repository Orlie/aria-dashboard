import type { LeadScore } from '../types'

const WEIGHTS = {
  revenuePotential: 0.35,
  brandFit: 0.25,
  easeOfClosing: 0.20,
  productMargins: 0.20,
}

export function calculateOverallScore(
  score: Omit<LeadScore, 'overall'>
): number {
  const weighted =
    score.revenuePotential * WEIGHTS.revenuePotential +
    score.brandFit * WEIGHTS.brandFit +
    score.easeOfClosing * WEIGHTS.easeOfClosing +
    score.productMargins * WEIGHTS.productMargins
  return Math.round(weighted * 10) / 10
}

export function getScoreClass(score: number): string {
  if (score >= 7) return 'score-high'
  if (score >= 4) return 'score-medium'
  return 'score-low'
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return 'Excellent'
  if (score >= 6) return 'Good'
  if (score >= 4) return 'Average'
  return 'Low'
}

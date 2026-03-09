import type { LeadScore } from '../../types'
import { calculateOverallScore } from '../../lib/scoring'
import { getScoreClass } from '../../lib/scoring'

interface LeadScoreFormProps {
  score: LeadScore
  onChange: (score: Omit<LeadScore, 'overall'>) => void
}

const SCORE_FIELDS: {
  key: keyof Omit<LeadScore, 'overall'>
  label: string
  weight: string
}[] = [
  { key: 'revenuePotential', label: 'Revenue Potential', weight: '35%' },
  { key: 'brandFit', label: 'Brand Fit', weight: '25%' },
  { key: 'easeOfClosing', label: 'Ease of Closing', weight: '20%' },
  { key: 'productMargins', label: 'Product Margins', weight: '20%' },
]

function LeadScoreForm({ score, onChange }: LeadScoreFormProps) {
  const handleChange = (key: keyof Omit<LeadScore, 'overall'>, value: number) => {
    const updated = {
      revenuePotential: score.revenuePotential,
      brandFit: score.brandFit,
      easeOfClosing: score.easeOfClosing,
      productMargins: score.productMargins,
      [key]: value,
    }
    onChange(updated)
  }

  const overall = calculateOverallScore(score)

  return (
    <div>
      {SCORE_FIELDS.map(({ key, label, weight }) => (
        <div className="slider-group" key={key}>
          <div className="slider-header">
            <span className="slider-label">
              {label} <span className="text-muted text-sm">({weight})</span>
            </span>
            <span className="slider-value">{score[key]}</span>
          </div>
          <input
            className="slider-input"
            type="range"
            min={1}
            max={10}
            value={score[key]}
            onChange={(e) => handleChange(key, Number(e.target.value))}
          />
        </div>
      ))}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          padding: '12px 0',
          borderTop: '1px solid var(--aria-gray-border)',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600 }}>Overall Score</span>
        <span
          className={getScoreClass(overall)}
          style={{ fontSize: 20, fontWeight: 700 }}
        >
          {overall.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

export default LeadScoreForm

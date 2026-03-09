import { useCountUp } from '../../lib/useCountUp'

interface KpiCardProps {
  label: string
  value: string
  subtext?: string
  variant?: 'default' | 'positive' | 'negative' | 'highlight'
}

function parseNumericValue(value: string): { numeric: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([₱]?)([0-9,]+(?:\.[0-9]+)?)(%?)$/)
  if (!match) return null
  const num = parseFloat(match[2].replace(/,/g, ''))
  if (isNaN(num)) return null
  return { numeric: num, prefix: match[1], suffix: match[3] }
}

function formatAnimatedValue(num: number, prefix: string, suffix: string, originalValue: string): string {
  const hasDecimals = originalValue.includes('.')
  const decimalPlaces = hasDecimals ? (originalValue.split('.')[1]?.replace(/%$/, '').length || 0) : 0
  const hasCommas = originalValue.includes(',')

  let formatted: string
  if (decimalPlaces > 0) {
    formatted = num.toFixed(decimalPlaces)
  } else {
    formatted = Math.round(num).toString()
  }

  if (hasCommas) {
    const parts = formatted.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formatted = parts.join('.')
  }

  return `${prefix}${formatted}${suffix}`
}

function KpiCard({ label, value, subtext, variant = 'default' }: KpiCardProps) {
  const valueClass = variant !== 'default' ? variant : ''
  const parsed = parseNumericValue(value)
  const animatedNum = useCountUp(parsed ? parsed.numeric : 0)

  const displayValue = parsed
    ? formatAnimatedValue(animatedNum, parsed.prefix, parsed.suffix, value)
    : value

  return (
    <div className="kpi-card">
      <div className="kpi-card-label">{label}</div>
      <div className={`kpi-card-value ${valueClass}`}>{displayValue}</div>
      {subtext && <div className="kpi-card-subtext">{subtext}</div>}
    </div>
  )
}

export default KpiCard

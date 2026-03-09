import { getScoreClass } from '../../lib/scoring'

interface ScoreIndicatorProps {
  score: number
}

function ScoreIndicator({ score }: ScoreIndicatorProps) {
  return (
    <span className={`score-indicator ${getScoreClass(score)}`}>
      {score.toFixed(1)}
    </span>
  )
}

export default ScoreIndicator

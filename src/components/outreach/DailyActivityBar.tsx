import { useOutreachStore } from '../../stores/outreach-store'
import { getToday } from '../../lib/utils'

const TARGETS = {
  messages: 15,
  followUps: 5,
}

function getProgressColor(value: number, target: number): string {
  const pct = target > 0 ? value / target : 0
  if (pct >= 1) return 'var(--aria-green)'
  if (pct >= 0.5) return 'var(--aria-yellow)'
  return '#555'
}

const styles = {
  bar: {
    display: 'flex',
    gap: 16,
    padding: 16,
    background: 'var(--aria-card-bg, #141414)',
    borderRadius: 8,
    border: '1px solid #222',
    marginBottom: 24,
  } as React.CSSProperties,

  stat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  } as React.CSSProperties,

  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#a8a8a8',
  } as React.CSSProperties,

  value: {
    fontSize: 20,
    fontWeight: 700,
    color: 'white',
  } as React.CSSProperties,

  target: {
    color: '#a8a8a8',
    fontSize: 14,
    fontWeight: 400,
  } as React.CSSProperties,

  progressTrack: {
    height: 3,
    background: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  } as React.CSSProperties,
}

export default function DailyActivityBar() {
  const { records } = useOutreachStore()
  const today = getToday()
  const todaysRecords = records.filter((r) => r.sentAt.startsWith(today))

  const messagesSent = todaysRecords.length
  const followUps = todaysRecords.filter(
    (r) =>
      r.templateUsed === 'follow_up' ||
      r.templateUsed === 'post_call_followup'
  ).length
  const responses = todaysRecords.filter((r) => r.gotResponse).length

  return (
    <div style={styles.bar}>
      {/* Messages Sent */}
      <div style={styles.stat}>
        <span style={styles.label}>Messages Sent</span>
        <span style={styles.value}>
          <span className="daily-stat-count">{messagesSent}</span>
          {' / '}
          <span className="daily-stat-target" style={styles.target}>
            {TARGETS.messages}
          </span>
        </span>
        <div style={styles.progressTrack}>
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              transition: 'width 0.3s ease',
              width: `${Math.min(100, (messagesSent / TARGETS.messages) * 100)}%`,
              background: getProgressColor(messagesSent, TARGETS.messages),
            }}
          />
        </div>
      </div>

      {/* Follow-ups */}
      <div style={styles.stat}>
        <span style={styles.label}>Follow-ups</span>
        <span style={styles.value}>
          <span className="daily-stat-count">{followUps}</span>
          {' / '}
          <span className="daily-stat-target" style={styles.target}>
            {TARGETS.followUps}
          </span>
        </span>
        <div style={styles.progressTrack}>
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              transition: 'width 0.3s ease',
              width: `${Math.min(100, (followUps / TARGETS.followUps) * 100)}%`,
              background: getProgressColor(followUps, TARGETS.followUps),
            }}
          />
        </div>
      </div>

      {/* Responses */}
      <div style={styles.stat}>
        <span style={styles.label}>Responses</span>
        <span style={styles.value}>
          <span className="daily-stat-count">{responses}</span>
        </span>
      </div>
    </div>
  )
}

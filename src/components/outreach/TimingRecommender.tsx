import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

const BEST_DAYS = ['Tuesday', 'Wednesday', 'Thursday']
const BEST_MORNING = { start: 9, end: 11 } // 9-11 AM PHT
const BEST_AFTERNOON = { start: 14, end: 16 } // 2-4 PM PHT

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function isOptimalDay(dayName: string): boolean {
  return BEST_DAYS.includes(dayName)
}

function isOptimalTime(hour: number): boolean {
  return (
    (hour >= BEST_MORNING.start && hour < BEST_MORNING.end) ||
    (hour >= BEST_AFTERNOON.start && hour < BEST_AFTERNOON.end)
  )
}

function formatCurrentTime(date: Date): string {
  return date.toLocaleTimeString('en-PH', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  })
}

function getCurrentPHTDate(): Date {
  // Get current time in PHT
  const now = new Date()
  const phtString = now.toLocaleString('en-US', { timeZone: 'Asia/Manila' })
  return new Date(phtString)
}

function TimingRecommender() {
  const [now, setNow] = useState(getCurrentPHTDate())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentPHTDate())
    }, 60_000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const currentDay = DAY_NAMES[now.getDay()]
  const currentHour = now.getHours()
  const dayIsOptimal = isOptimalDay(currentDay)
  const timeIsOptimal = isOptimalTime(currentHour)
  const isOptimalNow = dayIsOptimal && timeIsOptimal

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div className="section-title">
        <Clock size={18} className="section-title-icon" />
        Optimal Outreach Timing
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <div className="form-label">Best Days</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {BEST_DAYS.map((day) => (
              <span
                key={day}
                className={`badge ${currentDay === day ? 'badge-active' : 'badge-pending'}`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="form-label">Best Times (PHT)</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span className="badge badge-pending">9 - 11 AM</span>
            <span className="badge badge-pending">2 - 4 PM</span>
          </div>
        </div>
      </div>

      {/* Current status indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          background: isOptimalNow ? 'var(--aria-green-muted)' : 'var(--aria-surface)',
        }}
      >
        {isOptimalNow ? (
          <CheckCircle size={18} style={{ color: 'var(--aria-green)' }} />
        ) : (
          <XCircle size={18} style={{ color: 'var(--aria-gray-text)' }} />
        )}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {isOptimalNow ? 'Now is a great time to reach out!' : 'Not in optimal outreach window'}
          </div>
          <div className="text-sm text-muted">
            {currentDay}, {formatCurrentTime(now)} PHT
            {!dayIsOptimal && ' — best to outreach on Tue/Wed/Thu'}
            {dayIsOptimal && !timeIsOptimal && ' — wait for 9-11 AM or 2-4 PM'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimingRecommender

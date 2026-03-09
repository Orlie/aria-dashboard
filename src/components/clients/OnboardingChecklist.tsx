import { useState, useMemo } from 'react'
import { ChevronDown, Check, ClipboardList } from 'lucide-react'
import { useClientsStore } from '../../stores/clients-store'
import { getToday } from '../../lib/utils'
import type { OnboardingTask } from '../../types'
import './OnboardingChecklist.css'

const DAY_LABELS: Record<number, string> = {
  0: 'Day 0 — Contract & Setup',
  1: 'Day 1 — Access',
  2: 'Day 2 — Strategy',
  3: 'Day 3 — Strategy',
  4: 'Day 4 — Launch Prep',
  5: 'Day 5 — Launch Prep',
  6: 'Day 6 — GO LIVE',
  7: 'Day 7 — GO LIVE',
  14: 'Week 2 — Optimization',
}

interface OnboardingChecklistProps {
  clientId: string
}

function OnboardingChecklist({ clientId }: OnboardingChecklistProps) {
  const onboarding = useClientsStore((s) => s.getOnboarding(clientId))
  const startOnboarding = useClientsStore((s) => s.startOnboarding)
  const updateOnboardingTask = useClientsStore((s) => s.updateOnboardingTask)

  const currentDay = useMemo(() => {
    if (!onboarding) return 0
    const start = new Date(onboarding.startDate)
    const today = new Date(getToday())
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }, [onboarding])

  const dayGroups = useMemo(() => {
    if (!onboarding) return []
    const groups: { day: number; label: string; tasks: OnboardingTask[] }[] = []
    const seen = new Set<number>()
    for (const task of onboarding.tasks) {
      if (!seen.has(task.day)) {
        seen.add(task.day)
        groups.push({
          day: task.day,
          label: DAY_LABELS[task.day] || `Day ${task.day}`,
          tasks: onboarding.tasks.filter((t) => t.day === task.day),
        })
      }
    }
    return groups.sort((a, b) => a.day - b.day)
  }, [onboarding])

  const [collapsedDays, setCollapsedDays] = useState<Set<number>>(() => {
    if (!onboarding) return new Set()
    const allDays = new Set(onboarding.tasks.map((t) => t.day))
    allDays.delete(currentDay <= 14 ? currentDay : 0)
    return allDays
  })

  if (!onboarding) {
    return (
      <div className="onboarding-start">
        <button
          className="btn btn-primary"
          onClick={() => startOnboarding(clientId)}
        >
          <ClipboardList size={14} />
          Start Onboarding
        </button>
      </div>
    )
  }

  const completedCount = onboarding.tasks.filter((t) => t.completed).length
  const totalCount = onboarding.tasks.length
  const percent = Math.round((completedCount / totalCount) * 100)
  const allDone = completedCount === totalCount

  const toggleDay = (day: number) => {
    setCollapsedDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  const handleToggleTask = (taskId: string, currentCompleted: boolean) => {
    updateOnboardingTask(clientId, taskId, { completed: !currentCompleted })
  }

  return (
    <div className="onboarding-checklist">
      <div className="onboarding-header">
        <span className="onboarding-header-title">
          Onboarding — Day {Math.min(currentDay, 14)} of 7
        </span>
        <span className="onboarding-header-stats">
          {completedCount}/{totalCount} tasks complete ({percent}%)
        </span>
      </div>

      <div className="onboarding-progress-bar">
        <div
          className={`onboarding-progress-fill${allDone ? ' complete' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {dayGroups.map((group) => {
        const groupDone = group.tasks.filter((t) => t.completed).length
        const groupTotal = group.tasks.length
        const isCollapsed = collapsedDays.has(group.day)
        const fractionClass =
          groupDone === groupTotal ? 'all-done' : groupDone > 0 ? 'partial' : 'none'

        return (
          <div key={group.day} className="onboarding-day-group">
            <div className="onboarding-day-header" onClick={() => toggleDay(group.day)}>
              <span className="onboarding-day-label">
                {groupDone === groupTotal && <Check size={14} style={{ color: 'var(--aria-green)' }} />}
                {group.label}
              </span>
              <div className="onboarding-day-status">
                <span className={`onboarding-day-fraction ${fractionClass}`}>
                  {groupDone}/{groupTotal}
                </span>
                <ChevronDown
                  size={14}
                  className={`onboarding-day-chevron${isCollapsed ? ' collapsed' : ''}`}
                />
              </div>
            </div>

            <div className={`onboarding-tasks${isCollapsed ? ' collapsed' : ''}`}>
              {group.tasks.map((task) => (
                <div key={task.id} className="onboarding-task">
                  <label className="onboarding-checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                    />
                    <span className="onboarding-checkbox-visual">
                      <Check size={12} className="onboarding-checkbox-check" />
                    </span>
                  </label>
                  <span className={`onboarding-task-label${task.completed ? ' completed' : ''}`}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OnboardingChecklist

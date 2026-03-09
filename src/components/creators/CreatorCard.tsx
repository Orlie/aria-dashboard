import { useState } from 'react'
import type { Creator } from '../../types'
import { isOverdue, getDaysUntil, formatCurrency } from '../../lib/utils'
import './CreatorCard.css'

interface CreatorCardProps {
  creator: Creator
  onClick: () => void
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return String(count)
}

function CreatorCard({ creator, onClick }: CreatorCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('creatorId', creator.id)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const contentOverdue =
    creator.contentDueDate && !creator.contentPostedDate && isOverdue(creator.contentDueDate)
  const daysUntilDue =
    creator.contentDueDate && !creator.contentPostedDate && !isOverdue(creator.contentDueDate)
      ? getDaysUntil(creator.contentDueDate)
      : null

  return (
    <div
      className={`creator-card${isDragging ? ' dragging' : ''}`}
      onClick={onClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="creator-card-header">
        <span className="creator-card-handle">@{creator.tiktokHandle.replace(/^@/, '')}</span>
        {creator.totalGmv > 0 && (
          <span className="creator-card-gmv">{formatCurrency(creator.totalGmv)}</span>
        )}
      </div>

      {creator.fullName && (
        <div className="creator-card-name">{creator.fullName}</div>
      )}

      <div className="creator-card-stats">
        <span>{formatFollowers(creator.followerCount)} followers</span>
        <span>{(creator.engagementRate * 100).toFixed(1)}% ER</span>
      </div>

      {contentOverdue && (
        <div className="creator-card-badge creator-card-badge--overdue">
          Content Overdue
        </div>
      )}

      {daysUntilDue !== null && daysUntilDue <= 3 && (
        <div className="creator-card-badge creator-card-badge--due-soon">
          Due in {daysUntilDue}d
        </div>
      )}

      {creator.niche && (
        <div className="creator-card-niche">{creator.niche}</div>
      )}
    </div>
  )
}

export default CreatorCard

import { useState } from 'react'
import type { Creator, CreatorStatus } from '../../types'
import { useCreatorsStore } from '../../stores/creators-store'
import CreatorCard from './CreatorCard'
import { ChevronDown } from 'lucide-react'

interface CreatorPipelineProps {
  clientId: string
  onSelectCreator: (creator: Creator) => void
  onAddCreator: () => void
}

interface PipelineColumn {
  statuses: CreatorStatus[]
  label: string
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  { statuses: ['identified', 'outreached'], label: 'Outreached' },
  { statuses: ['replied', 'vetting'], label: 'Replied / Vetting' },
  { statuses: ['approved'], label: 'Approved' },
  { statuses: ['sample_shipped'], label: 'Sample Shipped' },
  { statuses: ['content_due'], label: 'Content Due' },
  { statuses: ['content_posted'], label: 'Content Posted' },
  { statuses: ['active_partner'], label: 'Active Partner' },
]

const ARCHIVED_STATUSES: CreatorStatus[] = ['paused', 'removed']

function CreatorPipeline({ clientId, onSelectCreator, onAddCreator }: CreatorPipelineProps) {
  const creators = useCreatorsStore((s) => s.getCreatorsByClient(clientId))
  const { updateCreatorStatus } = useCreatorsStore()
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null)
  const [showArchived, setShowArchived] = useState(false)

  const archivedCreators = creators.filter((c) => ARCHIVED_STATUSES.includes(c.status))

  const handleDragOver = (e: React.DragEvent, colIndex: number) => {
    e.preventDefault()
    setDragOverColumn(colIndex)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, column: PipelineColumn) => {
    e.preventDefault()
    const creatorId = e.dataTransfer.getData('creatorId')
    if (creatorId) {
      // Drop into the first status of the column
      updateCreatorStatus(creatorId, column.statuses[0])
    }
    setDragOverColumn(null)
  }

  return (
    <div>
      <div className="pipeline-container">
        {PIPELINE_COLUMNS.map((column, idx) => {
          const columnCreators = creators.filter((c) =>
            column.statuses.includes(c.status)
          )

          return (
            <div
              className={`pipeline-column${dragOverColumn === idx ? ' pipeline-column--drag-over' : ''}`}
              key={column.label}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className="pipeline-column-header">
                <span className="pipeline-column-title">{column.label}</span>
                <span className="pipeline-column-count">{columnCreators.length}</span>
              </div>
              <div className="pipeline-cards">
                {columnCreators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    onClick={() => onSelectCreator(creator)}
                  />
                ))}
                {idx === 0 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={onAddCreator}
                    style={{ width: '100%', marginTop: 8, fontSize: 12 }}
                  >
                    + Add Creator
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Archived section */}
      {archivedCreators.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowArchived(!showArchived)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ChevronDown
              size={14}
              style={{
                transform: showArchived ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            />
            Archived ({archivedCreators.length})
          </button>

          {showArchived && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 12,
                marginTop: 12,
              }}
            >
              {archivedCreators.map((creator) => (
                <div key={creator.id} style={{ opacity: 0.6 }}>
                  <CreatorCard
                    creator={creator}
                    onClick={() => onSelectCreator(creator)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreatorPipeline

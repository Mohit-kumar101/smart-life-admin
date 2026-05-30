import { CheckCircle2, Pencil, Trash2, Clock, AlertTriangle } from 'lucide-react'
import { CategoryBadge, StatusBadge, OverdueBadge } from '../ui/Badge'
import { formatDate, relativeDue, isOverdue, priorityColor } from '../../utils/helpers'
import Button from '../ui/Button'

export default function TaskCard({ task, onComplete, onEdit, onDelete }) {
  const overdue = isOverdue(task)
  const isDone  = task.status === 'DONE'
  const relDue  = relativeDue(task.dueDate)

  return (
    <div
      className="animate-fade-in"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${overdue && !isDone ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: overdue && !isDone ? '0 0 0 1px rgba(239,68,68,0.1)' : 'none',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Priority bar */}
        <div style={{
          width: 3,
          alignSelf: 'stretch',
          borderRadius: 99,
          background: isDone
            ? 'var(--success)'
            : priorityColor(task.priorityScore),
          flexShrink: 0,
          minHeight: 24,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 600,
            color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: isDone ? 'line-through' : 'none',
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {task.title}
          </h3>

          {task.description && (
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {task.description}
            </p>
          )}
        </div>

        {/* Priority score pill */}
        {!isDone && (
          <div style={{
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 700,
            color: priorityColor(task.priorityScore),
            background: `${priorityColor(task.priorityScore)}18`,
            border: `1px solid ${priorityColor(task.priorityScore)}30`,
            borderRadius: 99,
            padding: '2px 8px',
            fontFamily: 'var(--font-display)',
          }}>
            {task.priorityScore}
          </div>
        )}
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <CategoryBadge category={task.category} />
        {overdue && !isDone ? <OverdueBadge /> : <StatusBadge status={task.status} />}

        {task.dueDate && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: overdue && !isDone ? 'var(--danger-light)' : 'var(--text-muted)',
          }}>
            {overdue && !isDone
              ? <AlertTriangle size={11} />
              : <Clock size={11} />}
            {relDue}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: 6,
        paddingTop: 4,
        borderTop: '1px solid var(--border)',
        justifyContent: 'flex-end',
      }}>
        {!isDone && (
          <Button
            variant="success"
            size="sm"
            icon={CheckCircle2}
            onClick={() => onComplete(task.id)}
          >
            Complete
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          icon={Pencil}
          onClick={() => onEdit(task)}
          disabled={isDone}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

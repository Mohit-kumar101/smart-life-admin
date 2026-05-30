import { categoryConfig } from '../../utils/helpers'

export function CategoryBadge({ category }) {
  const cfg = categoryConfig[category] || categoryConfig.NORMAL
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const isDone = status === 'DONE'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      background: isDone ? 'var(--success-glow)' : 'rgba(99,102,241,0.12)',
      color: isDone ? 'var(--success-light)' : 'var(--accent-light)',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: isDone ? 'var(--success)' : 'var(--accent)',
        flexShrink: 0,
      }} />
      {isDone ? 'Done' : 'Pending'}
    </span>
  )
}

export function OverdueBadge() {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      background: 'var(--danger-glow)',
      color: 'var(--danger-light)',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0,
      }} />
      Overdue
    </span>
  )
}

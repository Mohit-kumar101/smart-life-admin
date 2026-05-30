import { Loader2 } from 'lucide-react'

export function Spinner({ size = 24, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <Loader2
        size={size}
        color="var(--accent)"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
      color: 'var(--text-muted)',
    }}>
      <Spinner size={32} />
      <span style={{ fontSize: 14 }}>Loading…</span>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 32px',
      gap: 12,
      textAlign: 'center',
    }}>
      {Icon && (
        <div style={{
          width: 60,
          height: 60,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}>
          <Icon size={26} color="var(--text-muted)" />
        </div>
      )}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 17,
        fontWeight: 700,
        color: 'var(--text-primary)',
      }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 300 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}

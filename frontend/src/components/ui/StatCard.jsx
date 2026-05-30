import Card from '../ui/Card'

export default function StatCard({ label, value, icon: Icon, color, sub, trend }) {
  return (
    <Card className="animate-fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow accent */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: color || 'var(--accent)',
        opacity: 0.08,
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}>
            {label}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 32,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            {value ?? '—'}
          </p>
          {sub && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              {sub}
            </p>
          )}
        </div>

        {Icon && (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: `${color}18` || 'var(--accent-glow)',
            border: `1px solid ${color}30` || '1px solid rgba(99,102,241,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={20} color={color || 'var(--accent)'} />
          </div>
        )}
      </div>
    </Card>
  )
}

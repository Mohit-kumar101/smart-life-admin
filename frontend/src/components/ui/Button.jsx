import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-light)',
  },
  danger: {
    background: 'var(--danger-glow)',
    color: 'var(--danger-light)',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  success: {
    background: 'var(--success-glow)',
    color: 'var(--success-light)',
    border: '1px solid rgba(16,185,129,0.3)',
  },
}

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 12, borderRadius: 8, gap: 4 },
  md: { padding: '9px 18px', fontSize: 13, borderRadius: 10, gap: 6 },
  lg: { padding: '12px 24px', fontSize: 14, borderRadius: 12, gap: 8 },
}

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon: Icon,
  onClick, type = 'button', style = {}, fullWidth = false,
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.borderRadius,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
        ...v,
        ...style,
      }}
    >
      {loading ? (
        <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
      ) : Icon ? (
        <Icon size={14} />
      ) : null}
      {children}
    </button>
  )
}

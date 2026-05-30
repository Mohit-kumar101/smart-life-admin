export default function Card({ children, style = {}, className = '', onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        ...style,
        ...(onClick ? { cursor: 'pointer' } : {}),
      }}
    >
      {children}
    </div>
  )
}

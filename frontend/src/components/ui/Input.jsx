export default function Input({
  label, type = 'text', value, onChange, placeholder,
  error, required, disabled, style = {}, rows,
}) {
  const isTextarea = type === 'textarea'
  const Tag = isTextarea ? 'textarea' : 'input'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <Tag
        type={isTextarea ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows || 3}
        style={{
          ...styles.input,
          ...(error ? styles.inputError : {}),
          ...(disabled ? styles.inputDisabled : {}),
          ...(isTextarea ? { resize: 'vertical', minHeight: 80 } : {}),
          ...style,
        }}
      />
      {error && <span style={styles.error}>{error}</span>}
    </div>
  )
}

export function Select({ label, value, onChange, options = [], error, required, disabled, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(error ? styles.inputError : {}),
          cursor: 'pointer',
          ...style,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span style={styles.error}>{error}</span>}
    </div>
  )
}

const styles = {
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  input: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    width: '100%',
  },
  inputError: {
    borderColor: 'var(--danger)',
    boxShadow: '0 0 0 3px var(--danger-glow)',
  },
  inputDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  error: {
    fontSize: 12,
    color: 'var(--danger-light)',
  },
}

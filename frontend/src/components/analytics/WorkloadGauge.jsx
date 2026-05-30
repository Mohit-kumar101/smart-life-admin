import { workloadColor, workloadLabel } from '../../utils/helpers'

export default function WorkloadGauge({ score = 0 }) {
  const color = workloadColor(score)
  const label = workloadLabel(score)

  // SVG arc math
  const R = 70
  const cx = 90, cy = 90
  const startAngle = -210
  const totalArc   = 240
  const angle      = startAngle + (score / 100) * totalArc

  const toRad = (deg) => (deg * Math.PI) / 180
  const arcPath = (deg) => {
    const x = cx + R * Math.cos(toRad(deg))
    const y = cy + R * Math.sin(toRad(deg))
    return { x, y }
  }

  const start = arcPath(startAngle)
  const end   = arcPath(startAngle + totalArc)
  const fill  = arcPath(angle)
  const large = (score / 100) * totalArc > 180 ? 1 : 0

  const bgArc   = `M ${start.x} ${start.y} A ${R} ${R} 0 1 1 ${end.x} ${end.y}`
  const fillArc = score > 0
    ? `M ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${fill.x} ${fill.y}`
    : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="180" height="120" viewBox="0 0 180 120">
        {/* Track */}
        <path
          d={bgArc}
          fill="none"
          stroke="var(--bg-elevated)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Fill */}
        {fillArc && (
          <path
            d={fillArc}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        )}
        {/* Center text */}
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text-primary)"
          fontSize="24"
          fontWeight="700"
          fontFamily="'DM Sans', sans-serif"
        >
          {score}
        </text>
        <text
          x={cx} y={cy + 20}
          textAnchor="middle"
          fill={color}
          fontSize="11"
          fontWeight="600"
          fontFamily="'DM Sans', sans-serif"
          style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
        >
          {label}
        </text>
      </svg>

      {/* Scale labels */}
      <div style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { range: '0–24',  color: '#10b981', label: 'Low'      },
          { range: '25–49', color: '#6366f1', label: 'Moderate' },
          { range: '50–74', color: '#f59e0b', label: 'High'     },
          { range: '75–100',color: '#ef4444', label: 'Critical' },
        ].map((s) => (
          <span key={s.label} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: 'var(--text-muted)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

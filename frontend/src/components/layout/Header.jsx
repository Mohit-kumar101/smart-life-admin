import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard':  { title: 'Dashboard',    sub: 'Your life at a glance' },
  '/tasks':      { title: 'Tasks',        sub: 'Manage and prioritize your work' },
  '/analytics':  { title: 'Analytics',    sub: 'Insights into your productivity' },
  '/assistant':  { title: 'AI Assistant', sub: 'Your intelligent life coach' },
}

export default function Header() {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { title: 'SmartLife', sub: '' }

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>{page.title}</h1>
        <p style={styles.sub}>{page.sub}</p>
      </div>
      <div style={styles.dateChip}>
        {dateStr}
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 32px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-surface)',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  sub: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  dateChip: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    padding: '6px 14px',
    borderRadius: 99,
    fontWeight: 500,
  },
}

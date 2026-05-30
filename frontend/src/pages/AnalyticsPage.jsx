import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useAnalytics } from '../hooks/useAnalytics'
import { useTasks } from '../hooks/useTasks'
import WorkloadGauge from '../components/analytics/WorkloadGauge'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import { PageLoader } from '../components/ui/Spinner'
import { TrendingUp, Target, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import Button from '../components/ui/Button'
import { workloadColor } from '../utils/helpers'

const PIE_COLORS = {
  URGENT:    '#ef4444',
  IMPORTANT: '#f59e0b',
  NORMAL:    '#6366f1',
  OPTIONAL:  '#64748b',
}

const TOOLTIP_STYLE = {
  background: '#1a2236',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10,
  color: '#f1f5f9',
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { analytics, loading, refetch } = useAnalytics(user?.id)
  const { tasks } = useTasks(user?.id)

  if (loading) return <PageLoader />

  const a = analytics || {}

  // Category pie data
  const pieData = a.categoryBreakdown
    ? Object.entries(a.categoryBreakdown)
        .map(([key, val]) => ({
          name: key.charAt(0) + key.slice(1).toLowerCase(),
          value: Number(val),
          fill: PIE_COLORS[key.toUpperCase()] || '#64748b',
        }))
        .filter((d) => d.value > 0)
    : []

  // Status bar data
  const barData = [
    { name: 'Completed', value: Number(a.completedTasks ?? 0), fill: '#10b981' },
    { name: 'Pending',   value: Number(a.pendingTasks   ?? 0), fill: '#6366f1' },
    { name: 'Overdue',   value: Number(a.overdueTasks   ?? 0), fill: '#ef4444' },
  ]

  // Priority distribution from tasks
  const priorityBuckets = [
    { name: '0–20',  count: tasks.filter((t) => t.priorityScore <= 20).length,  fill: '#64748b' },
    { name: '21–40', count: tasks.filter((t) => t.priorityScore > 20 && t.priorityScore <= 40).length, fill: '#6366f1' },
    { name: '41–60', count: tasks.filter((t) => t.priorityScore > 40 && t.priorityScore <= 60).length, fill: '#f59e0b' },
    { name: '61–80', count: tasks.filter((t) => t.priorityScore > 60 && t.priorityScore <= 80).length, fill: '#ef4444' },
    { name: '81–100',count: tasks.filter((t) => t.priorityScore > 80).length,  fill: '#dc2626' },
  ]

  const wColor = workloadColor(a.workloadScore ?? 0)

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div />
        <Button variant="ghost" size="sm" icon={RefreshCw} onClick={refetch}>
          Refresh
        </Button>
      </div>

      {/* KPI row */}
      <div style={styles.statsGrid} className="stagger">
        <StatCard
          label="Completion Rate"
          value={`${a.completionRate ?? 0}%`}
          icon={TrendingUp}
          color="#10b981"
          sub={`${a.completedTasks ?? 0} of ${a.totalTasks ?? 0} tasks done`}
        />
        <StatCard
          label="Workload Score"
          value={a.workloadScore ?? 0}
          icon={Target}
          color={wColor}
          sub={`${a.dailySuggestedTasks ?? 0} tasks suggested today`}
        />
        <StatCard
          label="Overdue Tasks"
          value={a.overdueTasks ?? 0}
          icon={AlertTriangle}
          color="#ef4444"
          sub={a.overdueTasks > 0 ? 'Needs immediate attention' : 'You\'re on track!'}
        />
        <StatCard
          label="Completed"
          value={a.completedTasks ?? 0}
          icon={CheckCircle2}
          color="#10b981"
          sub="All time"
        />
      </div>

      {/* Charts row */}
      <div style={styles.chartsRow}>
        {/* Workload gauge */}
        <Card style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <h3 style={styles.chartTitle}>Current Workload</h3>
          <WorkloadGauge score={a.workloadScore ?? 0} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
            Based on {a.pendingTasks ?? 0} pending + {a.overdueTasks ?? 0} overdue tasks
          </p>
        </Card>

        {/* Status bar chart */}
        <Card style={{ flex: 1, minWidth: 0 }}>
          <h3 style={styles.chartTitle}>Task Status Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category pie */}
        {pieData.length > 0 && (
          <Card style={{ flex: '0 0 280px' }}>
            <h3 style={styles.chartTitle}>Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Priority distribution */}
      <Card>
        <h3 style={{ ...styles.chartTitle, marginBottom: 16 }}>Priority Score Distribution</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={priorityBuckets} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]}>
              {priorityBuckets.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}

const styles = {
  page: {
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 14,
  },
  chartsRow: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  chartTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 12,
  },
}

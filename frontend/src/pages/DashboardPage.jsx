import { CheckSquare, Clock, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAnalytics } from '../hooks/useAnalytics'
import { useTasks } from '../hooks/useTasks'
import StatCard from '../components/ui/StatCard'
import WorkloadGauge from '../components/analytics/WorkloadGauge'
import TaskCard from '../components/tasks/TaskCard'
import TaskFormModal from '../components/tasks/TaskFormModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { PageLoader, EmptyState } from '../components/ui/Spinner'
import { useState } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { analytics, loading: aLoading } = useAnalytics(user?.id)
  const { tasks, loading: tLoading, createTask, completeTask, updateTask, deleteTask } = useTasks(user?.id)
  const [showCreate, setShowCreate] = useState(false)
  const [editTask, setEditTask]     = useState(null)

  const topTasks = tasks
    .filter((t) => t.status === 'PENDING')
    .slice(0, 3)

  if (aLoading && tLoading) return <PageLoader />

  return (
    <div style={styles.page}>
      {/* Welcome */}
      <div style={styles.welcome} className="animate-fade-in">
        <div>
          <h2 style={styles.welcomeTitle}>
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p style={styles.welcomeSub}>
            {analytics
              ? `You have ${analytics.pendingTasks} pending tasks${analytics.overdueTasks > 0 ? ` and ${analytics.overdueTasks} overdue` : ''}.`
              : 'Loading your overview…'}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)}>
          New Task
        </Button>
      </div>

      {/* Stat cards */}
      <div style={styles.statsGrid} className="stagger">
        <StatCard
          label="Total Tasks"
          value={analytics?.totalTasks ?? '—'}
          icon={CheckSquare}
          color="#6366f1"
          sub={analytics ? `${analytics.completionRate}% completion rate` : null}
        />
        <StatCard
          label="Completed"
          value={analytics?.completedTasks ?? '—'}
          icon={TrendingUp}
          color="#10b981"
          sub="All time"
        />
        <StatCard
          label="Pending"
          value={analytics?.pendingTasks ?? '—'}
          icon={Clock}
          color="#f59e0b"
          sub={analytics ? `${analytics.dailySuggestedTasks} suggested today` : null}
        />
        <StatCard
          label="Overdue"
          value={analytics?.overdueTasks ?? '—'}
          icon={AlertTriangle}
          color="#ef4444"
          sub={analytics?.overdueTasks > 0 ? 'Needs attention!' : 'All clear ✓'}
        />
      </div>

      {/* Workload + Top Tasks */}
      <div style={styles.midRow}>
        {/* Workload gauge */}
        <Card style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <h3 style={styles.sectionTitle}>Workload Score</h3>
          <WorkloadGauge score={analytics?.workloadScore ?? 0} />
          {analytics?.dailySuggestedTasks > 0 && (
            <p style={styles.suggestion}>
              💡 Tackle <strong style={{ color: 'var(--accent-light)' }}>{analytics.dailySuggestedTasks} tasks</strong> today
            </p>
          )}
        </Card>

        {/* Top priority tasks */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Top Priority Tasks</h3>
            <Link to="/tasks" style={styles.seeAll}>
              See all <ArrowRight size={13} />
            </Link>
          </div>

          {tLoading ? (
            <PageLoader />
          ) : topTasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="All caught up!"
              description="No pending tasks. Create a new one to get started."
              action={<Button icon={Plus} onClick={() => setShowCreate(true)}>New Task</Button>}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onEdit={(t) => setEditTask(t)}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TaskFormModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={createTask}
      />
      <TaskFormModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        initialData={editTask}
        onSubmit={(data) => updateTask(editTask.id, data)}
      />
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

const styles = {
  page: {
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    flex: 1,
  },
  welcome: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  welcomeTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 14,
    color: 'var(--text-muted)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 14,
  },
  midRow: {
    display: 'flex',
    gap: 20,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  seeAll: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: 'var(--accent-light)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  suggestion: {
    fontSize: 13,
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
}

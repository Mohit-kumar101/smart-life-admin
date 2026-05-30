import { useState, useMemo } from 'react'
import { Plus, Search, Filter, SortDesc } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/tasks/TaskCard'
import TaskFormModal from '../components/tasks/TaskFormModal'
import Button from '../components/ui/Button'
import { EmptyState, PageLoader } from '../components/ui/Spinner'
import { isOverdue } from '../utils/helpers'

const FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue',   label: 'Overdue' },
]

const SORT_OPTIONS = [
  { key: 'priority', label: 'Priority Score' },
  { key: 'dueDate',  label: 'Due Date' },
  { key: 'created',  label: 'Date Created' },
]

export default function TasksPage() {
  const { user }  = useAuth()
  const { tasks, loading, createTask, updateTask, deleteTask, completeTask } = useTasks(user?.id)

  const [filter, setFilter]     = useState('all')
  const [sort, setSort]         = useState('priority')
  const [search, setSearch]     = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editTask, setEditTask] = useState(null)

  const filtered = useMemo(() => {
    let list = [...tasks]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      )
    }

    // Filter
    switch (filter) {
      case 'pending':   list = list.filter((t) => t.status === 'PENDING'); break
      case 'completed': list = list.filter((t) => t.status === 'DONE'); break
      case 'overdue':   list = list.filter((t) => isOverdue(t)); break
    }

    // Sort
    list.sort((a, b) => {
      if (sort === 'priority') return b.priorityScore - a.priorityScore
      if (sort === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return list
  }, [tasks, filter, sort, search])

  const counts = useMemo(() => ({
    all:       tasks.length,
    pending:   tasks.filter((t) => t.status === 'PENDING').length,
    completed: tasks.filter((t) => t.status === 'DONE').length,
    overdue:   tasks.filter((t) => isOverdue(t)).length,
  }), [tasks])

  return (
    <div style={styles.page}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <Search size={15} style={styles.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            style={styles.searchInput}
          />
        </div>

        {/* Sort */}
        <div style={styles.sortWrap}>
          <SortDesc size={14} color="var(--text-muted)" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={styles.sortSelect}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>

        <Button icon={Plus} onClick={() => setShowCreate(true)}>
          New Task
        </Button>
      </div>

      {/* Filter tabs */}
      <div style={styles.filterRow}>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              ...styles.filterTab,
              ...(filter === key ? styles.filterTabActive : {}),
            }}
          >
            {label}
            <span style={{
              ...styles.filterCount,
              ...(filter === key ? styles.filterCountActive : {}),
            }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <PageLoader />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Plus}
          title={search ? 'No matching tasks' : 'No tasks here'}
          description={
            search
              ? `No tasks match "${search}". Try a different search.`
              : filter === 'all'
              ? 'Create your first task to get started!'
              : `No ${filter} tasks right now.`
          }
          action={
            filter === 'all' && !search
              ? <Button icon={Plus} onClick={() => setShowCreate(true)}>Create Task</Button>
              : null
          }
        />
      ) : (
        <div style={styles.grid}>
          {filtered.map((task) => (
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

const styles = {
  page: {
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    flex: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  searchWrap: {
    flex: 1,
    minWidth: 220,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '9px 14px 9px 36px',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  sortWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '8px 12px',
  },
  sortSelect: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    outline: 'none',
  },
  filterRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterTab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 99,
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.15s',
  },
  filterTabActive: {
    background: 'var(--accent-glow)',
    borderColor: 'rgba(99,102,241,0.3)',
    color: 'var(--accent-light)',
  },
  filterCount: {
    background: 'var(--bg-elevated)',
    borderRadius: 99,
    padding: '1px 7px',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
  },
  filterCountActive: {
    background: 'rgba(99,102,241,0.2)',
    color: 'var(--accent-light)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 12,
    alignContent: 'start',
  },
}

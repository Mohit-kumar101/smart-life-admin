import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'

export const formatDate = (dateStr) => {
  if (!dateStr) return 'No deadline'
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy')
  } catch { return 'Invalid date' }
}

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy HH:mm')
  } catch { return '—' }
}

export const relativeDue = (dateStr) => {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Due today'
    if (isTomorrow(date)) return 'Due tomorrow'
    if (isPast(date)) return `${formatDistanceToNow(date)} overdue`
    return `Due in ${formatDistanceToNow(date)}`
  } catch { return null }
}

export const isOverdue = (task) =>
  task.dueDate &&
  isPast(new Date(task.dueDate)) &&
  task.status === 'PENDING'

export const categoryConfig = {
  URGENT:    { label: 'Urgent',    color: '#ef4444', bg: 'rgba(239,68,68,0.12)',    dot: '#ef4444' },
  IMPORTANT: { label: 'Important', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   dot: '#f59e0b' },
  NORMAL:    { label: 'Normal',    color: '#6366f1', bg: 'rgba(99,102,241,0.12)',   dot: '#6366f1' },
  OPTIONAL:  { label: 'Optional',  color: '#64748b', bg: 'rgba(100,116,139,0.12)',  dot: '#64748b' },
}

export const workloadColor = (score) => {
  if (score >= 75) return '#ef4444'
  if (score >= 50) return '#f59e0b'
  if (score >= 25) return '#6366f1'
  return '#10b981'
}

export const workloadLabel = (score) => {
  if (score >= 75) return 'Critical'
  if (score >= 50) return 'High'
  if (score >= 25) return 'Moderate'
  return 'Low'
}

export const priorityColor = (score) => {
  if (score >= 70) return '#ef4444'
  if (score >= 40) return '#f59e0b'
  if (score >= 20) return '#6366f1'
  return '#64748b'
}

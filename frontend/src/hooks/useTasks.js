import { useState, useEffect, useCallback } from 'react'
import { tasksApi } from '../services/api'
import toast from 'react-hot-toast'

export function useTasks(userId) {
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await tasksApi.getAll(userId)
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const createTask = async (data) => {
    if (!userId) {
      const msg = 'Not signed in. Please log out and log in again.'
      toast.error(msg)
      throw new Error(msg)
    }
    try {
      const newTask = await tasksApi.create({ ...data, userId })
      setTasks((prev) => [newTask, ...prev])
      toast.success('Task created!')
      return newTask
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const updateTask = async (taskId, data) => {
    try {
      const updated = await tasksApi.update(taskId, data)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
      toast.success('Task updated!')
      return updated
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await tasksApi.delete(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      toast.success('Task deleted')
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const completeTask = async (taskId) => {
    try {
      const updated = await tasksApi.complete(taskId)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
      toast.success('Task completed! 🎉')
      return updated
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, completeTask }
}

import { useState, useEffect, useCallback } from 'react'
import { analyticsApi } from '../services/api'

export function useAnalytics(userId) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await analyticsApi.get(userId)
      setAnalytics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  return { analytics, loading, error, refetch: fetchAnalytics }
}

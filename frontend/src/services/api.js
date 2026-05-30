import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Response interceptor — unwrap data, normalize errors
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const data = err.response?.data
    const fieldErrors = data?.fieldErrors
    const message =
      (fieldErrors && Object.values(fieldErrors).join('. ')) ||
      data?.error ||
      data?.message ||
      (err.response?.status === 503
        ? 'Database unavailable. Start MongoDB, then restart the backend.'
        : null) ||
      err.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getUser:  (id)   => api.get(`/auth/user/${id}`),
}

// ── Tasks ────────────────────────────────────────────────────
export const tasksApi = {
  create:   (data)           => api.post('/tasks', data),
  getAll:   (userId)         => api.get(`/tasks/${userId}`),
  update:   (taskId, data)   => api.put(`/tasks/${taskId}`, data),
  delete:   (taskId)         => api.delete(`/tasks/${taskId}`),
  complete: (taskId)         => api.patch(`/tasks/complete/${taskId}`),
}

// ── Analytics ────────────────────────────────────────────────
export const analyticsApi = {
  get: (userId) => api.get(`/analytics/${userId}`),
}

// ── AI Assistant ─────────────────────────────────────────────
export const aiApi = {
  suggest: (data) => api.post('/ai/suggest', data),
}

export default api

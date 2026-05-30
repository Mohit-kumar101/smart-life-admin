import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function normalizeUser(raw) {
  if (!raw) return null
  const id = raw.id || raw.userId
  if (!id) return null
  return { id, name: raw.name, email: raw.email }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sla_user')
      return stored ? normalizeUser(JSON.parse(stored)) : null
    } catch { return null }
  })

  const login = (userData) => {
    const normalized = normalizeUser(userData)
    setUser(normalized)
    if (normalized) {
      localStorage.setItem('sla_user', JSON.stringify(normalized))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sla_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

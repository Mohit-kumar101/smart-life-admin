import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function AuthPage() {
  const [mode, setMode]         = useState('login') // 'login' | 'register'
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [form, setForm]         = useState({ name: '', email: '', password: '' })

  const { login }   = useAuth()
  const navigate    = useNavigate()

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (mode === 'register' && !form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    if (mode === 'register' && form.password.length < 6) errs.password = 'Min 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const fn = mode === 'login' ? authApi.login : authApi.register
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const data = await fn(payload)
      login({ id: data.userId, name: data.name, email: data.email })
      toast.success(data.message || 'Welcome!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode((m) => m === 'login' ? 'register' : 'login')
    setErrors({})
    setForm({ name: '', email: '', password: '' })
  }

  return (
    <div style={styles.page}>
      {/* Background mesh */}
      <div style={styles.bgMesh} />

      <div style={styles.card} className="animate-fade-in">
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <Zap size={22} color="#6366f1" strokeWidth={2.5} />
          </div>
          <div>
            <div style={styles.logoText}>SmartLife Admin</div>
            <div style={styles.logoSub}>Your intelligent life manager</div>
          </div>
        </div>

        <h2 style={styles.heading}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p style={styles.subheading}>
          {mode === 'login'
            ? 'Sign in to manage your tasks and life goals.'
            : 'Join thousands of people mastering their productivity.'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'register' && (
            <div style={styles.inputWrap}>
              <User size={15} style={styles.inputIcon} />
              <Input
                placeholder="Your full name"
                value={form.name}
                onChange={set('name')}
                error={errors.name}
                style={{ paddingLeft: 36 }}
              />
            </div>
          )}

          <div style={styles.inputWrap}>
            <Mail size={15} style={styles.inputIcon} />
            <Input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={styles.inputWrap}>
            <Lock size={15} style={styles.inputIcon} />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
            style={{ marginTop: 4 }}
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p style={styles.toggle}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button style={styles.toggleBtn} onClick={toggleMode}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-base)',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  bgMesh: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse 60% 50% at 20% 20%, rgba(99,102,241,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 70%)
    `,
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-xl)',
    padding: '36px 32px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
    position: 'relative',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: 'var(--accent-glow)',
    border: '1px solid rgba(99,102,241,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  logoSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: 'var(--text-muted)',
    marginBottom: 28,
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  toggle: {
    textAlign: 'center',
    fontSize: 13,
    color: 'var(--text-muted)',
    marginTop: 20,
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-light)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    fontFamily: 'var(--font-body)',
  },
}

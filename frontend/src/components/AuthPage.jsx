import React, { useState } from 'react'

const USERS_KEY = 'swasthya_users'
const AUTH_KEY = 'swasthya_auth'

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function getLoggedInUser() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
    return auth
  } catch {
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem('swasthya_user_profile')
}

function saveUser(email, password, name) {
  const users = getUsers()
  users[email] = { password, name, createdAt: new Date().toISOString() }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loginUser(email, name) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email, name, loggedInAt: new Date().toISOString() }))
}

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name')
        return
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters')
        return
      }
      const users = getUsers()
      if (users[email]) {
        setError('An account with this email already exists. Please log in.')
        return
      }
      saveUser(email, password, name)
      loginUser(email, name)
      onAuth({ email, name })
    } else {
      const users = getUsers()
      const user = users[email]
      if (!user) {
        setError('No account found with this email. Please sign up first.')
        return
      }
      if (user.password !== password) {
        setError('Incorrect password. Please try again.')
        return
      }
      loginUser(email, user.name)
      onAuth({ email, name: user.name })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card glass-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="navbar-logo-icon" style={{ width: 52, height: 52, fontSize: 26, borderRadius: 16 }}>⚕️</div>
          <span className="navbar-logo-text" style={{ fontSize: '1.8rem' }}>SwasthyaAI</span>
        </div>

        <h2 className="auth-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to access your personalized health dashboard'
            : 'Join SwasthyaAI for AI-powered health guidance'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">👤</span>
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Bhargav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  id="auth-name-input"
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">📧</span>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus={mode === 'login'}
                id="auth-email-input"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="auth-password-input"
              />
              <button
                type="button"
                className="auth-show-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit" id="auth-submit-btn">
            {mode === 'login' ? '🔓 Sign In' : '🚀 Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          className="btn-secondary auth-switch"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          id="auth-switch-btn"
        >
          {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>

        <p className="auth-disclaimer">
          🔒 Your data stays on your device. No server storage.
        </p>
      </div>
    </div>
  )
}

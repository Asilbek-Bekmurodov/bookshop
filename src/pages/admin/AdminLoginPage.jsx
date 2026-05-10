import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AdminLoginPage.module.css'

const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(200,146,42,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)

const EyeOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === 'admin@gmail.com' && password === 'admin123') {
      sessionStorage.setItem('adminAuth', 'true')
      setError('')
      navigate('/admin')
    } else {
      setError("Email yoki parol noto'g'ri. Admin login ma'lumotlarini kiriting.")
    }
  }

  return (
    <div className={styles.auth}>
      {/* ── Left decorative panel ── */}
      <div className={styles.panel}>
        <div className={styles.panelInner}>
          <a href="/" className={styles.brand}>
            Book.com <span className={styles.brandDot} />
          </a>

          <div className={styles.spines}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={styles.spine} />
            ))}
          </div>

          <div className={styles.shieldWrap}>
            <div className={styles.shieldCircle}>
              <ShieldIcon />
            </div>
            <h2 className={styles.panelTitle}>Admin Panel</h2>
            <p className={styles.panelSub}>Secure management dashboard for administrators</p>
          </div>

          <div className={styles.panelStats}>
            <div className={styles.panelStat}>
              <span className={styles.statNum}>248</span>
              <span className={styles.statLabel}>Users</span>
            </div>
            <div className={styles.panelStat}>
              <span className={styles.statNum}>1.8K</span>
              <span className={styles.statLabel}>Books</span>
            </div>
            <div className={styles.panelStat}>
              <span className={styles.statNum}>12</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.form}>
        <div className={styles.formInner}>
          <Link to="/login" className={styles.backLink}>
            ← Back to user login
          </Link>

          <div className={styles.formHeader}>
            <span className={styles.adminLabel}>ADMIN ACCESS</span>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Sign in to your admin dashboard</p>
          </div>

          <form className={styles.fields} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Admin Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="admin@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPwd(v => !v)}
                >
                  {showPwd ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn}>
              Sign in to Admin Panel
            </button>
          </form>

          <p className={styles.hintText}>
            Demo: <code>admin@gmail.com</code> / <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage

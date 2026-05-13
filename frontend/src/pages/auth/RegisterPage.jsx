import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../store/authSlice'
import styles from './Auth.module.css'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.251 17.64 11.943 17.64 9.2z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.826.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
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

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const dispatch = useDispatch()
  const { loading, error } = useSelector((s) => s.auth)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return
    const result = await dispatch(registerUser({ name, email, password }))
    if (registerUser.fulfilled.match(result)) {
      navigate('/home', { replace: true })
    }
  }

  const passwordsMatch = confirm === '' || password === confirm

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

          <blockquote className={styles.quote}>
            <span className={styles.quoteMark}>"</span>
            <p className={styles.quoteText}>
              Not all those who wander are lost — but all those who read are found.
            </p>
            <cite className={styles.quoteCite}>— Adapted from Tolkien</cite>
          </blockquote>

          <div className={styles.panelStats}>
            <div className={styles.panelStat}>
              <span className={styles.statNum}>12K+</span>
              <span className={styles.statLabel}>Books</span>
            </div>
            <div className={styles.panelStat}>
              <span className={styles.statNum}>8K+</span>
              <span className={styles.statLabel}>Readers</span>
            </div>
            <div className={styles.panelStat}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Authors</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.form}>
        <div className={styles.formInner}>

          <Link to="/" className={styles.backLink}>
            ← Back to home
          </Link>

          <div className={styles.formHeader}>
            <h1 className={styles.title}>Create account</h1>
            <p className={styles.subtitle}>Join your reading community today</p>
          </div>

          <button className={styles.googleBtn} type="button">
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          <form className={styles.fields} onSubmit={handleSubmit}>

            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                type="email"
                className={styles.input}
                placeholder="you@example.com"
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={8}
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

            <div className={styles.field}>
              <label className={styles.label}>Confirm password</label>
              <div className={styles.inputWrap}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`${styles.input} ${!passwordsMatch ? styles.inputError : ''}`}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowConfirm(v => !v)}
                >
                  {showConfirm ? <EyeOff /> : <EyeOn />}
                </button>
              </div>
              {!passwordsMatch && (
                <span className={styles.errorMsg}>Passwords don't match</span>
              )}
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <button type="submit" className={styles.submitBtn} disabled={loading || !passwordsMatch}>
              {loading ? 'Yaratilmoqda...' : 'Create account'}
            </button>

          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.switchLink}>Sign in</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default RegisterPage

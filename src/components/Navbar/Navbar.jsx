import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import StreakBadge from '../StreakBadge/StreakBadge'
import NotificationDropdown from './NotificationDropdown'

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
)

const Navbar = () => {
  const navigate = useNavigate()
  const [overVideo, setOverVideo] = useState(true)

  useEffect(() => {
    const section = document.getElementById('video-intro')
    if (!section) {
      setOverVideo(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOverVideo(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={`${styles.navbar} ${overVideo ? styles.transparent : styles.solid}`}>
      <a href="/" className={styles.logo}>Book.com</a>

      <ul className={styles.navLinks}>
        <li><span className={styles.navLink}>Book Type</span></li>
        <li><span className={styles.navLink}>Recomendation</span></li>
        <li><span className={styles.navLink}>Popular</span></li>
        <li><span className={styles.navLink}>Download App</span></li>
      </ul>

      <div className={styles.authButtons}>
        <StreakBadge streak={35} active={true} />
        <NotificationDropdown overVideo={overVideo} />
        <button
          className={`${styles.leaderboardBtn} ${overVideo ? styles.leaderboardBtnTransparent : styles.leaderboardBtnSolid}`}
          onClick={() => navigate('/leaderboard')}
          title="Leaderboard"
          aria-label="Open leaderboard"
        >
          <TrophyIcon />
        </button>
        <button className={styles.loginBtn} onClick={() => navigate('/login')}>
          Login
        </button>
        <button className={styles.startBtn} onClick={() => navigate('/register')}>
          Start For Free
        </button>
      </div>
    </nav>
  )
}

export default Navbar

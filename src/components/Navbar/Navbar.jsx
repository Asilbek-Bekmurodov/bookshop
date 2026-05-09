import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

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

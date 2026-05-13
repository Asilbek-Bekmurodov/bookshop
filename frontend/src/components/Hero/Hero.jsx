import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '../../store/searchSlice'
import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'
import heroBooks from '../../assets/hero-books.png'

const Hero = () => {
  const dispatch = useDispatch()
  const query = useSelector((state) => state.search.query)
  const videoWrapperRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!videoWrapperRef.current || !heroRef.current) return
      const scrollY = window.scrollY
      const heroH = heroRef.current.offsetHeight
      const progress = Math.min(scrollY / heroH, 1)
      const ty = scrollY * 0.18
      const ry = progress * 10
      const rx = progress * -5
      const sc = 1 - progress * 0.07
      videoWrapperRef.current.style.transform =
        `rotateY(${ry}deg) rotateX(${rx}deg) translateY(${ty}px) scale(${sc})`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = () => {
    if (query.trim()) alert(`Searching for: ${query}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.leftContent}>
        <div className={styles.badge}>✦ Premium Book Collection</div>
        <h1 className={styles.headline}>
          Find the book<br />
          you're looking for<br />
          <span className={styles.accent}>easier to read.</span>
        </h1>
        <p className={styles.subtitle}>
          The most appropriate book site to reach books
        </p>
        <div className={styles.searchBox}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Find your favorite book here..."
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onKeyPress={handleKeyPress}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>12K+</span>
            <span className={styles.statLabel}>Books</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>8K+</span>
            <span className={styles.statLabel}>Readers</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>500+</span>
            <span className={styles.statLabel}>Authors</span>
          </div>
        </div>
      </div>

      <div className={styles.rightContent}>
        <div className={`${styles.floatingIcon} ${styles.lightbulb}`}>
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548 5.478a1 1 0 01-.994.91H8.665a1 1 0 01-.994-.91l-.548-5.478z" />
          </svg>
        </div>
        <div className={`${styles.floatingIcon} ${styles.award}`}>
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <div className={`${styles.floatingIcon} ${styles.target}`}>
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>

        <div className={styles.imageWrapper} ref={videoWrapperRef}>
          <img src={heroBooks} alt="Stack of books" className={styles.heroImage} />
        </div>
      </div>
    </section>
  )
}

export default Hero

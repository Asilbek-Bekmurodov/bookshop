import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DashboardPage.module.css'
import AudioSection from '../components/AudioSection/AudioSection'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer'

/* ── Icons ─────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const BookOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const CompassIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
)
const TrendingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const LogOutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

/* ── Data ───────────────────────────────────────────────────── */
const BOOKS = [
  { id: 1,  title: "The Great Gatsby",          author: "F. Scott Fitzgerald", category: "Fiction",    rating: 4.8, price: "$12.99", pages: 180,  color: "#2d4a3e", spine: "#1a3028" },
  { id: 2,  title: "Sapiens",                   author: "Yuval Noah Harari",   category: "History",    rating: 4.9, price: "$15.99", pages: 443,  color: "#4a2d2d", spine: "#3a1a1a" },
  { id: 3,  title: "Atomic Habits",             author: "James Clear",          category: "Self-Help",  rating: 4.9, price: "$14.99", pages: 320,  color: "#2a3a4a", spine: "#1a2a38" },
  { id: 4,  title: "1984",                      author: "George Orwell",        category: "Fiction",    rating: 4.7, price: "$10.99", pages: 328,  color: "#3a3028", spine: "#2a2018" },
  { id: 5,  title: "Thinking, Fast and Slow",   author: "Daniel Kahneman",     category: "Psychology", rating: 4.6, price: "$16.99", pages: 499,  color: "#2a4a3a", spine: "#1a3828" },
  { id: 6,  title: "The Alchemist",             author: "Paulo Coelho",         category: "Fiction",    rating: 4.8, price: "$11.99", pages: 208,  color: "#4a3a20", spine: "#382c14" },
  { id: 7,  title: "Educated",                  author: "Tara Westover",        category: "Biography",  rating: 4.7, price: "$13.99", pages: 352,  color: "#3a2a4a", spine: "#2a1a38" },
  { id: 8,  title: "The Power of Now",          author: "Eckhart Tolle",       category: "Philosophy", rating: 4.5, price: "$12.49", pages: 229,  color: "#284a40", spine: "#1a3830" },
  { id: 9,  title: "Dune",                      author: "Frank Herbert",        category: "Sci-Fi",     rating: 4.9, price: "$17.99", pages: 688,  color: "#3a4020", spine: "#2a3010" },
  { id: 10, title: "To Kill a Mockingbird",     author: "Harper Lee",           category: "Fiction",    rating: 4.8, price: "$11.49", pages: 281,  color: "#4a2838", spine: "#381820" },
  { id: 11, title: "Man's Search for Meaning",  author: "Viktor E. Frankl",    category: "Philosophy", rating: 4.9, price: "$10.49", pages: 200,  color: "#303842", spine: "#202830" },
  { id: 12, title: "The Midnight Library",      author: "Matt Haig",            category: "Fiction",    rating: 4.6, price: "$13.49", pages: 304,  color: "#283040", spine: "#182030" },
]

const CATEGORIES = ["All", "Fiction", "History", "Psychology", "Philosophy", "Biography", "Self-Help", "Sci-Fi"]

const FEATURED = [
  { title: "New Arrivals This Week",  sub: "20 fresh titles just added", bg: "linear-gradient(135deg, #1c2d20 0%, #2d4a3e 100%)" },
  { title: "Staff Picks for May",     sub: "Curated by our readers",      bg: "linear-gradient(135deg, #3a2010 0%, #6a3820 100%)" },
]

const SIDEBAR_NAV = [
  { icon: HomeIcon,    label: "Home",       badge: null,  active: true,  path: "/home"    },
  { icon: BookOpenIcon,label: "My Library", badge: "14",  active: false, path: null       },
  { icon: HeartIcon,   label: "Favourites", badge: "6",   active: false, path: null       },
  { icon: CompassIcon, label: "Discover",   badge: null,  active: false, path: null       },
  { icon: TrendingIcon,label: "Trending",   badge: null,  active: false, path: null       },
  { icon: UserIcon,    label: "Profile",    badge: null,  active: false, path: "/profile" },
]

/* ── Component ─────────────────────────────────────────────── */
const DashboardPage = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("All")
  const [favorites, setFavorites] = useState(new Set([1, 6]))
  const [searchQuery, setSearchQuery] = useState('')
  const [currentAudio, setCurrentAudio] = useState(null)
  const [audioPlaylist, setAudioPlaylist] = useState([])

  const handleAudioPlay = (item, playlist) => {
    setCurrentAudio(item)
    setAudioPlaylist(playlist)
  }

  const handleAudioClose = () => {
    setCurrentAudio(null)
    setAudioPlaylist([])
  }

  const handleSelectTrack = (item) => {
    setCurrentAudio(item)
  }

  const filteredBooks = BOOKS.filter(b => {
    const matchesCategory = activeCategory === "All" || b.category === activeCategory
    const matchesSearch = !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFav = (id, e) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleLogout = () => navigate('/login')

  return (
    <div className={styles.shell}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <a href="/home" className={styles.headerLogo}>
          <div className={styles.headerLogoMark}>B</div>
          <span className={styles.headerLogoText}>Book<em>.com</em></span>
        </a>

        <div className={styles.headerSearch}>
          <span className={styles.headerSearchIcon}><SearchIcon /></span>
          <input
            className={styles.headerSearchInput}
            placeholder="Search books, authors, genres…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.headerActions}>
          <button className={styles.headerIconBtn} title="Notifications">
            <BellIcon />
            <span className={styles.notifBadge} />
          </button>
          <button className={styles.headerIconBtn} title="Browse" onClick={() => setActiveCategory("All")}>
            <GridIcon />
          </button>
          <button className={styles.headerIconBtn} title="Logout" onClick={handleLogout}>
            <LogOutIcon />
          </button>
          <div className={styles.headerAvatar} title="user@gmail.com" onClick={() => navigate('/profile')}>UG</div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Menu</div>
            {SIDEBAR_NAV.map(({ icon: Icon, label, badge, active, path }) => (
              <div key={label} className={`${styles.navItem} ${active ? styles.active : ''}`} onClick={() => path && navigate(path)}>
                <span className={styles.navItemIcon}><Icon /></span>
                <span>{label}</span>
                {badge && <span className={styles.navItemBadge}>{badge}</span>}
              </div>
            ))}
          </div>

          <div className={styles.sideDivider} />

          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Categories</div>
            {CATEGORIES.map(cat => (
              <div
                key={cat}
                className={`${styles.categoryItem} ${activeCategory === cat ? styles.activeCategory : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className={styles.categoryCount}>
                  {cat === "All" ? BOOKS.length : BOOKS.filter(b => b.category === cat).length}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.sideDivider} />

          <div className={styles.sideStats}>
            <div className={styles.sideStatsTitle}>Reading Progress</div>
            <div className={styles.sideStatRow}>
              <span className={styles.sideStatLabel}>Books read</span>
              <span className={styles.sideStatValue}>14 / 20</span>
            </div>
            <div className={styles.readingBar}>
              <div className={styles.readingBarFill} style={{ width: '70%' }} />
            </div>
            <div style={{ marginTop: 14 }}>
              <div className={styles.sideStatRow}>
                <span className={styles.sideStatLabel}>This month</span>
                <span className={styles.sideStatValue}>3 books</span>
              </div>
              <div className={styles.sideStatRow}>
                <span className={styles.sideStatLabel}>Pages read</span>
                <span className={styles.sideStatValue}>1 240</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.content}>

          {/* Welcome banner */}
          <div className={styles.banner}>
            <div className={styles.bannerText}>
              <div className={styles.bannerGreet}>Good morning, User</div>
              <h1 className={styles.bannerTitle}>
                What will you <em>read</em> today?
              </h1>
              <p className={styles.bannerSub}>
                12,000+ books across every genre, curated just for you.
              </p>
            </div>
            <div className={styles.bannerActions}>
              <button className={`${styles.bannerBtn} ${styles.bannerBtnPrimary}`}>
                Browse all books
              </button>
              <button className={`${styles.bannerBtn} ${styles.bannerBtnSecondary}`}>
                My reading list
              </button>
            </div>
          </div>

          {/* Featured */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured</h2>
            <a className={styles.sectionLink}>View all</a>
          </div>
          <div className={styles.featuredGrid}>
            {FEATURED.map(f => (
              <div key={f.title} className={styles.featuredCard} style={{ background: f.bg }}>
                <div className={styles.featuredCardPattern} />
                <span className={styles.featuredLabel}>Collection</span>
                <div className={styles.featuredCardTitle}>{f.title}</div>
                <div className={styles.featuredCardAuthor}>{f.sub}</div>
              </div>
            ))}
          </div>

          {/* Book list */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {activeCategory === "All" ? "All Books" : activeCategory}
              {searchQuery && ` · "${searchQuery}"`}
            </h2>
            <a className={styles.sectionLink}>Sort by: Popular</a>
          </div>

          {/* Filter pills */}
          <div className={styles.filterRow}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.filterPill} ${activeCategory === cat ? styles.activePill : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className={styles.bookGrid}>
            {filteredBooks.map(book => (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookCover} style={{ background: `linear-gradient(160deg, ${book.color}, ${book.spine})` }}>
                  <div className={styles.bookSpineAccent} style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.15), transparent)` }} />
                  <div className={styles.bookCoverPattern} />
                  <button
                    className={`${styles.bookFavBtn} ${favorites.has(book.id) ? styles.favorited : ''}`}
                    onClick={e => toggleFav(book.id, e)}
                    title="Add to favourites"
                  >
                    <HeartIcon filled={favorites.has(book.id)} />
                  </button>
                  <span className={styles.bookCoverTitle}>{book.title}</span>
                </div>
                <div className={styles.bookInfo}>
                  <div className={styles.bookCategory}>{book.category}</div>
                  <div className={styles.bookTitle}>{book.title}</div>
                  <div className={styles.bookAuthor}>{book.author}</div>
                  <div className={styles.bookMeta}>
                    <span className={styles.bookRating}>
                      <StarIcon /> {book.rating}
                    </span>
                    <span className={styles.bookPrice}>{book.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#b0a070', fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
              No books found.
            </div>
          )}

          {/* Audio Section */}
          <AudioSection onPlay={handleAudioPlay} />

        </main>
      </div>

      {/* Audio Player */}
      {currentAudio && (
        <AudioPlayer
          current={currentAudio}
          playlist={audioPlaylist}
          onClose={handleAudioClose}
          onSelectTrack={handleSelectTrack}
        />
      )}
    </div>
  )
}

export default DashboardPage

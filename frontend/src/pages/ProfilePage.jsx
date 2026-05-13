import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProfilePage.module.css'

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
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
)
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
)
const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const PagesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)
const StarIcon2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

/* ── Sidebar nav data ───────────────────────────────────────── */
const SIDEBAR_NAV = [
  { icon: HomeIcon,    label: "Home",       badge: null, path: "/home" },
  { icon: BookOpenIcon,label: "My Library", badge: "14", path: null   },
  { icon: HeartIcon,   label: "Favourites", badge: "6",  path: null   },
  { icon: CompassIcon, label: "Discover",   badge: null, path: null   },
  { icon: TrendingIcon,label: "Trending",   badge: null, path: null   },
  { icon: UserIcon,    label: "Profile",    badge: null, path: "/profile", active: true },
]

/* ── Component ─────────────────────────────────────────────── */
const ProfilePage = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [avatarSrc, setAvatarSrc] = useState(null)
  const [editing, setEditing] = useState(false)
  const [hobbyInput, setHobbyInput] = useState('')

  const [userData, setUserData] = useState({
    firstName: 'Asilbek',
    lastName:  'Bekmurodov',
    email:     'user@gmail.com',
    hobbies:   ['Reading', 'Writing', 'Traveling'],
  })

  const [draft, setDraft] = useState({ ...userData })

  const initials = `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const startEdit = () => {
    setDraft({ ...userData })
    setEditing(true)
  }

  const saveEdit = () => {
    setUserData({ ...draft })
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft({ ...userData })
    setEditing(false)
  }

  const addHobby = () => {
    const trimmed = hobbyInput.trim()
    if (trimmed && !draft.hobbies.includes(trimmed)) {
      setDraft(d => ({ ...d, hobbies: [...d.hobbies, trimmed] }))
    }
    setHobbyInput('')
  }

  const removeHobby = (h) => {
    setDraft(d => ({ ...d, hobbies: d.hobbies.filter(x => x !== h) }))
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
          />
        </div>

        <div className={styles.headerActions}>
          <button className={styles.headerIconBtn} title="Notifications">
            <BellIcon />
            <span className={styles.notifBadge} />
          </button>
          <button className={styles.headerIconBtn} title="Browse" onClick={() => navigate('/home')}>
            <GridIcon />
          </button>
          <button className={styles.headerIconBtn} title="Logout" onClick={handleLogout}>
            <LogOutIcon />
          </button>
          <div
            className={styles.headerAvatar}
            title={userData.email}
            onClick={() => navigate('/profile')}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" className={styles.headerAvatarImg} />
              : initials}
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideSectionTitle}>Menu</div>
            {SIDEBAR_NAV.map(({ icon: Icon, label, badge, path, active }) => (
              <div
                key={label}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                onClick={() => path && navigate(path)}
              >
                <span className={styles.navItemIcon}><Icon /></span>
                <span>{label}</span>
                {badge && <span className={styles.navItemBadge}>{badge}</span>}
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

          <div className={styles.sideLogout}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOutIcon />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.content}>

          {/* Page title */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>My Profile</h1>
              <p className={styles.pageSub}>Manage your personal information and reading preferences</p>
            </div>
          </div>

          <div className={styles.profileGrid}>

            {/* ── Left column: avatar + info ── */}
            <div className={styles.leftCol}>

              {/* Avatar card */}
              <div className={styles.card}>
                <div className={styles.avatarSection}>
                  <div
                    className={styles.avatarWrap}
                    onClick={() => fileInputRef.current?.click()}
                    title="Change profile photo"
                  >
                    {avatarSrc
                      ? <img src={avatarSrc} alt="Profile" className={styles.avatarImg} />
                      : <div className={styles.avatarInitials}>{initials}</div>}
                    <div className={styles.avatarOverlay}>
                      <CameraIcon />
                      <span>Change</span>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.hiddenInput}
                    onChange={handleAvatarChange}
                  />
                  <div className={styles.avatarName}>
                    {userData.firstName} {userData.lastName}
                  </div>
                  <div className={styles.avatarEmail}>{userData.email}</div>
                  <div className={styles.memberBadge}>Member since 2024</div>
                </div>
              </div>

              {/* Hobbies card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>Interests & Hobbies</div>
                  {!editing && (
                    <button className={styles.editBtn} onClick={startEdit}>
                      <PencilIcon /> Edit
                    </button>
                  )}
                </div>

                <div className={styles.hobbiesList}>
                  {(editing ? draft.hobbies : userData.hobbies).map(h => (
                    <span key={h} className={styles.hobbyTag}>
                      {h}
                      {editing && (
                        <button className={styles.removeHobby} onClick={() => removeHobby(h)}>
                          <XIcon />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {editing && (
                  <div className={styles.hobbyInputRow}>
                    <input
                      className={styles.hobbyInput}
                      placeholder="Add hobby…"
                      value={hobbyInput}
                      onChange={e => setHobbyInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addHobby()}
                    />
                    <button className={styles.addHobbyBtn} onClick={addHobby}>
                      <PlusIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right column: info form + stats ── */}
            <div className={styles.rightCol}>

              {/* Personal info card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>Personal Information</div>
                  {!editing
                    ? <button className={styles.editBtn} onClick={startEdit}><PencilIcon /> Edit</button>
                    : (
                      <div className={styles.editActions}>
                        <button className={styles.cancelBtn} onClick={cancelEdit}><XIcon /> Cancel</button>
                        <button className={styles.saveBtn} onClick={saveEdit}><SaveIcon /> Save</button>
                      </div>
                    )}
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>First Name</label>
                    {editing
                      ? <input
                          className={styles.fieldInput}
                          value={draft.firstName}
                          onChange={e => setDraft(d => ({ ...d, firstName: e.target.value }))}
                        />
                      : <div className={styles.fieldValue}>{userData.firstName}</div>}
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Last Name</label>
                    {editing
                      ? <input
                          className={styles.fieldInput}
                          value={draft.lastName}
                          onChange={e => setDraft(d => ({ ...d, lastName: e.target.value }))}
                        />
                      : <div className={styles.fieldValue}>{userData.lastName}</div>}
                  </div>

                  <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.fieldLabel}>Email Address</label>
                    <div className={styles.fieldValue} style={{ color: '#a09070' }}>{userData.email}</div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statCardGold}`}>
                  <div className={styles.statIcon}><BookIcon /></div>
                  <div className={styles.statNumber}>14</div>
                  <div className={styles.statLabel}>Books Read</div>
                </div>

                <div className={`${styles.statCard} ${styles.statCardGreen}`}>
                  <div className={styles.statIcon}><CalendarIcon /></div>
                  <div className={styles.statNumber}>3</div>
                  <div className={styles.statLabel}>This Month</div>
                </div>

                <div className={`${styles.statCard} ${styles.statCardDark}`}>
                  <div className={styles.statIcon}><PagesIcon /></div>
                  <div className={styles.statNumber}>1,240</div>
                  <div className={styles.statLabel}>Pages Read</div>
                </div>

                <div className={`${styles.statCard} ${styles.statCardWarm}`}>
                  <div className={styles.statIcon}><StarIcon2 /></div>
                  <div className={styles.statNumber} style={{ fontSize: 20 }}>Fiction</div>
                  <div className={styles.statLabel}>Fav Genre</div>
                </div>
              </div>

              {/* Reading goal card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>2024 Reading Goal</div>
                  <span className={styles.goalBadge}>70% complete</span>
                </div>

                <div className={styles.goalInfo}>
                  <span className={styles.goalCurrent}>14 books read</span>
                  <span className={styles.goalTarget}>Goal: 20 books</span>
                </div>

                <div className={styles.goalBarTrack}>
                  <div className={styles.goalBarFill} style={{ width: '70%' }}>
                    <div className={styles.goalBarShine} />
                  </div>
                </div>

                <div className={styles.monthlyGrid}>
                  {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => {
                    const counts = [2, 1, 3, 1, 2, 2, 1, 2, 0, 0, 0, 0]
                    const count = counts[i]
                    return (
                      <div key={m} className={styles.monthCell}>
                        <div
                          className={styles.monthBar}
                          style={{ height: `${Math.max(count * 16, 4)}px`, opacity: count ? 1 : 0.2 }}
                        />
                        <span className={styles.monthLabel}>{m}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ProfilePage

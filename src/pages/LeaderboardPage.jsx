import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LeaderboardPage.module.css'

const FlameIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
  </svg>
)

const TrophyIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
)

const ClockIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const BookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)

const BackIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

const CrownIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20h20v-3H2v3zm2-5l4-8 4 4 4-6 4 10H4z"/>
  </svg>
)

const USERS = [
  { id: 1,  name: 'Alexandra K.',  avatar: 'AK', streak: 87,  readingTime: 312, pages: 8940, isCurrentUser: false },
  { id: 2,  name: 'Marcus Chen',   avatar: 'MC', streak: 72,  readingTime: 289, pages: 7820, isCurrentUser: false },
  { id: 3,  name: 'Sofia Navarro', avatar: 'SN', streak: 65,  readingTime: 241, pages: 6590, isCurrentUser: false },
  { id: 4,  name: 'James Wright',  avatar: 'JW', streak: 54,  readingTime: 198, pages: 5430, isCurrentUser: false },
  { id: 5,  name: 'Priya Sharma',  avatar: 'PS', streak: 48,  readingTime: 176, pages: 4980, isCurrentUser: false },
  { id: 6,  name: 'Luca Romano',   avatar: 'LR', streak: 41,  readingTime: 154, pages: 4320, isCurrentUser: false },
  { id: 7,  name: 'You',           avatar: 'ME', streak: 35,  readingTime: 132, pages: 3760, isCurrentUser: true  },
  { id: 8,  name: 'Emma Fischer',  avatar: 'EF', streak: 29,  readingTime: 118, pages: 3210, isCurrentUser: false },
  { id: 9,  name: 'Noah Petrov',   avatar: 'NP', streak: 22,  readingTime: 94,  pages: 2680, isCurrentUser: false },
  { id: 10, name: 'Yuki Tanaka',   avatar: 'YT', streak: 17,  readingTime: 78,  pages: 2140, isCurrentUser: false },
]

const TABS = [
  { id: 'streak',      label: 'Streak',       Icon: FlameIcon, key: 'streak',      unit: 'days', accentColor: '#ff6b35', accentGlow: 'rgba(255,107,53,0.35)' },
  { id: 'time',        label: 'Reading Time', Icon: ClockIcon, key: 'readingTime', unit: 'hrs',  accentColor: '#38bdf8', accentGlow: 'rgba(56,189,248,0.35)'  },
  { id: 'pages',       label: 'Pages Read',   Icon: BookIcon,  key: 'pages',       unit: 'pp',   accentColor: '#a78bfa', accentGlow: 'rgba(167,139,250,0.35)' },
]

const MEDAL = [
  { gradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', glow: 'rgba(251,191,36,0.45)',  ringColor: 'rgba(251,191,36,0.5)'  },
  { gradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)', glow: 'rgba(203,213,225,0.35)', ringColor: 'rgba(203,213,225,0.4)' },
  { gradient: 'linear-gradient(135deg, #fb923c 0%, #b45309 100%)', glow: 'rgba(251,146,60,0.35)',  ringColor: 'rgba(251,146,60,0.4)'  },
]

const fmtVal = (v, unit) => unit === 'pp' ? v.toLocaleString() : v

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('streak')
  const [visible, setVisible]     = useState(false)

  const tab         = TABS.find(t => t.id === activeTab)
  const sorted      = [...USERS].sort((a, b) => b[tab.key] - a[tab.key])
  const maxVal      = sorted[0][tab.key]

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    return () => cancelAnimationFrame(id)
  }, [activeTab])

  return (
    <div className={styles.root}>
      <div className={styles.meshBg} />
      <div className={styles.orb} style={{ '--c': tab.accentColor }} />
      <div className={styles.orb2} />

      {/* ── Header ── */}
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/home')}>
          <BackIcon />Back
        </button>

        <div className={styles.headerCenter}>
          <span className={styles.trophyIcon} style={{ color: '#fbbf24', filter: `drop-shadow(0 0 10px ${tab.accentGlow})` }}>
            <TrophyIcon size={30} />
          </span>
          <div>
            <h1 className={styles.pageTitle}>Leaderboard</h1>
            <p className={styles.pageSub}>Top readers this month</p>
          </div>
        </div>

        <div style={{ width: 90 }} />
      </header>

      {/* ── Tabs ── */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabActive : ''}`}
            style={activeTab === t.id ? {
              borderColor: `${t.accentColor}55`,
              boxShadow: `0 0 18px ${t.accentGlow}`,
              color: t.accentColor,
            } : {}}
            onClick={() => setActiveTab(t.id)}
          >
            <span style={{ display: 'flex', color: activeTab === t.id ? t.accentColor : 'inherit' }}>
              <t.Icon size={14} />
            </span>
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>

        {/* ── Podium ── */}
        <div className={`${styles.podium} ${visible ? styles.podiumIn : ''}`}>

          {/* Silver — 2nd */}
          <div className={`${styles.podCard} ${styles.pod2}`} style={{ transitionDelay: '120ms' }}>
            <div className={styles.podRank} style={{ background: MEDAL[1].gradient, boxShadow: `0 4px 16px ${MEDAL[1].glow}` }}>2</div>
            <div className={styles.podAvatar} style={{ borderColor: MEDAL[1].ringColor }}>
              {sorted[1]?.avatar}
            </div>
            <div className={styles.podName}>{sorted[1]?.name}</div>
            <div className={styles.podStat} style={{ color: '#94a3b8' }}>
              {fmtVal(sorted[1]?.[tab.key], tab.unit)}<span className={styles.podUnit}> {tab.unit}</span>
            </div>
            <div className={styles.podBase} style={{ height: 60, background: 'linear-gradient(180deg, rgba(148,163,184,.14), transparent)' }} />
          </div>

          {/* Gold — 1st */}
          <div className={`${styles.podCard} ${styles.pod1}`} style={{ transitionDelay: '0ms' }}>
            <span className={styles.crown}><CrownIcon size={22} /></span>
            <div className={styles.podRank} style={{ background: MEDAL[0].gradient, boxShadow: `0 4px 20px ${MEDAL[0].glow}`, width: 46, height: 46, fontSize: 20 }}>1</div>
            <div className={styles.podAvatar} style={{
              width: 76, height: 76, fontSize: 22,
              borderColor: MEDAL[0].ringColor,
              boxShadow: `0 0 28px ${MEDAL[0].glow}`,
            }}>
              {sorted[0]?.avatar}
            </div>
            <div className={styles.podName} style={{ fontSize: 15, fontWeight: 700 }}>{sorted[0]?.name}</div>
            <div className={styles.podStat} style={{ color: '#fbbf24', fontSize: 22, fontWeight: 800 }}>
              {fmtVal(sorted[0]?.[tab.key], tab.unit)}<span className={styles.podUnit} style={{ fontSize: 12 }}> {tab.unit}</span>
            </div>
            <div className={styles.podBase} style={{ height: 88, background: 'linear-gradient(180deg, rgba(251,191,36,.18), transparent)' }} />
          </div>

          {/* Bronze — 3rd */}
          <div className={`${styles.podCard} ${styles.pod3}`} style={{ transitionDelay: '200ms' }}>
            <div className={styles.podRank} style={{ background: MEDAL[2].gradient, boxShadow: `0 4px 16px ${MEDAL[2].glow}` }}>3</div>
            <div className={styles.podAvatar} style={{ borderColor: MEDAL[2].ringColor }}>
              {sorted[2]?.avatar}
            </div>
            <div className={styles.podName}>{sorted[2]?.name}</div>
            <div className={styles.podStat} style={{ color: '#fb923c' }}>
              {fmtVal(sorted[2]?.[tab.key], tab.unit)}<span className={styles.podUnit}> {tab.unit}</span>
            </div>
            <div className={styles.podBase} style={{ height: 44, background: 'linear-gradient(180deg, rgba(251,146,60,.14), transparent)' }} />
          </div>
        </div>

        {/* ── Rankings list ── */}
        <div className={styles.card}>
          <div className={styles.cardHead}>All Rankings</div>
          <ul className={styles.list}>
            {sorted.map((u, i) => {
              const pct = Math.round((u[tab.key] / maxVal) * 100)
              const isTop3 = i < 3
              return (
                <li
                  key={u.id}
                  className={`${styles.row} ${u.isCurrentUser ? styles.meRow : ''} ${visible ? styles.rowIn : ''}`}
                  style={{ transitionDelay: `${i * 55}ms` }}
                >
                  <div className={styles.rankCell}>
                    {isTop3 ? (
                      <span className={styles.medal} style={{ background: MEDAL[i].gradient, boxShadow: `0 2px 10px ${MEDAL[i].glow}` }}>
                        {i + 1}
                      </span>
                    ) : (
                      <span className={styles.rankNum}>{i + 1}</span>
                    )}
                  </div>

                  <div
                    className={styles.avatar}
                    style={{
                      borderColor: u.isCurrentUser ? tab.accentColor : (isTop3 ? MEDAL[i].ringColor : 'transparent'),
                      boxShadow: u.isCurrentUser ? `0 0 14px ${tab.accentGlow}` : 'none',
                    }}
                  >
                    {u.avatar}
                    {u.isCurrentUser && <span className={styles.activeDot} style={{ background: tab.accentColor }} />}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.uname}>
                      {u.name}
                      {u.isCurrentUser && (
                        <span className={styles.youBadge} style={{ color: tab.accentColor, background: `${tab.accentColor}18`, borderColor: `${tab.accentColor}44` }}>
                          You
                        </span>
                      )}
                    </div>
                    <div className={styles.track}>
                      <div
                        className={styles.fill}
                        style={{
                          width: visible ? `${pct}%` : '0%',
                          background: isTop3
                            ? MEDAL[i].gradient
                            : `linear-gradient(90deg, ${tab.accentColor}cc, ${tab.accentColor}44)`,
                          transitionDelay: `${i * 55 + 220}ms`,
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.valCell}>
                    <span
                      className={styles.valNum}
                      style={{ color: isTop3 ? ['#fbbf24','#94a3b8','#fb923c'][i] : tab.accentColor }}
                    >
                      {fmtVal(u[tab.key], tab.unit)}
                    </span>
                    <span className={styles.valUnit}>{tab.unit}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

      </div>
    </div>
  )
}

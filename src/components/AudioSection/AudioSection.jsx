import { useState } from 'react'
import styles from './AudioSection.module.css'

export const AUDIO_BOOKS = [
  { id: 'ab1', type: 'audiobook', title: 'Atomic Habits', author: 'James Clear', duration: '5h 42m', totalSeconds: 20520, c1: '#0f2818', c2: '#1e5c38', accent: '#7cb97a', category: 'Self-Help' },
  { id: 'ab2', type: 'audiobook', title: 'Sapiens', author: 'Yuval Noah Harari', duration: '15h 17m', totalSeconds: 55020, c1: '#0f0f28', c2: '#1e2050', accent: '#7a8eca', category: 'History' },
  { id: 'ab3', type: 'audiobook', title: 'The Alchemist', author: 'Paulo Coelho', duration: '4h 21m', totalSeconds: 15660, c1: '#280f0f', c2: '#5c2020', accent: '#ca7a7a', category: 'Fiction' },
  { id: 'ab4', type: 'audiobook', title: 'Dune', author: 'Frank Herbert', duration: '21h 02m', totalSeconds: 75720, c1: '#1e1205', c2: '#4a2e0a', accent: '#d4a44a', category: 'Sci-Fi' },
  { id: 'ab5', type: 'audiobook', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', duration: '20h 02m', totalSeconds: 72120, c1: '#0f0f14', c2: '#282836', accent: '#9a9aca', category: 'Psychology' },
]

export const PODCASTS = [
  { id: 'p1', type: 'podcast', title: 'The Tim Ferriss Show', author: 'Tim Ferriss', duration: '1h 23m', totalSeconds: 4980, c1: '#0a2815', c2: '#165c30', accent: '#7cb97a', ep: 'Ep. 720' },
  { id: 'p2', type: 'podcast', title: 'How I Built This', author: 'Guy Raz', duration: '58m', totalSeconds: 3480, c1: '#1a082a', c2: '#3c1858', accent: '#b07ac5', ep: 'Ep. 542' },
  { id: 'p3', type: 'podcast', title: 'Lex Fridman Podcast', author: 'Lex Fridman', duration: '2h 45m', totalSeconds: 9900, c1: '#080818', c2: '#12182e', accent: '#6a92c5', ep: 'Ep. 456' },
  { id: 'p4', type: 'podcast', title: 'The Daily', author: 'Michael Barbaro', duration: '25m', totalSeconds: 1500, c1: '#1e0808', c2: '#3c1010', accent: '#c56a6a', ep: 'Ep. 1823' },
  { id: 'p5', type: 'podcast', title: 'Stuff You Should Know', author: 'Josh & Chuck', duration: '1h 10m', totalSeconds: 4200, c1: '#081808', c2: '#103810', accent: '#6ab06a', ep: 'Ep. 1231' },
]

const WaveformBars = ({ accent }) => (
  <div className={styles.waveform}>
    {[5, 9, 13, 7, 17, 11, 15, 5, 9, 13, 7, 15].map((h, i) => (
      <div key={i} className={styles.waveBar} style={{ height: `${h}px`, background: accent }} />
    ))}
  </div>
)

const AudioBookCard = ({ item, onPlay }) => (
  <div className={styles.card} onClick={() => onPlay(item, AUDIO_BOOKS)}>
    <div className={styles.audioCover} style={{ background: `linear-gradient(145deg, ${item.c1} 0%, ${item.c2} 100%)` }}>
      <div className={styles.coverFrame} style={{ borderColor: `${item.accent}30` }} />
      <div className={styles.coverInitials} style={{ color: item.accent }}>
        {item.title.split(' ').slice(0, 2).map(w => w[0]).join('')}
      </div>
      <div className={styles.playOverlay}>
        <div className={styles.playBtn} style={{ background: `${item.accent}22`, borderColor: `${item.accent}80` }}>
          <svg viewBox="0 0 24 24" fill={item.accent} width="18" height="18">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className={styles.coverMeta}>
        <span className={styles.durationBadge}>{item.duration}</span>
      </div>
    </div>
    <div className={styles.cardText}>
      <span className={styles.cardCategory}>{item.category}</span>
      <h4 className={styles.cardTitle}>{item.title}</h4>
      <p className={styles.cardAuthor}>{item.author}</p>
    </div>
  </div>
)

const PodcastCard = ({ item, onPlay }) => (
  <div className={styles.card} onClick={() => onPlay(item, PODCASTS)}>
    <div className={styles.podcastCover} style={{ background: `linear-gradient(145deg, ${item.c1} 0%, ${item.c2} 100%)` }}>
      <div className={styles.podcastRingOuter} style={{ borderColor: `${item.accent}18` }} />
      <div className={styles.podcastRingInner} style={{ borderColor: `${item.accent}28` }} />
      <div className={styles.podcastMicIcon} style={{ background: `${item.accent}18`, borderColor: `${item.accent}50` }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="1.5" width="22" height="22" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      </div>
      <WaveformBars accent={item.accent} />
      <div className={styles.playOverlay}>
        <div className={styles.playBtn} style={{ background: `${item.accent}22`, borderColor: `${item.accent}80` }}>
          <svg viewBox="0 0 24 24" fill={item.accent} width="18" height="18">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className={styles.coverMeta}>
        <span className={styles.durationBadge}>{item.duration}</span>
      </div>
    </div>
    <div className={styles.cardText}>
      <span className={styles.cardCategory}>{item.ep}</span>
      <h4 className={styles.cardTitle}>{item.title}</h4>
      <p className={styles.cardAuthor}>{item.author}</p>
    </div>
  </div>
)

const AudioSection = ({ onPlay }) => {
  const [activeTab, setActiveTab] = useState('audiobooks')
  const items = activeTab === 'audiobooks' ? AUDIO_BOOKS : PODCASTS

  return (
    <section className={styles.section}>
      <div className={styles.topRow}>
        <div className={styles.headerGroup}>
          <p className={styles.sectionLabel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12" style={{ marginRight: 6, flexShrink: 0 }}>
              <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            Listen &amp; Learn
          </p>
          <h2 className={styles.heading}>
            {activeTab === 'audiobooks' ? 'Audio Books' : 'Podcasts'}
          </h2>
        </div>

        <div className={styles.rightControls}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'audiobooks' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('audiobooks')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Audio Books
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'podcasts' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('podcasts')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
              Podcasts
            </button>
          </div>
          <button className={styles.viewAllBtn}>
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.track}>
        <div className={styles.trackInner}>
          {items.map(item =>
            item.type === 'audiobook'
              ? <AudioBookCard key={item.id} item={item} onPlay={onPlay} />
              : <PodcastCard key={item.id} item={item} onPlay={onPlay} />
          )}
        </div>
      </div>
    </section>
  )
}

export default AudioSection

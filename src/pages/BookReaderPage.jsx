import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './BookReaderPage.module.css'

const readableBooks = [
  {
    id: 2,
    title: 'Deep Work',
    author: 'Cal Newport',
    coverColor: 'purple',
    genre: 'Productivity',
    chapters: [
      {
        id: 1,
        title: 'Deep Work Is Valuable',
        content: [
          "The economy is changing beneath our feet. Thanks to increasing automation and the democratization of intelligent machines, many once-lucrative jobs are now hollow or extinct. The winners in this new economy—and there are extraordinary winners—tend to cluster around two particular core abilities: the skill to quickly master hard things, and the capacity to produce at an elite level, in terms of both quality and speed.",
          "These two core abilities—mastering hard things quickly and producing at an elite level—depend on your capacity to perform what I call deep work: professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate.",
          "Deep work is not some nostalgic skill from an analog age. It is a necessity in the modern knowledge economy. Consider the experience of a master programmer like Bill Gates, who spent a feverish seven-week period in his early years writing a BASIC interpreter for the Altair microcomputer. Or think of a theoretical physicist like Richard Feynman, who was legendary for retreating into periods of total isolation when working on a difficult problem. What these individuals share is not simply raw intelligence—it is the capacity to focus without fracture.",
          "The term 'deep work' stands in contrast to what I call shallow work: noncognitively demanding, logistical-style tasks, often performed while distracted. These efforts tend not to create much new value in the world and are easy to replicate. Our current culture has accidentally elevated this latter category to a position of undeserved prominence. Email, social media, instant messaging, open offices, multitasking—all are treated as markers of productivity. They are, in most cases, the opposite.",
          "This book is organized into two parts. The first makes the case that the deep work hypothesis is true: deep work is valuable, rare, and meaningful. The second presents a rigorous training regimen for transforming your mind and habits in ways that will maximize the amount of deep work you perform. This is the right strategy for knowledge workers navigating the complexities of the twenty-first-century economy.",
        ],
      },
      {
        id: 2,
        title: 'Deep Work Is Rare',
        content: [
          "If deep work is so important, you might wonder why it seems to be increasingly rare. The answer lies in the culture of the modern knowledge workplace—a culture that, through a series of unfortunate incentives, has come to prize shallow work and constant connectivity above concentrated effort.",
          "Open office plans were introduced with the sincere belief that physical proximity would accelerate collaboration and innovation. The reality has been less inspiring. Research on the topic is damning: open offices decrease collaboration among employees and increase absenteeism, physical and psychological illness, and staff turnover. More relevant to our purposes, they destroy concentration. Knowledge workers can spend as little as three days a week doing their primary job functions; the rest is consumed by interruption and reactive work.",
          "There is a simpler explanation for why businesses default to shallow work: it is easy to observe and therefore easy to measure. When a manager can see employees typing emails, attending meetings, and responding instantly to messages, she can convince herself that productivity is happening. Deep work, by contrast, is invisible. It happens in silence, over long uninterrupted stretches, and its outputs may not materialize for days or weeks.",
          "This creates what I call the Principle of Least Resistance: in a business setting, without clear feedback on the impact of various behaviors to the bottom line, we tend to do whatever is easiest in the moment. For most knowledge workers in most office environments, the path of least resistance is to stay busy with shallow activities—to respond to messages instantly, to fill calendars with meetings, to look productive while avoiding the hard, lonely work of thinking.",
          "The scarcity of deep work in the modern economy is precisely what makes it so valuable. Like any scarce resource in high demand, it commands a premium. Those who can reliably produce valuable output through deep concentration will find themselves increasingly indispensable as the world continues to automate and commoditize shallower cognitive tasks.",
        ],
      },
      {
        id: 3,
        title: 'Deep Work Is Meaningful',
        content: [
          "We have so far discussed deep work from the perspective of productivity and economics. But there is another dimension to this practice—one that is, perhaps, more fundamental. Deep work is not merely a strategy for professional success. It is a path toward meaning in an age that has made meaning increasingly hard to find.",
          "The neuroscientist Daniel Levitin has documented the extraordinary metabolic cost of task-switching. Each time we divert our attention—each time we check email, glance at social media, or respond to a notification—we consume limited quantities of cognitive resources, leaving less available for the sustained thinking that actually matters. The constant fracturing of attention is not merely annoying. It is cognitively and emotionally exhausting.",
          "Psychologist Mihaly Csikszentmihalyi spent decades studying what he called 'optimal experience'—those moments when people feel most alive, most engaged, most themselves. He found that these experiences arise, with remarkable consistency, during periods of deep absorption in challenging work. He called this state 'flow.' It is not the same as happiness; it is something richer and more sustaining.",
          "Winifred Gallagher, in her book Rapt, summarizes years of research on the phenomenology of attention with a simple thesis: 'Who you are, what you think, feel, and do, what you love—is the sum of what you focus on.' If you spend your hours chasing distractions, those fragmented, reactive experiences constitute your life. If instead you fill your hours with focused, meaningful work, those deep and attentive experiences are what you become.",
          "The medieval craftsmen who built the great cathedrals of Europe often lavished extraordinary care on interior decorative elements that no one would ever see—hidden alcoves, high rafters, spaces behind altarpieces. When asked why they bothered, they had a simple answer: God would see. Whether or not one shares their theology, the attitude illuminates something profound about the relationship between focused craft, meaning, and identity. Deep work is not, at its root, a productivity hack. It is a way of being human.",
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverColor: 'teal',
    genre: 'Sci-Fi',
    chapters: [
      {
        id: 1,
        title: 'What the Hell?',
        content: [
          "What's two plus two?",
          "The question surfaces in my mind before I'm fully awake, before I know where I am or who I am. Just the pure, clean architecture of the problem: two plus two. The answer comes without hesitation. Four. Good. That's something.",
          "I open my eyes to dim blue light. The room is small and cylindrical—about the size of a walk-in closet—with padded walls and a ceiling low enough that I instinctively tense before realizing I have plenty of clearance. My body feels wrong in the specific way of someone who has slept too long and too hard. Muscles protest. Joints resist. There's a headache brewing at the base of my skull.",
          "My name is Ryland Grace. That comes back to me in a rush of relief that is immediately followed by a rush of confusion, because knowing my name is essentially all I've got. Everything else—where I am, why I'm here, what I'm supposed to do—is gone, as though someone reached into my skull and carefully extracted those specific files.",
          "I sit up slowly. Two other beds occupy the room. The people in them are motionless in a way I don't examine too carefully. I note them. I move on. The soft blue light pulses from strips embedded in the walls, suggesting emergency power, and through a porthole the size of a dinner plate I can see nothing but a spectacular density of stars.",
          "This is, I understand, not good. But I don't yet know how not-good it is, and until I do, panic seems like a waste of energy. I look for something that tells me what has happened. I look for a way to understand what comes next.",
        ],
      },
      {
        id: 2,
        title: 'The Long Way Home',
        content: [
          "Memory returns in shards. Not all at once—the brain doesn't work that way—but in pieces, each one arriving without context, like photographs from someone else's life.",
          "I was a teacher. Middle school science, eighth grade, in a school somewhere in California that I can picture clearly but cannot name. I remember the smell of the place: chalk and hand sanitizer and the particular industrial cleanliness of a school cafeteria. I remember a class of thirty-two students, their faces blurring together except for a girl in the front row who always had more questions than time allowed.",
          "I remember a phone call. A car arriving at my house at an unreasonable hour. Men in suits who spoke in the careful, neutral way of people who are terrified and trying not to show it. And something about the sun—something wrong with the sun—but the details remain stubbornly out of reach.",
          "The instruments on the wall display numbers I can't yet interpret. Some screens are dark; others pulse with data. There is no obvious map. No label saying 'You Are Here' with a helpful star. I find a food pouch in a cabinet below the beds and drink it without tasting. Whatever it contains, my body welcomes it with embarrassing desperation.",
          "Outside the porthole, the stars do not move. We are not in orbit around anything—or if we are, the orbital period is enormous. The stars are not the stars I know; the constellations are wrong, subtly wrong, in a way that suggests significant distance traveled.",
          "I should be more frightened than I am. Perhaps the mechanism for appropriate fear is still rebooting. Or perhaps, at some level beneath conscious thought, I already know what I am here to do, and that knowledge is steadying me. I don't know. I search my memory and find only more shards.",
        ],
      },
      {
        id: 3,
        title: 'Rocky',
        content: [
          "The tapping started while I was asleep.",
          "It pulled me up from whatever dreams I'd been having—fragments of a classroom, a whiteboard, a question I couldn't answer—into the blue-lit reality of the ship. Three knocks. A pause. Three knocks. I lay still and listened, telling myself it was thermal expansion, the metal hull contracting in the cold of space. I had read about that somewhere. It was perfectly normal.",
          "The pattern came again. Three-three-three. Rhythmic. Deliberate. Not thermal expansion.",
          "I pressed my face to the porthole. Outside, among the stars, something moved. It was large—bus-sized, roughly—and asymmetric in the way of things assembled by intelligence rather than formed by physics. Its surface was covered in structures I couldn't classify from this distance. As I watched, it oriented itself toward me with a precision that ruled out coincidence. Smooth, controlled, intentional.",
          "Three lights on its surface pulsed in sequence. Three-three-three.",
          "I pressed my palm flat against the cold glass. My heart was very loud. After a long moment, I knocked on the hull—three times, three times, three times—and waited.",
          "The lights pulsed back.",
          "'Hello,' I said to the empty room, though I meant the word for the thing outside. I didn't know what it was. I didn't know where it came from or what it wanted or whether 'wanted' was even a concept that applied to it. What I knew was this: it was not nothing. It had found me—or found this ship—and it was saying hello. And for the first time since waking up alone in the dark, I felt something that was not fear. I felt, improbably, the first green shoots of hope.",
        ],
      },
    ],
  },
]

const coverGradients = {
  green: 'linear-gradient(145deg, #7cb97a 0%, #4a8f48 60%, #2d6b2b 100%)',
  purple: 'linear-gradient(145deg, #b0acda 0%, #8880b8 60%, #5e5890 100%)',
  dark: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 60%, #0d0d0d 100%)',
  orange: 'linear-gradient(145deg, #f0bc94 0%, #e8a87c 40%, #c47840 100%)',
  teal: 'linear-gradient(145deg, #7accc8 0%, #4aa8a4 60%, #2d8480 100%)',
}

const fontSizes = [14, 16, 18, 20]

const BookReaderPage = () => {
  const { id } = useParams()
  const book = readableBooks.find((b) => b.id === parseInt(id))

  const [currentChapter, setCurrentChapter] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  const readingAreaRef = useRef(null)

  useEffect(() => {
    const area = readingAreaRef.current
    if (!area) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = area
      const max = scrollHeight - clientHeight
      setScrollProgress(max > 0 ? (scrollTop / max) * 100 : 100)
    }
    area.addEventListener('scroll', handleScroll, { passive: true })
    return () => area.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (readingAreaRef.current) {
      readingAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setScrollProgress(0)
  }, [currentChapter])

  const fontIdx = fontSizes.indexOf(fontSize)

  if (!book) {
    return (
      <div className={styles.notFound}>
        <p className={styles.notFoundIcon}>📚</p>
        <h2 className={styles.notFoundTitle}>This book isn't available for reading</h2>
        <p className={styles.notFoundSub}>Only free books can be read online.</p>
        <Link to="/" className={styles.notFoundBack}>← Back to Home</Link>
      </div>
    )
  }

  const chapter = book.chapters[currentChapter]
  const totalChapters = book.chapters.length
  const overallProgress = Math.round(
    ((currentChapter + (scrollProgress / 100)) / totalChapters) * 100
  )

  return (
    <div
      className={styles.page}
      data-dark={isDark}
      style={{ '--reader-font-size': `${fontSize}px` }}
    >
      {/* Reading progress ribbon */}
      <div className={styles.ribbon} style={{ width: `${overallProgress}%` }} />

      {/* ── Top bar ── */}
      <header className={styles.topBar}>
        <Link to={`/books/${book.id}`} className={styles.backBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="15" height="15">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.backLabel}>Back to Book</span>
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle chapters"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17">
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="3" y1="12" x2="16" y2="12" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        <span className={styles.topTitle}>{book.title}</span>

        <div className={styles.controls}>
          <button
            className={styles.ctrlBtn}
            onClick={() => fontIdx > 0 && setFontSize(fontSizes[fontIdx - 1])}
            disabled={fontIdx === 0}
            title="Decrease font size"
          >
            A−
          </button>
          <button
            className={styles.ctrlBtn}
            onClick={() => fontIdx < fontSizes.length - 1 && setFontSize(fontSizes[fontIdx + 1])}
            disabled={fontIdx === fontSizes.length - 1}
            title="Increase font size"
          >
            A+
          </button>
          <button
            className={styles.themeBtn}
            onClick={() => setIsDark((d) => !d)}
            aria-label="Toggle dark mode"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
                <line x1="12" y1="2" x2="12" y2="4" strokeLinecap="round" />
                <line x1="12" y1="20" x2="12" y2="22" strokeLinecap="round" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
                <line x1="2" y1="12" x2="4" y2="12" strokeLinecap="round" />
                <line x1="20" y1="12" x2="22" y2="12" strokeLinecap="round" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className={styles.layout}>

        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? '' : styles.sidebarHidden}`}>
          <div className={styles.sidebarInner}>

            {/* Mini book cover */}
            <div
              className={styles.bookThumb}
              style={{ background: coverGradients[book.coverColor] }}
            >
              <div className={styles.thumbSpine} />
              <div className={styles.thumbBody}>
                <span className={styles.thumbGenre}>{book.genre}</span>
                <span className={styles.thumbTitle}>{book.title}</span>
                <span className={styles.thumbAuthor}>{book.author}</span>
              </div>
            </div>

            {/* Progress */}
            <div className={styles.progressBox}>
              <div className={styles.progressRow}>
                <span className={styles.progressLabel}>Progress</span>
                <span className={styles.progressPct}>{overallProgress}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            {/* Chapter list */}
            <p className={styles.chapListLabel}>Chapters</p>
            <nav className={styles.chapList}>
              {book.chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  className={`${styles.chapItem} ${idx === currentChapter ? styles.chapActive : ''}`}
                  onClick={() => { setCurrentChapter(idx); if (window.innerWidth < 768) setSidebarOpen(false) }}
                >
                  <span className={styles.chapNum}>{String(idx + 1).padStart(2, '0')}</span>
                  <span className={styles.chapName}>{ch.title}</span>
                  {idx < currentChapter && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11" className={styles.doneIcon}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Reading pane */}
        <main className={styles.reader} ref={readingAreaRef}>
          <article className={styles.article}>

            <header className={styles.chapHeader}>
              <span className={styles.chapEyebrow}>Chapter {currentChapter + 1}</span>
              <h1 className={styles.chapTitle}>{chapter.title}</h1>
              <div className={styles.chapRule} />
            </header>

            <div className={styles.prose} style={{ fontSize: 'var(--reader-font-size)' }}>
              {chapter.content.map((para, i) => (
                <p key={i} className={`${styles.para} ${i === 0 ? styles.paraFirst : ''}`}>
                  {para}
                </p>
              ))}
            </div>

            <footer className={styles.chapNav}>
              <button
                className={styles.navBtn}
                onClick={() => setCurrentChapter((c) => Math.max(0, c - 1))}
                disabled={currentChapter === 0}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Previous</span>
              </button>

              <span className={styles.chapCount}>{currentChapter + 1} / {totalChapters}</span>

              <button
                className={`${styles.navBtn} ${styles.navBtnNext}`}
                onClick={() => setCurrentChapter((c) => Math.min(totalChapters - 1, c + 1))}
                disabled={currentChapter === totalChapters - 1}
              >
                <span>Next Chapter</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </footer>
          </article>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default BookReaderPage

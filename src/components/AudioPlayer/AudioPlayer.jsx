import { useState, useEffect, useRef } from 'react'
import styles from './AudioPlayer.module.css'

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

const AudioPlayer = ({ current, playlist, onClose, onSelectTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [showVolume, setShowVolume] = useState(false)
  const intervalRef = useRef(null)

  const totalSeconds = current?.totalSeconds || 3600
  const currentIndex = playlist ? playlist.findIndex(i => i.id === current?.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = playlist && currentIndex >= 0 && currentIndex < playlist.length - 1

  useEffect(() => {
    setCurrentTime(0)
    setIsPlaying(true)
  }, [current?.id])

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalSeconds) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, totalSeconds])

  if (!current) return null

  const progress = totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setCurrentTime(Math.floor(ratio * totalSeconds))
  }

  const handlePrev = () => {
    if (hasPrev && onSelectTrack) onSelectTrack(playlist[currentIndex - 1])
  }

  const handleNext = () => {
    if (hasNext && onSelectTrack) onSelectTrack(playlist[currentIndex + 1])
  }

  const initials = current.title.split(' ').slice(0, 2).map(w => w[0]).join('')

  return (
    <div className={styles.player}>
      <div className={styles.progressTop}>
        <div className={styles.progressTopFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.inner}>
        {/* Cover thumbnail */}
        <div
          className={styles.thumb}
          style={{ background: `linear-gradient(135deg, ${current.c1} 0%, ${current.c2} 100%)` }}
        >
          <span className={styles.thumbInitials} style={{ color: current.accent }}>
            {initials}
          </span>
        </div>

        {/* Track info */}
        <div className={styles.info}>
          <span className={styles.infoTitle}>{current.title}</span>
          <span className={styles.infoAuthor}>{current.author}</span>
        </div>

        {/* Playback controls */}
        <div className={styles.controls}>
          <button
            className={`${styles.ctrlBtn} ${!hasPrev ? styles.ctrlBtnDisabled : ''}`}
            onClick={handlePrev}
            disabled={!hasPrev}
            title="Previous"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          <button
            className={styles.playPauseBtn}
            onClick={() => setIsPlaying(p => !p)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            className={`${styles.ctrlBtn} ${!hasNext ? styles.ctrlBtnDisabled : ''}`}
            onClick={handleNext}
            disabled={!hasNext}
            title="Next"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M6 18l8.5-6L6 6v12zM16 6h2v12h-2z" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressArea}>
          <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
          <div className={styles.progressBar} onClick={handleProgressClick} role="progressbar">
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
          </div>
          <span className={styles.timeLabel}>{current.duration}</span>
        </div>

        {/* Volume */}
        <div className={styles.volumeArea}>
          <button
            className={styles.ctrlBtn}
            onClick={() => setShowVolume(v => !v)}
            title="Volume"
          >
            {volume === 0 ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          {showVolume && (
            <div className={styles.volumePopup}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className={styles.volumeInput}
                style={{ '--vol': `${volume * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} title="Close player">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer

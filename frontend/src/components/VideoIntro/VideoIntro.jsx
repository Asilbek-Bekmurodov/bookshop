import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './VideoIntro.module.css'

const TOTAL_FRAMES = 145
const FPS = 24
const SCROLL_PER_SEC = 420
const frameUrl = (i) => `/frames/frame${String(i).padStart(4, '0')}.jpg`

const VideoIntro = () => {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentFrameRef = useRef(0)
  const hintRef = useRef(null)
  const progressFillRef = useRef(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // Draw a single frame on canvas with cover sizing
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current
    const img = framesRef.current[index]
    if (!canvas || !img?.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih)
    const dx = (cw - iw * scale) / 2
    const dy = (ch - ih * scale) / 2
    ctx.drawImage(img, dx, dy, iw * scale, ih * scale)
  }, [])

  // Resize canvas to viewport
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(currentFrameRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  // Preload all frames
  useEffect(() => {
    const frames = new Array(TOTAL_FRAMES)
    framesRef.current = frames
    let count = 0

    // Section height is predictable, set immediately
    const duration = TOTAL_FRAMES / FPS
    sectionRef.current && (sectionRef.current.style.height =
      `${window.innerHeight + duration * SCROLL_PER_SEC}px`)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      frames[i] = img
      img.onload = () => {
        count++
        setLoadProgress(count / TOTAL_FRAMES)
        if (i === 0) drawFrame(0)
        if (count === TOTAL_FRAMES) setReady(true)
      }
      img.src = frameUrl(i + 1)
    }
  }, [drawFrame])

  // Scroll → instant frame draw (no seeking, pure canvas)
  useEffect(() => {
    if (!ready) return
    let pendingFrame = null
    let rafId = null

    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const sectionTop = section.offsetTop
      const scrollable = section.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, window.scrollY - sectionTop)
      const prog = Math.min(scrolled / scrollable, 1)
      const idx = Math.min(Math.floor(prog * TOTAL_FRAMES), TOTAL_FRAMES - 1)

      pendingFrame = idx

      if (progressFillRef.current)
        progressFillRef.current.style.width = `${prog * 100}%`
      if (hintRef.current) {
        hintRef.current.style.opacity = scrolled < 60 ? '1' : '0'
        hintRef.current.style.transform =
          `translateX(-50%) translateY(${scrolled < 60 ? 0 : 8}px)`
      }

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (pendingFrame !== null && pendingFrame !== currentFrameRef.current) {
            currentFrameRef.current = pendingFrame
            drawFrame(pendingFrame)
          }
          pendingFrame = null
          rafId = null
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [ready, drawFrame])

  return (
    <section id="video-intro" ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />

        <div className={styles.vignette} />

        {/* Loading overlay */}
        {!ready && (
          <div className={styles.loader} style={{ opacity: ready ? 0 : 1 }}>
            <div className={styles.loaderBar}>
              <div
                className={styles.loaderFill}
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scroll progress */}
        <div className={styles.progressBar}>
          <div ref={progressFillRef} className={styles.progressFill} />
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className={styles.hint}>
          <span className={styles.hintText}>Scroll to explore</span>
          <div className={styles.scrollWheel}>
            <div className={styles.scrollDot} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoIntro

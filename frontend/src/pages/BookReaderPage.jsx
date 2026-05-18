import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import api from '../api/axios'
import styles from './BookReaderPage.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const BookReaderPage = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.2)

  useEffect(() => {
    api.get(`/books/${id}`)
      .then(({ data }) => { setBook(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#c8b89a', background: '#111', minHeight: '100vh' }}>
      Yuklanmoqda...
    </div>
  )

  if (!book || !book.pdfUrl) return (
    <div className={styles.notFound}>
      <p className={styles.notFoundIcon}>📚</p>
      <h2 className={styles.notFoundTitle}>Bu kitob o'qish uchun mavjud emas</h2>
      <p className={styles.notFoundSub}>Faqat PDF yuklangan kitoblarni o'qish mumkin.</p>
      <Link to="/" className={styles.notFoundBack}>← Bosh sahifaga</Link>
    </div>
  )

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh', color: '#c8b89a' }}>
      {/* Top bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#111', borderBottom: '1px solid #2a2a2a', position: 'sticky', top: 0, zIndex: 10 }}>
        <Link to={`/books/${book._id}`} style={{ color: '#c8b89a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          ← {book.title}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setScale(s => Math.max(0.6, s - 0.2))} style={{ background: '#2a2a2a', border: 'none', color: '#c8b89a', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>−</button>
          <span style={{ fontSize: 13 }}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))} style={{ background: '#2a2a2a', border: 'none', color: '#c8b89a', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>+</button>
        </div>
        <span style={{ fontSize: 13 }}>{pageNumber} / {numPages || '…'}</span>
      </header>

      {/* PDF viewer */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 16px' }}>
        <Document
          file={book.pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div style={{ color: '#c8b89a', padding: '2rem' }}>PDF yuklanmoqda...</div>}
          error={<div style={{ color: '#e07070', padding: '2rem' }}>PDF yuklanmadi.</div>}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, padding: '16px', position: 'sticky', bottom: 0, background: '#111', borderTop: '1px solid #2a2a2a' }}>
        <button
          onClick={() => setPageNumber(p => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          style={{ background: '#2a2a2a', border: 'none', color: '#c8b89a', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', opacity: pageNumber <= 1 ? 0.4 : 1 }}
        >
          ← Oldingi
        </button>
        <button
          onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}
          disabled={pageNumber >= (numPages || 1)}
          style={{ background: '#4a8f48', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', opacity: pageNumber >= (numPages || 1) ? 0.4 : 1 }}
        >
          Keyingi →
        </button>
      </div>
    </div>
  )
}

export default BookReaderPage

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './NewArrivals.module.css'
import api from '../../api/axios'

const StarRating = ({ rating }) => (
  <div className={styles.stars}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`${styles.star} ${star <= Math.round(rating) ? styles.starFilled : styles.starEmpty}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
    <span className={styles.ratingNum}>{rating}</span>
  </div>
)

const NewArrivals = () => {
  const [books, setBooks] = useState([])
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    api.get('/books?limit=6').then(({ data }) => setBooks(data)).catch(() => {})
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.sectionLabel}>New Arrivals</p>
          <h2 className={styles.heading}>Fresh off the press</h2>
        </div>
        <button className={styles.viewAllBtn}>
          View All
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.arrowIcon}
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.booksGrid}>
        {books.map((book) => (
          <Link
            to={`/books/${book._id}`}
            key={book._id}
            className={`${styles.bookCard} ${hoveredId === book._id ? styles.bookCardHovered : ''}`}
            onMouseEnter={() => setHoveredId(book._id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className={`${styles.bookCover} ${styles[book.coverColor]}`}>
              <div className={styles.spine} />
              <div className={styles.coverDecorCircle} />
              <div className={styles.coverDecorLine} />
              <div className={styles.coverContent}>
                <span className={styles.coverGenre}>{book.genre}</span>
                <h3 className={styles.coverTitle}>{book.title}</h3>
                <span className={styles.coverAuthor}>{book.author?.name || book.author || ''}</span>
              </div>
              {book.badge && (
                <span className={`${styles.badge} ${styles[`badge${book.badge}`]}`}>
                  {book.badge}
                </span>
              )}
            </div>

            <div className={styles.bookInfo}>
              <h4 className={styles.bookTitle}>{book.title}</h4>
              <p className={styles.bookAuthor}>{book.author?.name || book.author || ''}</p>
              <StarRating rating={book.rating} />
              {book.pdfUrl ? (
                <span className={styles.readBadge}>O'qish mumkin</span>
              ) : (
                <span className={styles.comingSoon}>Tez kunda</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals

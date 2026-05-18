import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import styles from './BookDetailPage.module.css'

const reviewsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: 'March 12, 2024',
    text: 'Absolutely transformative. The way this book breaks down complex ideas with real-world examples made me recognize patterns in my own thinking I had never noticed before. A must-read for anyone serious about improving their decisions.',
    helpful: 47,
    initials: 'SJ',
    avatarColor: '#4a8f48',
  },
  {
    id: 2,
    name: 'Marcus Chen',
    rating: 4,
    date: 'February 28, 2024',
    text: 'Dense with insights and incredibly well-researched. Some chapters felt repetitive but the core ideas are genuinely useful. Changed how I approach decision-making in my daily work and personal life.',
    helpful: 31,
    initials: 'MC',
    avatarColor: '#5e5890',
  },
  {
    id: 3,
    name: 'Elena Petrov',
    rating: 5,
    date: 'January 15, 2024',
    text: 'One of those rare books that rewards rereading. Each time I return I find something new. The writing is precise without being dry, and the examples are perfectly chosen for every kind of reader.',
    helpful: 62,
    initials: 'EP',
    avatarColor: '#c47840',
  },
]

const StarRating = ({ rating, size }) => (
  <div className={`${styles.stars} ${size === 'sm' ? styles.starsSm : ''}`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`${styles.star} ${star <= Math.round(rating) ? styles.starFilled : styles.starEmpty}`}
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
)

const BookDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/books/${id}`)
      .then(({ data }) => { setBook(data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [id])

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#c8b89a' }}>Yuklanmoqda...</div>
  if (!book) return <div style={{ padding: '4rem', textAlign: 'center', color: '#c8b89a' }}>Kitob topilmadi</div>

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbInner}>
          <Link to="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbGenre}>{book.genre}</span>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{book.title}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        {/* Left: Cover */}
        <div className={styles.coverCol}>
          <div className={styles.coverStage}>
            <div className={`${styles.bookCover} ${styles[book.coverColor]}`}>
              <div className={styles.spine} />
              <div className={styles.coverDecorCircle} />
              <div className={styles.coverDecorLine} />
              <div className={styles.coverContent}>
                <span className={styles.coverGenre}>{book.genre}</span>
                <h3 className={styles.coverTitle}>{book.title}</h3>
                <span className={styles.coverAuthor}>{book.author?.name || book.author}</span>
              </div>
              {book.badge && (
                <span className={`${styles.badge} ${styles['badge' + book.badge]}`}>
                  {book.badge}
                </span>
              )}
            </div>
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Publisher</span>
              <span className={styles.metaValue}>{book.publisher}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Year</span>
              <span className={styles.metaValue}>{book.year}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Pages</span>
              <span className={styles.metaValue}>{book.pages}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Language</span>
              <span className={styles.metaValue}>{book.language}</span>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className={styles.infoCol}>
          <span className={styles.genreTag}>{book.genre}</span>

          <h1 className={styles.bookTitle}>{book.title}</h1>
          <p className={styles.bookAuthor}>
            by <span className={styles.authorName}>{book.author?.name || book.author}</span>
          </p>

          <div className={styles.ratingRow}>
            <StarRating rating={book.rating} />
            <span className={styles.ratingScore}>{book.rating}</span>
            <span className={styles.ratingCount}>
              ({(book.reviews ?? 0).toLocaleString()} reviews)
            </span>
          </div>

          <hr className={styles.divider} />

          <p className={styles.description}>{book.description}</p>

          <hr className={styles.divider} />

          <div className={styles.actionRow}>
            {book.pdfUrl ? (
              <button
                className={styles.readBtn}
                onClick={() => navigate(`/books/${book._id}/read`)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.btnIcon}>
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Kitobni o'qish
              </button>
            ) : (
              <span className={styles.comingSoon}>Tez kunda</span>
            )}

            <button
              className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <svg viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className={styles.btnIcon}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isWishlisted ? 'Saralangan' : 'Saralagichga'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className={styles.reviewsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Community</p>
              <h2 className={styles.sectionHeading}>Reader Reviews</h2>
            </div>
            <div className={styles.ratingOverview}>
              <span className={styles.bigRating}>{book.rating}</span>
              <div>
                <StarRating rating={book.rating} />
                <p className={styles.totalReviews}>
                  {(book.reviews ?? 0).toLocaleString()} reviews
                </p>
              </div>
            </div>
          </div>

          <div className={styles.reviewsGrid}>
            {reviewsData.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <header className={styles.reviewHeader}>
                  <div
                    className={styles.avatar}
                    style={{ background: review.avatarColor }}
                  >
                    {review.initials}
                  </div>
                  <div className={styles.reviewerMeta}>
                    <span className={styles.reviewerName}>{review.name}</span>
                    <span className={styles.reviewDate}>{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </header>
                <p className={styles.reviewText}>"{review.text}"</p>
                <footer className={styles.reviewFooter}>
                  <button className={styles.helpfulBtn}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="13"
                      height="13"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    Helpful ({review.helpful})
                  </button>
                </footer>
              </article>
            ))}
          </div>

          {/* Write a review */}
          <div className={styles.writeReview}>
            <h3 className={styles.writeReviewTitle}>Share Your Thoughts</h3>
            <div className={styles.rateRow}>
              <span className={styles.rateLabel}>Your rating:</span>
              <div className={styles.interactiveStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`${styles.star} ${styles.starLg} ${star <= (hoveredStar || userRating) ? styles.starFilled : styles.starEmpty}`}
                    viewBox="0 0 24 24"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setUserRating(star)}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <textarea
              className={styles.reviewTextarea}
              placeholder="What did you think of this book?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
            />
            <button className={styles.submitReview}>Submit Review</button>
          </div>
        </div>
      </section>

      {/* ── Similar Books ── */}
      <section className={styles.similarSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>Discover More</p>
              <h2 className={styles.sectionHeading}>Similar Books</h2>
            </div>
            <Link to="/" className={styles.viewAllBtn}>
              View All
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.arrowIcon}
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className={styles.similarGrid}>
            {/* Similar books loaded from backend in a future enhancement */}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookDetailPage

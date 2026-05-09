import { useState } from 'react'
import styles from './NewArrivals.module.css'

const books = [
  {
    id: 1,
    title: 'The Art of Thinking Clearly',
    author: 'Rolf Dobelli',
    rating: 4.8,
    reviews: 2341,
    price: 24.99,
    originalPrice: 34.99,
    badge: 'Bestseller',
    coverColor: 'green',
    genre: 'Philosophy',
  },
  {
    id: 2,
    title: 'Deep Work',
    author: 'Cal Newport',
    rating: 4.9,
    reviews: 5234,
    price: 19.99,
    originalPrice: null,
    badge: 'New',
    coverColor: 'purple',
    genre: 'Productivity',
  },
  {
    id: 3,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    rating: 4.7,
    reviews: 8901,
    price: 22.99,
    originalPrice: 29.99,
    badge: 'New',
    coverColor: 'dark',
    genre: 'Fiction',
  },
  {
    id: 4,
    title: 'Atomic Habits',
    author: 'James Clear',
    rating: 4.9,
    reviews: 12500,
    price: 27.99,
    originalPrice: null,
    badge: 'Trending',
    coverColor: 'orange',
    genre: 'Self-Help',
  },
  {
    id: 5,
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    rating: 4.8,
    reviews: 6789,
    price: 18.99,
    originalPrice: 25.99,
    badge: 'New',
    coverColor: 'teal',
    genre: 'Sci-Fi',
  },
]

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
  const [hoveredId, setHoveredId] = useState(null)

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
          <div
            key={book.id}
            className={`${styles.bookCard} ${hoveredId === book.id ? styles.bookCardHovered : ''}`}
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className={`${styles.bookCover} ${styles[book.coverColor]}`}>
              <div className={styles.spine} />
              <div className={styles.coverDecorCircle} />
              <div className={styles.coverDecorLine} />
              <div className={styles.coverContent}>
                <span className={styles.coverGenre}>{book.genre}</span>
                <h3 className={styles.coverTitle}>{book.title}</h3>
                <span className={styles.coverAuthor}>{book.author}</span>
              </div>
              {book.badge && (
                <span className={`${styles.badge} ${styles[`badge${book.badge}`]}`}>
                  {book.badge}
                </span>
              )}
            </div>

            <div className={styles.bookInfo}>
              <h4 className={styles.bookTitle}>{book.title}</h4>
              <p className={styles.bookAuthor}>{book.author}</p>
              <StarRating rating={book.rating} />
              <div className={styles.priceRow}>
                <span className={styles.price}>${book.price}</span>
                {book.originalPrice && (
                  <span className={styles.originalPrice}>${book.originalPrice}</span>
                )}
              </div>
              <button className={styles.addToCart}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrivals

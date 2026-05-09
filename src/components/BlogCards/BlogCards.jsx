import styles from './BlogCards.module.css'
import blog1 from '../../assets/blog1.jpg'
import blog2 from '../../assets/blog2.jpg'
import blog3 from '../../assets/blog3.jpg'

const blogPosts = [
  {
    id: 1,
    image: blog1,
    date: '',
    title: 'Have you choosen a good book?',
    featured: true,
  },
  {
    id: 2,
    image: blog2,
    date: 'Blog - 12/21',
    title: 'Wher do you want to go today? find it in a book',
    featured: false,
  },
  {
    id: 3,
    image: blog3,
    date: 'Blog - 12/21',
    title: 'Give the gift of love - read to someone',
    featured: false,
  },
]

const BlogCards = () => {
  const featured = blogPosts.find((post) => post.featured)
  const smallCards = blogPosts.filter((post) => !post.featured)

  return (
    <section className={styles.blogSection}>
      <p className={styles.sectionLabel}>New Arrived</p>
      <div className={styles.cardsGrid}>
        {featured && (
          <div className={styles.featuredCard}>
            <img src={featured.image} alt={featured.title} className={styles.featuredImage} />
            <h3 className={styles.featuredTitle}>{featured.title}</h3>
          </div>
        )}

        {smallCards.map((card) => (
          <div key={card.id} className={styles.smallCard}>
            <img src={card.image} alt={card.title} className={styles.cardImage} />
            <p className={styles.cardMeta}>{card.date}</p>
            <h4 className={styles.cardTitle}>{card.title}</h4>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BlogCards

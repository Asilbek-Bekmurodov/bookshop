import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import styles from './AdminDashboard.module.css'

/* ── Icons ─────────────────────────────────────────────────── */
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ChevronDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const UserSingleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const BookStatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const TagStatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)
const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

/* ── Mock Data ─────────────────────────────────────────────── */
const INIT_BOOKS = [
  { id:1, title:'The Great Gatsby',       author:'F. Scott Fitzgerald', category:'Fiction',     price:'$12.99', rating:4.8, stock:45 },
  { id:2, title:'Sapiens',                author:'Yuval Noah Harari',   category:'History',     price:'$15.99', rating:4.9, stock:32 },
  { id:3, title:'Atomic Habits',          author:'James Clear',          category:'Self-Help',   price:'$14.99', rating:4.9, stock:78 },
  { id:4, title:'1984',                   author:'George Orwell',        category:'Fiction',     price:'$10.99', rating:4.7, stock:56 },
  { id:5, title:'Thinking Fast and Slow', author:'Daniel Kahneman',     category:'Psychology',  price:'$16.99', rating:4.6, stock:23 },
  { id:6, title:'The Alchemist',          author:'Paulo Coelho',         category:'Fiction',     price:'$11.99', rating:4.8, stock:67 },
  { id:7, title:'Educated',              author:'Tara Westover',        category:'Biography',   price:'$13.99', rating:4.7, stock:41 },
  { id:8, title:'Dune',                   author:'Frank Herbert',        category:'Sci-Fi',      price:'$17.99', rating:4.9, stock:29 },
]

const INIT_CATS = [
  { id:1, name:'Fiction',    description:'Imaginative narratives and storytelling', books:45, color:'#2d4a3e' },
  { id:2, name:'History',    description:'Historical events and biographies',       books:28, color:'#4a2d2d' },
  { id:3, name:'Psychology', description:'Mind and human behavior',                 books:22, color:'#2a3a4a' },
  { id:4, name:'Philosophy', description:'Philosophical thought and ethics',        books:18, color:'#3a3028' },
  { id:5, name:'Biography',  description:'Life stories of notable people',          books:15, color:'#2a4a3a' },
  { id:6, name:'Self-Help',  description:'Personal development books',              books:32, color:'#4a3a20' },
  { id:7, name:'Sci-Fi',     description:'Science fiction and futurism',            books:24, color:'#283040' },
  { id:8, name:'Romance',    description:'Love stories and relationships',          books:19, color:'#4a2838' },
]

const CHART_BOOKS_BY_CAT = [
  { name:'Fiction',    books:45 },
  { name:'History',    books:28 },
  { name:'Psych',      books:22 },
  { name:'Philosophy', books:18 },
  { name:'Biography',  books:15 },
  { name:'Self-Help',  books:32 },
  { name:'Sci-Fi',     books:24 },
]

const CHART_USER_REG = [
  { month:'Jan', users:20 },
  { month:'Feb', users:35 },
  { month:'Mar', users:28 },
  { month:'Apr', users:45 },
  { month:'May', users:52 },
  { month:'Jun', users:38 },
]

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const avatarColor = (name) => `hsl(${(name.charCodeAt(0) * 37 + name.charCodeAt(1) * 17) % 360}, 32%, 32%)`

/* ── Modal Wrapper ─────────────────────────────────────────── */
const Modal = ({ title, onClose, children }) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <button className={styles.modalClose} onClick={onClose}><XIcon /></button>
      </div>
      {children}
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Users state
  const [users, setUsers] = useState([])
  const [userModal, setUserModal] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({ name:'', email:'', role:'user', password:'' })

  // Books state
  const [books, setBooks] = useState(INIT_BOOKS)
  const [bookModal, setBookModal] = useState(null)
  const [editingBook, setEditingBook] = useState(null)
  const [bookForm, setBookForm] = useState({ title:'', author:'', category:'Fiction', price:'', rating:'', stock:'' })

  // Categories state
  const [cats, setCats] = useState(INIT_CATS)
  const [catModal, setCatModal] = useState(null)
  const [editingCat, setEditingCat] = useState(null)
  const [catForm, setCatForm] = useState({ name:'', description:'', color:'#2d4a3e', books:0 })

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).catch(() => {})
  }, [])

  /* ── Users CRUD ── */
  const openAddUser = () => {
    setUserForm({ name:'', email:'', role:'user', password:'' })
    setEditingUser(null)
    setUserModal('add')
  }
  const openEditUser = (u) => {
    setUserForm({ name:u.name, email:u.email, role:u.role, password:'' })
    setEditingUser(u)
    setUserModal('edit')
  }
  const openDelUser = (u) => { setEditingUser(u); setUserModal('delete') }
  const saveUser = async () => {
    try {
      if (userModal === 'add') {
        const { data } = await api.post('/users', userForm)
        setUsers(prev => [data, ...prev])
      } else {
        const payload = { name: userForm.name, email: userForm.email, role: userForm.role }
        if (userForm.password) payload.password = userForm.password
        const { data } = await api.patch(`/users/${editingUser._id}`, payload)
        setUsers(prev => prev.map(u => u._id === editingUser._id ? data : u))
      }
      setUserModal(null)
    } catch (e) {
      alert(e.response?.data?.message || 'Xato yuz berdi')
    }
  }
  const delUser = async () => {
    try {
      await api.delete(`/users/${editingUser._id}`)
      setUsers(prev => prev.filter(u => u._id !== editingUser._id))
      setUserModal(null)
    } catch (e) {
      alert(e.response?.data?.message || 'Xato yuz berdi')
    }
  }

  /* ── Books CRUD ── */
  const openAddBook = () => {
    setBookForm({ title:'', author:'', category:'Fiction', price:'', rating:'', stock:'' })
    setEditingBook(null)
    setBookModal('add')
  }
  const openEditBook = (b) => {
    setBookForm({ title:b.title, author:b.author, category:b.category, price:b.price, rating:String(b.rating), stock:String(b.stock) })
    setEditingBook(b)
    setBookModal('edit')
  }
  const openDelBook = (b) => { setEditingBook(b); setBookModal('delete') }
  const saveBook = () => {
    if (bookModal === 'add') {
      setBooks(prev => [...prev, { id: Date.now(), ...bookForm, rating: parseFloat(bookForm.rating) || 4.5, stock: parseInt(bookForm.stock) || 0 }])
    } else {
      setBooks(prev => prev.map(b => b.id === editingBook.id ? { ...b, ...bookForm, rating: parseFloat(bookForm.rating) || b.rating, stock: parseInt(bookForm.stock) || b.stock } : b))
    }
    setBookModal(null)
  }
  const delBook = () => {
    setBooks(prev => prev.filter(b => b.id !== editingBook.id))
    setBookModal(null)
  }

  /* ── Categories CRUD ── */
  const openAddCat = () => {
    setCatForm({ name:'', description:'', color:'#2d4a3e', books:0 })
    setEditingCat(null)
    setCatModal('add')
  }
  const openEditCat = (c) => {
    setCatForm({ name:c.name, description:c.description, color:c.color, books:c.books })
    setEditingCat(c)
    setCatModal('edit')
  }
  const openDelCat = (c) => { setEditingCat(c); setCatModal('delete') }
  const saveCat = () => {
    if (catModal === 'add') {
      setCats(prev => [...prev, { id: Date.now(), ...catForm, books: parseInt(catForm.books) || 0 }])
    } else {
      setCats(prev => prev.map(c => c.id === editingCat.id ? { ...c, ...catForm, books: parseInt(catForm.books) || c.books } : c))
    }
    setCatModal(null)
  }
  const delCat = () => {
    setCats(prev => prev.filter(c => c.id !== editingCat.id))
    setCatModal(null)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    navigate('/admin/login')
  }

  const NAV = [
    { id: 'overview',   label: 'Overview',   Icon: HomeIcon },
    { id: 'users',      label: 'Users',      Icon: UsersIcon },
    { id: 'books',      label: 'Books',      Icon: BookIcon },
    { id: 'categories', label: 'Categories', Icon: TagIcon },
  ]

  const sectionLabel = NAV.find(n => n.id === activeSection)?.label || 'Overview'

  return (
    <div className={styles.shell}>

      {/* ══ Sidebar ══ */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.sideLogo}>
            <div className={styles.sideLogoMark}>B</div>
            <div className={styles.sideLogoText}>
              <span className={styles.sideLogoName}>Book.com</span>
              <span className={styles.adminBadge}>ADMIN</span>
            </div>
          </div>

          <nav className={styles.sideNav}>
            <div className={styles.navLabel}>NAVIGATION</div>
            {NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`${styles.navItem} ${activeSection === id ? styles.navActive : ''}`}
                onClick={() => setActiveSection(id)}
              >
                <span className={styles.navIcon}><Icon /></span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.sideBottom}>
          <div className={styles.sideDivider} />
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.navIcon}><LogOutIcon /></span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ══ Main ══ */}
      <div className={styles.main}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>{sectionLabel}</h1>
            <span className={styles.headerCrumb}>Admin / {sectionLabel}</span>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.iconBtn} title="Notifications">
              <BellIcon />
              <span className={styles.notifDot} />
            </button>

            <div className={styles.profileWrap} ref={dropdownRef}>
              <button
                className={styles.profileBtn}
                onClick={() => setShowDropdown(v => !v)}
              >
                <div className={styles.headerAvatar}>AU</div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>Admin User</span>
                  <span className={styles.profileEmail}>admin@gmail.com</span>
                </div>
                <span className={`${styles.chevron} ${showDropdown ? styles.chevronOpen : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>

              {showDropdown && (
                <div className={styles.dropdown}>
                  <div className={styles.dropHead}>
                    <div className={styles.dropAvatar}>AU</div>
                    <div>
                      <div className={styles.dropName}>Admin User</div>
                      <div className={styles.dropEmail}>admin@gmail.com</div>
                    </div>
                  </div>
                  <div className={styles.dropDivider} />
                  <button className={styles.dropItem} onClick={() => setShowDropdown(false)}>
                    My Profile
                  </button>
                  <button className={`${styles.dropItem} ${styles.dropLogout}`} onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={styles.content}>
          {activeSection === 'overview' && (
            <OverviewSection users={users} books={books} cats={cats} />
          )}
          {activeSection === 'users' && (
            <UsersSection users={users} onAdd={openAddUser} onEdit={openEditUser} onDelete={openDelUser} />
          )}
          {activeSection === 'books' && (
            <BooksSection books={books} onAdd={openAddBook} onEdit={openEditBook} onDelete={openDelBook} />
          )}
          {activeSection === 'categories' && (
            <CategoriesSection cats={cats} onAdd={openAddCat} onEdit={openEditCat} onDelete={openDelCat} />
          )}
        </main>
      </div>

      {/* ══ Users Modals ══ */}
      {(userModal === 'add' || userModal === 'edit') && (
        <Modal title={userModal === 'add' ? 'Add New User' : 'Edit User'} onClose={() => setUserModal(null)}>
          <div className={styles.modalBody}>
            <div className={styles.formField}>
              <label>Full Name</label>
              <input value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} placeholder="Alice Johnson" />
            </div>
            <div className={styles.formField}>
              <label>Email Address</label>
              <input type="email" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} placeholder="alice@gmail.com" />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Role</label>
                <select value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className={styles.formField}>
                <label>{userModal === 'add' ? 'Password' : 'New Password (optional)'}</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={userModal === 'add' ? 'Password' : 'Leave blank to keep'}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setUserModal(null)}>Cancel</button>
              <button className={styles.submitBtn} onClick={saveUser}>
                {userModal === 'add' ? 'Add User' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {userModal === 'delete' && editingUser && (
        <Modal title="Delete User" onClose={() => setUserModal(null)}>
          <div className={styles.modalBody}>
            <p className={styles.deleteMsg}>
              Are you sure you want to delete <strong>{editingUser.name}</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setUserModal(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={delUser}>Delete User</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ Books Modals ══ */}
      {(bookModal === 'add' || bookModal === 'edit') && (
        <Modal title={bookModal === 'add' ? 'Add New Book' : 'Edit Book'} onClose={() => setBookModal(null)}>
          <div className={styles.modalBody}>
            <div className={styles.formField}>
              <label>Title</label>
              <input value={bookForm.title} onChange={e => setBookForm(f => ({ ...f, title: e.target.value }))} placeholder="Book title" />
            </div>
            <div className={styles.formField}>
              <label>Author</label>
              <input value={bookForm.author} onChange={e => setBookForm(f => ({ ...f, author: e.target.value }))} placeholder="Author name" />
            </div>
            <div className={styles.formField}>
              <label>Category</label>
              <select value={bookForm.category} onChange={e => setBookForm(f => ({ ...f, category: e.target.value }))}>
                {['Fiction','History','Psychology','Philosophy','Biography','Self-Help','Sci-Fi','Romance'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Price</label>
                <input value={bookForm.price} onChange={e => setBookForm(f => ({ ...f, price: e.target.value }))} placeholder="$14.99" />
              </div>
              <div className={styles.formField}>
                <label>Rating</label>
                <input type="number" step="0.1" min="0" max="5" value={bookForm.rating} onChange={e => setBookForm(f => ({ ...f, rating: e.target.value }))} placeholder="4.5" />
              </div>
              <div className={styles.formField}>
                <label>Stock</label>
                <input type="number" min="0" value={bookForm.stock} onChange={e => setBookForm(f => ({ ...f, stock: e.target.value }))} placeholder="50" />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setBookModal(null)}>Cancel</button>
              <button className={styles.submitBtn} onClick={saveBook}>
                {bookModal === 'add' ? 'Add Book' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {bookModal === 'delete' && editingBook && (
        <Modal title="Delete Book" onClose={() => setBookModal(null)}>
          <div className={styles.modalBody}>
            <p className={styles.deleteMsg}>
              Are you sure you want to delete <strong>{editingBook.title}</strong>? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setBookModal(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={delBook}>Delete Book</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ Categories Modals ══ */}
      {(catModal === 'add' || catModal === 'edit') && (
        <Modal title={catModal === 'add' ? 'Add Category' : 'Edit Category'} onClose={() => setCatModal(null)}>
          <div className={styles.modalBody}>
            <div className={styles.formField}>
              <label>Name</label>
              <input value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="Category name" />
            </div>
            <div className={styles.formField}>
              <label>Description</label>
              <input value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Color</label>
                <input type="color" value={catForm.color} onChange={e => setCatForm(f => ({ ...f, color: e.target.value }))} />
              </div>
              <div className={styles.formField}>
                <label>Book Count</label>
                <input type="number" min="0" value={catForm.books} onChange={e => setCatForm(f => ({ ...f, books: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setCatModal(null)}>Cancel</button>
              <button className={styles.submitBtn} onClick={saveCat}>
                {catModal === 'add' ? 'Add Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      {catModal === 'delete' && editingCat && (
        <Modal title="Delete Category" onClose={() => setCatModal(null)}>
          <div className={styles.modalBody}>
            <p className={styles.deleteMsg}>
              Are you sure you want to delete the <strong>{editingCat.name}</strong> category? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setCatModal(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={delCat}>Delete Category</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   OVERVIEW SECTION
══════════════════════════════════════════════════════════════ */
const OverviewSection = ({ users, books, cats }) => {
  const STATS = [
    { label: 'Total Users',      value: users.length, Icon: UserSingleIcon, color: '#2d4a3e', bg: '#e8f0ec' },
    { label: 'Total Books',      value: books.length, Icon: BookStatIcon,   color: '#c8922a', bg: '#fdf4e0' },
    { label: 'Categories',       value: cats.length,  Icon: TagStatIcon,    color: '#5b4a7a', bg: '#f0ecf8' },
    { label: 'Monthly Revenue',  value: '$12,450',    Icon: DollarIcon,     color: '#2a4a4a', bg: '#e8f0f0' },
  ]

  return (
    <div className={styles.section}>
      <div className={styles.statsGrid}>
        {STATS.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ background: bg, color }}>
              <Icon />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Books by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_BOOKS_BY_CAT} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,160,120,0.15)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a09070', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a09070', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(180,160,120,0.3)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans' }}
                cursor={{ fill: 'rgba(200,146,42,0.06)' }}
              />
              <Bar dataKey="books" fill="#c8922a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>User Registrations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={CHART_USER_REG} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(180,160,120,0.15)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a09070', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a09070', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid rgba(180,160,120,0.3)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans' }}
              />
              <Line dataKey="users" stroke="#2d4a3e" strokeWidth={2.5} dot={{ r: 4, fill: '#2d4a3e', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   USERS SECTION
══════════════════════════════════════════════════════════════ */
const roleBadgeClass = (role) => role === 'admin' ? styles.roleAdmin : styles.roleReader
const roleLabel = (role) => role === 'admin' ? 'Admin' : 'User'

const UsersSection = ({ users, onAdd, onEdit, onDelete }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div>
        <h2 className={styles.sectionTitle}>Users Management</h2>
        <p className={styles.sectionSub}>{users.length} registered users</p>
      </div>
      <button className={styles.addBtn} onClick={onAdd}>
        <PlusIcon /> Add User
      </button>
    </div>

    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u._id}>
              <td className={styles.tdNum}>{i + 1}</td>
              <td>
                <div className={styles.userCell}>
                  <div className={styles.userAvatar} style={{ background: avatarColor(u.name) }}>
                    {getInitials(u.name)}
                  </div>
                  <span className={styles.userName}>{u.name}</span>
                </div>
              </td>
              <td className={styles.tdMuted}>{u.email}</td>
              <td>
                <span className={`${styles.roleBadge} ${roleBadgeClass(u.role)}`}>{roleLabel(u.role)}</span>
              </td>
              <td className={styles.tdMuted}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => onEdit(u)} title="Edit user"><EditIcon /></button>
                  <button className={styles.delBtn} onClick={() => onDelete(u)} title="Delete user"><TrashIcon /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════
   BOOKS SECTION
══════════════════════════════════════════════════════════════ */
const BooksSection = ({ books, onAdd, onEdit, onDelete }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div>
        <h2 className={styles.sectionTitle}>Books Management</h2>
        <p className={styles.sectionSub}>{books.length} books in catalog</p>
      </div>
      <button className={styles.addBtn} onClick={onAdd}>
        <PlusIcon /> Add Book
      </button>
    </div>

    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b, i) => (
            <tr key={b.id}>
              <td className={styles.tdNum}>{i + 1}</td>
              <td className={styles.tdBold}>{b.title}</td>
              <td className={styles.tdMuted}>{b.author}</td>
              <td>
                <span className={styles.catBadge}>{b.category}</span>
              </td>
              <td className={styles.tdGold}>{b.price}</td>
              <td>
                <span className={styles.ratingCell}>⭐ {b.rating}</span>
              </td>
              <td>
                <span className={Number(b.stock) < 30 ? styles.stockLow : styles.stockOk}>{b.stock}</span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => onEdit(b)} title="Edit book"><EditIcon /></button>
                  <button className={styles.delBtn} onClick={() => onDelete(b)} title="Delete book"><TrashIcon /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════
   CATEGORIES SECTION
══════════════════════════════════════════════════════════════ */
const CategoriesSection = ({ cats, onAdd, onEdit, onDelete }) => (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <div>
        <h2 className={styles.sectionTitle}>Categories Management</h2>
        <p className={styles.sectionSub}>{cats.length} categories</p>
      </div>
      <button className={styles.addBtn} onClick={onAdd}>
        <PlusIcon /> Add Category
      </button>
    </div>

    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Color</th>
            <th>Name</th>
            <th>Description</th>
            <th>Books</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cats.map((c, i) => (
            <tr key={c.id}>
              <td className={styles.tdNum}>{i + 1}</td>
              <td>
                <div className={styles.colorSwatch} style={{ background: c.color }} />
              </td>
              <td className={styles.tdBold}>{c.name}</td>
              <td className={styles.tdMuted}>{c.description}</td>
              <td>
                <span className={styles.bookCountBadge}>{c.books}</span>
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => onEdit(c)} title="Edit category"><EditIcon /></button>
                  <button className={styles.delBtn} onClick={() => onDelete(c)} title="Delete category"><TrashIcon /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default AdminDashboard

# Books, Authors, PDF & Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Backend'da Author va Book modellarini qo'shish, admin dashboardga real CRUD + author autocomplete + PDF yuklash (Cloudinary), va frontendda NewArrivals/BookDetailPage/BookReaderPage/ProfilePage sahifalarini backend bilan ulash.

**Architecture:** Author alohida MongoDB collection, Book unga ref orqali bog'liq. Kitob yaratishda author nomi orqali qidirish, topilmasa avtomatik yaratish. PDF Cloudinary'da saqlanadi, frontend react-pdf bilan ko'rsatadi.

**Tech Stack:** Express, Mongoose, Cloudinary, multer-storage-cloudinary, React 19, react-pdf, Redux Toolkit, Axios.

---

## File Structure

**Yangi backend fayllar:**
- `backend/src/models/Author.js`
- `backend/src/models/Book.js`
- `backend/src/config/cloudinary.js`
- `backend/src/routes/authors.js`
- `backend/src/routes/books.js`

**O'zgaradigan backend fayllar:**
- `backend/src/routes/users.js` — GET /me, PATCH /me qo'shiladi
- `backend/src/index.js` — yangi routelar ro'yxatdan o'tkaziladi

**O'zgaradigan frontend fayllar:**
- `frontend/src/pages/admin/AdminDashboard.jsx` — Authors tab, Books real backend, autocomplete, PDF upload
- `frontend/src/components/NewArrivals/NewArrivals.jsx` — backend dan kitoblar
- `frontend/src/pages/BookDetailPage.jsx` — backend dan kitob
- `frontend/src/pages/BookReaderPage.jsx` — react-pdf viewer
- `frontend/src/pages/ProfilePage.jsx` — backend dan profil

---

## Task 1: Author modeli

**Files:**
- Create: `backend/src/models/Author.js`

- [ ] **Step 1: Author.js yaratish**

```js
import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    bio: { type: String, default: '' },
    nationality: { type: String, default: '' },
    photo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Author', authorSchema);
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/models/Author.js
git commit -m "feat: add Author mongoose model"
```

---

## Task 2: Book modeli

**Files:**
- Create: `backend/src/models/Book.js`

- [ ] **Step 1: Book.js yaratish**

```js
import mongoose from 'mongoose';

const CATEGORIES = [
  'Fiction', 'Non-fiction', 'Mystery', 'Science Fiction',
  'Fantasy', 'Romance', 'History', 'Self-help', 'Thriller',
  'Biography', 'Philosophy', 'Psychology', 'Sci-Fi',
];

const COVER_COLORS = ['green', 'blue', 'purple', 'red', 'dark', 'orange', 'teal'];

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    category: { type: String, enum: CATEGORIES, default: 'Fiction' },
    price: { type: Number, default: 0, min: 0 },
    originalPrice: { type: Number, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    coverColor: { type: String, enum: COVER_COLORS, default: 'green' },
    badge: { type: String, enum: ['Bestseller', 'New', 'Hot', ''], default: '' },
    genre: { type: String, default: '' },
    isFree: { type: Boolean, default: false },
    pageCount: { type: Number, default: null },
    publishedYear: { type: Number, default: null },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/models/Book.js
git commit -m "feat: add Book mongoose model with author ref and PDF support"
```

---

## Task 3: Cloudinary konfiguratsiyasi va paketlar

**Files:**
- Create: `backend/src/config/cloudinary.js`

- [ ] **Step 1: Backend paketlarni o'rnatish**

```bash
cd backend
npm install cloudinary multer-storage-cloudinary multer
```

- [ ] **Step 2: .env ga Cloudinary o'zgaruvchilarni qo'shish**

`backend/.env` fayliga qo'shing (Cloudinary dashboard'dan olasiz — https://console.cloudinary.com):
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- [ ] **Step 3: cloudinary.js konfiguratsiya yaratish**

```js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bookshop/pdfs',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
  },
});

export const uploadPdf = multer({ storage: pdfStorage });
export default cloudinary;
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/config/cloudinary.js backend/package.json backend/package-lock.json
git commit -m "feat: add Cloudinary config and multer PDF upload setup"
```

---

## Task 4: Authors routes (CRUD + autocomplete)

**Files:**
- Create: `backend/src/routes/authors.js`

- [ ] **Step 1: authors.js yaratish**

```js
import { Router } from 'express';
import Author from '../models/Author.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/authors - barcha authorlar (public)
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/authors/search?q= - autocomplete (public)
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (q.length < 1) return res.json([]);
    const authors = await Author.find({
      name: { $regex: q, $options: 'i' },
    }).limit(10).select('_id name');
    res.json(authors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/authors/:id - bitta author (public)
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author topilmadi' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/authors - yangi author (admin)
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const { name, bio, nationality, photo } = req.body;
    if (!name) return res.status(400).json({ message: 'name majburiy' });
    if (await Author.findOne({ name })) {
      return res.status(400).json({ message: 'Bu nom bilan author mavjud' });
    }
    const author = await Author.create({ name, bio, nationality, photo });
    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/authors/:id - tahrirlash (admin)
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { name, bio, nationality, photo } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (nationality !== undefined) update.nationality = nationality;
    if (photo !== undefined) update.photo = photo;
    const author = await Author.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!author) return res.status(404).json({ message: 'Author topilmadi' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/authors/:id (admin)
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ message: 'Author topilmadi' });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/authors.js
git commit -m "feat: add Authors CRUD routes with autocomplete search"
```

---

## Task 5: Books routes (CRUD + PDF upload)

**Files:**
- Create: `backend/src/routes/books.js`

- [ ] **Step 1: books.js yaratish**

```js
import { Router } from 'express';
import Book from '../models/Book.js';
import Author from '../models/Author.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { uploadPdf } from '../config/cloudinary.js';

const router = Router();

// GET /api/books - barcha kitoblar (public), author populated
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    let q = Book.find().populate('author', 'name nationality photo').sort({ createdAt: -1 });
    if (limit > 0) q = q.limit(limit);
    const books = await q;
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/books/:id - bitta kitob (public)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author', 'name nationality photo bio');
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books - yangi kitob yaratish (admin)
// Body: { title, authorId?, authorName?, category, price, originalPrice,
//         rating, stock, description, coverColor, badge, genre, isFree,
//         pageCount, publishedYear }
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title, authorId, authorName, category, price, originalPrice,
      rating, stock, description, coverColor, badge, genre,
      isFree, pageCount, publishedYear,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'title majburiy' });

    // Author: authorId berilgan bo'lsa ishlatiladi, aks holda authorName bo'yicha topiladi yoki yaratiladi
    let resolvedAuthorId = authorId;
    if (!resolvedAuthorId && authorName) {
      let author = await Author.findOne({ name: { $regex: `^${authorName}$`, $options: 'i' } });
      if (!author) {
        author = await Author.create({ name: authorName });
      }
      resolvedAuthorId = author._id;
    }
    if (!resolvedAuthorId) {
      return res.status(400).json({ message: 'authorId yoki authorName majburiy' });
    }

    const book = await Book.create({
      title, author: resolvedAuthorId, category, price, originalPrice,
      rating, stock, description, coverColor, badge, genre,
      isFree: isFree || false, pageCount, publishedYear,
    });

    const populated = await Book.findById(book._id).populate('author', 'name nationality photo');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/books/:id - tahrirlash (admin)
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title, authorId, authorName, category, price, originalPrice,
      rating, stock, description, coverColor, badge, genre,
      isFree, pageCount, publishedYear,
    } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (category !== undefined) update.category = category;
    if (price !== undefined) update.price = price;
    if (originalPrice !== undefined) update.originalPrice = originalPrice;
    if (rating !== undefined) update.rating = rating;
    if (stock !== undefined) update.stock = stock;
    if (description !== undefined) update.description = description;
    if (coverColor !== undefined) update.coverColor = coverColor;
    if (badge !== undefined) update.badge = badge;
    if (genre !== undefined) update.genre = genre;
    if (isFree !== undefined) update.isFree = isFree;
    if (pageCount !== undefined) update.pageCount = pageCount;
    if (publishedYear !== undefined) update.publishedYear = publishedYear;

    if (authorId) {
      update.author = authorId;
    } else if (authorName) {
      let author = await Author.findOne({ name: { $regex: `^${authorName}$`, $options: 'i' } });
      if (!author) author = await Author.create({ name: authorName });
      update.author = author._id;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('author', 'name nationality photo');
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/books/:id (admin)
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books/:id/upload-pdf - PDF yuklash Cloudinary'ga (admin)
router.post('/:id/upload-pdf', protect, requireAdmin, uploadPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'PDF fayl yuborilmadi' });
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { pdfUrl: req.file.path },
      { new: true }
    ).populate('author', 'name nationality photo');
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/books.js
git commit -m "feat: add Books CRUD routes with find-or-create author and Cloudinary PDF upload"
```

---

## Task 6: users.js ga /me endpointlar + index.js yangilash

**Files:**
- Modify: `backend/src/routes/users.js`
- Modify: `backend/src/index.js`

- [ ] **Step 1: users.js ga /me routelarni qo'shish**

`backend/src/routes/users.js` faylida `import { Router }` dan keyin, `router.get('/:id'` dan **OLDIN** quyidagini qo'shing:

```js
// GET /api/users/me - joriy foydalanuvchi profili
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshTokens');
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/me - joriy foydalanuvchi profilini yangilash
router.patch('/me', protect, async (req, res) => {
  try {
    const { name, favAuthors, favGenres, age } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (favAuthors !== undefined) update.favAuthors = favAuthors;
    if (favGenres !== undefined) update.favGenres = favGenres;
    if (age !== undefined) update.age = age;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true })
      .select('-passwordHash -refreshTokens');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
```

**Muhim:** Bu kod `router.get('/:id', ...)` dan OLDIN bo'lishi kerak, aks holda `/me` ni ID sifatida o'qib oladi.

- [ ] **Step 2: index.js ga yangi routelarni ro'yxatdan o'tkazish**

`backend/src/index.js` faylini quyidagicha yangilang:

```js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import seedAdmin from './config/seedAdmin.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import authorsRouter from './routes/authors.js';
import booksRouter from './routes/books.js';
import swaggerSpec from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

app.get('/', (req, res) => res.json({ message: 'Bookshop API ishlayapti', docs: '/api/docs' }));

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlamoqda`));
});
```

- [ ] **Step 3: Backend serverni ishlatib tekshirish**

```bash
cd backend && npm run dev
```

Quyidagi endpointlarni tekshiring:
```
GET  http://localhost:5000/api/authors          → []
GET  http://localhost:5000/api/authors/search?q=ali → []
GET  http://localhost:5000/api/books            → []
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/routes/users.js backend/src/index.js
git commit -m "feat: add /me profile endpoints and register authors/books routes"
```

---

## Task 7: Admin Dashboard — Authors tab

**Files:**
- Modify: `frontend/src/pages/admin/AdminDashboard.jsx`

- [ ] **Step 1: Sidebar'ga Authors nav item qo'shish**

`AdminDashboard.jsx` da `nav` items arrayiga (yoki sidebar render qismida) `authors` bo'limini qo'shing. `TagIcon` dan keyin quyidagicha:

```jsx
// Sidebar navigation items da (activeSection check qilinayotgan joyda)
// 'books' dan keyin 'authors' qo'shing:
{ key: 'authors', icon: <UserSingleIcon />, label: 'Authors' }
```

`UserSingleIcon` SVG (boshida iconlar qatoriga qo'shing):
```jsx
const UserSingleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
```

- [ ] **Step 2: Authors state va fetch qo'shish**

`AdminDashboard` component ichida (users state dan keyin):

```jsx
// Authors state
const [authors, setAuthors] = useState([])
const [authorModal, setAuthorModal] = useState(null)
const [editingAuthor, setEditingAuthor] = useState(null)
const [authorForm, setAuthorForm] = useState({ name: '', bio: '', nationality: '', photo: '' })

useEffect(() => {
  api.get('/authors').then(({ data }) => setAuthors(data)).catch(() => {})
}, [])
```

- [ ] **Step 3: Authors CRUD funksiyalari**

```jsx
const openAddAuthor = () => {
  setAuthorForm({ name: '', bio: '', nationality: '', photo: '' })
  setEditingAuthor(null)
  setAuthorModal('add')
}
const openEditAuthor = (a) => {
  setAuthorForm({ name: a.name, bio: a.bio || '', nationality: a.nationality || '', photo: a.photo || '' })
  setEditingAuthor(a)
  setAuthorModal('edit')
}
const openDelAuthor = (a) => { setEditingAuthor(a); setAuthorModal('delete') }

const saveAuthor = async () => {
  try {
    if (authorModal === 'add') {
      const { data } = await api.post('/authors', authorForm)
      setAuthors(prev => [data, ...prev])
    } else {
      const { data } = await api.put(`/authors/${editingAuthor._id}`, authorForm)
      setAuthors(prev => prev.map(a => a._id === editingAuthor._id ? data : a))
    }
    setAuthorModal(null)
  } catch (e) {
    alert(e.response?.data?.message || 'Xato yuz berdi')
  }
}

const delAuthor = async () => {
  try {
    await api.delete(`/authors/${editingAuthor._id}`)
    setAuthors(prev => prev.filter(a => a._id !== editingAuthor._id))
    setAuthorModal(null)
  } catch (e) {
    alert(e.response?.data?.message || 'Xato yuz berdi')
  }
}
```

- [ ] **Step 4: Authors section JSX**

`activeSection === 'authors'` uchun quyidagi JSX ni render qismiga qo'shing (books section analogiyasida):

```jsx
{activeSection === 'authors' && (
  <div className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>Authors</h2>
      <button className={styles.addBtn} onClick={openAddAuthor}>
        <PlusIcon /> Add Author
      </button>
    </div>
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(a => (
            <tr key={a._id}>
              <td><strong>{a.name}</strong></td>
              <td>{a.nationality || '—'}</td>
              <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {a.bio || '—'}
              </td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.editBtn} onClick={() => openEditAuthor(a)}><EditIcon /></button>
                  <button className={styles.delBtn} onClick={() => openDelAuthor(a)}><TrashIcon /></button>
                </div>
              </td>
            </tr>
          ))}
          {authors.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#a09070' }}>
              Hali author yo'q
            </td></tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Author Modals */}
    {(authorModal === 'add' || authorModal === 'edit') && (
      <Modal title={authorModal === 'add' ? 'Add Author' : 'Edit Author'} onClose={() => setAuthorModal(null)}>
        <div className={styles.modalBody}>
          <div className={styles.formField}>
            <label>Full Name *</label>
            <input value={authorForm.name} onChange={e => setAuthorForm(f => ({ ...f, name: e.target.value }))} placeholder="Dostoevsky" />
          </div>
          <div className={styles.formField}>
            <label>Nationality</label>
            <input value={authorForm.nationality} onChange={e => setAuthorForm(f => ({ ...f, nationality: e.target.value }))} placeholder="Russian" />
          </div>
          <div className={styles.formField}>
            <label>Bio</label>
            <textarea value={authorForm.bio} onChange={e => setAuthorForm(f => ({ ...f, bio: e.target.value }))} placeholder="Short bio..." rows={3} style={{ width: '100%', resize: 'vertical' }} />
          </div>
          <div className={styles.formField}>
            <label>Photo URL</label>
            <input value={authorForm.photo} onChange={e => setAuthorForm(f => ({ ...f, photo: e.target.value }))} placeholder="https://..." />
          </div>
          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={() => setAuthorModal(null)}>Cancel</button>
            <button className={styles.submitBtn} onClick={saveAuthor}>
              {authorModal === 'add' ? 'Add Author' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    )}
    {authorModal === 'delete' && editingAuthor && (
      <Modal title="Delete Author" onClose={() => setAuthorModal(null)}>
        <div className={styles.modalBody}>
          <p className={styles.deleteMsg}>
            <strong>{editingAuthor.name}</strong> nomli autherni o'chirmoqchimisiz?
          </p>
          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={() => setAuthorModal(null)}>Cancel</button>
            <button className={styles.deleteBtn} onClick={delAuthor}>Delete</button>
          </div>
        </div>
      </Modal>
    )}
  </div>
)}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/admin/AdminDashboard.jsx
git commit -m "feat: add Authors tab with real backend CRUD in AdminDashboard"
```

---

## Task 8: Admin Dashboard — Books tab real backend + author autocomplete + PDF upload

**Files:**
- Modify: `frontend/src/pages/admin/AdminDashboard.jsx`

- [ ] **Step 1: Books state'ni real backendga o'tkazish**

`useState(INIT_BOOKS)` ni `useState([])` ga o'zgartiring va `INIT_BOOKS` konstantasini o'chiring.

`useEffect` blokida books fetch qo'shing:
```jsx
useEffect(() => {
  api.get('/books').then(({ data }) => setBooks(data)).catch(() => {})
}, [])
```

- [ ] **Step 2: Author autocomplete state qo'shish**

`bookForm` state dan keyin:
```jsx
const [authorSearch, setAuthorSearch] = useState('')
const [authorSuggestions, setAuthorSuggestions] = useState([])
const [selectedAuthorId, setSelectedAuthorId] = useState(null)
const [pdfFile, setPdfFile] = useState(null)
```

Debounced author search:
```jsx
useEffect(() => {
  if (authorSearch.length < 2) { setAuthorSuggestions([]); return }
  const t = setTimeout(async () => {
    try {
      const { data } = await api.get(`/authors/search?q=${encodeURIComponent(authorSearch)}`)
      setAuthorSuggestions(data)
    } catch { setAuthorSuggestions([]) }
  }, 300)
  return () => clearTimeout(t)
}, [authorSearch])
```

- [ ] **Step 3: openAddBook va openEditBook funksiyalarini yangilash**

```jsx
const openAddBook = () => {
  setBookForm({ title: '', category: 'Fiction', price: '', originalPrice: '', rating: '', stock: '', description: '', coverColor: 'green', badge: '', genre: '', isFree: false, pageCount: '', publishedYear: '' })
  setAuthorSearch('')
  setSelectedAuthorId(null)
  setAuthorSuggestions([])
  setPdfFile(null)
  setEditingBook(null)
  setBookModal('add')
}

const openEditBook = (b) => {
  setBookForm({
    title: b.title,
    category: b.category,
    price: String(b.price),
    originalPrice: b.originalPrice ? String(b.originalPrice) : '',
    rating: String(b.rating),
    stock: String(b.stock),
    description: b.description || '',
    coverColor: b.coverColor || 'green',
    badge: b.badge || '',
    genre: b.genre || '',
    isFree: b.isFree || false,
    pageCount: b.pageCount ? String(b.pageCount) : '',
    publishedYear: b.publishedYear ? String(b.publishedYear) : '',
  })
  setAuthorSearch(b.author?.name || '')
  setSelectedAuthorId(b.author?._id || null)
  setAuthorSuggestions([])
  setPdfFile(null)
  setEditingBook(b)
  setBookModal('edit')
}
```

- [ ] **Step 4: saveBook funksiyasini yangilash (real backend + PDF upload)**

```jsx
const saveBook = async () => {
  try {
    const payload = {
      title: bookForm.title,
      category: bookForm.category,
      price: parseFloat(bookForm.price) || 0,
      originalPrice: bookForm.originalPrice ? parseFloat(bookForm.originalPrice) : null,
      rating: parseFloat(bookForm.rating) || 0,
      stock: parseInt(bookForm.stock) || 0,
      description: bookForm.description,
      coverColor: bookForm.coverColor,
      badge: bookForm.badge,
      genre: bookForm.genre,
      isFree: bookForm.isFree,
      pageCount: bookForm.pageCount ? parseInt(bookForm.pageCount) : null,
      publishedYear: bookForm.publishedYear ? parseInt(bookForm.publishedYear) : null,
    }

    if (selectedAuthorId) {
      payload.authorId = selectedAuthorId
    } else if (authorSearch.trim()) {
      payload.authorName = authorSearch.trim()
    }

    let savedBook
    if (bookModal === 'add') {
      const { data } = await api.post('/books', payload)
      savedBook = data
      setBooks(prev => [savedBook, ...prev])
    } else {
      const { data } = await api.put(`/books/${editingBook._id}`, payload)
      savedBook = data
      setBooks(prev => prev.map(b => b._id === editingBook._id ? savedBook : b))
    }

    // PDF yuklash (ixtiyoriy)
    if (pdfFile && savedBook._id) {
      const formData = new FormData()
      formData.append('pdf', pdfFile)
      const { data: withPdf } = await api.post(`/books/${savedBook._id}/upload-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setBooks(prev => prev.map(b => b._id === withPdf._id ? withPdf : b))
    }

    setBookModal(null)
  } catch (e) {
    alert(e.response?.data?.message || 'Xato yuz berdi')
  }
}
```

- [ ] **Step 5: delBook funksiyasini yangilash**

```jsx
const delBook = async () => {
  try {
    await api.delete(`/books/${editingBook._id}`)
    setBooks(prev => prev.filter(b => b._id !== editingBook._id))
    setBookModal(null)
  } catch (e) {
    alert(e.response?.data?.message || 'Xato yuz berdi')
  }
}
```

- [ ] **Step 6: Books modali formani yangilash (author autocomplete + PDF)**

Books add/edit modal ichida `author` input qismini quyidagi autocomplete bilan almashtiring:

```jsx
{/* Author autocomplete */}
<div className={styles.formField} style={{ position: 'relative' }}>
  <label>Author *</label>
  <input
    value={authorSearch}
    onChange={e => { setAuthorSearch(e.target.value); setSelectedAuthorId(null) }}
    placeholder="Author nomini yozing..."
    autoComplete="off"
  />
  {authorSuggestions.length > 0 && (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
      background: '#1e1e1e', border: '1px solid #3a3028', borderRadius: 6,
      maxHeight: 200, overflowY: 'auto'
    }}>
      {authorSuggestions.map(a => (
        <div
          key={a._id}
          onClick={() => { setAuthorSearch(a.name); setSelectedAuthorId(a._id); setAuthorSuggestions([]) }}
          style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #2a2a2a' }}
          onMouseEnter={e => e.target.style.background = '#2a2a2a'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          {a.name}
        </div>
      ))}
      {!selectedAuthorId && authorSearch.length >= 2 && (
        <div
          onClick={() => { setAuthorSuggestions([]); }}
          style={{ padding: '8px 12px', color: '#4a8f48', cursor: 'pointer', fontSize: 13 }}
        >
          + Yangi yaratish: "{authorSearch}"
        </div>
      )}
    </div>
  )}
  {selectedAuthorId && (
    <span style={{ fontSize: 11, color: '#4a8f48', marginTop: 2, display: 'block' }}>
      ✓ Bazadan tanlandi
    </span>
  )}
</div>

{/* PDF upload */}
<div className={styles.formField}>
  <label>PDF fayl (ixtiyoriy)</label>
  <input
    type="file"
    accept=".pdf"
    onChange={e => setPdfFile(e.target.files?.[0] || null)}
    style={{ color: '#c8b89a' }}
  />
  {editingBook?.pdfUrl && !pdfFile && (
    <span style={{ fontSize: 11, color: '#4a8f48', marginTop: 2, display: 'block' }}>
      ✓ PDF mavjud — yangi fayl tanlasangiz almashadi
    </span>
  )}
</div>
```

- [ ] **Step 7: Books jadvalidagi author ko'rinishini yangilash**

Books table'da `author` ustunida (avval `b.author` string edi, endi object):
```jsx
<td>{b.author?.name || b.author || '—'}</td>
```

- [ ] **Step 8: Commit**

```bash
git add frontend/src/pages/admin/AdminDashboard.jsx
git commit -m "feat: wire Books tab to real backend with author autocomplete and PDF upload"
```

---

## Task 9: NewArrivals — real backend kitoblar

**Files:**
- Modify: `frontend/src/components/NewArrivals/NewArrivals.jsx`

- [ ] **Step 1: useState, useEffect import qo'shish va hardcoded books o'chirish**

Faylning boshini quyidagicha o'zgartiring:

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './NewArrivals.module.css'
import api from '../../api/axios'
```

Hardcoded `const books = [...]` ni o'chiring.

- [ ] **Step 2: Component ichida fetch logikasi**

```jsx
const NewArrivals = () => {
  const [books, setBooks] = useState([])
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    api.get('/books?limit=6').then(({ data }) => setBooks(data)).catch(() => {})
  }, [])

  // ... qolgan JSX o'zgarmaydi, faqat book.id o'rniga book._id ishlatiladi
```

- [ ] **Step 3: `book.id` → `book._id` almashtirish**

`<Link to={`/books/${book.id}`}` → `<Link to={`/books/${book._id}`}`

`key={book.id}` → `key={book._id}`

- [ ] **Step 4: author displayni yangilash**

```jsx
// Avval: {book.author}
// Endi:
{book.author?.name || book.author || ''}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/NewArrivals/NewArrivals.jsx
git commit -m "feat: NewArrivals fetches real books from backend"
```

---

## Task 10: BookDetailPage — real backend

**Files:**
- Modify: `frontend/src/pages/BookDetailPage.jsx`

- [ ] **Step 1: import va state o'zgartirish**

Faylning boshiga qo'shing:
```jsx
import { useState, useEffect } from 'react'
import api from '../api/axios'
```

Hardcoded `const allBooks = [...]` ni o'chiring.

- [ ] **Step 2: Component ichida fetch**

```jsx
const BookDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [reviewText, setReviewText] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/books/${id}`)
      .then(({ data }) => { setBook(data); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [id])

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#c8b89a' }}>Yuklanmoqda...</div>
  if (!book) return <div style={{ padding: '4rem', textAlign: 'center', color: '#c8b89a' }}>Kitob topilmadi</div>

  const discountPct = book.originalPrice
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : null
```

- [ ] **Step 3: author ko'rinishini yangilash**

```jsx
// Avval: by <span>{book.author}</span>
// Endi:
by <span className={styles.authorName}>{book.author?.name || book.author}</span>
```

- [ ] **Step 4: "Read Book" tugmasini yangilash**

```jsx
// Avval: book.isFree
// Endi: book.isFree && book.pdfUrl
{book.isFree && book.pdfUrl && (
  <button className={styles.readBtn} onClick={() => navigate(`/books/${book._id}/read`)}>
    ...Read Book
  </button>
)}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/BookDetailPage.jsx
git commit -m "feat: BookDetailPage fetches real book from backend"
```

---

## Task 11: BookReaderPage — react-pdf PDF viewer

**Files:**
- Modify: `frontend/src/pages/BookReaderPage.jsx`

- [ ] **Step 1: react-pdf o'rnatish**

```bash
cd frontend
npm install react-pdf
```

- [ ] **Step 2: Worker konfiguratsiyasi**

`frontend/src/main.jsx` fayliga qo'shing:
```jsx
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
```

- [ ] **Step 3: BookReaderPage ni qayta yozish**

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import api from '../api/axios'
import styles from './BookReaderPage.module.css'

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
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/BookReaderPage.jsx frontend/src/main.jsx frontend/package.json frontend/package-lock.json
git commit -m "feat: BookReaderPage uses react-pdf to display Cloudinary PDFs"
```

---

## Task 12: ProfilePage — real backend data

**Files:**
- Modify: `frontend/src/pages/ProfilePage.jsx`

- [ ] **Step 1: import qo'shish**

```jsx
import { useEffect } from 'react'  // allaqachon bor bo'lsa skip
import { useSelector } from 'react-redux'
import api from '../api/axios'
```

- [ ] **Step 2: userData state'ni backend dan yuklash**

ProfilePage component ichida `userData` useState ni o'zgartirmang — faqat `useEffect` qo'shing:

```jsx
const authUser = useSelector(state => state.auth.user)

useEffect(() => {
  api.get('/users/me')
    .then(({ data }) => {
      // Backend'da name bitta maydon (masalan "Asilbek Bekmurodov")
      // firstName/lastName ga bo'lamiz
      const parts = (data.name || '').split(' ')
      setUserData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: data.email || '',
        hobbies: data.favGenres || [],
        favAuthors: data.favAuthors || [],
      })
      setDraft({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: data.email || '',
        hobbies: data.favGenres || [],
        favAuthors: data.favAuthors || [],
      })
    })
    .catch(() => {})
}, [])
```

- [ ] **Step 3: saveEdit funksiyasini yangilash**

Mavjud `saveEdit` funksiyani toping va API ga save qiluvchi kod qo'shing:

```jsx
const saveEdit = async () => {
  try {
    const name = `${draft.firstName} ${draft.lastName}`.trim()
    await api.patch('/users/me', {
      name,
      favGenres: draft.hobbies,
      favAuthors: draft.favAuthors || [],
    })
    setUserData({ ...draft })
    setEditing(false)
  } catch (e) {
    alert(e.response?.data?.message || 'Saqlashda xato yuz berdi')
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/ProfilePage.jsx
git commit -m "feat: ProfilePage loads and saves data from backend /users/me"
```

---

## Yakuniy tekshiruv

- [ ] Backend server ishlayapti (`npm run dev`)
- [ ] Frontend server ishlayapti (`npm run dev`)
- [ ] Admin → Authors tab: add/edit/delete ishlaydi
- [ ] Admin → Books tab: add book (author autocomplete), kitob saqlanadi, PDF yuklanadi
- [ ] Bosh sahifa (NewArrivals): real kitoblar ko'rsatiladi
- [ ] BookDetailPage: `/books/:id` dan real ma'lumot
- [ ] BookReaderPage: PDF viewer ko'rsatiladi
- [ ] ProfilePage: login qilingan foydalanuvchi ma'lumotlari ko'rsatiladi va tahrir qilinadi

---

## Muhim eslatmalar

1. **Cloudinary env vars:** Render deploy'da ham `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` ni qo'shing.
2. **`/me` route order:** `router.get('/me', ...)` `router.get('/:id', ...)` dan **OLDIN** bo'lishi shart.
3. **react-pdf CORS:** Cloudinary PDF URL'lariga CORS ruxsat berilgan — muammo bo'lmaydi.
4. **Author ref populate:** Barcha book query'larida `.populate('author', 'name ...')` qo'shilgan.

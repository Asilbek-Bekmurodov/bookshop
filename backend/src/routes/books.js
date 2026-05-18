import { Router } from 'express';
import Book from '../models/Book.js';
import Author from '../models/Author.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { uploadPdf, uploadToSupabase } from '../config/cloudinary.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Kitoblar CRUD va PDF yuklash
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Barcha kitoblar ro'yxati
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nechta kitob qaytarilsin (0 = hammasi)
 *     responses:
 *       200:
 *         description: Kitoblar massivi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
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

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Yangi kitob yaratish (admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Yaratilgan kitob
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Majburiy maydon yo'q
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Bitta kitob
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kitob ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kitob topilmadi
 */
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author', 'name nationality photo bio');
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const {
      title, authorId, authorName, category, price, originalPrice,
      rating, stock, description, coverColor, badge, genre,
      isFree, pageCount, publishedYear,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'title majburiy' });

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

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Kitobni tahrirlash (admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Yangilangan kitob
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Kitob topilmadi
 *   delete:
 *     summary: Kitobni o'chirish (admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: O'chirildi
 *       404:
 *         description: Kitob topilmadi
 */
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

router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}/upload-pdf:
 *   post:
 *     summary: Kitobga PDF yuklash (admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: PDF fayl (max 50MB)
 *     responses:
 *       200:
 *         description: PDF yuklandi, kitob yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: PDF fayl yuborilmadi
 *       404:
 *         description: Kitob topilmadi
 */
router.post('/:id/upload-pdf', protect, requireAdmin, uploadPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'PDF fayl yuborilmadi' });
    const pdfUrl = await uploadToSupabase(req.file.buffer, req.file.originalname);
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { pdfUrl },
      { new: true }
    ).populate('author', 'name nationality photo');
    if (!book) return res.status(404).json({ message: 'Kitob topilmadi' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

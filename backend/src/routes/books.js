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

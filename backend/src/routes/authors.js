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

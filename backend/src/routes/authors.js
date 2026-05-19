import { Router } from 'express';
import Author from '../models/Author.js';
import { protect, requireAdmin } from '../middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Mualliflar CRUD
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Barcha mualliflar ro'yxati
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Mualliflar massivi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *   post:
 *     summary: Yangi muallif yaratish (admin)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fyodor Dostoevsky
 *               bio:
 *                 type: string
 *                 example: Rus yozuvchisi
 *               nationality:
 *                 type: string
 *                 example: Russian
 *               photo:
 *                 type: string
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: Yaratilgan muallif
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: name majburiy yoki bu nom bilan muallif mavjud
 *       401:
 *         description: Avtorizatsiya talab qilinadi
 */

/**
 * @swagger
 * /api/authors/search:
 *   get:
 *     summary: Muallif nomi bo'yicha qidirish (autocomplete)
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Qidiruv so'zi (kamida 1 harf)
 *         example: Dost
 *     responses:
 *       200:
 *         description: Mos kelgan mualliflar (max 10)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 */

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Bitta muallif ma'lumotlari
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muallif ma'lumoti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Muallif topilmadi
 *   put:
 *     summary: Muallifni tahrirlash (admin)
 *     tags: [Authors]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               nationality:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yangilangan muallif
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Muallif topilmadi
 *   delete:
 *     summary: Muallifni o'chirish (admin)
 *     tags: [Authors]
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
 *         description: Muallif topilmadi
 */

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

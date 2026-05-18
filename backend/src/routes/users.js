import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Foydalanuvchilarni boshqarish (faqat admin)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Barcha foydalanuvchilar ro'yxati
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token yo'q
 *       403:
 *         description: Admin emas
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Bitta foydalanuvchi
 *     tags: [Users]
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
 *         description: Foydalanuvchi ma'lumoti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Topilmadi
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yangi foydalanuvchi yaratish
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ali Karimov
 *               email:
 *                 type: string
 *                 example: ali@example.com
 *               password:
 *                 type: string
 *                 example: parol123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: Yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Noto'g'ri ma'lumot yoki email band
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Foydalanuvchini tahrirlash
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               password:
 *                 type: string
 *                 description: Bo'sh qoldirilsa o'zgarmaydi
 *     responses:
 *       200:
 *         description: Yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Topilmadi
 *   delete:
 *     summary: Foydalanuvchini o'chirish
 *     tags: [Users]
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
 *         description: Topilmadi
 */

const router = Router();

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

router.use(protect, requireAdmin);

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash -refreshTokens').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -refreshTokens');
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, age, favAuthors, favGenres } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email va password majburiy' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Bu email band' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, passwordHash,
      role: role || 'user',
      age: age || null,
      favAuthors: favAuthors || [],
      favGenres: favGenres || [],
    });
    res.status(201).json(user.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { name, email, role, age, favAuthors, favGenres, password } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (role !== undefined) update.role = role;
    if (age !== undefined) update.age = age;
    if (favAuthors !== undefined) update.favAuthors = favAuthors;
    if (favGenres !== undefined) update.favGenres = favGenres;
    if (password) update.passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('-passwordHash -refreshTokens');
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

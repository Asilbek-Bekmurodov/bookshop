import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const signAccess = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

const signRefresh = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish (faqat user role)
 *     tags: [Auth]
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
 *                 minLength: 8
 *                 example: parol123
 *               age:
 *                 type: integer
 *                 minimum: 5
 *                 maximum: 120
 *                 example: 25
 *               favAuthor:
 *                 type: string
 *                 example: Fyodor Dostoevsky
 *               favGenre:
 *                 type: string
 *                 enum: [Fiction, Non-fiction, Mystery, Science Fiction, Fantasy, Romance, History, Self-help, Thriller, Biography]
 *                 example: Fiction
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tish
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Noto'g'ri ma'lumot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email allaqachon mavjud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, favAuthor, favGenre } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Barcha maydonlarni to\'ldiring' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Parol kamida 8 ta belgi bo\'lishi kerak' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Bu email allaqachon ro\'yxatdan o\'tgan' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, passwordHash, role: 'user',
      age: age || null,
      favAuthor: favAuthor || null,
      favGenre: favGenre || null,
    });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ali@example.com
 *               password:
 *                 type: string
 *                 example: parol123
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirish. refreshToken httpOnly cookie da qaytadi.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Email yoki parol noto'g'ri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email va parolni kiriting' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email yoki parol noto\'g\'ri' });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken, user: user.toSafeObject() });
  } catch {
    res.status(500).json({ message: 'Server xatosi' });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Yangi access token olish
 *     tags: [Auth]
 *     description: refreshToken httpOnly cookie orqali yuboriladi. Yangi access token + rotated refresh token qaytaradi.
 *     responses:
 *       200:
 *         description: Yangi tokenlar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Refresh token yo'q yoki yaroqsiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token yo\'q' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.refreshTokens.includes(token))
      return res.status(401).json({ message: 'Token yaroqsiz' });

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    const newRefresh = signRefresh(user);
    user.refreshTokens.push(newRefresh);
    await user.save();

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken: signAccess(user), user: user.toSafeObject() });
  } catch {
    res.status(401).json({ message: 'Token muddati o\'tgan' });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Tizimdan chiqish
 *     tags: [Auth]
 *     description: refreshToken cookie ni o'chiradi va DB dan tokenni o'chiradi.
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqish
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chiqildi
 */
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET).catch?.(() => null);
      if (payload) {
        const user = await User.findById(payload.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
          await user.save();
        }
      }
    }
  } catch { /* ignore */ }
  res.clearCookie('refreshToken');
  res.json({ message: 'Chiqildi' });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Joriy foydalanuvchi ma'lumoti
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumoti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token yo'q yoki yaroqsiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Topilmadi' });
  res.json({ user: user.toSafeObject() });
});

export default router;

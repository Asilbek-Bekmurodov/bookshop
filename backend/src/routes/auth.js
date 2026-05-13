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

// POST /api/auth/register  — faqat "user" role
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Barcha maydonlarni to\'ldiring' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Parol kamida 8 ta belgi bo\'lishi kerak' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Bu email allaqachon ro\'yxatdan o\'tgan' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: 'user' });

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

// POST /api/auth/login
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

// POST /api/auth/refresh
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

// POST /api/auth/logout
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

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Topilmadi' });
  res.json({ user: user.toSafeObject() });
});

export default router;

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = Router();
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

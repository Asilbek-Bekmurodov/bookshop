import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedAdmin = async () => {
  const exists = await User.findOne({ role: 'admin' });
  if (exists) return;

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12);
  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@bookshop.com',
    passwordHash,
    role: 'admin',
  });
  console.log('Admin yaratildi:', process.env.ADMIN_EMAIL || 'admin@bookshop.com');
};

export default seedAdmin;

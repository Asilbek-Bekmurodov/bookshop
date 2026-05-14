import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const GENRES = [
  'Fiction', 'Non-fiction', 'Mystery', 'Science Fiction',
  'Fantasy', 'Romance', 'History', 'Self-help', 'Thriller', 'Biography',
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokens: [String],
    age: { type: Number, min: 5, max: 120, default: null },
    favAuthor: { type: String, trim: true, default: null },
    favGenre: { type: String, enum: [...GENRES, null], default: null },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    age: this.age,
    favAuthor: this.favAuthor,
    favGenre: this.favGenre,
  };
};

export default mongoose.model('User', userSchema);

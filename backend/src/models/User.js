import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const VALID_GENRES = [
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
    favAuthors: { type: [String], default: [] },
    favGenres: { type: [{ type: String, enum: VALID_GENRES }], default: [] },
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
    favAuthors: this.favAuthors,
    favGenres: this.favGenres,
  };
};

export default mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const CATEGORIES = [
  'Fiction', 'Non-fiction', 'Mystery', 'Science Fiction',
  'Fantasy', 'Romance', 'History', 'Self-help', 'Thriller',
  'Biography', 'Philosophy', 'Psychology', 'Sci-Fi',
];

const COVER_COLORS = ['green', 'blue', 'purple', 'red', 'dark', 'orange', 'teal'];

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    category: { type: String, enum: CATEGORIES, default: 'Fiction' },
    price: { type: Number, default: 0, min: 0 },
    originalPrice: { type: Number, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: '' },
    coverColor: { type: String, enum: COVER_COLORS, default: 'green' },
    badge: { type: String, enum: ['Bestseller', 'New', 'Hot', ''], default: '' },
    genre: { type: String, default: '' },
    isFree: { type: Boolean, default: false },
    pageCount: { type: Number, default: null },
    publishedYear: { type: Number, default: null },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);

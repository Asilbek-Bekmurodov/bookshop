import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    bio: { type: String, default: '' },
    nationality: { type: String, default: '' },
    photo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Author', authorSchema);

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import seedAdmin from './config/seedAdmin.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.get('/', (req, res) => res.json({ message: 'Bookshop API ishlayapti' }));

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlamoqda`));
});

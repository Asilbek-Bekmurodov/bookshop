import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import seedAdmin from './config/seedAdmin.js';
import authRouter from './routes/auth.js';
import swaggerSpec from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // dev da localhost:* har qanday portga ruxsat
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: ${origin} ruxsatsiz`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

app.get('/', (req, res) => res.json({ message: 'Bookshop API ishlayapti', docs: '/api/docs' }));

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlamoqda`));
});

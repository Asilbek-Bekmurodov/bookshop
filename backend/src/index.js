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

app.use(cors({
  origin: true,
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

import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/database.js';
import { prisma } from './config/prisma.js';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
  }
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch {
    process.exit(1);
  }
};

start();

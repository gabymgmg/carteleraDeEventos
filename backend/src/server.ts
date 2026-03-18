import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';

const app: Application = express();
const allowedOrigins = [
  'http://localhost:5173', // Local Dev
  process.env.FRONTEND_URL  // Vercel URL
];
// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS policy: This origin is not allowed'), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json()); // Allows to receive JSON data
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Simple Smoke Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Cartelera de eventos API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

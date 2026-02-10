import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
  })
);
app.use(express.json()); // Allows to receive JSON data
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Simple Smoke Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Cartelera de eventos API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

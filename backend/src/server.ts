import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

const app: Application = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to receive JSON data

// Simple Smoke Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Cartelera de eventos API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

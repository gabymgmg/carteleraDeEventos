import express from 'express';
import { login, register, forgotPassword, resetPassword } from '../controllers/authController';


const router = express.Router();

// Register Route
router.post('/register', register);
// Login Route
router.post('/login', login);
// Routes for password recovery
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;

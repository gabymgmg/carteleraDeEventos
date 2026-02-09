import express from 'express';
import { approveUser, getPendingUsers } from '../controllers/userController';
import { admin, protect } from '../middleware/authMiddleware';

const router = express.Router();

// Admin routes for user approval
router.get('/pending', protect, admin, getPendingUsers);
router.put('/approve/:id', protect, admin, approveUser);

export default router;

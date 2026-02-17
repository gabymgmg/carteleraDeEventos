import express from 'express';
import {
  approveUser,
  getPendingUsers,
  getUserProfile,
  editUserProfile,
  changePassword,
} from '../controllers/userController';
import { admin, protect } from '../middleware/authMiddleware';

const router = express.Router();

// Admin routes for user approval
router.get('/pending', protect, admin, getPendingUsers);
router.put('/approve/:id', protect, admin, approveUser);
// Route for user edit profile (private)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, editUserProfile);
router.patch('/change-password', protect, changePassword);
export default router;

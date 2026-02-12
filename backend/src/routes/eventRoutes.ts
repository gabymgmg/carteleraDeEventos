import express from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  updateEvent,
} from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Routes for event management (private)
router.post('/', protect, createEvent);
router.get('/my-events', protect, getMyEvents);
router.delete('/:id', protect, deleteEvent);
router.get('/:id', protect, getEventById);
router.put('/:id', protect, updateEvent);

// Public route to get all events
router.get('/', getAllEvents);

export default router;

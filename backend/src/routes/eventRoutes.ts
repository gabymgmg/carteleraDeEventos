import express from 'express';
import { createEvent, deleteEvent, getMyEvents, updateEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Routes for event management
router.post('/', protect, createEvent);
router.get('/my-events', protect, getMyEvents);
router.delete('/:id', protect, deleteEvent);
router.put('/:id', protect, updateEvent);

export default router;
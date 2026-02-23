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
import uploadCloud from '../config/cloudinary';

const router = express.Router();

// Routes for event management (private)
router.post(
  '/',
  protect,
  (req, res, next) => {
    uploadCloud.single('image')(req, res, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: 'Error en la subida', detail: err.message });
      }
      next();
    });
  },
  createEvent
);
router.get('/my-events', protect, getMyEvents);
router.delete('/:id', protect, deleteEvent);
router.put('/:id', protect, updateEvent);

// Public route to get events
router.get('/', getAllEvents);
router.get('/:id', getEventById);

export default router;

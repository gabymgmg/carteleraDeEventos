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
  uploadCloud.single('image'), // 1. Primero procesamos el archivo
  (req, res, next) => {        // 2. Luego vemos qué llegó
    console.log('--- DIAGNÓSTICO POST-MULTER ---');
    console.log('¿Hay archivo?:', !!req.file);
    console.log('Contenido del Body:', req.body);
    next();
  },
  createEvent                  // 3. Finalmente guardamos
);
router.get('/my-events', protect, getMyEvents);
router.delete('/:id', protect, deleteEvent);
router.put('/:id', protect, uploadCloud.single('image'), updateEvent);
// Public route to get events
router.get('/', getAllEvents);
router.get('/:id', getEventById);

export default router;

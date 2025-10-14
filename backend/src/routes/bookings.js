import express from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  confirmBooking
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas, validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Booking routes
router.get('/', validateQuery(querySchemas.pagination), getBookings);
router.get('/:bookingId', getBooking);
router.post('/', validate(schemas.createSession), createBooking);
router.put('/:bookingId', validate(schemas.updateSession), updateBooking);
router.post('/:bookingId/cancel', cancelBooking);
router.post('/:bookingId/confirm', confirmBooking);

export default router;

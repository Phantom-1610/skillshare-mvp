import express from 'express';
import {
  getDashboard,
  getUsers,
  getUser,
  updateUserStatus,
  getReviews,
  moderateReview,
  getSessions,
  getMessages,
  getSystemStats
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate, schemas, validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', getDashboard);
router.get('/stats', getSystemStats);

// User management
router.get('/users', validateQuery(querySchemas.pagination), getUsers);
router.get('/users/:userId', getUser);
router.put('/users/:userId/status', validate(schemas.updateUserStatus), updateUserStatus);

// Content moderation
router.get('/reviews', validateQuery(querySchemas.pagination), getReviews);
router.post('/reviews/:reviewId/moderate', validate(schemas.moderateReview), moderateReview);

// Session management
router.get('/sessions', validateQuery(querySchemas.pagination), getSessions);

// Message management
router.get('/messages', validateQuery(querySchemas.pagination), getMessages);

export default router;

import express from 'express';
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  flagReview,
  getReviewsForUser
} from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas, validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Review routes
router.get('/', validateQuery(querySchemas.pagination), getReviews);
router.get('/user/:userId', getReviewsForUser);
router.get('/:reviewId', getReview);
router.post('/', validate(schemas.createReview), createReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
router.post('/:reviewId/flag', flagReview);

export default router;

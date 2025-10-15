import express from 'express';
import {
  getUsers,
  getUser,
  updateProfile,
  addSkill,
  removeSkill,
  updateAvailability,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserStats
} from '../controllers/userController.js';
import { authenticateToken, requireOwnershipOrAdmin } from '../middleware/auth.js';
import { validate, schemas, validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validateQuery(querySchemas.userSearch), getUsers);
router.get('/:userId', getUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/stats', getUserStats);

// Protected routes
router.put('/profile', authenticateToken, validate(schemas.updateProfile), updateProfile);
router.post('/skills', authenticateToken, validate(schemas.addSkill), addSkill);
router.delete('/skills/:skillId', authenticateToken, removeSkill);
router.put('/availability', authenticateToken, validate(schemas.updateAvailability), updateAvailability);
router.post('/:userId/follow', authenticateToken, followUser);
router.delete('/:userId/follow', authenticateToken, unfollowUser);

export default router;


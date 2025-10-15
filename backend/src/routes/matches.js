import express from 'express';
import {
  getMatches,
  getMatch,
  createMatch,
  acceptMatch,
  declineMatch,
  getMatchHistory
} from '../controllers/matchController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas, validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Match routes
router.get('/', validateQuery(querySchemas.pagination), getMatches);
router.get('/history', getMatchHistory);
router.get('/:matchId', getMatch);
router.post('/', validate(schemas.createMatch), createMatch);
router.post('/:matchId/accept', acceptMatch);
router.post('/:matchId/decline', declineMatch);

export default router;


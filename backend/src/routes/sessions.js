import express from 'express';
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  cancelSession,
  startSession,
  endSession,
  getSessionMaterials
} from '../controllers/sessionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas, validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Session routes
router.get('/', validateQuery(querySchemas.pagination), getSessions);
router.get('/:sessionId', getSession);
router.get('/:sessionId/materials', getSessionMaterials);
router.post('/', validate(schemas.createSession), createSession);
router.put('/:sessionId', validate(schemas.updateSession), updateSession);
router.post('/:sessionId/cancel', cancelSession);
router.post('/:sessionId/start', startSession);
router.post('/:sessionId/end', endSession);

export default router;




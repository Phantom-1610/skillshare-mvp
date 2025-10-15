import express from 'express';
import {
  getSkills,
  getSkill,
  searchSkills,
  getPopularSkills,
  getSkillCategories
} from '../controllers/skillController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validateQuery, querySchemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', validateQuery(querySchemas.pagination), getSkills);
router.get('/search', searchSkills);
router.get('/popular', getPopularSkills);
router.get('/categories', getSkillCategories);
router.get('/:skillId', getSkill);

export default router;


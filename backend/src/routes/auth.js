import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  logout
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.put('/update-password', authenticateToken, updatePassword);
router.post('/resend-verification', authenticateToken, resendVerification);
router.post('/logout', authenticateToken, logout);

export default router;


import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', verifyJwt, getMe);
router.patch('/update-profile', verifyJwt, updateProfile);
router.patch('/change-password', verifyJwt, changePassword);

export default router;

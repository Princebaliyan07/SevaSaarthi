import express from 'express';
import {
  registerFirstResponder,
  searchFirstResponders,
  getAllFirstResponders,
  toggleActive,
  sendAadhaarOtp,
  verifyAadhaarOtp,
  getAdminResponders,
  approveFirstResponder,
  rejectFirstResponder,
  deleteFirstResponder,
} from '../controllers/firstResponder.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/register', registerFirstResponder);
router.get('/search', searchFirstResponders);
router.get('/', getAllFirstResponders);
router.patch('/:id/toggle', toggleActive);
router.post('/aadhaar-otp/send', sendAadhaarOtp);
router.post('/aadhaar-otp/verify', verifyAadhaarOtp);

// Protected Admin Routes — Strictly require verified administrator token
router.get('/admin/all', verifyJwt, authorizeRoles('admin'), getAdminResponders);
router.patch('/:id/approve', verifyJwt, authorizeRoles('admin'), approveFirstResponder);
router.patch('/:id/reject', verifyJwt, authorizeRoles('admin'), rejectFirstResponder);
router.delete('/:id', verifyJwt, authorizeRoles('admin'), deleteFirstResponder);

export default router;

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

const router = express.Router();

router.post('/register', registerFirstResponder);
router.get('/search', searchFirstResponders);
router.get('/', getAllFirstResponders);
router.patch('/:id/toggle', toggleActive);
router.post('/aadhaar-otp/send', sendAadhaarOtp);
router.post('/aadhaar-otp/verify', verifyAadhaarOtp);

// Admin routes
router.get('/admin/all', getAdminResponders);
router.patch('/:id/approve', approveFirstResponder);
router.patch('/:id/reject', rejectFirstResponder);
router.delete('/:id', deleteFirstResponder);

export default router;


import express from 'express';
import {
  registerFirstResponder,
  searchFirstResponders,
  getAllFirstResponders,
  toggleActive,
  sendAadhaarOtp,
  verifyAadhaarOtp,
} from '../controllers/firstResponder.controller.js';

const router = express.Router();

router.post('/register', registerFirstResponder);
router.get('/search', searchFirstResponders);
router.get('/', getAllFirstResponders);
router.patch('/:id/toggle', toggleActive);
router.post('/aadhaar-otp/send', sendAadhaarOtp);
router.post('/aadhaar-otp/verify', verifyAadhaarOtp);

export default router;

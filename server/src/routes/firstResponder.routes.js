import express from 'express';
import {
  registerFirstResponder,
  searchFirstResponders,
  getAllFirstResponders,
  toggleActive,
} from '../controllers/firstResponder.controller.js';

const router = express.Router();

router.post('/register', registerFirstResponder);
router.get('/search', searchFirstResponders);
router.get('/', getAllFirstResponders);
router.patch('/:id/toggle', toggleActive);

export default router;

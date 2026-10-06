import { Router } from 'express';
import {
  getMedicinesList,
  getMedicineById,
  comparePrice,
} from '../controllers/medicine.controller.js';

const router = Router();

router.get('/', getMedicinesList);
router.get('/compare', comparePrice);
router.get('/:id', getMedicineById);

export default router;

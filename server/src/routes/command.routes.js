import { Router } from 'express';
import { getCommandStats } from '../controllers/incident.controller.js';

const router = Router();

router.get('/stats', getCommandStats);

export default router;

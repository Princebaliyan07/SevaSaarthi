import { Router } from 'express';
import { chatTriage, legacyTriage } from '../controllers/ai.controller.js';

const router = Router();

// POST /api/v1/ai/chat - Frontend chatbot interaction
router.post('/chat', chatTriage);

// POST /api/v1/ai/triage - Direct triage keyword assessment
router.post('/triage', legacyTriage);

export default router;

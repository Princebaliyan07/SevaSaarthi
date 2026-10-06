import { Router } from 'express';
import {
  getMelaOverview,
  reportMissingPerson,
  getMissingPersonsList,
  reuniteMissingPerson,
} from '../controllers/mela.controller.js';
import { validateMissingPersonReport } from '../validators/missingPerson.validator.js';

const router = Router();

// Overview & Crowd density
router.get('/crowd-status', getMelaOverview);
router.get('/overview', getMelaOverview);

// Missing person reporting & tracking
router.post('/missing-persons', validateMissingPersonReport, reportMissingPerson);
router.post('/missing', validateMissingPersonReport, reportMissingPerson);
router.get('/missing-persons', getMissingPersonsList);
router.patch('/missing-persons/:id/reunite', reuniteMissingPerson);

export default router;

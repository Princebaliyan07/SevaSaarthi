import { Router } from 'express';
import {
  getLiveIncidents,
  getIncidents,
  reportIncident,
  updateIncidentStatus,
  getIncidentById,
  triggerSync,
  getIncidentStats,
  deleteIncident,
} from '../controllers/incident.controller.js';
import { emergencyLimiter } from '../middlewares/rateLimit.middleware.js';
import { validateIncidentReport } from '../validators/incident.validator.js';

const router = Router();

// GET /api/v1/incidents/live - Main live feed with filtering (NASA EONET + NDMA SACHET)
router.get('/live', getLiveIncidents);

// GET /api/v1/incidents - All active incidents for situation board
router.get('/', getIncidents);

// POST /api/v1/incidents - Report 112 SOS incident
router.post('/', emergencyLimiter, validateIncidentReport, reportIncident);

// GET /api/v1/incidents/stats - Aggregate metrics
router.get('/stats', getIncidentStats);

// POST /api/v1/incidents/sync - Manual telemetry sync trigger
router.post('/sync', triggerSync);

// PATCH /api/v1/incidents/:id/status - Update incident status
router.patch('/:id/status', updateIncidentStatus);

// DELETE /api/v1/incidents/:id - Delete an incident
router.delete('/:id', deleteIncident);

// GET /api/v1/incidents/:id - Single incident details
router.get('/:id', getIncidentById);

export default router;

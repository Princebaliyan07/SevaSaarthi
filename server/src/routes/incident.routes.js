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
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// GET /api/v1/incidents/live - Main live feed with filtering (NASA EONET + NDMA SACHET)
router.get('/live', getLiveIncidents);

// GET /api/v1/incidents - All active incidents for situation board
router.get('/', getIncidents);

// POST /api/v1/incidents - Report 112 SOS incident
router.post('/', emergencyLimiter, validateIncidentReport, reportIncident);

// GET /api/v1/incidents/stats - Aggregate metrics
router.get('/stats', getIncidentStats);

// POST /api/v1/incidents/sync - Manual telemetry sync trigger (Admin only)
router.post('/sync', verifyJwt, authorizeRoles('admin'), triggerSync);

// PATCH /api/v1/incidents/:id/status - Update incident status (Authorized responders and admins only)
router.patch('/:id/status', verifyJwt, authorizeRoles('admin', 'responder', 'doctor'), updateIncidentStatus);

// DELETE /api/v1/incidents/:id - Delete an incident (Admin only)
router.delete('/:id', verifyJwt, authorizeRoles('admin'), deleteIncident);

// GET /api/v1/incidents/:id - Single incident details
router.get('/:id', getIncidentById);

export default router;

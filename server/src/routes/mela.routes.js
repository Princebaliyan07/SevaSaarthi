import { Router } from 'express';
import {
  getMelaOverview,
  reportMissingPerson,
  getMissingPersonsList,
  reuniteMissingPerson,
} from '../controllers/mela.controller.js';
import {
  getMelaFacilities,
  createMelaFacility,
  updateMelaFacility,
  deleteMelaFacility,
  createLostFoundReport,
  getLostFoundReports,
  getReportDetails,
  updateReportStatus,
  submitPossibleMatch,
  sendReportMessage,
  getMelaAlerts,
  createMelaAlert,
  updateMelaAlert,
  resolveMelaAlert,
} from '../controllers/melaCore.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';
import { validateMissingPersonReport } from '../validators/missingPerson.validator.js';

const router = Router();

// ==========================================
// 1. LEGACY MELA OVERVIEW & COMPATIBILITY
// ==========================================
router.get('/crowd-status', getMelaOverview);
router.get('/overview', getMelaOverview);
router.post('/missing-persons', validateMissingPersonReport, reportMissingPerson);
router.post('/missing', validateMissingPersonReport, reportMissingPerson);
router.get('/missing-persons', getMissingPersonsList);
router.patch('/missing-persons/:id/reunite', reuniteMissingPerson);

// ==========================================
// FEATURE 1: INTERACTIVE MELA MAP FACILITIES
// ==========================================
// Public view
router.get('/facilities', getMelaFacilities);

// Admin-controlled facility management (verified server-side)
router.post('/facilities', verifyJwt, authorizeRoles('admin'), createMelaFacility);
router.patch('/facilities/:id', verifyJwt, authorizeRoles('admin'), updateMelaFacility);
router.delete('/facilities/:id', verifyJwt, authorizeRoles('admin'), deleteMelaFacility);

// ==========================================
// FEATURE 2: MISSING PERSONS & LOST AND FOUND
// ==========================================
// Public submission & public sanitized directory
router.post('/reports', createLostFoundReport);
router.get('/reports', getLostFoundReports);
router.get('/reports/:id', getReportDetails);

// Submit a possible match (public with validation)
router.post('/reports/:id/match', submitPossibleMatch);

// Admin review workflow: change status
router.patch('/reports/:id/status', verifyJwt, authorizeRoles('admin'), updateReportStatus);

// Report-linked secure private messaging (reporter via secretKey or admin via JWT)
router.post('/reports/:id/messages', sendReportMessage);

// ==========================================
// FEATURE 3: ADMIN-CONTROLLED CROWD ALERTS
// ==========================================
// Public active alerts
router.get('/alerts', getMelaAlerts);

// Admin-controlled alert management
router.post('/alerts', verifyJwt, authorizeRoles('admin'), createMelaAlert);
router.patch('/alerts/:id', verifyJwt, authorizeRoles('admin'), updateMelaAlert);
router.patch('/alerts/:id/resolve', verifyJwt, authorizeRoles('admin'), resolveMelaAlert);

export default router;

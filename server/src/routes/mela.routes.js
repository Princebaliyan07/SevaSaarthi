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
  deleteLostFoundReport,
  getMelaAlerts,
  createMelaAlert,
  updateMelaAlert,
  resolveMelaAlert,
  deleteMelaAlert,
  getMelaMaps,
  createMelaMap,
  deleteMelaMap,
  getCrowdZones,
  createCrowdZone,
  updateCrowdZone,
  deleteCrowdZone,
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
router.get('/facilities', getMelaFacilities);
router.post('/facilities', verifyJwt, authorizeRoles('admin'), createMelaFacility);
router.patch('/facilities/:id', verifyJwt, authorizeRoles('admin'), updateMelaFacility);
router.delete('/facilities/:id', verifyJwt, authorizeRoles('admin'), deleteMelaFacility);

// ==========================================
// FEATURE 2: MISSING PERSONS & LOST AND FOUND
// ==========================================
router.post('/reports', createLostFoundReport);
router.get('/reports', getLostFoundReports);
router.get('/reports/:id', getReportDetails);
router.post('/reports/:id/match', submitPossibleMatch);
router.patch('/reports/:id/status', verifyJwt, authorizeRoles('admin'), updateReportStatus);
router.delete('/reports/:id', verifyJwt, authorizeRoles('admin'), deleteLostFoundReport);
router.post('/reports/:id/messages', sendReportMessage);


// ==========================================
// FEATURE 3: ADMIN-CONTROLLED CROWD ALERTS
// ==========================================
router.get('/alerts', getMelaAlerts);
router.post('/alerts', verifyJwt, authorizeRoles('admin'), createMelaAlert);
router.patch('/alerts/:id', verifyJwt, authorizeRoles('admin'), updateMelaAlert);
router.patch('/alerts/:id/resolve', verifyJwt, authorizeRoles('admin'), resolveMelaAlert);
router.delete('/alerts/:id', verifyJwt, authorizeRoles('admin'), deleteMelaAlert);

// ==========================================
// FEATURE 4: MULTIPLE GROUND MAPS
// ==========================================
router.get('/maps', getMelaMaps);
router.post('/maps', verifyJwt, authorizeRoles('admin'), createMelaMap);
router.delete('/maps/:mapId', verifyJwt, authorizeRoles('admin'), deleteMelaMap);

// ==========================================
// FEATURE 5: CROWD DENSITY ZONES — FULLY DYNAMIC
// ==========================================
router.get('/crowd-zones', getCrowdZones);                                        // public
router.post('/crowd-zones', verifyJwt, authorizeRoles('admin'), createCrowdZone); // admin: add zone
router.patch('/crowd-zones/:id', verifyJwt, authorizeRoles('admin'), updateCrowdZone); // admin: update
router.delete('/crowd-zones/:id', verifyJwt, authorizeRoles('admin'), deleteCrowdZone); // admin: delete

export default router;

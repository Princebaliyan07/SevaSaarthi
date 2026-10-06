import { Router } from 'express';
import {
  getActiveAlerts,
  getGisLayers,
  triggerSyncController,
  getSyncStatusController,
  createAdminAlert,
} from '../controllers/disaster.controller.js';

const router = Router();

router.get('/alerts', getActiveAlerts);
router.get('/active', getActiveAlerts);
router.get('/gis', getGisLayers);
router.post('/sync', triggerSyncController);
router.get('/sync/status', getSyncStatusController);
router.post('/alerts', createAdminAlert);

export default router;

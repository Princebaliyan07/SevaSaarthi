import { Router } from 'express';
import {
  getVolunteerTeams,
  registerVolunteer,
  getDeliveryRequests,
  createDeliveryRequest,
  claimDeliveryRequest,
  updateDeliveryStatus,
} from '../controllers/volunteer.controller.js';

const router = Router();

// Volunteer Teams
router.get('/teams', getVolunteerTeams);
router.post('/register', registerVolunteer);

// Medicine / Flood Delivery Requests
router.get('/deliveries', getDeliveryRequests);
router.post('/deliveries', createDeliveryRequest);
router.patch('/deliveries/:id/claim', claimDeliveryRequest);
router.patch('/deliveries/:id/status', updateDeliveryStatus);

export default router;

import { Router } from 'express';
import {
  getHospitalsList,
  getHospitalById,
  getNearestEmergencyHospital,
  geocodeLocation,
  updateBeds,
  getDoctorsList,
  bookAppointment,
} from '../controllers/hospital.controller.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Hospitals
router.get('/', getHospitalsList);
router.get('/meta/emergency-nearest', getNearestEmergencyHospital);
router.get('/meta/geocode', geocodeLocation);
router.get('/:id', getHospitalById);
router.patch('/:id/beds', verifyJwt, authorizeRoles('admin', 'responder', 'doctor'), updateBeds);

// Doctors & Appointments
router.get('/meta/doctors', getDoctorsList);
router.post('/meta/appointments', bookAppointment);

export default router;

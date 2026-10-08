import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Route imports
import authRoutes from './routes/auth.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import medicineRoutes from './routes/medicine.routes.js';
import melaRoutes from './routes/mela.routes.js';
import volunteerRoutes from './routes/volunteer.routes.js';
import disasterRoutes from './routes/disaster.routes.js';
import aiRoutes from './routes/ai.routes.js';
import commandRoutes from './routes/command.routes.js';
import firstResponderRoutes from './routes/firstResponder.routes.js';

// Controller direct delegates for direct frontend paths
import { getDoctorsList, bookAppointment, getHospitalsList } from './controllers/hospital.controller.js';
import { getMedicinesList } from './controllers/medicine.controller.js';
import { reportIncident, getIncidents } from './controllers/incident.controller.js';

import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Security and utility middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true, limit: '16mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve('uploads')));

// Favicon handler
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Health Check API
app.get(['/api/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SevaSaarthi Civic Emergency & Disaster Response Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    telemetrySources: ['NDMA SACHET CAP Feed', 'NASA EONET v3 Satellite', 'IMD Mausam Bhavan'],
  });
});

// Primary API Endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/hospitals', hospitalRoutes);
app.use('/api/v1/medicines', medicineRoutes);
app.use('/api/v1/mela', melaRoutes);
app.use('/api/v1/volunteers', volunteerRoutes);
app.use('/api/v1/disasters', disasterRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/command', commandRoutes);
app.use('/api/v1/first-responders', firstResponderRoutes);

// Direct top-level aliases to guarantee 100% contract compatibility with frontend client calls
app.get('/api/v1/doctors', getDoctorsList);
app.post('/api/v1/appointments', bookAppointment);
app.get('/api/v1/health/hospitals', getHospitalsList);
app.get('/api/v1/health/medicines', getMedicinesList);
app.get('/api/v1/health/doctors', getDoctorsList);
app.post('/api/v1/health/consultation', bookAppointment);

// Emergency routes compatibility
app.post('/api/v1/emergency/report', reportIncident);
app.get('/api/v1/emergency/reports', getIncidents);

// Double-prefix guard for client calling /v1/incidents/live with baseURL /api/v1
app.get('/api/v1/v1/incidents/live', (req, res, next) => {
  req.url = '/live';
  return incidentRoutes(req, res, next);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found on SevaSaarthi backend`,
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;

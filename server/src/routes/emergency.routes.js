import { Router } from 'express';

const router = Router();

const CITIZEN_REPORTS = [];

// POST /api/v1/emergency/report - Citizen 112 SOS Incident Dispatch
router.post('/report', (req, res) => {
  const { title, category, severity, location, voiceAudioUrl } = req.body;
  const incidentId = `SS-EMG-2026-${Date.now().toString().slice(-5)}`;

  const newReport = {
    incidentId,
    title: title || `${category || 'Emergency'} Dispatched`,
    category: category || 'general',
    severity: severity || 'critical',
    location: location || 'Prayagraj Zone 4',
    status: 'assigned',
    reportedAt: new Date(),
    assignedAgency: severity === 'critical' ? '112 Rapid Police & 108 ALS Ambulance' : 'Civil Defence',
    slaMinutesRemaining: 7,
    voiceAudioUrl: voiceAudioUrl || null,
  };

  CITIZEN_REPORTS.unshift(newReport);

  return res.status(201).json({
    success: true,
    message: 'Emergency Dispatch Transmitted to 112 Control Centre',
    incidentId,
    data: newReport,
  });
});

// GET /api/v1/emergency/reports - Active citizen 112 tickets
router.get('/reports', (req, res) => {
  return res.json({
    success: true,
    count: CITIZEN_REPORTS.length,
    data: CITIZEN_REPORTS,
  });
});

export default router;

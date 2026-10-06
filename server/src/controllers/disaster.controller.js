import mongoose from 'mongoose';
import DisasterAlert from '../models/DisasterAlert.model.js';
import Incident from '../models/Incident.model.js';
import { runDisasterSync, getDisasterSyncStatus } from '../services/disasterSync.service.js';
import { queryLiveIncidents } from '../services/incident.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { broadcastEmergencyAlert } from '../services/notification.service.js';

const BASELINE_DISASTER_ALERTS = [
  {
    alertId: 'IMD-NOWCAST-UP-01',
    category: 'Monsoon Flood',
    title: 'IMD Alert: Riverine Inundation Warning Ganga-Yamuna Doab',
    season: 'Monsoon',
    affectedRegion: 'Uttar Pradesh (Prayagraj, Varanasi, Kanpur)',
    severity: 'Orange Alert',
    agency: 'IMD Mausam Bhavan / CWC',
    leadTime: '24 Hours',
    dosAndDonts: [
      'Do not venture near ghats during high discharge.',
      'Follow pontoon bridge restriction notices.',
    ],
    reliefCenterNearby: 'Prayagraj Parade Ground Flood Relief Centre',
    coords: { lat: 25.4358, lng: 81.8463 },
  },
  {
    alertId: 'IMD-NOWCAST-UK-02',
    category: 'Landslide Hazard',
    title: 'IMD Heavy Rainfall & Mountain Slope Vulnerability Warning',
    season: 'Monsoon',
    affectedRegion: 'Uttarakhand (Chamoli, Rudraprayag, Uttarkashi)',
    severity: 'Red Alert',
    agency: 'IMD Dehradun / SDRF',
    leadTime: '12 Hours',
    dosAndDonts: [
      'Avoid night transit on Char Dham highway corridors.',
      'Camp only in designated safe transit camps.',
    ],
    reliefCenterNearby: 'SDRF Mountain Rescue Base Camp, Chamoli',
    coords: { lat: 30.4074, lng: 79.3275 },
  },
];

export const getActiveAlerts = asyncHandler(async (req, res) => {
  const { category, severity, season } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (category) filter.category = category;
      if (severity) filter.severity = severity;
      if (season) filter.season = season;

      const alerts = await DisasterAlert.find(filter).sort({ createdAt: -1 }).lean();
      if (alerts.length > 0) {
        return res.status(200).json(new ApiResponse(200, alerts, 'Active disaster alerts'));
      }
    } catch {
      // fallback
    }
  }

  let list = BASELINE_DISASTER_ALERTS;
  if (category) list = list.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()));
  if (severity) list = list.filter((a) => a.severity.toLowerCase().includes(severity.toLowerCase()));

  return res.status(200).json(new ApiResponse(200, list, 'Active disaster alerts'));
});

export const getGisLayers = asyncHandler(async (req, res) => {
  let incidents = [];

  if (mongoose.connection.readyState === 1) {
    try {
      incidents = await Incident.find({ status: { $in: ['active', 'assigned'] } }).lean();
    } catch {
      // fallback
    }
  }

  if (incidents.length === 0) {
    const live = await queryLiveIncidents({ status: 'all' });
    incidents = live.incidents || [];
  }

  const features = incidents.map((inc) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        inc.longitude || inc.location?.coordinates?.[0] || 81.8463,
        inc.latitude || inc.location?.coordinates?.[1] || 25.4358,
      ],
    },
    properties: {
      id: inc.incidentId,
      title: inc.title,
      disasterType: inc.disasterType,
      severity: inc.severity,
      source: inc.source,
      sourceUrl: inc.sourceUrl,
      verified: inc.verified,
      locationName: inc.locationName || inc.district || inc.state,
      reportedAt: inc.reportedAt,
    },
  }));

  const featureCollection = {
    type: 'FeatureCollection',
    features,
  };

  return res.status(200).json(new ApiResponse(200, featureCollection, 'GIS GeoJSON Layers'));
});

export const triggerSyncController = asyncHandler(async (req, res) => {
  const status = await runDisasterSync();
  return res.status(200).json(new ApiResponse(200, status, 'Disaster telemetry sync completed'));
});

export const getSyncStatusController = asyncHandler(async (req, res) => {
  const status = getDisasterSyncStatus();
  return res.status(200).json(new ApiResponse(200, status, 'Current sync status'));
});

export const createAdminAlert = asyncHandler(async (req, res) => {
  const { title, category, severity, affectedRegion, leadTime, dosAndDonts, lat, lng } = req.body;

  const alertId = `ADMIN-ALERT-${Date.now().toString().slice(-6)}`;
  const alert = {
    alertId,
    title,
    category: category || 'Monsoon Flood',
    severity: severity || 'Orange Alert',
    affectedRegion: affectedRegion || 'All India High Risk Zone',
    agency: 'Command Administration Authority',
    leadTime: leadTime || 'Immediate',
    dosAndDonts: dosAndDonts || ['Follow official guidelines.'],
    coords: {
      lat: lat ? Number(lat) : 25.4358,
      lng: lng ? Number(lng) : 81.8463,
    },
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await DisasterAlert.create(alert);
    } catch {
      // fallback
    }
  }

  BASELINE_DISASTER_ALERTS.unshift(alert);
  broadcastEmergencyAlert('disaster:admin_alert', alert);

  return res.status(201).json(new ApiResponse(201, alert, 'Emergency disaster alert broadcasted'));
});

export default {
  getActiveAlerts,
  getGisLayers,
  triggerSyncController,
  getSyncStatusController,
  createAdminAlert,
};

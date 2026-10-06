import mongoose from 'mongoose';
import MissingPerson from '../models/MissingPerson.model.js';
import { generateIncidentId } from '../utils/idGenerator.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { broadcastEmergencyAlert } from '../services/notification.service.js';

const MELA_ZONES = [
  {
    id: 'z-sangam',
    name: 'Sangam Ghat',
    status: 'Critical',
    color: 'bg-red-200 border-red-400 text-red-950',
    densityPercent: 92,
    advisory: 'Sangam Ghat: crowd critical. Use alternate exit via Gate 4.',
  },
  {
    id: 'z-maingate',
    name: 'Main Gate',
    status: 'High',
    color: 'bg-amber-200 border-amber-400 text-amber-950',
    densityPercent: 78,
    advisory: 'Main Gate: heavy inflow. Barricades active, redirecting to Gate 2.',
  },
  {
    id: 'z-sector1',
    name: 'Camp Sector 1',
    status: 'Moderate',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-950',
    densityPercent: 54,
    advisory: 'Camp Sector 1: smooth transit flow. Sanitation teams on duty.',
  },
  {
    id: 'z-medrow',
    name: 'Medical Camp Row',
    status: 'Normal',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-950',
    densityPercent: 30,
    advisory: 'Medical Camp Row: free movement. Triage doctors standing by.',
  },
  {
    id: 'z-foodwater',
    name: 'Food and Water',
    status: 'Moderate',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-950',
    densityPercent: 49,
    advisory: 'Food & Water Zone: clean RO water points functioning at capacity.',
  },
  {
    id: 'z-shelter',
    name: 'Shelter Area',
    status: 'Normal',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-950',
    densityPercent: 35,
    advisory: 'Shelter Area: comfortable seating and emergency bedding available.',
  },
];

const HELP_POINTS = [
  'Medical camps',
  'Police points',
  'Food and water',
  'Shelters',
  'Toilets',
  'Pharmacies',
  'Entry and exit gates',
  'Evacuation routes',
];

const inMemoryMissingPersons = [
  {
    caseId: 'SS-MELA-2026-000412',
    name: 'Sita Devi',
    age: 65,
    gender: 'Female',
    lastSeenLocation: 'Sangam Gate 3',
    lastSeenTime: '10:15 AM',
    clothing: 'Yellow Saree with red border, carrying cloth bag',
    status: 'Missing',
    nearestHelpDesk: 'Gate 3 Help Desk (400 m)',
    reportedBy: 'Son (Ramesh)',
  },
  {
    caseId: 'SS-MELA-2026-000408',
    name: 'Aarav Patel',
    age: 8,
    gender: 'Male',
    lastSeenLocation: 'Pontoon Bridge 2',
    lastSeenTime: '08:45 AM',
    clothing: 'Blue t-shirt, navy shorts, red cap',
    status: 'Located',
    nearestHelpDesk: 'Sector 2 Police Post',
    reportedBy: 'Mother (Sunita)',
  },
];

export const getMelaOverview = asyncHandler(async (req, res) => {
  let missingCases = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const dbCases = await MissingPerson.find().sort({ createdAt: -1 }).limit(50).lean();
      if (dbCases && dbCases.length > 0) {
        missingCases = dbCases.map((m) => ({
          id: m._id?.toString() || m.caseId,
          _id: m._id?.toString(),
          caseId: m.caseId,
          name: m.name,
          age: m.age,
          gender: m.gender || 'Other',
          photoUrl: m.photoUrl || '',
          lastSeenLocation: m.lastSeenLocation,
          lastSeenTime: m.lastSeenTime,
          clothing: m.clothing,
          status: m.status === 'reunited' ? 'Located' : 'Missing',
          rawStatus: m.status,
          nearestHelpDesk: 'Gate 3 Help Desk (400 m)',
          reportedBy: m.reportedBy,
          contactPhone: m.contactPhone,
          createdAt: m.createdAt,
        }));
      }
    } catch (err) {
      console.error('[Mela Overview DB Error]', err);
    }
  }

  if (missingCases.length === 0 && inMemoryMissingPersons.length > 0) {
    missingCases = [...inMemoryMissingPersons];
  }

  const overview = {
    crowdStatus: 'High Inflow (Amavasya Snan)',
    medicalCamps: 14,
    openIncidents: 6,
    missingReports: missingCases.length,
    helpDesks: 22,
    zones: MELA_ZONES,
    missingCases,
    helpPoints: HELP_POINTS,
  };

  return res.status(200).json(new ApiResponse(200, overview, 'Mela overview telemetry'));
});

export const reportMissingPerson = asyncHandler(async (req, res) => {
  const {
    name,
    age,
    gender = 'Other',
    lastSeenLocation,
    lastSeenTime = 'Just now',
    clothing = 'Standard attire',
    languages = 'Hindi',
    contactPhone = '+91 98765 43210',
    reportedBy = 'Family Member',
    photoUrl = '',
  } = req.body;

  const caseId = generateIncidentId('MELA');

  let savedDoc = null;
  if (mongoose.connection.readyState === 1) {
    try {
      savedDoc = await MissingPerson.create({
        caseId,
        name: name.trim(),
        age: Number(age),
        gender,
        photoUrl,
        lastSeenLocation: lastSeenLocation.trim(),
        lastSeenTime,
        clothing: clothing ? clothing.trim() : 'Standard attire',
        languages,
        contactPhone: contactPhone ? contactPhone.trim() : '+91 98765 43210',
        reportedBy: reportedBy ? reportedBy.trim() : 'Family Member',
        status: 'broadcasting',
      });
    } catch (err) {
      console.error('[MissingPerson MongoDB Save Error]', err);
    }
  }

  const record = savedDoc
    ? {
        id: savedDoc._id?.toString() || savedDoc.caseId,
        _id: savedDoc._id?.toString(),
        caseId: savedDoc.caseId,
        name: savedDoc.name,
        age: savedDoc.age,
        gender: savedDoc.gender,
        photoUrl: savedDoc.photoUrl,
        lastSeenLocation: savedDoc.lastSeenLocation,
        lastSeenTime: savedDoc.lastSeenTime,
        clothing: savedDoc.clothing,
        languages: savedDoc.languages,
        contactPhone: savedDoc.contactPhone,
        reportedBy: savedDoc.reportedBy,
        status: savedDoc.status === 'reunited' ? 'Located' : 'Missing',
        rawStatus: savedDoc.status,
        nearestHelpDesk: 'Gate 3 Help Desk (400 m)',
        createdAt: savedDoc.createdAt,
      }
    : {
        id: caseId,
        caseId,
        name: name.trim(),
        age: Number(age),
        gender,
        photoUrl,
        lastSeenLocation: lastSeenLocation.trim(),
        lastSeenTime,
        clothing: clothing || 'Standard attire',
        languages,
        contactPhone: contactPhone || '+91 98765 43210',
        reportedBy,
        status: 'Missing',
        nearestHelpDesk: 'Gate 3 Help Desk (400 m)',
        createdAt: new Date().toISOString(),
      };

  inMemoryMissingPersons.unshift(record);
  broadcastEmergencyAlert('mela:missing_person', record);

  return res.status(201).json(
    new ApiResponse(201, record, 'Missing person broadcast registered')
  );
});

export const getMissingPersonsList = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const list = await MissingPerson.find().sort({ createdAt: -1 }).lean();
      if (list.length > 0) {
        return res.status(200).json(new ApiResponse(200, list, 'Missing persons list'));
      }
    } catch {
      // fallback
    }
  }
  return res.status(200).json(new ApiResponse(200, inMemoryMissingPersons, 'Missing persons list'));
});

export const reuniteMissingPerson = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await MissingPerson.findOneAndUpdate(
        { $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: { status: 'reunited', reunitedAt: new Date() } },
        { new: true }
      );
      if (updated) {
        broadcastEmergencyAlert('mela:missing_reunited', updated);
        return res.status(200).json(new ApiResponse(200, updated, 'Person marked as reunited'));
      }
    } catch {
      // fallback
    }
  }

  const found = inMemoryMissingPersons.find((m) => m.caseId === id);
  if (found) {
    found.status = 'Located';
    return res.status(200).json(new ApiResponse(200, found, 'Person marked as reunited'));
  }

  throw new ApiError(404, `Missing person record ${id} not found`);
});

export default {
  getMelaOverview,
  reportMissingPerson,
  getMissingPersonsList,
  reuniteMissingPerson,
};

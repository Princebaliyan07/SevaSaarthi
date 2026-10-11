import crypto from 'crypto';
import mongoose from 'mongoose';
import MelaFacility from '../models/MelaFacility.model.js';
import MelaAlert from '../models/MelaAlert.model.js';
import LostFoundReport from '../models/LostFoundReport.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { broadcastEmergencyAlert } from '../services/notification.service.js';

// ==========================================
// SEED DEFAULT BLUEPRINT MELA MAP FACILITIES
// Coordinates mapped cleanly onto 2D blueprint layout (mapX %, mapY %)
// ==========================================
export const DEFAULT_FACILITIES = [
  {
    facilityId: 'MF-HOSP-01',
    name: 'Sector 1 200-Bed Central Triage Hospital',
    category: 'hospital_medical',
    description: 'Emergency ICU, triage trauma station with ambulance staging bay. (Demonstration Data)',
    mapX: 20,
    mapY: 34,
    latitude: 25.4284,
    longitude: 81.8845,
    location: { type: 'Point', coordinates: [81.8845, 25.4284] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Emergency',
    sector: 'Akhada Area - Sector 1',
  },
  {
    facilityId: 'MF-HOSP-02',
    name: 'East Bank Medical Station A',
    category: 'hospital_medical',
    description: 'Rapid first aid, dehydration care & heatstroke revival center. (Demonstration Data)',
    mapX: 68,
    mapY: 71,
    latitude: 25.4278,
    longitude: 81.892,
    location: { type: 'Point', coordinates: [81.892, 25.4278] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Open',
    sector: 'Juna Akhada - Sector 7',
  },
  {
    facilityId: 'MF-MED-03',
    name: 'Jan Aushadhi Free Medicine Counter',
    category: 'medicine_distribution',
    description: 'Free ORS, paracetamol, antiseptic bandages, glucose packets. (Demonstration Data)',
    mapX: 36,
    mapY: 62,
    latitude: 25.4298,
    longitude: 81.8885,
    location: { type: 'Point', coordinates: [81.8885, 25.4298] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '06:00 AM - 11:00 PM',
    sector: 'Prayer Area - Sector 3',
  },
  {
    facilityId: 'MF-WATER-04',
    name: 'RO Drinking Water Station #12',
    category: 'drinking_water',
    description: 'High-capacity chilled RO drinking water unit with 32 push taps. (Demonstration Data)',
    mapX: 42,
    mapY: 48,
    latitude: 25.432,
    longitude: 81.882,
    location: { type: 'Point', coordinates: [81.882, 25.432] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Continuous',
    sector: 'Sangam Approach Ghats',
  },
  {
    facilityId: 'MF-WATER-05',
    name: 'Pilgrim Camps Drinking Water Point #7',
    category: 'drinking_water',
    description: 'Purified mineral water supply with stainless steel water coolers. (Demonstration Data)',
    mapX: 38,
    mapY: 82,
    latitude: 25.426,
    longitude: 81.884,
    location: { type: 'Point', coordinates: [81.884, 25.426] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7',
    sector: 'Pilgrim Tents - Sector 3',
  },
  {
    facilityId: 'MF-TOILET-06',
    name: 'Sanitation Complex & Bio-Toilets #14',
    category: 'toilet',
    description: '60-unit clean bio-toilet block with running water and disability ramps. (Demonstration Data)',
    mapX: 25,
    mapY: 64,
    latitude: 25.4312,
    longitude: 81.8865,
    location: { type: 'Point', coordinates: [81.8865, 25.4312] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Sanitized',
    sector: 'Kalpwas Camp - Sector 2',
  },
  {
    facilityId: 'MF-TOILET-07',
    name: 'East Ghat Sanitation & Bathing Block #9',
    category: 'toilet',
    description: 'Segregated female and male bathing cubicles with hot water geysers. (Demonstration Data)',
    mapX: 74,
    mapY: 42,
    latitude: 25.43,
    longitude: 81.894,
    location: { type: 'Point', coordinates: [81.894, 25.43] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Open',
    sector: 'Yamuna Riverbank Zone',
  },
  {
    facilityId: 'MF-GATE-08',
    name: 'Main Grand Entry Gate 1',
    category: 'entry_gate',
    description: 'Primary pedestrian ingress with metal detector arches and volunteer help guides. (Demonstration Data)',
    mapX: 12,
    mapY: 26,
    latitude: 25.435,
    longitude: 81.879,
    location: { type: 'Point', coordinates: [81.879, 25.435] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Ingress',
    sector: 'Main Mela Road Access',
  },
  {
    facilityId: 'MF-EXIT-09',
    name: 'Emergency Exit Corridor Gate 8',
    category: 'exit_gate',
    description: 'Rapid egress corridor leading directly to shuttle bus terminus. (Demonstration Data)',
    mapX: 84,
    mapY: 42,
    latitude: 25.425,
    longitude: 81.891,
    location: { type: 'Point', coordinates: [81.891, 25.425] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Egress',
    sector: 'East Riverbank Transit',
  },
  {
    facilityId: 'MF-SHELTER-10',
    name: 'All-Weather Rain & Night Shelter Camp 3',
    category: 'emergency_shelter',
    description: '1,500 person capacity insulated tent shelter with free woolen blankets and bedding. (Demonstration Data)',
    mapX: 30,
    mapY: 74,
    latitude: 25.4335,
    longitude: 81.884,
    location: { type: 'Point', coordinates: [81.884, 25.4335] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Shelter',
    sector: 'Kalpwas Camp Sector 2',
  },
  {
    facilityId: 'MF-HELP-11',
    name: 'Sangam Central Lost & Found Help Desk',
    category: 'help_desk',
    description: 'Central announcement tower, live CCTV feeds, and verified reunification counter. (Demonstration Data)',
    mapX: 51,
    mapY: 49,
    latitude: 25.43,
    longitude: 81.885,
    location: { type: 'Point', coordinates: [81.885, 25.43] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Active',
    sector: 'Sangam Holy Confluence',
  },
  {
    facilityId: 'MF-CROWD-12',
    name: 'Sangam Snan Ghat (Dense Pilgrim Congregation)',
    category: 'crowded_area',
    description: 'High pilgrim volume during holy snan timings. Crowd marshals deployed. (Demonstration Data)',
    mapX: 52,
    mapY: 43,
    latitude: 25.4275,
    longitude: 81.887,
    location: { type: 'Point', coordinates: [81.887, 25.4275] },
    status: 'Congested',
    isPublished: true,
    operatingHours: 'Active Regulation',
    sector: 'Sangam Nose Ghat',
  },
  {
    facilityId: 'MF-ROUTE-13',
    name: 'Pontoon Bridge #2 (Regulated One-Way Flow)',
    category: 'temporarily_closed_route',
    description: 'River crossing regulated by water police. Use Pontoon Bridge 1 as alternate. (Demonstration Data)',
    mapX: 52,
    mapY: 67,
    latitude: 25.429,
    longitude: 81.881,
    location: { type: 'Point', coordinates: [81.881, 25.429] },
    status: 'Restricted',
    isPublished: true,
    operatingHours: 'Reopening in 30 mins',
    sector: 'Ganga-Yamuna River Channel',
  },
];

export const DEFAULT_ALERTS = [
  {
    alertId: 'MA-ALERT-01',
    title: 'High Crowd Surge near Sangam Bathing Confluence',
    alertType: 'High Crowd Density',
    severity: 'Warning',
    affectedLocation: 'Sangam Main Bathing Ghats',
    recommendedAction: 'Use Pontoon Bridge 4 or proceed towards Ram Ghats to avoid bottleneck congestion.',
    issuingAuthority: 'Mela Police & Crowd Command',
    mapX: 52,
    mapY: 45,
    latitude: 25.428,
    longitude: 81.886,
    areaRadiusMeters: 300,
    status: 'Active',
    isPublished: true,
    isSensorVerified: false,
    reportedSource: 'Administration-Reported (Timestamped)',
    expiresAt: new Date(Date.now() + 6 * 3600 * 1000),
  },
  {
    alertId: 'MA-ALERT-02',
    title: 'Pontoon Bridge #2 Under Temporary Regulation',
    alertType: 'Route Temporarily Closed',
    severity: 'Advisory',
    affectedLocation: 'Pontoon Bridge 2 (South Approach)',
    recommendedAction: 'Pilgrims advised to follow illuminated green arrows towards Pontoon Bridge 6.',
    issuingAuthority: 'Traffic & Riverfront Control',
    mapX: 52,
    mapY: 67,
    latitude: 25.429,
    longitude: 81.881,
    areaRadiusMeters: 200,
    status: 'Active',
    isPublished: true,
    isSensorVerified: false,
    reportedSource: 'Administration-Reported (Timestamped)',
    expiresAt: new Date(Date.now() + 3 * 3600 * 1000),
  },
];

let inMemoryFacilities = [...DEFAULT_FACILITIES];
let inMemoryAlerts = [...DEFAULT_ALERTS];
let inMemoryReports = [
  {
    reportRefId: 'SR-MISS-2026-001',
    reportType: 'missing_person',
    personName: 'Rameshwar Dayal',
    personAge: 68,
    personGender: 'Male',
    clothingDescription: 'White Kurta Pyjama, saffron scarf, brown chappals, brass kamandalu',
    distinguishingFeatures: 'White beard, black metal frame reading glasses',
    relationshipToPerson: 'Elder Son (Sunil)',
    location: 'Near Sangam Gate 3 Flower & Prasad Stalls',
    dateTimeApprox: 'Today, 08:30 AM',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    foundPhotoUrl: '',
    foundLocation: '',
    foundFinderName: '',
    foundFinderContact: '',
    reporterName: 'Sunil Dayal',
    reporterPhone: '+91 98765 43210',
    reporterEmail: 'sunil@example.com',
    secretAccessKey: 'sec_key_rameshwar_001',
    status: 'Submitted',
    isPublicApproved: true,
    messages: [
      {
        messageId: 'msg-01',
        senderName: 'Mela Admin Desk',
        senderRole: 'admin',
        text: 'Report registered. Photo broadcast dispatched to Sector 1 volunteer patrol and digital lost-found towers.',
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    reportRefId: 'SR-MISS-2026-002',
    reportType: 'missing_person',
    personName: 'Aarav Sharma',
    personAge: 9,
    personGender: 'Male',
    clothingDescription: 'Navy blue printed t-shirt, beige cargo shorts, blue sandals, red cap',
    distinguishingFeatures: 'Small scar near left eyebrow',
    relationshipToPerson: 'Mother (Sunita)',
    location: 'Rest Area outside Kalpwas Camp Sector 2',
    dateTimeApprox: 'Today, 10:15 AM',
    photoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80',
    foundPhotoUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80',
    foundLocation: 'Safe at Sector 2 Police Help Desk (Booth #4)',
    foundFinderName: 'Inspector R. K. Verma (UP Police)',
    foundFinderContact: 'Police Post Kalpwas',
    reporterName: 'Sunita Sharma',
    reporterPhone: '+91 91234 56789',
    reporterEmail: 'sunita@example.com',
    secretAccessKey: 'sec_key_aarav_002',
    status: 'Possible Match',
    matchNotes: 'Boy located safely by duty police team at Sector 2 Help Desk. Photo uploaded for comparison.',
    isPublicApproved: true,
    messages: [
      {
        messageId: 'msg-02',
        senderName: 'Inspector R. K. Verma',
        senderRole: 'claimant',
        text: 'Found child matching description sitting at Sector 2 Police Post. Given warm milk and biscuits. Please review photo.',
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function sanitizeReportForPublic(report) {
  const doc = report.toObject ? report.toObject() : { ...report };
  delete doc.reporterPhone;
  delete doc.reporterEmail;
  delete doc.secretAccessKey;
  delete doc.foundFinderContact;
  return doc;
}

// ==========================================
// FEATURE 1: MELA FACILITIES
// ==========================================

export const getMelaFacilities = asyncHandler(async (req, res) => {
  const { category, status, includeUnpublished } = req.query;
  const filter = {};

  if (!includeUnpublished || includeUnpublished === 'false') {
    filter.isPublished = true;
  }
  if (category && category !== 'all') {
    filter.category = category;
  }
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (mongoose.connection.readyState === 1) {
    try {
      let facilities = await MelaFacility.find(filter).sort({ createdAt: -1 }).lean();
      if (!facilities || facilities.length === 0) {
        const count = await MelaFacility.countDocuments();
        if (count === 0) {
          await MelaFacility.insertMany(DEFAULT_FACILITIES);
          facilities = await MelaFacility.find(filter).sort({ createdAt: -1 }).lean();
        }
      }
      if (facilities && facilities.length > 0) {
        return res.status(200).json(new ApiResponse(200, facilities, 'Mela facilities loaded'));
      }
    } catch (err) {
      console.error('[Mela Facilities DB Error]', err);
    }
  }

  let list = inMemoryFacilities;
  if (!includeUnpublished || includeUnpublished === 'false') {
    list = list.filter((f) => f.isPublished);
  }
  if (category && category !== 'all') {
    list = list.filter((f) => f.category === category);
  }
  if (status && status !== 'all') {
    list = list.filter((f) => f.status === status);
  }
  return res.status(200).json(new ApiResponse(200, list, 'Mela facilities loaded (memory)'));
});

export const createMelaFacility = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description = '',
    mapX = 50,
    mapY = 50,
    latitude = 25.4285,
    longitude = 81.884,
    status = 'Operational',
    isPublished = true,
    operatingHours = '24x7 (Demo Schedule)',
    sector = 'Sector 1 - Sangam',
  } = req.body;

  if (!name || !category) {
    throw new ApiError(400, 'Name and category are required');
  }

  const facilityId = `MF-${Date.now().toString().slice(-6)}`;
  const payload = {
    facilityId,
    name: name.trim(),
    category,
    description: description.trim(),
    mapX: Math.min(100, Math.max(0, Number(mapX))),
    mapY: Math.min(100, Math.max(0, Number(mapY))),
    latitude: Number(latitude),
    longitude: Number(longitude),
    location: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
    status,
    isPublished: Boolean(isPublished),
    operatingHours,
    sector,
    isDemoData: true,
    createdBy: req.user?.name || 'Admin',
    updatedBy: req.user?.name || 'Admin',
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const created = await MelaFacility.create(payload);
      return res.status(201).json(new ApiResponse(201, created, 'Facility created successfully'));
    } catch (err) {
      console.error('[Create Facility DB Error]', err);
    }
  }

  inMemoryFacilities.unshift(payload);
  return res.status(201).json(new ApiResponse(201, payload, 'Facility created (memory)'));
});

export const updateMelaFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updatedBy: req.user?.name || 'Admin' };

  if (updates.mapX !== undefined) updates.mapX = Math.min(100, Math.max(0, Number(updates.mapX)));
  if (updates.mapY !== undefined) updates.mapY = Math.min(100, Math.max(0, Number(updates.mapY)));

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await MelaFacility.findOneAndUpdate(
        { $or: [{ facilityId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: updates },
        { new: true }
      );
      if (updated) {
        return res.status(200).json(new ApiResponse(200, updated, 'Facility updated'));
      }
    } catch (err) {
      console.error('[Update Facility DB Error]', err);
    }
  }

  const idx = inMemoryFacilities.findIndex((f) => f.facilityId === id || f._id === id);
  if (idx !== -1) {
    inMemoryFacilities[idx] = { ...inMemoryFacilities[idx], ...updates };
    return res.status(200).json(new ApiResponse(200, inMemoryFacilities[idx], 'Facility updated (memory)'));
  }

  throw new ApiError(404, 'Facility not found');
});

export const deleteMelaFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const deleted = await MelaFacility.findOneAndDelete({
        $or: [{ facilityId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });
      if (deleted) {
        return res.status(200).json(new ApiResponse(200, null, 'Facility deleted'));
      }
    } catch (err) {
      console.error('[Delete Facility DB Error]', err);
    }
  }

  inMemoryFacilities = inMemoryFacilities.filter((f) => f.facilityId !== id && f._id !== id);
  return res.status(200).json(new ApiResponse(200, null, 'Facility deleted (memory)'));
});

// ==========================================
// FEATURE 2: MISSING PERSONS (STRICTLY PERSON-FOCUSED)
// ==========================================

export const createLostFoundReport = asyncHandler(async (req, res) => {
  const {
    personName,
    personAge,
    personGender = 'Unknown',
    clothingDescription = '',
    distinguishingFeatures = '',
    relationshipToPerson = '',
    location,
    dateTimeApprox,
    photoUrl = '',
    reporterName,
    reporterPhone,
    reporterEmail = '',
  } = req.body;

  if (!personName || !location || !dateTimeApprox || !reporterName || !reporterPhone) {
    throw new ApiError(400, 'Person name, last-seen location, date/time, and reporter contact details are required');
  }

  const reportRefId = `SR-MISS-${Date.now().toString().slice(-6)}`;
  const secretAccessKey = `key_${crypto.randomBytes(16).toString('hex')}`;

  const payload = {
    reportRefId,
    reportType: 'missing_person',
    personName: personName.trim(),
    personAge: personAge ? Number(personAge) : null,
    personGender,
    clothingDescription: clothingDescription ? clothingDescription.trim() : '',
    distinguishingFeatures: distinguishingFeatures ? distinguishingFeatures.trim() : '',
    relationshipToPerson: relationshipToPerson ? relationshipToPerson.trim() : '',
    location: location.trim(),
    dateTimeApprox: dateTimeApprox.trim(),
    photoUrl: photoUrl.trim(),
    foundPhotoUrl: '',
    foundLocation: '',
    foundFinderName: '',
    foundFinderContact: '',
    reporterName: reporterName.trim(),
    reporterPhone: reporterPhone.trim(),
    reporterEmail: reporterEmail.trim(),
    secretAccessKey,
    status: 'Submitted',
    isPublicApproved: true,
    matchNotes: '',
    messages: [
      {
        messageId: `msg-${Date.now()}`,
        senderName: 'System Desk',
        senderRole: 'admin',
        text: `Missing person case ${reportRefId} registered. Information dispatched to Mela field volunteers.`,
        timestamp: new Date(),
      },
    ],
  };

  let savedDoc = null;
  if (mongoose.connection.readyState === 1) {
    try {
      savedDoc = await LostFoundReport.create(payload);
    } catch (err) {
      console.error('[Create Missing Report DB Error]', err);
    }
  }

  const finalRecord = savedDoc || payload;
  if (!savedDoc) inMemoryReports.unshift(payload);

  broadcastEmergencyAlert('mela:missing_person_submitted', {
    reportRefId,
    personName,
    location,
    createdAt: new Date(),
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        report: sanitizeReportForPublic(finalRecord),
        secretAccessKey,
        reportRefId,
      },
      'Missing person report registered securely'
    )
  );
});

export const getLostFoundReports = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = { isPublicApproved: true };

  if (status && status !== 'all') {
    filter.status = status;
  }
  if (search) {
    const q = search.trim();
    filter.$or = [
      { reportRefId: { $regex: q, $options: 'i' } },
      { personName: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
      { clothingDescription: { $regex: q, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  if (mongoose.connection.readyState === 1) {
    try {
      const total = await LostFoundReport.countDocuments(filter);
      const reports = await LostFoundReport.find(filter)
        .select('-reporterPhone -reporterEmail -secretAccessKey -foundFinderContact')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      if (reports && reports.length > 0) {
        return res.status(200).json(
          new ApiResponse(
            200,
            {
              reports,
              pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
              },
            },
            'Missing person reports retrieved'
          )
        );
      }
    } catch (err) {
      console.error('[Get Reports DB Error]', err);
    }
  }

  let list = inMemoryReports.map(sanitizeReportForPublic);
  if (status && status !== 'all') {
    list = list.filter((r) => r.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.reportRefId?.toLowerCase().includes(q) ||
        r.personName?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.clothingDescription?.toLowerCase().includes(q)
    );
  }

  const pagedList = list.slice(skip, skip + Number(limit));
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reports: pagedList,
        pagination: {
          total: list.length,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(list.length / Number(limit)),
        },
      },
      'Missing person reports retrieved (memory)'
    )
  );
});

export const getReportDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { secretKey } = req.query;
  const isAdmin = req.user?.role === 'admin';

  let report = null;
  if (mongoose.connection.readyState === 1) {
    try {
      report = await LostFoundReport.findOne({
        $or: [{ reportRefId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      }).lean();
    } catch (err) {
      console.error('[Get Single Report DB Error]', err);
    }
  }

  if (!report) {
    report = inMemoryReports.find((r) => r.reportRefId === id || r._id === id);
  }

  if (!report) {
    throw new ApiError(404, 'Report not found');
  }

  const isOwner = secretKey && report.secretAccessKey === secretKey;
  if (!isAdmin && !isOwner) {
    return res.status(200).json(new ApiResponse(200, sanitizeReportForPublic(report), 'Public report details'));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...report,
        isAuthorizedViewer: true,
      },
      'Full report details'
    )
  );
});

// SUBMIT FOUND PERSON REPORT / PHOTO MATCH CLAIM
export const submitPossibleMatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    foundLocation,
    foundPhotoUrl = '',
    notes = '',
    finderName = 'Good Samaritan / Police',
    finderContact = '',
  } = req.body;

  if (!foundLocation || !foundLocation.trim()) {
    throw new ApiError(400, 'Found location is required');
  }

  const systemNote = `Person Found Reported by ${finderName}: Located at "${foundLocation}". Notes: ${notes}`;

  const updateFields = {
    status: 'Possible Match',
    foundLocation: foundLocation.trim(),
    foundFinderName: finderName.trim(),
    foundFinderContact: finderContact.trim(),
    matchNotes: systemNote,
  };
  if (foundPhotoUrl && foundPhotoUrl.trim()) {
    updateFields.foundPhotoUrl = foundPhotoUrl.trim();
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await LostFoundReport.findOneAndUpdate(
        { $or: [{ reportRefId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        {
          $set: updateFields,
          $push: {
            messages: {
              messageId: `msg-${Date.now()}`,
              senderName: finderName,
              senderRole: 'claimant',
              text: `PERSON FOUND UPDATE: Located at "${foundLocation}". ${notes ? `Notes: ${notes}.` : ''} Dual photo comparison available for admin verification.`,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
      if (updated) {
        broadcastEmergencyAlert('mela:person_found_claimed', {
          reportRefId: updated.reportRefId,
          foundLocation,
        });
        return res.status(200).json(new ApiResponse(200, sanitizeReportForPublic(updated), 'Person found claim recorded'));
      }
    } catch (err) {
      console.error('[Submit Found Person DB Error]', err);
    }
  }

  const rep = inMemoryReports.find((r) => r.reportRefId === id || r._id === id);
  if (rep) {
    Object.assign(rep, updateFields);
    rep.messages.push({
      messageId: `msg-${Date.now()}`,
      senderName: finderName,
      senderRole: 'claimant',
      text: `PERSON FOUND UPDATE: Located at "${foundLocation}". Dual photo comparison available for admin verification.`,
      timestamp: new Date(),
    });
    return res.status(200).json(new ApiResponse(200, sanitizeReportForPublic(rep), 'Person found claim recorded (memory)'));
  }

  throw new ApiError(404, 'Report not found');
});

// ADMIN REVIEW WORKFLOW: VERIFY DUAL PHOTOS & UPDATE STATUS
export const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, matchNotes } = req.body;

  const validStatuses = [
    'Submitted',
    'Under Review',
    'Possible Match',
    'Verified Match',
    'Resolved',
    'Rejected',
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const updates = { status };
  if (matchNotes !== undefined) updates.matchNotes = matchNotes;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await LostFoundReport.findOneAndUpdate(
        { $or: [{ reportRefId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        {
          $set: updates,
          $push: {
            messages: {
              messageId: `msg-${Date.now()}`,
              senderName: req.user?.name || 'Mela Command Admin',
              senderRole: 'admin',
              text: `ADMIN DECISION: Case status updated to "${status}". ${matchNotes ? `Notes: ${matchNotes}` : ''}`,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
      if (updated) {
        broadcastEmergencyAlert('mela:report_status_changed', {
          reportRefId: updated.reportRefId,
          status: updated.status,
        });
        return res.status(200).json(new ApiResponse(200, updated, 'Report status updated'));
      }
    } catch (err) {
      console.error('[Update Report DB Error]', err);
    }
  }

  const idx = inMemoryReports.findIndex((r) => r.reportRefId === id || r._id === id);
  if (idx !== -1) {
    inMemoryReports[idx] = { ...inMemoryReports[idx], ...updates };
    inMemoryReports[idx].messages.push({
      messageId: `msg-${Date.now()}`,
      senderName: req.user?.name || 'Mela Command Admin',
      senderRole: 'admin',
      text: `ADMIN DECISION: Case status updated to "${status}".`,
      timestamp: new Date(),
    });
    return res.status(200).json(new ApiResponse(200, inMemoryReports[idx], 'Report status updated (memory)'));
  }

  throw new ApiError(404, 'Report not found');
});

export const sendReportMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text, secretKey, senderName } = req.body;
  const isAdmin = req.user?.role === 'admin';

  if (!text || !text.trim()) {
    throw new ApiError(400, 'Message text is required');
  }

  let report = null;
  if (mongoose.connection.readyState === 1) {
    report = await LostFoundReport.findOne({
      $or: [{ reportRefId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });
  } else {
    report = inMemoryReports.find((r) => r.reportRefId === id || r._id === id);
  }

  if (!report) throw new ApiError(404, 'Report not found');

  const isOwner = secretKey && report.secretAccessKey === secretKey;
  if (!isAdmin && !isOwner) {
    throw new ApiError(403, 'Forbidden: Provide valid Secret Key or Login as Admin');
  }

  const newMsg = {
    messageId: `msg-${Date.now()}`,
    senderName: isAdmin ? req.user?.name || 'Mela Command Admin' : senderName || report.reporterName,
    senderRole: isAdmin ? 'admin' : 'reporter',
    text: text.trim(),
    timestamp: new Date(),
  };

  if (mongoose.connection.readyState === 1) {
    report.messages.push(newMsg);
    await report.save();
    return res.status(201).json(new ApiResponse(201, newMsg, 'Message sent successfully'));
  }

  report.messages.push(newMsg);
  return res.status(201).json(new ApiResponse(201, newMsg, 'Message sent (memory)'));
});

// ==========================================
// FEATURE 3: MELA CROWD SAFETY & ALERTS
// ==========================================

export const getMelaAlerts = asyncHandler(async (req, res) => {
  const { includeInactive } = req.query;
  const now = new Date();
  const filter = {};

  if (!includeInactive || includeInactive === 'false') {
    filter.status = 'Active';
    filter.isPublished = true;
    filter.$or = [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }];
  }

  if (mongoose.connection.readyState === 1) {
    try {
      let alerts = await MelaAlert.find(filter).sort({ createdAt: -1 }).lean();
      if (!alerts || alerts.length === 0) {
        const count = await MelaAlert.countDocuments();
        if (count === 0) {
          await MelaAlert.insertMany(DEFAULT_ALERTS);
          alerts = await MelaAlert.find(filter).sort({ createdAt: -1 }).lean();
        }
      }
      if (alerts && alerts.length > 0) {
        return res.status(200).json(new ApiResponse(200, alerts, 'Active Mela alerts retrieved'));
      }
    } catch (err) {
      console.error('[Get Alerts DB Error]', err);
    }
  }

  let list = inMemoryAlerts;
  if (!includeInactive || includeInactive === 'false') {
    list = list.filter((a) => a.status === 'Active' && a.isPublished && (!a.expiresAt || new Date(a.expiresAt) > now));
  }
  return res.status(200).json(new ApiResponse(200, list, 'Active Mela alerts retrieved (memory)'));
});

export const createMelaAlert = asyncHandler(async (req, res) => {
  const {
    title,
    alertType,
    severity = 'Advisory',
    affectedLocation,
    recommendedAction,
    issuingAuthority = 'Mela Administration & Police Command',
    mapX = 50,
    mapY = 50,
    latitude = 25.4284,
    longitude = 81.8845,
    areaRadiusMeters = 250,
    expiresInHours = 6,
    isSensorVerified = false,
  } = req.body;

  if (!title || !alertType || !affectedLocation || !recommendedAction) {
    throw new ApiError(400, 'Title, alert type, location, and recommended action are required');
  }

  const alertId = `MA-${Date.now().toString().slice(-6)}`;
  const expiresAt = expiresInHours ? new Date(Date.now() + Number(expiresInHours) * 3600 * 1000) : null;

  const payload = {
    alertId,
    title: title.trim(),
    alertType,
    severity,
    affectedLocation: affectedLocation.trim(),
    recommendedAction: recommendedAction.trim(),
    issuingAuthority: issuingAuthority.trim(),
    mapX: Math.min(100, Math.max(0, Number(mapX))),
    mapY: Math.min(100, Math.max(0, Number(mapY))),
    latitude: Number(latitude),
    longitude: Number(longitude),
    areaRadiusMeters: Number(areaRadiusMeters),
    status: 'Active',
    isPublished: true,
    expiresAt,
    isSensorVerified: Boolean(isSensorVerified),
    reportedSource: isSensorVerified ? 'Verified Sensor Feed' : 'Administration-Reported (Timestamped)',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const created = await MelaAlert.create(payload);
      broadcastEmergencyAlert('mela:new_alert', created);
      return res.status(201).json(new ApiResponse(201, created, 'Alert published successfully'));
    } catch (err) {
      console.error('[Create Alert DB Error]', err);
    }
  }

  inMemoryAlerts.unshift(payload);
  broadcastEmergencyAlert('mela:new_alert', payload);
  return res.status(201).json(new ApiResponse(201, payload, 'Alert published (memory)'));
});

export const updateMelaAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updatedAt: new Date() };

  if (updates.expiresInHours) {
    updates.expiresAt = new Date(Date.now() + Number(updates.expiresInHours) * 3600 * 1000);
  }

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await MelaAlert.findOneAndUpdate(
        { $or: [{ alertId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: updates },
        { new: true }
      );
      if (updated) {
        return res.status(200).json(new ApiResponse(200, updated, 'Alert updated'));
      }
    } catch (err) {
      console.error('[Update Alert DB Error]', err);
    }
  }

  const idx = inMemoryAlerts.findIndex((a) => a.alertId === id || a._id === id);
  if (idx !== -1) {
    inMemoryAlerts[idx] = { ...inMemoryAlerts[idx], ...updates };
    return res.status(200).json(new ApiResponse(200, inMemoryAlerts[idx], 'Alert updated (memory)'));
  }

  throw new ApiError(404, 'Alert not found');
});

export const resolveMelaAlert = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await MelaAlert.findOneAndUpdate(
        { $or: [{ alertId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: { status: 'Resolved' } },
        { new: true }
      );
      if (updated) {
        return res.status(200).json(new ApiResponse(200, updated, 'Alert resolved'));
      }
    } catch (err) {
      console.error('[Resolve Alert DB Error]', err);
    }
  }

  const a = inMemoryAlerts.find((item) => item.alertId === id || item._id === id);
  if (a) {
    a.status = 'Resolved';
    return res.status(200).json(new ApiResponse(200, a, 'Alert resolved (memory)'));
  }

  throw new ApiError(404, 'Alert not found');
});

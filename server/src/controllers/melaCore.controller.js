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
// SEED DEFAULT MELA DEMO DATA IF EMPTY
// ==========================================
export const DEFAULT_FACILITIES = [
  {
    facilityId: 'MF-HOSP-01',
    name: 'Sector 1 Central Triage Hospital',
    category: 'hospital_medical',
    description: '40-bed emergency triage hospital with ICU, trauma surgeons, and 24x7 ambulance bay. (Demonstration data)',
    latitude: 25.4284,
    longitude: 81.8845,
    location: { type: 'Point', coordinates: [81.8845, 25.4284] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 (Emergency)',
    sector: 'Sector 1 - Sangam',
    contactPhone: 'Demo Only',
  },
  {
    facilityId: 'MF-MED-02',
    name: 'Jan Aushadhi Medical Counter - Sangam',
    category: 'medicine_distribution',
    description: 'Free generic ORS, paracetamol, bandages, and burn ointments distribution center. (Demonstration data)',
    latitude: 25.4298,
    longitude: 81.8885,
    location: { type: 'Point', coordinates: [81.8885, 25.4298] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '06:00 AM - 11:00 PM',
    sector: 'Sector 2 - Ghats',
    contactPhone: 'Demo Only',
  },
  {
    facilityId: 'MF-WATER-03',
    name: 'RO Drinking Water Plant #4',
    category: 'drinking_water',
    description: 'Chilled reverse osmosis drinking water station with 24 push-taps. (Demonstration data)',
    latitude: 25.432,
    longitude: 81.882,
    location: { type: 'Point', coordinates: [81.882, 25.432] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Continuous',
    sector: 'Sector 3 - Pontoon Road',
  },
  {
    facilityId: 'MF-TOILET-04',
    name: 'Eco-Bio Toilet Complex B',
    category: 'toilet',
    description: '50-unit sanitized bio-toilet block with running water and disability ramps. (Demonstration data)',
    latitude: 25.4312,
    longitude: 81.8865,
    location: { type: 'Point', coordinates: [81.8865, 25.4312] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7',
    sector: 'Sector 2 - Ghats',
  },
  {
    facilityId: 'MF-GATE-05',
    name: 'Entry Gate 1 (Kalyani Devi Approach)',
    category: 'entry_gate',
    description: 'Main pedestrian ingress gate with metal detectors and RFID pilgrim wristband assistance. (Demonstration data)',
    latitude: 25.435,
    longitude: 81.879,
    location: { type: 'Point', coordinates: [81.879, 25.435] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Open',
    sector: 'Sector 1 - Entry',
  },
  {
    facilityId: 'MF-EXIT-06',
    name: 'Exit Gate 4 (Trivenipuram Transit)',
    category: 'exit_gate',
    description: 'Designated one-way rapid exit corridor connecting to shuttle parking. (Demonstration data)',
    latitude: 25.425,
    longitude: 81.891,
    location: { type: 'Point', coordinates: [81.891, 25.425] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Open',
    sector: 'Sector 4 - Exit Corridor',
  },
  {
    facilityId: 'MF-SHELTER-07',
    name: 'Rain & Night Emergency Shelter #2',
    category: 'emergency_shelter',
    description: 'Waterproof insulated tent camp accommodating 1,200 pilgrims with sleeping mats and emergency blankets. (Demonstration data)',
    latitude: 25.4335,
    longitude: 81.884,
    location: { type: 'Point', coordinates: [81.884, 25.4335] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7 Shelter',
    sector: 'Sector 3 - Camp Grounds',
  },
  {
    facilityId: 'MF-HELP-08',
    name: 'Lost & Found / Unified Help Desk Sangam',
    category: 'help_desk',
    description: 'Central announcement hub, multilingual assistance, and missing person verification post. (Demonstration data)',
    latitude: 25.43,
    longitude: 81.885,
    location: { type: 'Point', coordinates: [81.885, 25.43] },
    status: 'Operational',
    isPublished: true,
    operatingHours: '24x7',
    sector: 'Sector 1 - Sangam',
  },
  {
    facilityId: 'MF-CROWD-09',
    name: 'Sangam Nose Bathing Ghat (High Congestion)',
    category: 'crowded_area',
    description: 'Heavy pilgrim concentration during holy dip hours. Administration crowd marshals deployed. (Demonstration data)',
    latitude: 25.4275,
    longitude: 81.887,
    location: { type: 'Point', coordinates: [81.887, 25.4275] },
    status: 'Congested',
    isPublished: true,
    operatingHours: 'Open with regulation',
    sector: 'Sector 1 - Sangam',
  },
  {
    facilityId: 'MF-ROUTE-10',
    name: 'Pontoon Bridge #3 (Temporarily Regulated)',
    category: 'temporarily_closed_route',
    description: 'One-way river crossing regulated due to boat convoy movement. (Demonstration data)',
    latitude: 25.429,
    longitude: 81.881,
    location: { type: 'Point', coordinates: [81.881, 25.429] },
    status: 'Closed',
    isPublished: true,
    operatingHours: 'Expected reopening in 45 mins',
    sector: 'River Zone',
  },
];

export const DEFAULT_ALERTS = [
  {
    alertId: 'MA-ALERT-01',
    title: 'High Crowd Surge near Sangam Bathing Ghat #2',
    alertType: 'High Crowd Density',
    severity: 'Warning',
    affectedLocation: 'Sangam Main Bathing Ghats',
    recommendedAction: 'Please use Pontoon Bridge 4 or proceed towards Daraganj Ghat to avoid congestion.',
    issuingAuthority: 'Mela Police & Crowd Command',
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
    title: 'Pontoon Bridge 3 Temporarily Regulated',
    alertType: 'Route Temporarily Closed',
    severity: 'Advisory',
    affectedLocation: 'Pontoon Bridge 3 (Jhusi Side)',
    recommendedAction: 'Pilgrims are advised to follow directional signs towards Pontoon Bridge 1 or 2.',
    issuingAuthority: 'Traffic & Corridor Management',
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
    reportRefId: 'SR-PERS-2026-001',
    reportType: 'missing_person',
    personName: 'Rameshwar Dayal',
    personAge: 68,
    personGender: 'Male',
    clothingDescription: 'White Kurta Pyjama, brown scarf, carrying brass kamandalu',
    distinguishingFeatures: 'White beard, spectacles with black frame',
    relationshipToPerson: 'Son',
    location: 'Near Sangam Gate 3 Prasad Stalls',
    dateTimeApprox: 'Today, approx 08:30 AM',
    photoUrl: '',
    reporterName: 'Sunil Dayal',
    reporterPhone: '+91 98765 43210',
    reporterEmail: 'sunil@example.com',
    secretAccessKey: 'sec_sample_key_001',
    status: 'Submitted',
    isPublicApproved: true,
    messages: [
      {
        messageId: 'msg-01',
        senderName: 'Mela Admin Desk',
        senderRole: 'admin',
        text: 'Report registered. Information transmitted to Sector 3 volunteer patrol and audio announcement tower.',
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    reportRefId: 'SR-ITEM-2026-002',
    reportType: 'lost_item',
    itemCategory: 'Bag/Luggage',
    itemDescription: 'Blue nylon backpack containing Aadhaar card, train tickets, and steel water bottle',
    location: 'Rest Area outside Emergency Shelter 2',
    dateTimeApprox: 'Today, approx 09:15 AM',
    photoUrl: '',
    reporterName: 'Priya Sharma',
    reporterPhone: '+91 91234 56789',
    reporterEmail: 'priya@example.com',
    secretAccessKey: 'sec_sample_key_002',
    status: 'Under Review',
    isPublicApproved: true,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper to sanitize report for public viewing (strip phone, email, secret keys)
export function sanitizeReportForPublic(report) {
  const doc = report.toObject ? report.toObject() : { ...report };
  delete doc.reporterPhone;
  delete doc.reporterEmail;
  delete doc.secretAccessKey;
  // If found person without identification, keep sensitive fields protected
  return doc;
}

// ==========================================
// FEATURE 1: MELA FACILITIES (MAP MARKERS)
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
        // Seed default facilities if DB collection is completely empty
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

  // Memory fallback
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
    latitude,
    longitude,
    status = 'Operational',
    isPublished = true,
    operatingHours = '24x7 (Demo Schedule)',
    sector = 'Sector 1 - Sangam',
  } = req.body;

  if (!name || !category || latitude === undefined || longitude === undefined) {
    throw new ApiError(400, 'Name, category, latitude, and longitude are required');
  }

  const facilityId = `MF-${Date.now().toString().slice(-6)}`;
  const payload = {
    facilityId,
    name: name.trim(),
    category,
    description: description.trim(),
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

  if (updates.latitude !== undefined && updates.longitude !== undefined) {
    updates.location = {
      type: 'Point',
      coordinates: [Number(updates.longitude), Number(updates.latitude)],
    };
  }

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
// FEATURE 2: MISSING PERSONS & LOST & FOUND
// ==========================================

export const createLostFoundReport = asyncHandler(async (req, res) => {
  const {
    reportType,
    personName,
    personAge,
    personGender,
    clothingDescription,
    distinguishingFeatures,
    relationshipToPerson,
    itemCategory,
    itemDescription,
    location,
    dateTimeApprox,
    photoUrl = '',
    reporterName,
    reporterPhone,
    reporterEmail = '',
  } = req.body;

  if (!reportType || !location || !dateTimeApprox || !reporterName || !reporterPhone) {
    throw new ApiError(400, 'Report type, location, date/time, and reporter contact details are required');
  }

  const typePrefix =
    reportType === 'missing_person'
      ? 'MISS'
      : reportType === 'found_person'
      ? 'FNDP'
      : reportType === 'lost_item'
      ? 'LOST'
      : 'FNDI';

  const reportRefId = `SR-${typePrefix}-${Date.now().toString().slice(-6)}`;
  const secretAccessKey = `key_${crypto.randomBytes(16).toString('hex')}`;

  const payload = {
    reportRefId,
    reportType,
    personName: personName ? personName.trim() : '',
    personAge: personAge ? Number(personAge) : null,
    personGender: personGender || 'Unknown',
    clothingDescription: clothingDescription ? clothingDescription.trim() : '',
    distinguishingFeatures: distinguishingFeatures ? distinguishingFeatures.trim() : '',
    relationshipToPerson: relationshipToPerson ? relationshipToPerson.trim() : '',
    itemCategory: itemCategory ? itemCategory.trim() : '',
    itemDescription: itemDescription ? itemDescription.trim() : '',
    location: location.trim(),
    dateTimeApprox: dateTimeApprox.trim(),
    photoUrl: photoUrl.trim(),
    reporterName: reporterName.trim(),
    reporterPhone: reporterPhone.trim(),
    reporterEmail: reporterEmail.trim(),
    secretAccessKey,
    status: 'Submitted',
    isPublicApproved: true,
    messages: [
      {
        messageId: `msg-${Date.now()}`,
        senderName: 'System Desk',
        senderRole: 'admin',
        text: `Report ${reportRefId} submitted successfully. Keep your Secret Access Key safe to manage or communicate privately.`,
        timestamp: new Date(),
      },
    ],
  };

  let savedDoc = null;
  if (mongoose.connection.readyState === 1) {
    try {
      savedDoc = await LostFoundReport.create(payload);
    } catch (err) {
      console.error('[Create Report DB Error]', err);
    }
  }

  const finalRecord = savedDoc || payload;
  if (!savedDoc) inMemoryReports.unshift(payload);

  broadcastEmergencyAlert('mela:report_submitted', {
    reportRefId,
    reportType,
    location,
    createdAt: new Date(),
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        report: sanitizeReportForPublic(finalRecord),
        secretAccessKey, // Returned ONLY to the reporter upon submission
        reportRefId,
      },
      'Report registered securely'
    )
  );
});

export const getLostFoundReports = asyncHandler(async (req, res) => {
  const { reportType, status, location, search, page = 1, limit = 20 } = req.query;
  const filter = { isPublicApproved: true };

  if (reportType && reportType !== 'all') {
    filter.reportType = reportType;
  }
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (location && location !== 'all') {
    filter.location = { $regex: location, $options: 'i' };
  }
  if (search) {
    const q = search.trim();
    filter.$or = [
      { reportRefId: { $regex: q, $options: 'i' } },
      { personName: { $regex: q, $options: 'i' } },
      { itemDescription: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  if (mongoose.connection.readyState === 1) {
    try {
      const total = await LostFoundReport.countDocuments(filter);
      const reports = await LostFoundReport.find(filter)
        .select('-reporterPhone -reporterEmail -secretAccessKey')
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
            'Reports retrieved'
          )
        );
      }
    } catch (err) {
      console.error('[Get Reports DB Error]', err);
    }
  }

  // Memory fallback
  let list = inMemoryReports.map(sanitizeReportForPublic);
  if (reportType && reportType !== 'all') {
    list = list.filter((r) => r.reportType === reportType);
  }
  if (status && status !== 'all') {
    list = list.filter((r) => r.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.reportRefId?.toLowerCase().includes(q) ||
        r.personName?.toLowerCase().includes(q) ||
        r.itemDescription?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q)
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
      'Reports retrieved (memory)'
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

  // Check authorization for private details
  const isOwner = secretKey && report.secretAccessKey === secretKey;
  if (!isAdmin && !isOwner) {
    // Return sanitized public version without contacts or secretKey
    return res.status(200).json(new ApiResponse(200, sanitizeReportForPublic(report), 'Public report details'));
  }

  // Authorized user / admin gets full document
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

export const updateReportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, matchedReportRefId, matchNotes } = req.body;

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
  if (matchedReportRefId !== undefined) updates.matchedReportRefId = matchedReportRefId;
  if (matchNotes !== undefined) updates.matchNotes = matchNotes;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await LostFoundReport.findOneAndUpdate(
        { $or: [{ reportRefId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: updates },
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
    return res.status(200).json(new ApiResponse(200, inMemoryReports[idx], 'Report status updated (memory)'));
  }

  throw new ApiError(404, 'Report not found');
});

export const submitPossibleMatch = asyncHandler(async (req, res) => {
  const { id } = req.params; // Report that might match
  const { candidateReportRefId, notes, claimantName, claimantPhone } = req.body;

  if (!candidateReportRefId && !notes) {
    throw new ApiError(400, 'Candidate report ID or matching descriptive notes are required');
  }

  const systemNote = `Possible Match submitted by ${claimantName || 'Citizen'}: ${notes || ''}`;

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await LostFoundReport.findOneAndUpdate(
        { $or: [{ reportRefId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        {
          $set: {
            status: 'Possible Match',
            matchedReportRefId: candidateReportRefId || null,
            matchNotes: systemNote,
          },
          $push: {
            messages: {
              messageId: `msg-${Date.now()}`,
              senderName: claimantName || 'Citizen / Match Candidate',
              senderRole: 'claimant',
              text: `Possible match claim submitted: "${notes}". Contact submitted privately for verification.`,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
      if (updated) {
        return res.status(200).json(new ApiResponse(200, sanitizeReportForPublic(updated), 'Possible match recorded for review'));
      }
    } catch (err) {
      console.error('[Submit Match DB Error]', err);
    }
  }

  const rep = inMemoryReports.find((r) => r.reportRefId === id || r._id === id);
  if (rep) {
    rep.status = 'Possible Match';
    rep.matchedReportRefId = candidateReportRefId || null;
    rep.matchNotes = systemNote;
    rep.messages.push({
      messageId: `msg-${Date.now()}`,
      senderName: claimantName || 'Citizen Claimant',
      senderRole: 'claimant',
      text: `Possible match claim: "${notes}"`,
      timestamp: new Date(),
    });
    return res.status(200).json(new ApiResponse(200, sanitizeReportForPublic(rep), 'Possible match recorded (memory)'));
  }

  throw new ApiError(404, 'Report not found');
});

// Secure, server-side authorized report-linked messaging
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
    throw new ApiError(403, 'Forbidden: You must provide a valid Secret Access Key or be an Admin to post in this private thread');
  }

  const newMsg = {
    messageId: `msg-${Date.now()}`,
    senderName: isAdmin ? req.user?.name || 'Mela Administrator' : senderName || report.reporterName,
    senderRole: isAdmin ? 'admin' : 'reporter',
    text: text.trim(),
    timestamp: new Date(),
  };

  if (mongoose.connection.readyState === 1) {
    report.messages.push(newMsg);
    await report.save();
    return res.status(201).json(new ApiResponse(201, newMsg, 'Private message sent successfully'));
  }

  report.messages.push(newMsg);
  return res.status(201).json(new ApiResponse(201, newMsg, 'Private message sent (memory)'));
});

// ==========================================
// FEATURE 3: ADMIN-CONTROLLED CROWD ALERTS
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
    latitude,
    longitude,
    areaRadiusMeters = 250,
    expiresInHours = 6,
    isSensorVerified = false,
  } = req.body;

  if (!title || !alertType || !affectedLocation || !recommendedAction || latitude === undefined || longitude === undefined) {
    throw new ApiError(400, 'Title, alert type, location, recommended action, and coordinates are required');
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
        return res.status(200).json(new ApiResponse(200, updated, 'Alert resolved and preserved in history'));
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

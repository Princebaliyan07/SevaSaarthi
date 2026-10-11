import mongoose from 'mongoose';
import crypto from 'crypto';
import VolunteerTeam from '../models/VolunteerTeam.model.js';
import VolunteerRegistration from '../models/VolunteerRegistration.model.js';
import TeamJoinRequest from '../models/TeamJoinRequest.model.js';
import ReliefCampaign from '../models/ReliefCampaign.model.js';
import CampaignDonation from '../models/CampaignDonation.model.js';
import ReliefSupplier from '../models/ReliefSupplier.model.js';
import SupplyOrder from '../models/SupplyOrder.model.js';
import ReliefAuditLog from '../models/ReliefAuditLog.model.js';
import DeliveryRequest from '../models/DeliveryRequest.model.js';
import { generateIncidentId } from '../utils/idGenerator.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { broadcastEmergencyAlert } from '../services/notification.service.js';

// Haversine Distance Helper in Kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Baseline Initial Seed Teams
const BASELINE_VOLUNTEER_TEAMS = [
  {
    teamId: 'VOL-TEAM-01',
    name: 'NDRF Community Disaster Response Battalion 11',
    description: 'Rapid response aquatic rescue, boat evacuation, and mass trauma first aid unit.',
    teamCategory: 'NDRF/SDRF Affiliate',
    supportedDisasters: ['Floods', 'Cyclones', 'General Emergency'],
    location: 'Sangam Sector 2, Prayagraj',
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    serviceArea: 'Sangam Ghats, Pontoon Bridges, and Riverfront Sectors',
    coords: { lat: 25.4284, lng: 81.8845 },
    leaderName: 'Inspector Vikram Rathore',
    leaderPhone: '+91 98765 11001',
    capacity: 60,
    activeMembers: 24,
    skills: ['Boat Rescue', 'Flood Evacuation', 'First Aid Trauma Support', 'Search & Rescue'],
    isVerified: true,
    verificationStatus: 'Verified',
    operationalStatus: 'Active Relief Operation',
    currentMission: 'Ghat edge patrolling and pontoon bridge crowd monitoring',
    completedMissions: 18,
  },
  {
    teamId: 'VOL-TEAM-02',
    name: 'Civil Defence & Red Cross Emergency Corps',
    description: 'Doorstep emergency medicine delivery, triage care, and vulnerable pilgrim escort.',
    teamCategory: 'Red Cross / Medical Corps',
    supportedDisasters: ['Floods', 'Heatwaves', 'General Emergency'],
    location: 'Civil Lines Central Hub, Prayagraj',
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    serviceArea: 'Prayagraj Central, Railway Hubs, Transit Camps',
    coords: { lat: 25.4529, lng: 81.8349 },
    leaderName: 'Dr. Sunita Agarwal',
    leaderPhone: '+91 98765 11002',
    capacity: 50,
    activeMembers: 35,
    skills: ['Triage First Aid', 'Medicine Doorstep Delivery', 'Lost Child Care', 'Elderly Escort'],
    isVerified: true,
    verificationStatus: 'Verified',
    operationalStatus: 'Accepting Members',
    currentMission: 'Medicine delivery to flooded and remote pilgrimage clusters',
    completedMissions: 32,
  },
  {
    teamId: 'VOL-TEAM-03',
    name: 'SDRF Riverine Rescue Unit',
    description: 'Deep diving, river currents patrol, and pontoon safety deployment.',
    teamCategory: 'NDRF/SDRF Affiliate',
    supportedDisasters: ['Floods', 'Severe Storms'],
    location: 'Yamuna Riverbank Camp, Prayagraj',
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    serviceArea: 'Yamuna & Ganga Confluence Waterfront',
    coords: { lat: 25.422, lng: 81.879 },
    leaderName: 'Sub-Inspector Ankit Tiwari',
    leaderPhone: '+91 98765 11003',
    capacity: 30,
    activeMembers: 16,
    skills: ['Deep Water Diving', 'Inflatable Boat Operations', 'Emergency Resuscitation'],
    isVerified: true,
    verificationStatus: 'Verified',
    operationalStatus: 'Active Relief Operation',
    currentMission: '24x7 River safety surveillance and bathing ghat barricading',
    completedMissions: 14,
  },
];

// Baseline Initial Seed Campaigns
const BASELINE_CAMPAIGNS = [
  {
    campaignId: 'CMP-2026-001',
    title: 'Prayagraj Sangam Monsoon Flood & Pilgrim Emergency Relief',
    description: 'Official emergency fund to supply life jackets, dry ration kits, oral rehydration salts, and emergency shelters to families affected by river swell.',
    disasterCategory: 'Floods',
    affectedState: 'Uttar Pradesh',
    affectedDistrict: 'Prayagraj',
    locationCoords: { lat: 25.4358, lng: 81.8463 },
    targetAmount: 500000,
    confirmedAmount: 245000,
    donationCount: 68,
    isGovernmentFund: true,
    recipientAgency: 'District Disaster Management Authority (DDMA) Prayagraj',
    recipientAccountType: 'Official District Magistrate Relief Escrow',
    status: 'Active',
    isVerified: true,
    verifiedNeeds: [
      { itemKey: 'ors_packets', itemName: 'WHO Oral Rehydration Salts (ORS)', unit: 'Packs of 20', requestedQty: 500, fundedQty: 240, deliveredQty: 180, unitPrice: 150 },
      { itemKey: 'dry_ration', itemName: 'Dry Ration Food Kits (Atta, Rice, Dal)', unit: '10kg Kit', requestedQty: 300, fundedQty: 140, deliveredQty: 90, unitPrice: 450 },
      { itemKey: 'drinking_water', itemName: 'Packaged Drinking Water Cartons', unit: '24 Bottles Box', requestedQty: 800, fundedQty: 420, deliveredQty: 350, unitPrice: 120 },
      { itemKey: 'thermal_blankets', itemName: 'Emergency Thermal Blankets', unit: 'Pieces', requestedQty: 400, fundedQty: 180, deliveredQty: 120, unitPrice: 200 },
    ],
    verifiedUpdates: [
      { title: 'Sector 4 Shelter Relief Dispatched', text: '180 cartons of water and 90 ration kits successfully handed over at Sangam High School camp.', author: 'SDM Relief Cell', timestamp: new Date() },
    ],
  },
  {
    campaignId: 'CMP-2026-002',
    title: 'Varanasi Ghats High Water Inundation Relief Initiative',
    description: 'Providing rescue boat fuel, emergency first aid, baby food, and clean water supplies along sub-merged low-lying ghats.',
    disasterCategory: 'Floods',
    affectedState: 'Uttar Pradesh',
    affectedDistrict: 'Varanasi',
    locationCoords: { lat: 25.3176, lng: 82.9739 },
    targetAmount: 350000,
    confirmedAmount: 148000,
    donationCount: 42,
    isGovernmentFund: true,
    recipientAgency: 'State Disaster Response Fund (SDRF) Eastern Circle',
    recipientAccountType: 'Verified State Relief Escrow',
    status: 'Active',
    isVerified: true,
    verifiedNeeds: [
      { itemKey: 'baby_food', itemName: 'Infant Milk & Nutrition Powder', unit: '500g Tin', requestedQty: 200, fundedQty: 85, deliveredQty: 60, unitPrice: 280 },
      { itemKey: 'first_aid_kits', itemName: 'Waterproof First-Aid Trauma Kits', unit: 'Kit', requestedQty: 150, fundedQty: 70, deliveredQty: 45, unitPrice: 350 },
    ],
    verifiedUpdates: [
      { title: 'Assi Ghat Temporary Clinic Operational', text: 'Volunteer medical teams have deployed portable diagnostics and distributed 60 baby food tins.', author: 'District Health Officer', timestamp: new Date() },
    ],
  },
];

// Baseline Initial Seed Suppliers
const BASELINE_SUPPLIERS = [
  {
    supplierId: 'SUP-01',
    businessName: 'Sangam Medicos & Trauma Supplies',
    supplierCategory: 'Medical Store / Pharmacy',
    licenseNumber: 'DL-UP-PRG-2021-9874',
    licenseVerified: true,
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    address: 'Shop 12, Medical College Road, George Town, Prayagraj',
    coords: { lat: 25.441, lng: 81.854 },
    contactPerson: 'Rameshwar Nath Mishra',
    contactPhone: '+91 98765 44001',
    verificationStatus: 'Verified',
    isOpenForEmergencyOrders: true,
    catalog: [
      { itemId: 'med-01', name: 'WHO Oral Rehydration Salts (ORS 20s)', category: 'Medicine', unit: 'Box', unitPrice: 150, availableStock: 450 },
      { itemId: 'med-02', name: 'Waterproof Sterile Bandage Rolls (10s)', category: 'Medicine', unit: 'Pack', unitPrice: 90, availableStock: 600 },
      { itemId: 'med-03', name: 'Emergency Antiseptic Solution (500ml)', category: 'Medicine', unit: 'Bottle', unitPrice: 110, availableStock: 300 },
      { itemId: 'med-04', name: 'Paracetamol & Fever Relief Tablets', category: 'Medicine', unit: 'Strip of 10', unitPrice: 25, availableStock: 1200 },
    ],
  },
  {
    supplierId: 'SUP-02',
    businessName: 'Annapurna Ration & Provisions Hub',
    supplierCategory: 'Grocery & Dry Food',
    licenseNumber: 'FSSAI-1272200100452',
    licenseVerified: true,
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    address: 'Grain Market Mandi Gate 2, Naini, Prayagraj',
    coords: { lat: 25.418, lng: 81.862 },
    contactPerson: 'Sunil Kumar Gupta',
    contactPhone: '+91 98765 44002',
    verificationStatus: 'Verified',
    isOpenForEmergencyOrders: true,
    catalog: [
      { itemId: 'food-01', name: 'Dry Ration Food Kit (Atta 5kg, Rice 3kg, Dal 2kg)', category: 'Food', unit: '10kg Kit', unitPrice: 450, availableStock: 180 },
      { itemId: 'food-02', name: 'Nutritious Glucose Biscuits (Box of 24)', category: 'Food', unit: 'Box', unitPrice: 120, availableStock: 400 },
      { itemId: 'food-03', name: 'Fresh Milk Bread Loaf (Family Pack)', category: 'Food', unit: 'Pack', unitPrice: 40, availableStock: 250 },
      { itemId: 'food-04', name: 'Packaged Drinking Water (24 x 500ml)', category: 'Food', unit: 'Carton', unitPrice: 120, availableStock: 500 },
    ],
  },
];

// Helper: Seed initial records in MongoDB if collection is empty
async function ensureSeedData() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const teamCount = await VolunteerTeam.countDocuments();
    if (teamCount === 0) {
      await VolunteerTeam.insertMany(BASELINE_VOLUNTEER_TEAMS);
    }
    const campCount = await ReliefCampaign.countDocuments();
    if (campCount === 0) {
      await ReliefCampaign.insertMany(BASELINE_CAMPAIGNS);
    }
    const supCount = await ReliefSupplier.countDocuments();
    if (supCount === 0) {
      await ReliefSupplier.insertMany(BASELINE_SUPPLIERS);
    }
  } catch (err) {
    console.error('[Seed Volunteers DB Error]', err);
  }
}
ensureSeedData();

// ==========================================
// 1. VOLUNTEER TEAMS API
// ==========================================

export const getVolunteerTeams = asyncHandler(async (req, res) => {
  const { userLat, userLng, disaster, skill, verifiedOnly, search, status } = req.query;

  const filter = {};
  if (verifiedOnly === 'true') filter.verificationStatus = 'Verified';
  if (status && status !== 'all') filter.operationalStatus = status;
  if (disaster && disaster !== 'all') filter.supportedDisasters = disaster;
  if (skill && skill !== 'all') filter.skills = skill;
  if (search) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { city: { $regex: q, $options: 'i' } },
      { district: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
    ];
  }

  let teams = [];
  if (mongoose.connection.readyState === 1) {
    try {
      teams = await VolunteerTeam.find(filter).sort({ isVerified: -1, activeMembers: -1 }).lean();
    } catch (err) {
      console.error('[Get Teams Error]', err);
    }
  }

  if (teams.length === 0 && !search && (!status || status === 'all')) {
    teams = BASELINE_VOLUNTEER_TEAMS;
  }

  // Calculate distance from user coords if provided
  const parsedLat = userLat ? Number(userLat) : null;
  const parsedLng = userLng ? Number(userLng) : null;

  const teamsWithDistance = teams.map((team) => {
    let distanceKm = null;
    if (parsedLat && parsedLng && team.coords?.lat && team.coords?.lng) {
      distanceKm = calculateDistanceKm(parsedLat, parsedLng, team.coords.lat, team.coords.lng);
    }
    return {
      ...team,
      distanceKm,
      distanceText: distanceKm !== null ? `${distanceKm} km away` : 'Distance approximate',
    };
  });

  if (parsedLat && parsedLng) {
    teamsWithDistance.sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }

  return res.status(200).json(new ApiResponse(200, teamsWithDistance, 'Volunteer teams retrieved'));
});

export const getVolunteerTeamDetails = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  let team = null;
  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(teamId);
    team = await VolunteerTeam.findOne(
      isObjectId ? { $or: [{ _id: teamId }, { teamId }] } : { teamId }
    ).lean();
  }
  if (!team) {
    team = BASELINE_VOLUNTEER_TEAMS.find((t) => t.teamId === teamId || t._id === teamId);
  }

  if (!team) {
    throw new ApiError(404, 'Volunteer team not found');
  }

  // Check if caller is an approved team member, team creator, or admin
  const callerPhone = req.query.userPhone || req.user?.phone;
  const callerEmail = req.query.userEmail || req.user?.email;
  const isApprovedMember = Boolean(
    req.user?.role === 'admin' ||
    (callerPhone && (
      team.leaderPhone === callerPhone ||
      team.approvedMembers?.some((m) => m.phone === callerPhone || m.phoneMasked?.endsWith(callerPhone.slice(-4)))
    )) ||
    (callerEmail && team.approvedMembers?.some((m) => m.email === callerEmail))
  );

  // If approved member, return full unmasked contact details
  const sanitizedTeam = {
    ...team,
    isCallerApprovedMember: isApprovedMember,
    leaderPhone: isApprovedMember
      ? team.leaderPhone
      : (team.leaderPhone ? team.leaderPhone.replace(/(\+?\d{2}\s?\d{2})\d{4}(\d{4})/, '$1****$2') : ''),
  };

  return res.status(200).json(new ApiResponse(200, sanitizedTeam, 'Team details retrieved'));
});

export const createVolunteerTeam = asyncHandler(async (req, res) => {
  const {
    name,
    description = '',
    teamCategory = 'Citizen Action Group',
    supportedDisasters = ['Floods', 'General Emergency'],
    location,
    city,
    district,
    state = 'Uttar Pradesh',
    pincode = '',
    serviceArea = '',
    lat,
    lng,
    leaderName,
    leaderPhone,
    capacity = 50,
    skills = [],
    aadhaarNumber = '',
    idProofType = 'Aadhaar Card',
    idProofPhoto = '',
    registrationDocRef = '',
  } = req.body;

  if (!name || !location || !leaderName || !leaderPhone) {
    throw new ApiError(400, 'Team name, location, and team leader contact details are required');
  }

  const teamId = `VOL-TEAM-${Date.now().toString().slice(-4)}`;
  const payload = {
    teamId,
    name: name.trim(),
    description: description.trim(),
    teamCategory,
    supportedDisasters: Array.isArray(supportedDisasters) ? supportedDisasters : [supportedDisasters],
    location: location.trim(),
    city: city ? city.trim() : 'Prayagraj',
    district: district ? district.trim() : 'Prayagraj',
    state: state.trim(),
    pincode: pincode.trim(),
    serviceArea: serviceArea.trim() || 'Local district radius',
    coords: {
      lat: lat ? Number(lat) : 25.4358,
      lng: lng ? Number(lng) : 81.8463,
    },
    leaderName: leaderName.trim(),
    leaderPhone: leaderPhone.trim(),
    aadhaarNumber: aadhaarNumber ? aadhaarNumber.trim() : '',
    idProofType: idProofType || 'Aadhaar Card',
    idProofPhoto: idProofPhoto || '',
    capacity: Number(capacity) || 50,
    activeMembers: 1,
    approvedMembers: [
      {
        memberId: `MBR-${Date.now().toString().slice(-4)}`,
        fullName: leaderName.trim(),
        phoneMasked: leaderPhone.slice(-4).padStart(leaderPhone.length, '*'),
        role: 'Team Leader',
        joinedAt: new Date(),
      },
    ],
    skills: Array.isArray(skills) && skills.length > 0 ? skills : ['First Aid', 'Emergency Relief'],
    isVerified: false,
    verificationStatus: 'Pending',
    operationalStatus: 'Accepting Members',
    currentMission: 'Awaiting administrative verification and deployment',
    completedMissions: 0,
    registrationDocRef,
    createdBy: req.user?.name || leaderName,
  };

  let saved = payload;
  if (mongoose.connection.readyState === 1) {
    saved = await VolunteerTeam.create(payload);
    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'TEAM_CREATED_PENDING',
      category: 'Team',
      performedBy: leaderName,
      targetRef: teamId,
      details: `New team "${name}" registered with status Pending Verification.`,
    });
  }

  broadcastEmergencyAlert('mela:new_volunteer_team', {
    teamId,
    name,
    location,
  });

  return res.status(201).json(new ApiResponse(201, saved, 'Team registered successfully. Awaiting admin verification.'));
});

export const requestJoinTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const {
    fullName,
    phone,
    email = '',
    currentLocation = '',
    skills = [],
    availability = '',
    qualifications = '',
    reason,
    aadhaarNumber = '',
    idProofType = 'Aadhaar Card',
    idProofPhoto = '',
    idProofRef = '',
  } = req.body;

  if (!fullName || !phone || !reason) {
    throw new ApiError(400, 'Full name, mobile number, and reason for joining are required');
  }

  // Check team capacity and status
  let team = null;
  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(teamId);
    team = await VolunteerTeam.findOne(
      isObjectId ? { $or: [{ _id: teamId }, { teamId }] } : { teamId }
    );
  }

  if (team && team.operationalStatus === 'At Capacity') {
    throw new ApiError(400, 'This team has reached maximum volunteer capacity.');
  }

  // Prevent duplicate requests
  if (mongoose.connection.readyState === 1) {
    const existing = await TeamJoinRequest.findOne({
      $or: [{ teamId }, { teamId: team?.teamId || '' }],
      phone: phone.trim(),
      status: 'Pending Review',
    });
    if (existing) {
      throw new ApiError(409, 'You already have a pending membership request for this team.');
    }
  }

  const requestId = `TJR-${Date.now().toString().slice(-6)}`;
  const payload = {
    requestId,
    teamId: team?.teamId || teamId,
    teamName: team?.name || teamId,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    currentLocation: currentLocation.trim(),
    skills: Array.isArray(skills) ? skills : [skills],
    aadhaarNumber: aadhaarNumber ? aadhaarNumber.trim() : '',
    idProofType: idProofType || 'Aadhaar Card',
    idProofPhoto: idProofPhoto || '',
    idProofRef: idProofRef ? idProofRef.trim() : '',
    availability: availability.trim() || 'Flexible',
    qualifications: qualifications.trim(),
    reason: reason.trim(),
    safetyGuidelinesAgreed: true,
    status: 'Pending Review',
  };

  let saved = payload;
  if (mongoose.connection.readyState === 1) {
    saved = await TeamJoinRequest.create(payload);
  }

  return res.status(201).json(
    new ApiResponse(201, saved, 'Membership request submitted successfully. The team leader or administrator will review it.')
  );
});

export const getTeamJoinRequests = asyncHandler(async (req, res) => {
  const { teamId, status } = req.query;
  const filter = {};
  if (teamId) filter.teamId = teamId;
  if (status && status !== 'all') filter.status = status;

  let requests = [];
  if (mongoose.connection.readyState === 1) {
    requests = await TeamJoinRequest.find(filter).sort({ createdAt: -1 }).lean();
  }
  return res.status(200).json(new ApiResponse(200, requests, 'Team join requests retrieved'));
});

export const reviewTeamJoinRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { action, status, reviewNotes = '', adminNotes = '' } = req.body; // action/status: 'Approve'/'Approved' | 'Reject'/'Rejected' | 'Waitlist'/'Waitlisted'

  const effectiveAction = (action || status || '').toLowerCase();
  let newStatus = '';
  if (effectiveAction.startsWith('app')) newStatus = 'Approved';
  else if (effectiveAction.startsWith('rej')) newStatus = 'Rejected';
  else if (effectiveAction.startsWith('wait')) newStatus = 'Waitlisted';
  else {
    throw new ApiError(400, 'Invalid action. Must be Approve, Reject, or Waitlist');
  }

  let request = null;
  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(requestId);
    request = await TeamJoinRequest.findOne(
      isObjectId ? { $or: [{ _id: requestId }, { requestId }] } : { requestId }
    );
  }

  if (!request) {
    throw new ApiError(404, 'Join request not found');
  }

  // Generate a distinct 6-digit Secret PIN if approved and not yet generated
  let generatedKey = request.secretKey || '';
  if (newStatus === 'Approved' && !generatedKey) {
    generatedKey = `SEC-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  request.status = newStatus;
  request.secretKey = generatedKey;
  request.reviewNotes = reviewNotes || adminNotes;
  request.reviewedBy = req.user?.name || 'Authorized Lead';
  request.reviewedAt = new Date();
  await request.save();

  // If approved, append member to VolunteerTeam with secretKey and unmasked phone
  if (newStatus === 'Approved' && mongoose.connection.readyState === 1) {
    const team = await VolunteerTeam.findOne({
      $or: [{ teamId: request.teamId }, { _id: mongoose.Types.ObjectId.isValid(request.teamId) ? request.teamId : null }].filter(Boolean),
    });
    if (team) {
      // Check if already in approvedMembers
      const alreadyMember = team.approvedMembers.some(
        (m) => m.phone === request.phone || m.secretKey === generatedKey
      );
      if (!alreadyMember) {
        team.approvedMembers.push({
          memberId: `MBR-${Date.now().toString().slice(-4)}`,
          fullName: request.fullName,
          phone: request.phone,
          phoneMasked: request.phone.slice(-4).padStart(request.phone.length, '*'),
          secretKey: generatedKey,
          role: 'Field Volunteer',
          joinedAt: new Date(),
        });
        team.activeMembers = team.approvedMembers.length;
        if (team.activeMembers >= team.capacity) {
          team.operationalStatus = 'At Capacity';
        }
        await team.save();
      }

      await ReliefAuditLog.create({
        logId: `LOG-${Date.now()}`,
        action: 'MEMBER_JOIN_APPROVED',
        category: 'Team',
        performedBy: req.user?.name || 'Admin',
        targetRef: team.teamId,
        details: `Approved member "${request.fullName}" (Key: ${generatedKey}) to team "${team.name}". Total active members: ${team.activeMembers}.`,
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(200, request, `Request marked as ${newStatus}${generatedKey ? ` with Secret Access Key: ${generatedKey}` : ''}`)
  );
});

export const unlockTeamContacts = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { secretKey } = req.body;

  if (!secretKey || !secretKey.trim()) {
    throw new ApiError(400, 'Secret Access Key is required to view confidential team contacts.');
  }

  const cleanKey = secretKey.trim().toUpperCase();

  let team = null;
  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(teamId);
    team = await VolunteerTeam.findOne(
      isObjectId ? { $or: [{ _id: teamId }, { teamId }] } : { teamId }
    ).lean();
  }
  if (!team) {
    team = BASELINE_VOLUNTEER_TEAMS.find((t) => t.teamId === teamId || t._id === teamId);
  }

  if (!team) {
    throw new ApiError(404, 'Volunteer team not found');
  }

  // Check if key matches an approved member or verified join request for this team
  let isKeyValid = false;
  let matchingMember = null;

  // 1. Check in team approvedMembers
  if (Array.isArray(team.approvedMembers)) {
    matchingMember = team.approvedMembers.find((m) => m.secretKey && m.secretKey.toUpperCase() === cleanKey);
    if (matchingMember) isKeyValid = true;
  }

  // 2. Also check in TeamJoinRequest records
  if (!isKeyValid && mongoose.connection.readyState === 1) {
    const matchedRequest = await TeamJoinRequest.findOne({
      $or: [{ teamId: team.teamId }, { teamId: team._id?.toString() }],
      secretKey: cleanKey,
      status: 'Approved',
    }).lean();
    if (matchedRequest) {
      isKeyValid = true;
      matchingMember = {
        fullName: matchedRequest.fullName,
        phone: matchedRequest.phone,
        role: 'Field Volunteer',
      };
    }
  }

  // 3. Admin bypass key for command center demo / verification testing
  if (!isKeyValid && cleanKey === 'SEC-ADMIN999') {
    isKeyValid = true;
    matchingMember = { fullName: 'Command Center Lead', role: 'HQ Supervisor' };
  }

  if (!isKeyValid) {
    throw new ApiError(403, 'Invalid or unverified Secret Key. Access to volunteer contact numbers is restricted to approved members only.');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        unlocked: true,
        teamId: team.teamId,
        leaderName: team.leaderName,
        leaderPhone: team.leaderPhone,
        approvedMembers: (team.approvedMembers || []).map((m) => ({
          fullName: m.fullName,
          phone: m.phone || m.phoneMasked,
          role: m.role || 'Volunteer',
          joinedAt: m.joinedAt,
        })),
        verifiedAs: matchingMember?.fullName || 'Verified Member',
      },
      'Secret Key verified. Confidential volunteer contact information unlocked.'
    )
  );
});

export const reviewVolunteerTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { verificationStatus, operationalStatus, capacity } = req.body;

  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(teamId);
    const team = await VolunteerTeam.findOne(
      isObjectId ? { $or: [{ _id: teamId }, { teamId }] } : { teamId }
    );
    if (!team) throw new ApiError(404, 'Team not found');

    if (verificationStatus) {
      team.verificationStatus = verificationStatus;
      team.isVerified = verificationStatus === 'Verified';
    }
    if (operationalStatus) team.operationalStatus = operationalStatus;
    if (capacity) team.capacity = Number(capacity);

    await team.save();

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'TEAM_REVIEW_UPDATED',
      category: 'Team',
      performedBy: req.user?.name || 'Admin',
      targetRef: teamId,
      details: `Team status updated: verification=${team.verificationStatus}, operational=${team.operationalStatus}`,
    });

    return res.status(200).json(new ApiResponse(200, team, 'Team administrative record updated'));
  }

  return res.status(200).json(new ApiResponse(200, null, 'Team updated (memory fallback)'));
});

export const deleteVolunteerTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(teamId);
    const team = await VolunteerTeam.findOneAndDelete(
      isObjectId ? { $or: [{ _id: teamId }, { teamId }] } : { teamId }
    );
    if (!team) throw new ApiError(404, 'Volunteer team not found');

    // Also clean up pending join requests for this team
    await TeamJoinRequest.deleteMany({ teamId: team.teamId || teamId });

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'TEAM_DELETED',
      category: 'Team',
      performedBy: req.user?.name || 'Admin',
      targetRef: team.teamId || teamId,
      details: `Team "${team.name}" was permanently removed by administrator.`,
    });

    return res.status(200).json(new ApiResponse(200, { deletedId: team._id, teamId: team.teamId }, 'Team deleted successfully'));
  }

  return res.status(200).json(new ApiResponse(200, { teamId }, 'Team deleted (memory fallback)'));
});

// ==========================================
// 2. VOLUNTEER REGISTRATION (MULTI-STEP)
// ==========================================

export const registerVolunteer = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email = '',
    dob = '',
    state = 'Uttar Pradesh',
    district = 'Prayagraj',
    city = 'Prayagraj',
    pincode = '',
    preferredServiceArea = '',
    skills = [],
    qualifications = '',
    availableDays = [],
    availableHours = '',
    emergencyAvailability = true,
    travelDistanceKm = 15,
    hasVehicle = false,
    vehicleType = 'None',
    languages = ['Hindi'],
    idType = 'Not Provided',
    idReference = '',
    consentGiven = true,
  } = req.body;

  if (!fullName || !phone || !state || !district || !city) {
    throw new ApiError(400, 'Full name, phone, state, district, and city are mandatory');
  }

  if (!consentGiven) {
    throw new ApiError(400, 'Explicit informed consent is required to register as a disaster volunteer');
  }

  // Prevent duplicate pending registration
  if (mongoose.connection.readyState === 1) {
    const existing = await VolunteerRegistration.findOne({ phone: phone.trim(), applicationStatus: { $in: ['Pending', 'Approved', 'Active'] } });
    if (existing) {
      return res.status(200).json(
        new ApiResponse(200, existing, 'You already have an active or pending volunteer registration with this mobile number.')
      );
    }
  }

  // Mask identity reference to prevent storing sensitive raw document data
  let idReferenceMasked = '';
  if (idReference) {
    const clean = idReference.trim();
    idReferenceMasked = clean.length > 4 ? `XXXX-XXXX-${clean.slice(-4)}` : 'REF-VERIFIED';
  }

  const regId = `VOL-REG-${Date.now().toString().slice(-6)}`;
  const payload = {
    regId,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email.trim(),
    dob,
    state: state.trim(),
    district: district.trim(),
    city: city.trim(),
    pincode: pincode.trim(),
    preferredServiceArea: preferredServiceArea.trim(),
    skills: Array.isArray(skills) && skills.length > 0 ? skills : ['First Aid', 'Food Distribution'],
    qualifications: qualifications.trim(),
    availableDays: Array.isArray(availableDays) ? availableDays : [availableDays],
    availableHours: availableHours || '4-8 hours/week',
    emergencyAvailability: Boolean(emergencyAvailability),
    travelDistanceKm: Number(travelDistanceKm) || 15,
    hasVehicle: Boolean(hasVehicle),
    vehicleType,
    languages: Array.isArray(languages) ? languages : ['Hindi'],
    idType,
    idReferenceMasked,
    consentGiven: true,
    verificationStatus: idType !== 'Not Provided' ? 'Pending Review' : 'Not Required',
    applicationStatus: 'Pending',
  };

  let saved = payload;
  if (mongoose.connection.readyState === 1) {
    saved = await VolunteerRegistration.create(payload);
    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'VOLUNTEER_APPLICATION_SUBMITTED',
      category: 'Volunteer',
      performedBy: fullName,
      targetRef: regId,
      details: `Volunteer application filed by ${fullName} (${district}, ${state}). Status: Pending.`,
    });
  }

  return res.status(201).json(new ApiResponse(201, saved, 'Volunteer application submitted successfully. Assigned ID: ' + regId));
});

export const getVolunteerApplications = asyncHandler(async (req, res) => {
  const { status, district, skill } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.applicationStatus = status;
  if (district) filter.district = district;
  if (skill) filter.skills = skill;

  let apps = [];
  if (mongoose.connection.readyState === 1) {
    apps = await VolunteerRegistration.find(filter).sort({ createdAt: -1 }).lean();
  }
  return res.status(200).json(new ApiResponse(200, apps, 'Volunteer registrations list'));
});

export const reviewVolunteerApplication = asyncHandler(async (req, res) => {
  const { regId } = req.params;
  const { applicationStatus, verificationStatus, adminNotes = '' } = req.body;

  if (mongoose.connection.readyState === 1) {
    const app = await VolunteerRegistration.findOne({ regId });
    if (!app) throw new ApiError(404, 'Volunteer application not found');

    if (applicationStatus) app.applicationStatus = applicationStatus;
    if (verificationStatus) app.verificationStatus = verificationStatus;
    app.adminNotes = adminNotes;
    app.reviewedBy = req.user?.name || 'Admin Officer';
    app.reviewedAt = new Date();
    await app.save();

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'VOLUNTEER_REVIEWED',
      category: 'Volunteer',
      performedBy: req.user?.name || 'Admin',
      targetRef: regId,
      details: `Application ${regId} status changed to ${app.applicationStatus} (Verification: ${app.verificationStatus}).`,
    });

    return res.status(200).json(new ApiResponse(200, app, 'Application status updated'));
  }

  return res.status(200).json(new ApiResponse(200, null, 'Updated (fallback)'));
});

// ==========================================
// 3. DISASTER RELIEF CAMPAIGNS & DONATIONS
// ==========================================

export const getReliefCampaigns = asyncHandler(async (req, res) => {
  const { category, state, district, status } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.disasterCategory = category;
  if (state) filter.affectedState = state;
  if (district) filter.affectedDistrict = district;
  if (status && status !== 'all') filter.status = status;

  let campaigns = [];
  if (mongoose.connection.readyState === 1) {
    campaigns = await ReliefCampaign.find(filter).sort({ status: 1, createdAt: -1 }).lean();
  }
  if (campaigns.length === 0 && (!status || status === 'all')) {
    campaigns = BASELINE_CAMPAIGNS;
  }

  return res.status(200).json(new ApiResponse(200, campaigns, 'Relief campaigns retrieved'));
});

export const createReliefCampaign = asyncHandler(async (req, res) => {
  const {
    title,
    description = '',
    disasterCategory = 'Floods',
    affectedState = 'Uttar Pradesh',
    affectedDistrict = 'Prayagraj',
    lat,
    lng,
    targetAmount = 500000,
    isGovernmentFund = false,
    recipientAgency = 'District Disaster Relief Escrow',
    verifiedNeeds = [],
  } = req.body;

  if (!title || !recipientAgency) {
    throw new ApiError(400, 'Campaign title and official recipient agency are required');
  }

  const campaignId = `CMP-${Date.now().toString().slice(-6)}`;
  const payload = {
    campaignId,
    title: title.trim(),
    description: description.trim(),
    disasterCategory,
    affectedState: affectedState.trim(),
    affectedDistrict: affectedDistrict.trim(),
    locationCoords: {
      lat: lat ? Number(lat) : 25.4358,
      lng: lng ? Number(lng) : 81.8463,
    },
    targetAmount: Number(targetAmount) || 500000,
    confirmedAmount: 0,
    donationCount: 0,
    isGovernmentFund: Boolean(isGovernmentFund),
    recipientAgency: recipientAgency.trim(),
    recipientAccountType: 'Verified Public Relief Escrow Account',
    status: 'Active',
    isVerified: true,
    verifiedNeeds: Array.isArray(verifiedNeeds) ? verifiedNeeds : [],
    verifiedUpdates: [
      {
        title: 'Campaign Officially Commenced',
        text: `Official disaster relief operations opened for ${affectedDistrict}, ${affectedState}.`,
        author: 'Command Operations Desk',
        timestamp: new Date(),
      },
    ],
  };

  let saved = payload;
  if (mongoose.connection.readyState === 1) {
    saved = await ReliefCampaign.create(payload);
    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'CAMPAIGN_LAUNCHED',
      category: 'Campaign',
      performedBy: req.user?.name || 'Admin',
      targetRef: campaignId,
      details: `Campaign "${title}" launched with target ₹${targetAmount}.`,
    });
  }

  return res.status(201).json(new ApiResponse(201, saved, 'Relief campaign published successfully'));
});

export const deleteReliefCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;

  if (mongoose.connection.readyState === 1) {
    const isObjectId = mongoose.Types.ObjectId.isValid(campaignId);
    const campaign = await ReliefCampaign.findOneAndDelete(
      isObjectId ? { $or: [{ _id: campaignId }, { campaignId }] } : { campaignId }
    );
    if (!campaign) throw new ApiError(404, 'Relief campaign not found');

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'CAMPAIGN_DELETED',
      category: 'Campaign',
      performedBy: req.user?.name || 'Admin',
      targetRef: campaign.campaignId || campaignId,
      details: `Relief campaign "${campaign.title}" was permanently removed by administrator.`,
    });

    return res.status(200).json(new ApiResponse(200, { deletedId: campaign._id, campaignId: campaign.campaignId }, 'Campaign deleted successfully'));
  }

  return res.status(200).json(new ApiResponse(200, { campaignId }, 'Campaign deleted (memory fallback)'));
});

export const donateToCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const {
    donorName = 'Citizen Supporter',
    donorPhone = '',
    donorEmail = '',
    amount,
    type = 'Monetary Contribution',
    sponsoredItems = [],
    isAnonymous = false,
  } = req.body;

  const donationAmount = Number(amount);
  if (!donationAmount || donationAmount <= 0) {
    throw new ApiError(400, 'Valid donation amount is required');
  }

  let campaign = null;
  if (mongoose.connection.readyState === 1) {
    campaign = await ReliefCampaign.findOne({ campaignId });
  }

  const donationId = `DON-${Date.now().toString().slice(-6)}`;
  const receiptNumber = `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

  const donationDoc = {
    donationId,
    campaignId,
    campaignTitle: campaign?.title || 'Disaster Relief Fund',
    donorName: isAnonymous ? 'Anonymous Citizen' : donorName.trim(),
    donorPhone: donorPhone.trim(),
    donorEmail: donorEmail.trim(),
    amount: donationAmount,
    currency: 'INR',
    type,
    sponsoredItems,
    paymentProvider: 'Razorpay Sandbox (Verified Sandbox Simulation)',
    paymentOrderId: `order_${crypto.randomBytes(8).toString('hex')}`,
    paymentTransactionId: `pay_${crypto.randomBytes(10).toString('hex')}`,
    paymentStatus: 'Successful',
    receiptNumber,
    isAnonymous: Boolean(isAnonymous),
  };

  if (mongoose.connection.readyState === 1) {
    await CampaignDonation.create(donationDoc);

    // Increment actual confirmed amount on the campaign
    if (campaign) {
      campaign.confirmedAmount = (campaign.confirmedAmount || 0) + donationAmount;
      campaign.donationCount = (campaign.donationCount || 0) + 1;

      // If essentials were sponsored, increment the fundedQty for corresponding needs
      if (Array.isArray(sponsoredItems) && sponsoredItems.length > 0) {
        sponsoredItems.forEach((sp) => {
          const matchNeed = campaign.verifiedNeeds.find((n) => n.itemKey === sp.itemKey || n.itemName === sp.itemName);
          if (matchNeed) {
            matchNeed.fundedQty = (matchNeed.fundedQty || 0) + Number(sp.quantity);
          }
        });
      }

      if (campaign.confirmedAmount >= campaign.targetAmount) {
        campaign.status = 'Target Reached';
      }
      await campaign.save();
    }

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'DONATION_RECEIVED_CONFIRMED',
      category: 'Donation',
      performedBy: isAnonymous ? 'Anonymous' : donorName,
      targetRef: donationId,
      details: `Confirmed ₹${donationAmount} (${type}) for campaign ${campaignId}. Receipt: ${receiptNumber}.`,
    });
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        donation: donationDoc,
        campaignUpdatedTotal: campaign?.confirmedAmount || donationAmount,
        receiptNumber,
      },
      'Donation processed and receipt issued successfully'
    )
  );
});

export const getCampaignDonations = asyncHandler(async (req, res) => {
  const { campaignId } = req.query;
  const filter = { paymentStatus: 'Successful' };
  if (campaignId) filter.campaignId = campaignId;

  let donations = [];
  if (mongoose.connection.readyState === 1) {
    donations = await CampaignDonation.find(filter)
      .select('-donorPhone -donorEmail') // Never expose private donor contact
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }
  return res.status(200).json(new ApiResponse(200, donations, 'Donations list'));
});

// ==========================================
// 4. CERTIFIED SUPPLIERS & SHOPS NETWORK
// ==========================================

export const getReliefSuppliers = asyncHandler(async (req, res) => {
  const { category, city, verifiedOnly } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.supplierCategory = category;
  if (city) filter.city = city;
  if (verifiedOnly === 'true') filter.verificationStatus = 'Verified';

  let suppliers = [];
  if (mongoose.connection.readyState === 1) {
    suppliers = await ReliefSupplier.find(filter).sort({ verificationStatus: 1 }).lean();
  }
  if (suppliers.length === 0) {
    suppliers = BASELINE_SUPPLIERS;
  }

  // Hide private owner contact in public list
  const sanitized = suppliers.map((s) => ({
    ...s,
    contactPhone: s.contactPhone ? s.contactPhone.replace(/(\+?\d{2}\s?\d{2})\d{4}(\d{4})/, '$1****$2') : '',
  }));

  return res.status(200).json(new ApiResponse(200, sanitized, 'Relief suppliers retrieved'));
});

export const registerSupplier = asyncHandler(async (req, res) => {
  const { businessName, supplierCategory, licenseNumber, city, district, state = 'Uttar Pradesh', address, lat, lng, contactPerson, contactPhone, catalog = [] } = req.body;

  if (!businessName || !supplierCategory || !licenseNumber || !address || !contactPerson || !contactPhone) {
    throw new ApiError(400, 'Business name, category, license number, address, and contact details are required');
  }

  const supplierId = `SUP-${Date.now().toString().slice(-4)}`;
  const payload = {
    supplierId,
    businessName: businessName.trim(),
    supplierCategory,
    licenseNumber: licenseNumber.trim(),
    licenseVerified: false,
    city: city ? city.trim() : 'Prayagraj',
    district: district ? district.trim() : 'Prayagraj',
    state: state.trim(),
    address: address.trim(),
    coords: {
      lat: lat ? Number(lat) : 25.4358,
      lng: lng ? Number(lng) : 81.8463,
    },
    contactPerson: contactPerson.trim(),
    contactPhone: contactPhone.trim(),
    verificationStatus: 'Pending Verification',
    isOpenForEmergencyOrders: true,
    catalog: Array.isArray(catalog) ? catalog : [],
  };

  let saved = payload;
  if (mongoose.connection.readyState === 1) {
    saved = await ReliefSupplier.create(payload);
    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'SUPPLIER_ONBOARDED_PENDING',
      category: 'Supplier',
      performedBy: contactPerson,
      targetRef: supplierId,
      details: `New supplier "${businessName}" (${supplierCategory}) submitted with license ${licenseNumber}.`,
    });
  }

  return res.status(201).json(new ApiResponse(201, saved, 'Supplier registered. Awaiting license check and administrative approval.'));
});

export const reviewSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const { verificationStatus, licenseVerified } = req.body;

  if (mongoose.connection.readyState === 1) {
    const supplier = await ReliefSupplier.findOne({ supplierId });
    if (!supplier) throw new ApiError(404, 'Supplier not found');

    if (verificationStatus) supplier.verificationStatus = verificationStatus;
    if (licenseVerified !== undefined) supplier.licenseVerified = Boolean(licenseVerified);
    await supplier.save();

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'SUPPLIER_VERIFIED',
      category: 'Supplier',
      performedBy: req.user?.name || 'Admin',
      targetRef: supplierId,
      details: `Supplier ${supplierId} status set to ${supplier.verificationStatus}. License verified: ${supplier.licenseVerified}.`,
    });

    return res.status(200).json(new ApiResponse(200, supplier, 'Supplier verification record updated'));
  }

  return res.status(200).json(new ApiResponse(200, null, 'Updated (fallback)'));
});

// ==========================================
// 5. ESSENTIAL GOODS SUPPLY ORDERS & DISPATCH PIPELINE
// ==========================================

export const createSupplyOrder = asyncHandler(async (req, res) => {
  const { campaignId, campaignTitle, donorName = 'Anonymous Supporter', supplierId, items = [], destinationCamp = 'District Relief Center 1', lat, lng } = req.body;

  if (!supplierId || !items || items.length === 0) {
    throw new ApiError(400, 'Supplier and item selection are required');
  }

  let supplier = null;
  if (mongoose.connection.readyState === 1) {
    supplier = await ReliefSupplier.findOne({ supplierId });
  }

  const supplierName = supplier?.businessName || 'Certified Relief Shop';
  const totalAmount = items.reduce((acc, curr) => acc + (Number(curr.unitPrice) || 0) * (Number(curr.quantity) || 1), 0);

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const payload = {
    orderId,
    campaignId: campaignId || 'CMP-2026-001',
    campaignTitle: campaignTitle || 'Disaster Relief Initiative',
    donorName,
    supplierId,
    supplierName,
    supplierAddress: supplier?.address || 'City Hub',
    items,
    totalAmount,
    destinationCamp,
    destinationCoords: {
      lat: lat ? Number(lat) : 25.4358,
      lng: lng ? Number(lng) : 81.8463,
    },
    orderStatus: 'Paid',
    assignedVolunteerId: '',
    assignedVolunteerName: '',
    assignedVolunteerPhone: '',
  };

  let saved = payload;
  if (mongoose.connection.readyState === 1) {
    saved = await SupplyOrder.create(payload);
    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'SUPPLY_ORDER_CREATED',
      category: 'Order',
      performedBy: donorName,
      targetRef: orderId,
      details: `Supply order ${orderId} placed with ${supplierName} for ₹${totalAmount}.`,
    });
  }

  return res.status(201).json(new ApiResponse(201, saved, 'Supply order placed and awaiting dispatch assignment'));
});

export const getSupplyOrders = asyncHandler(async (req, res) => {
  const { status, supplierId, volunteerId } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.orderStatus = status;
  if (supplierId) filter.supplierId = supplierId;
  if (volunteerId) filter.assignedVolunteerId = volunteerId;

  let orders = [];
  if (mongoose.connection.readyState === 1) {
    orders = await SupplyOrder.find(filter).sort({ createdAt: -1 }).lean();
  }
  return res.status(200).json(new ApiResponse(200, orders, 'Supply orders retrieved'));
});

export const updateSupplyOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus, deliveryConfirmationNote = '', deliveryEvidenceUrl = '' } = req.body;

  if (mongoose.connection.readyState === 1) {
    const order = await SupplyOrder.findOne({ orderId });
    if (!order) throw new ApiError(404, 'Order not found');

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
      order.deliveryConfirmationNote = deliveryConfirmationNote;
      order.deliveryEvidenceUrl = deliveryEvidenceUrl;

      // Update deliveredQty in the linked campaign
      if (order.campaignId) {
        const camp = await ReliefCampaign.findOne({ campaignId: order.campaignId });
        if (camp) {
          order.items.forEach((ordItem) => {
            const need = camp.verifiedNeeds.find((n) => n.itemKey === ordItem.itemKey || n.itemName === ordItem.name);
            if (need) {
              need.deliveredQty = (need.deliveredQty || 0) + (ordItem.quantity || 0);
            }
          });
          await camp.save();
        }
      }
    }
    await order.save();

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'SUPPLY_ORDER_STATUS_CHANGED',
      category: 'Order',
      performedBy: req.user?.name || 'Volunteer/Admin',
      targetRef: orderId,
      details: `Order ${orderId} transitioned to "${orderStatus}".`,
    });

    return res.status(200).json(new ApiResponse(200, order, `Order status updated to ${orderStatus}`));
  }

  return res.status(200).json(new ApiResponse(200, null, 'Updated (fallback)'));
});

export const claimDeliveryOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { volunteerName = 'Volunteer Dispatcher', volunteerPhone = '' } = req.body;

  if (mongoose.connection.readyState === 1) {
    const order = await SupplyOrder.findOne({ orderId });
    if (!order) throw new ApiError(404, 'Order not found');

    order.assignedVolunteerId = `VOL-${Date.now().toString().slice(-4)}`;
    order.assignedVolunteerName = volunteerName;
    order.assignedVolunteerPhone = volunteerPhone;
    order.orderStatus = 'Assigned for Delivery';
    await order.save();

    await ReliefAuditLog.create({
      logId: `LOG-${Date.now()}`,
      action: 'DELIVERY_CLAIMED',
      category: 'Order',
      performedBy: volunteerName,
      targetRef: orderId,
      details: `Volunteer ${volunteerName} claimed delivery of order ${orderId}.`,
    });

    return res.status(200).json(new ApiResponse(200, order, 'Delivery assignment accepted'));
  }

  return res.status(200).json(new ApiResponse(200, null, 'Claimed (fallback)'));
});

// ==========================================
// 6. COMMAND CENTRE RELIEF OVERVIEW & AUDIT LOGS
// ==========================================

export const getReliefCommandOverview = asyncHandler(async (req, res) => {
  let stats = {
    totalVolunteers: 0,
    approvedVolunteers: 0,
    pendingVolunteers: 0,
    totalTeams: 0,
    verifiedTeams: 0,
    activeCampaigns: 0,
    confirmedDonationsTotal: 0,
    totalDonationsCount: 0,
    totalSuppliers: 0,
    verifiedSuppliers: 0,
    activeSupplyOrders: 0,
    completedDeliveries: 0,
    lastRefreshed: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      const [volTotal, volAppr, volPend, teamTotal, teamVer, campAct, donTotalAgg, supTotal, supVer, ordAct, ordDone] = await Promise.all([
        VolunteerRegistration.countDocuments(),
        VolunteerRegistration.countDocuments({ applicationStatus: { $in: ['Approved', 'Active'] } }),
        VolunteerRegistration.countDocuments({ applicationStatus: 'Pending' }),
        VolunteerTeam.countDocuments(),
        VolunteerTeam.countDocuments({ verificationStatus: 'Verified' }),
        ReliefCampaign.countDocuments({ status: { $in: ['Active', 'Urgent'] } }),
        CampaignDonation.aggregate([
          { $match: { paymentStatus: 'Successful' } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        ReliefSupplier.countDocuments(),
        ReliefSupplier.countDocuments({ verificationStatus: 'Verified' }),
        SupplyOrder.countDocuments({ orderStatus: { $nin: ['Delivered', 'Cancelled'] } }),
        SupplyOrder.countDocuments({ orderStatus: 'Delivered' }),
      ]);

      stats.totalVolunteers = volTotal;
      stats.approvedVolunteers = volAppr;
      stats.pendingVolunteers = volPend;
      stats.totalTeams = teamTotal;
      stats.verifiedTeams = teamVer;
      stats.activeCampaigns = campAct;
      stats.confirmedDonationsTotal = donTotalAgg[0]?.total || 0;
      stats.totalDonationsCount = donTotalAgg[0]?.count || 0;
      stats.totalSuppliers = supTotal;
      stats.verifiedSuppliers = supVer;
      stats.activeSupplyOrders = ordAct;
      stats.completedDeliveries = ordDone;
    } catch (err) {
      console.error('[Relief Overview Aggregation Error]', err);
    }
  }

  return res.status(200).json(new ApiResponse(200, stats, 'Relief operations command overview generated'));
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  let logs = [];
  if (mongoose.connection.readyState === 1) {
    logs = await ReliefAuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
  }
  return res.status(200).json(new ApiResponse(200, logs, 'Relief audit logs retrieved'));
});

// ==========================================
// 7. PRESERVE LEGACY MEDICINE DELIVERY REQUESTS
// ==========================================

export const getDeliveryRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;

  let deliveries = [];
  if (mongoose.connection.readyState === 1) {
    deliveries = await DeliveryRequest.find(filter).sort({ createdAt: -1 }).lean();
  }
  return res.status(200).json(new ApiResponse(200, deliveries, 'Delivery requests list'));
});

export const createDeliveryRequest = asyncHandler(async (req, res) => {
  const { patientName, patientPhone, medicinesList = [], deliveryAddress, lat, lng, urgency = 'urgent' } = req.body;
  const deliveryId = generateIncidentId('DELIV');
  const delivery = {
    deliveryId,
    patientName,
    patientPhone,
    medicinesList,
    deliveryAddress,
    destinationCoords: {
      lat: lat ? Number(lat) : 25.4358,
      lng: lng ? Number(lng) : 81.8463,
    },
    urgency,
    status: 'requested',
  };

  let saved = delivery;
  if (mongoose.connection.readyState === 1) {
    saved = await DeliveryRequest.create(delivery);
  }
  return res.status(201).json(new ApiResponse(201, saved, 'Delivery request created'));
});

export const claimDeliveryRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { volunteerName = 'Field Volunteer' } = req.body;

  if (mongoose.connection.readyState === 1) {
    const doc = await DeliveryRequest.findOneAndUpdate(
      { $or: [{ deliveryId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
      { status: 'accepted', volunteerName },
      { new: true }
    );
    return res.status(200).json(new ApiResponse(200, doc, 'Delivery claimed'));
  }
  return res.status(200).json(new ApiResponse(200, null, 'Claimed (fallback)'));
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (mongoose.connection.readyState === 1) {
    const doc = await DeliveryRequest.findOneAndUpdate(
      { $or: [{ deliveryId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }] },
      { status, deliveredAt: status === 'delivered' ? new Date() : undefined },
      { new: true }
    );
    return res.status(200).json(new ApiResponse(200, doc, 'Status updated'));
  }
  return res.status(200).json(new ApiResponse(200, null, 'Status updated (fallback)'));
});

import mongoose from 'mongoose';
import VolunteerTeam from '../models/VolunteerTeam.model.js';
import DeliveryRequest from '../models/DeliveryRequest.model.js';
import { generateIncidentId } from '../utils/idGenerator.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { broadcastEmergencyAlert } from '../services/notification.service.js';

const BASELINE_VOLUNTEER_TEAMS = [
  {
    teamId: 'VOL-TEAM-01',
    name: 'NDRF Community Disaster Response Battalion 11',
    location: 'Sangam Sector 2, Prayagraj',
    state: 'Uttar Pradesh',
    leaderName: 'Inspector Vikram Rathore',
    leaderPhone: '+91 98765 11001',
    activeMembers: 24,
    skills: ['Boat Rescue', 'Flood Evacuation', 'First Aid Trauma Support', 'Search & Rescue'],
    isVerified: true,
    currentMission: 'Ghat edge patrolling and pontoon bridge crowd monitoring',
  },
  {
    teamId: 'VOL-TEAM-02',
    name: 'Civil Defence & Red Cross Emergency Corps',
    location: 'Civil Lines Central Hub, Prayagraj',
    state: 'Uttar Pradesh',
    leaderName: 'Dr. Sunita Agarwal',
    leaderPhone: '+91 98765 11002',
    activeMembers: 35,
    skills: ['Triage First Aid', 'Medicine Doorstep Delivery', 'Lost Child Care', 'Elderly Escort'],
    isVerified: true,
    currentMission: 'Medicine delivery to flooded and remote pilgrimage clusters',
  },
  {
    teamId: 'VOL-TEAM-03',
    name: 'SDRF Riverine Rescue Unit',
    location: 'Yamuna Riverbank Camp',
    state: 'Uttar Pradesh',
    leaderName: 'Sub-Inspector Ankit Tiwari',
    leaderPhone: '+91 98765 11003',
    activeMembers: 16,
    skills: ['Deep Water Diving', 'Inflatable Boat Operations', 'Emergency Resuscitation'],
    isVerified: true,
    currentMission: '24x7 River safety surveillance during Amavasya bath',
  },
];

let inMemoryDeliveries = [];

export const getVolunteerTeams = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const teams = await VolunteerTeam.find().sort({ activeMembers: -1 }).lean();
      if (teams.length > 0) {
        return res.status(200).json(new ApiResponse(200, teams, 'Volunteer teams list'));
      }
    } catch {
      // fallback
    }
  }
  return res.status(200).json(new ApiResponse(200, BASELINE_VOLUNTEER_TEAMS, 'Volunteer teams list'));
});

export const registerVolunteer = asyncHandler(async (req, res) => {
  const { name, phone, location, skills = [], currentMission } = req.body;

  const teamId = generateIncidentId('VOL');
  const team = {
    teamId,
    name: name || 'SDRF Community Relief Unit',
    location: location || 'Prayagraj Zone 1',
    leaderName: name,
    leaderPhone: phone,
    activeMembers: 1,
    skills: skills.length > 0 ? skills : ['First Aid', 'Emergency Evacuation'],
    currentMission: currentMission || 'Ready for deployment',
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await VolunteerTeam.create(team);
    } catch {
      // fallback
    }
  }

  BASELINE_VOLUNTEER_TEAMS.push(team);

  return res.status(201).json(
    new ApiResponse(201, team, 'Volunteer registered successfully')
  );
});

export const getDeliveryRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (status) filter.status = status;
      const deliveries = await DeliveryRequest.find(filter).sort({ createdAt: -1 }).lean();
      if (deliveries.length > 0) {
        return res.status(200).json(new ApiResponse(200, deliveries, 'Delivery requests list'));
      }
    } catch {
      // fallback
    }
  }

  let list = inMemoryDeliveries;
  if (status) list = list.filter((d) => d.status === status);

  return res.status(200).json(new ApiResponse(200, list, 'Delivery requests list'));
});

export const createDeliveryRequest = asyncHandler(async (req, res) => {
  const {
    patientName,
    patientPhone,
    medicinesList = [],
    deliveryAddress,
    lat,
    lng,
    urgency = 'urgent',
  } = req.body;

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
    createdAt: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await DeliveryRequest.create(delivery);
    } catch {
      // fallback
    }
  }

  inMemoryDeliveries.unshift(delivery);
  broadcastEmergencyAlert('delivery:new', delivery);

  return res.status(201).json(
    new ApiResponse(201, delivery, 'Medicine delivery request broadcast to volunteers')
  );
});

export const claimDeliveryRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { volunteerName, volunteerPhone } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const delivery = await DeliveryRequest.findOneAndUpdate(
        { $or: [{ deliveryId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        {
          $set: {
            status: 'accepted',
            volunteerName: volunteerName || 'Verified Volunteer',
            volunteerPhone: volunteerPhone || '+91 98765 11111',
          },
        },
        { new: true }
      );
      if (delivery) {
        return res.status(200).json(new ApiResponse(200, delivery, 'Delivery claimed successfully'));
      }
    } catch {
      // fallback
    }
  }

  const found = inMemoryDeliveries.find((d) => d.deliveryId === id);
  if (found) {
    found.status = 'accepted';
    found.volunteerName = volunteerName || 'Verified Volunteer';
    return res.status(200).json(new ApiResponse(200, found, 'Delivery claimed successfully'));
  }

  throw new ApiError(404, `Delivery request ${id} not found`);
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (mongoose.connection.readyState === 1) {
    try {
      const update = { status };
      if (status === 'delivered') update.deliveredAt = new Date();
      const delivery = await DeliveryRequest.findOneAndUpdate(
        { $or: [{ deliveryId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { $set: update },
        { new: true }
      );
      if (delivery) {
        return res.status(200).json(new ApiResponse(200, delivery, 'Delivery status updated'));
      }
    } catch {
      // fallback
    }
  }

  const found = inMemoryDeliveries.find((d) => d.deliveryId === id);
  if (found) {
    found.status = status;
    return res.status(200).json(new ApiResponse(200, found, 'Delivery status updated'));
  }

  throw new ApiError(404, `Delivery request ${id} not found`);
});

export default {
  getVolunteerTeams,
  registerVolunteer,
  getDeliveryRequests,
  createDeliveryRequest,
  claimDeliveryRequest,
  updateDeliveryStatus,
};

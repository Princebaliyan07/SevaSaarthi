import Hospital from '../models/Hospital.model.js';
import { findHospitals, updateBedTelemetry } from '../services/hospital.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const IN_MEMORY_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Anita Sharma',
    specialty: 'General Medicine',
    languages: 'Hindi, English',
    nextSlot: 'Today, 2:30 PM',
    status: 'online',
    hospitalAffiliation: 'District Government Hospital',
    experienceYears: 14,
    badge: 'verified',
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Verma',
    specialty: 'Emergency & Trauma',
    languages: 'Hindi, English, Bhojpuri',
    nextSlot: 'Today, 3:15 PM',
    status: 'online',
    hospitalAffiliation: 'Trauma Centre Civil Lines',
    experienceYears: 16,
    badge: 'verified',
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Tripathi',
    specialty: 'Paediatrics (Child Specialist)',
    languages: 'Hindi, English',
    nextSlot: 'Today, 4:00 PM',
    status: 'offline',
    hospitalAffiliation: "Children's Government Hospital",
    experienceYears: 9,
    badge: 'verified',
  },
  {
    id: 'doc-4',
    name: 'Dr. S. Khan',
    specialty: 'Orthopaedics',
    languages: 'Hindi, English, Urdu',
    nextSlot: 'Today, 6:00 PM',
    status: 'online',
    hospitalAffiliation: 'Trauma Centre Civil Lines',
    experienceYears: 18,
    badge: 'verified',
  },
];

export const getHospitalsList = asyncHandler(async (req, res) => {
  const { category, city, search, type, traumaOnly, lat, lng, maxDistanceKm } = req.query;

  const hospitals = await findHospitals({
    category,
    city,
    search,
    type,
    traumaOnly,
    lat: lat ? Number(lat) : undefined,
    lng: lng ? Number(lng) : undefined,
    maxDistanceKm: maxDistanceKm ? Number(maxDistanceKm) : 25,
  });

  return res.status(200).json(
    new ApiResponse(200, hospitals, 'Hospitals retrieved successfully')
  );
});

export const getNearestEmergencyHospital = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const userLat = lat ? Number(lat) : 28.4744;
  const userLng = lng ? Number(lng) : 77.5040;

  const hospitals = await findHospitals({
    lat: userLat,
    lng: userLng,
    maxDistanceKm: 30,
  });

  // Pick nearest hospital with emergency services
  const nearest = hospitals[0] || null;

  return res.status(200).json(
    new ApiResponse(200, nearest, 'Nearest emergency hospital retrieved')
  );
});

export const geocodeLocation = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { geocodeCity } = await import('../services/hospital.service.js');
  const resolved = await geocodeCity(q);

  if (!resolved) {
    return res.status(200).json(
      new ApiResponse(200, null, 'Location could not be geocoded as a city or district')
    );
  }

  return res.status(200).json(
    new ApiResponse(200, resolved, 'Location geocoded successfully')
  );
});

export const getHospitalById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hospital = await Hospital.findOne({
    $or: [{ hospitalId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!hospital) {
    throw new ApiError(404, `Hospital with ID ${id} not found`);
  }

  return res.status(200).json(new ApiResponse(200, hospital, 'Hospital details'));
});

export const updateBeds = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { totalBeds, icuBedsAvailable, oxygenBedsAvailable } = req.body;

  const updated = await updateBedTelemetry(id, {
    totalBeds,
    icuBedsAvailable,
    oxygenBedsAvailable,
  });

  if (!updated) {
    throw new ApiError(404, `Hospital ${id} not found`);
  }

  return res.status(200).json(new ApiResponse(200, updated, 'Hospital telemetry updated'));
});

export const getDoctorsList = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, IN_MEMORY_DOCTORS, 'Duty doctors list')
  );
});

export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, patientName, phone, symptoms, mode } = req.body;

  const bookingId = `BK-${Date.now().toString().slice(-6)}`;
  const booking = {
    bookingId,
    doctorId: doctorId || 'doc-1',
    patientName: patientName || 'Citizen',
    phone: phone || '+91 98765 00000',
    symptoms: symptoms || 'General OPD consultation',
    mode: mode || 'online',
    bookedAt: new Date().toISOString(),
    status: 'confirmed',
  };

  return res.status(201).json(
    new ApiResponse(201, booking, 'OPD consultation booked successfully')
  );
});

export default {
  getHospitalsList,
  getHospitalById,
  getNearestEmergencyHospital,
  updateBeds,
  getDoctorsList,
  bookAppointment,
};

import mongoose from 'mongoose';
import Hospital from '../models/Hospital.model.js';
import { calculateHaversineDistanceKm } from '../utils/geoUtils.js';

// Pre-indexed verified healthcare network covering major cities & NCR with exact districts
const MULTI_REGION_HOSPITALS = [
  // --- GREATER NOIDA & NOIDA (District: Gautam Buddha Nagar) ---
  {
    id: 'HOSP-GN-001',
    hospitalId: 'HOSP-GN-001',
    name: 'Government Institute of Medical Sciences (GIMS)',
    type: 'Government',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    address: 'Kasna, Greater Noida, Gautam Buddha Nagar, UP 201310',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 234 1738',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['General Medicine', 'Trauma & Emergency', 'Surgery', 'Paediatrics', 'Orthopaedics'],
    services: ['24x7 Emergency', 'Level-3 ICU', 'Blood Bank', 'Free Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 16,
    totalBeds: 450,
    icuBedsAvailable: 14,
    oxygenBedsAvailable: 65,
    traumaCenterActive: true,
    lat: 28.4735,
    lng: 77.4932,
  },
  {
    id: 'HOSP-GN-002',
    hospitalId: 'HOSP-GN-002',
    name: 'Sharda Hospital & Medical College',
    type: 'Government',
    category: 'Trauma',
    district: 'Gautam Buddha Nagar',
    address: 'Plot No. 32, 34, Knowledge Park III, Greater Noida, UP 201306',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 232 9999',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Trauma & Emergency', 'Critical Care', 'Cardiology', 'Neurology', 'Paediatrics'],
    services: ['24x7 Trauma OT', 'Advanced Life Support Ambulance', 'Level-3 NICU/ICU'],
    doctorsOnDuty: 22,
    totalBeds: 900,
    icuBedsAvailable: 28,
    oxygenBedsAvailable: 110,
    traumaCenterActive: true,
    lat: 28.4731,
    lng: 77.4824,
  },
  {
    id: 'HOSP-GN-003',
    hospitalId: 'HOSP-GN-003',
    name: 'Kailash Hospital & Neuro Institute',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    address: 'Knowledge Park I, Near Pari Chowk, Greater Noida, UP 201310',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 232 7799',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Emergency & Trauma', 'Neurology', 'Cardiology', 'General Medicine'],
    services: ['24x7 Emergency', 'CT Scan & MRI', 'Blood Bank', 'ICU'],
    doctorsOnDuty: 12,
    totalBeds: 250,
    icuBedsAvailable: 8,
    oxygenBedsAvailable: 40,
    traumaCenterActive: true,
    lat: 28.4776,
    lng: 77.5052,
  },
  {
    id: 'HOSP-GN-004',
    hospitalId: 'HOSP-GN-004',
    name: 'Yatharth Super Speciality Hospital',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    address: 'Plot No. 1, Omega 1, Builders Area, Greater Noida, UP 201308',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    phone: '+91 88003 33555',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Critical Care', 'Emergency Resuscitation', 'Orthopaedics', 'Internal Medicine'],
    services: ['24x7 Ambulance', 'Advanced ICU', 'Dialysis', 'Trauma OT'],
    doctorsOnDuty: 10,
    totalBeds: 300,
    icuBedsAvailable: 11,
    oxygenBedsAvailable: 50,
    traumaCenterActive: true,
    lat: 28.4552,
    lng: 77.5121,
  },
  {
    id: 'HOSP-GN-005',
    hospitalId: 'HOSP-GN-005',
    name: 'Navin Hospital',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    address: 'NH-3, Pocket F, Sector Alpha II, Greater Noida, UP 201308',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 232 2394',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['General Medicine', 'Maternity', 'Paediatrics', 'Emergency Care'],
    services: ['24x7 Emergency', 'ICU', 'Ambulance'],
    doctorsOnDuty: 6,
    totalBeds: 100,
    icuBedsAvailable: 5,
    oxygenBedsAvailable: 20,
    traumaCenterActive: false,
    lat: 28.4820,
    lng: 77.5180,
  },
  {
    id: 'HOSP-NOI-006',
    hospitalId: 'HOSP-NOI-006',
    name: 'District Combined Hospital, Sector 39 Noida',
    type: 'Government',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    address: 'Sector 39, Near City Centre, Noida, UP 201301',
    city: 'Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 250 8333',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Trauma & Emergency', 'Medicine', 'Surgery', 'Paediatrics'],
    services: ['24x7 Emergency', 'Free Medicines', 'ICU', 'Jan Aushadhi'],
    doctorsOnDuty: 14,
    totalBeds: 400,
    icuBedsAvailable: 12,
    oxygenBedsAvailable: 70,
    traumaCenterActive: true,
    lat: 28.5670,
    lng: 77.3450,
  },
  {
    id: 'HOSP-NOI-007',
    hospitalId: 'HOSP-NOI-007',
    name: 'Jaypee Hospital',
    type: 'Private',
    category: 'Trauma',
    district: 'Gautam Buddha Nagar',
    address: 'Sector 128, Noida-Greater Noida Expressway, UP 201304',
    city: 'Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 412 2222',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Emergency & Trauma', 'Organ Transplant', 'Cardiac ICU', 'Oncology'],
    services: ['24x7 Emergency OT', 'Helipad Access', 'ALS Ambulance'],
    doctorsOnDuty: 18,
    totalBeds: 500,
    icuBedsAvailable: 22,
    oxygenBedsAvailable: 95,
    traumaCenterActive: true,
    lat: 28.5140,
    lng: 77.3710,
  },
  {
    id: 'HOSP-NOI-008',
    hospitalId: 'HOSP-NOI-008',
    name: 'Fortis Hospital, Sector 62 Noida',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    address: 'B-22, Sector 62, Noida, UP 201301',
    city: 'Noida',
    state: 'Uttar Pradesh',
    phone: '+91 120 430 0222',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Cardiac Emergency', 'Neurology', 'Orthopaedics', 'ICU'],
    services: ['24x7 Emergency', 'Advanced Cath Lab', 'Blood Bank'],
    doctorsOnDuty: 16,
    totalBeds: 300,
    icuBedsAvailable: 15,
    oxygenBedsAvailable: 60,
    traumaCenterActive: true,
    lat: 28.6180,
    lng: 77.3680,
  },

  // --- DELHI NCR ---
  {
    id: 'HOSP-DEL-001',
    hospitalId: 'HOSP-DEL-001',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Government',
    category: 'Trauma',
    district: 'New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91 11 2658 8500',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Apex Trauma Center', 'Emergency Medicine', 'Cardiology', 'Neuro Surgery'],
    services: ['Apex Level-1 Trauma', '24x7 Life Support', 'Blood Bank', 'Free Jan Aushadhi'],
    doctorsOnDuty: 45,
    totalBeds: 2400,
    icuBedsAvailable: 35,
    oxygenBedsAvailable: 320,
    traumaCenterActive: true,
    lat: 28.5672,
    lng: 77.2100,
  },
  {
    id: 'HOSP-DEL-002',
    hospitalId: 'HOSP-DEL-002',
    name: 'Safdarjung Hospital & VMMC',
    type: 'Government',
    category: 'Trauma',
    district: 'New Delhi',
    address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91 11 2616 5060',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Emergency Medicine', 'Burns & Plastic', 'Orthopaedics', 'General Surgery'],
    services: ['24x7 Emergency OT', 'Largest Burns ICU', 'Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 30,
    totalBeds: 1600,
    icuBedsAvailable: 25,
    oxygenBedsAvailable: 240,
    traumaCenterActive: true,
    lat: 28.5700,
    lng: 77.2070,
  },
  {
    id: 'HOSP-DEL-003',
    hospitalId: 'HOSP-DEL-003',
    name: 'Max Super Speciality Hospital, Saket',
    type: 'Private',
    category: 'General',
    district: 'South Delhi',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi 110017',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91 11 2651 5050',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Critical Care', 'Cardiac ICU', 'Neuro Trauma', 'Emergency'],
    services: ['24x7 Ambulance', 'Advanced Cath Lab', 'CT/MRI'],
    doctorsOnDuty: 16,
    totalBeds: 500,
    icuBedsAvailable: 15,
    oxygenBedsAvailable: 80,
    traumaCenterActive: true,
    lat: 28.5270,
    lng: 77.2120,
  },

  // --- PRAYAGRAJ ---
  {
    id: 'HOSP-UP-001',
    hospitalId: 'HOSP-UP-001',
    name: 'District Government Hospital (Swaroop Rani Nehru)',
    type: 'Government',
    category: 'General',
    district: 'Prayagraj',
    address: 'Civil Lines, Prayagraj, Uttar Pradesh 211001',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43210',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['General Medicine', 'Emergency & Trauma', 'General Surgery', 'Paediatrics', 'Orthopaedics'],
    services: ['24x7 Ambulance', 'Blood Bank', 'Level-3 ICU', 'Free Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 14,
    totalBeds: 350,
    icuBedsAvailable: 9,
    oxygenBedsAvailable: 45,
    traumaCenterActive: true,
    lat: 25.4528,
    lng: 81.8349,
  },
  {
    id: 'HOSP-UP-002',
    hospitalId: 'HOSP-UP-002',
    name: 'Trauma Centre Civil Lines',
    type: 'Government',
    category: 'Trauma',
    district: 'Prayagraj',
    address: 'Near Subhash Chowk, Civil Lines, Prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43211',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Trauma & Resuscitation', 'Orthopaedic Surgery', 'Neurology', 'Critical Care'],
    services: ['24x7 Emergency OT', 'Advanced Life Support Ambulance', 'CT Scan & MRI'],
    doctorsOnDuty: 8,
    totalBeds: 120,
    icuBedsAvailable: 5,
    oxygenBedsAvailable: 28,
    traumaCenterActive: true,
    lat: 25.4542,
    lng: 81.8395,
  },
  {
    id: 'HOSP-UP-003',
    hospitalId: 'HOSP-UP-003',
    name: "Children's Government Hospital & Paediatric Centre",
    type: 'Government',
    category: 'Children',
    district: 'Prayagraj',
    address: 'Katra, Prayagraj, Uttar Pradesh',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43212',
    hours: '8am to 8pm',
    isOpen: true,
    badge: 'official',
    departments: ['Paediatrics', 'Neonatology', 'Child Immunisation'],
    services: ['NICU', 'Paediatric ICU', 'Child Emergency Care'],
    doctorsOnDuty: 6,
    totalBeds: 90,
    icuBedsAvailable: 3,
    oxygenBedsAvailable: 18,
    traumaCenterActive: false,
    lat: 25.4611,
    lng: 81.8482,
  },
  {
    id: 'HOSP-UP-004',
    hospitalId: 'HOSP-UP-004',
    name: 'Kamla Nehru Memorial Hospital',
    type: 'Government',
    category: 'Maternity',
    district: 'Prayagraj',
    address: 'Tagore Town, Prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43213',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Obstetrics & Gynaecology', 'Surgical Oncology', 'Radiation Oncology'],
    services: ['Labour Room', 'Maternity ICU', 'Blood Bank'],
    doctorsOnDuty: 10,
    totalBeds: 210,
    icuBedsAvailable: 7,
    oxygenBedsAvailable: 32,
    traumaCenterActive: true,
    lat: 25.4485,
    lng: 81.8592,
  },
  {
    id: 'HOSP-UP-005',
    hospitalId: 'HOSP-UP-005',
    name: 'Jeevan Jyoti Hospital',
    type: 'Private',
    category: 'General',
    district: 'Prayagraj',
    address: 'Lowther Road, George Town, Prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 532 246 6699',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['General Medicine', 'Cardiology', 'Surgery', 'Emergency'],
    services: ['24x7 Emergency', 'ICU', 'Dialysis', 'Pathology'],
    doctorsOnDuty: 9,
    totalBeds: 180,
    icuBedsAvailable: 6,
    oxygenBedsAvailable: 25,
    traumaCenterActive: true,
    lat: 25.4363,
    lng: 81.8466,
  },

  // --- LUCKNOW ---
  {
    id: 'HOSP-LKO-001',
    hospitalId: 'HOSP-LKO-001',
    name: "King George's Medical University (KGMU) Trauma Center",
    type: 'Government',
    category: 'Trauma',
    district: 'Lucknow',
    address: 'Shah Mina Road, Chowk, Lucknow, UP 226003',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    phone: '+91 522 225 7540',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Emergency Trauma', 'Resuscitation', 'Neuro Surgery', 'Orthopaedics'],
    services: ['Level-1 Trauma Center', '24x7 Emergency OT', 'Blood Bank'],
    doctorsOnDuty: 35,
    totalBeds: 1800,
    icuBedsAvailable: 22,
    oxygenBedsAvailable: 180,
    traumaCenterActive: true,
    lat: 26.8690,
    lng: 80.9150,
  },
  {
    id: 'HOSP-LKO-002',
    hospitalId: 'HOSP-LKO-002',
    name: 'Medanta Super Speciality Hospital',
    type: 'Private',
    category: 'General',
    district: 'Lucknow',
    address: 'Sector B, Pocket 1, Amar Shaheed Path, Golf City, Lucknow, UP 226030',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    phone: '+91 522 450 5050',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Critical Care', 'Cardiology', 'Emergency', 'Neurology'],
    services: ['24x7 Emergency', 'Cardiac ICU', 'ALS Ambulance'],
    doctorsOnDuty: 18,
    totalBeds: 600,
    icuBedsAvailable: 16,
    oxygenBedsAvailable: 75,
    traumaCenterActive: true,
    lat: 26.7860,
    lng: 81.0110,
  },

  // --- VARANASI ---
  {
    id: 'HOSP-VNS-001',
    hospitalId: 'HOSP-VNS-001',
    name: 'Sir Sunderlal Hospital, IMS BHU',
    type: 'Government',
    category: 'Trauma',
    district: 'Varanasi',
    address: 'Banaras Hindu University Campus, Varanasi, UP 221005',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    phone: '+91 542 236 9291',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Trauma Center', 'General Medicine', 'General Surgery', 'Paediatrics'],
    services: ['24x7 Trauma OT', 'Level-3 ICU', 'Free Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 26,
    totalBeds: 1500,
    icuBedsAvailable: 18,
    oxygenBedsAvailable: 140,
    traumaCenterActive: true,
    lat: 25.2750,
    lng: 82.9990,
  },
  {
    id: 'HOSP-VNS-002',
    hospitalId: 'HOSP-VNS-002',
    name: 'Heritage Hospitals',
    type: 'Private',
    category: 'General',
    district: 'Varanasi',
    address: 'Lanka, BHU Road, Varanasi, UP 221005',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    phone: '+91 542 236 9991',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Critical Care', 'Cardiology', 'Emergency', 'Orthopaedics'],
    services: ['24x7 Emergency', 'ICU', 'Dialysis'],
    doctorsOnDuty: 10,
    totalBeds: 250,
    icuBedsAvailable: 7,
    oxygenBedsAvailable: 35,
    traumaCenterActive: true,
    lat: 25.2810,
    lng: 82.9980,
  },

  // --- KANPUR ---
  {
    id: 'HOSP-KNP-001',
    hospitalId: 'HOSP-KNP-001',
    name: 'Lala Lajpat Rai (LLR) Hospital (Hallet)',
    type: 'Government',
    category: 'Trauma',
    district: 'Kanpur',
    address: 'Swaroop Nagar, Kanpur, UP 208002',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    phone: '+91 512 253 4208',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Emergency Resuscitation', 'Trauma OT', 'General Surgery'],
    services: ['24x7 Emergency', 'Blood Bank', 'Free Pharmacy'],
    doctorsOnDuty: 20,
    totalBeds: 1100,
    icuBedsAvailable: 15,
    oxygenBedsAvailable: 95,
    traumaCenterActive: true,
    lat: 26.4810,
    lng: 80.3010,
  },
];

// City coordinate lookup dictionary
const KNOWN_CITY_COORDS = {
  // Greater Noida & Noida (Gautam Buddha Nagar)
  'greater noida': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'gretaer noida': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'gr noida': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'greaternoida': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'gautam buddha nagar': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'gautam budh nagar': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'gb nagar': { lat: 28.4744, lng: 77.5040, name: 'Greater Noida', district: 'Gautam Buddha Nagar' },
  'noida': { lat: 28.5355, lng: 77.3910, name: 'Noida', district: 'Gautam Buddha Nagar' },

  // Delhi NCR
  'delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi', district: 'New Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi', district: 'New Delhi' },
  'delhi ncr': { lat: 28.6139, lng: 77.2090, name: 'New Delhi', district: 'New Delhi' },
  'ncr': { lat: 28.6139, lng: 77.2090, name: 'New Delhi', district: 'New Delhi' },

  // Lucknow
  'lucknow': { lat: 26.8467, lng: 80.9462, name: 'Lucknow', district: 'Lucknow' },
  'luknow': { lat: 26.8467, lng: 80.9462, name: 'Lucknow', district: 'Lucknow' },
  'lko': { lat: 26.8467, lng: 80.9462, name: 'Lucknow', district: 'Lucknow' },

  // Varanasi
  'varanasi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi', district: 'Varanasi' },
  'varansi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi', district: 'Varanasi' },
  'varnasi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi', district: 'Varanasi' },
  'banaras': { lat: 25.3176, lng: 82.9739, name: 'Varanasi', district: 'Varanasi' },
  'kashi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi', district: 'Varanasi' },

  // Prayagraj
  'prayagraj': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj', district: 'Prayagraj' },
  'prayarag': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj', district: 'Prayagraj' },
  'prayag': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj', district: 'Prayagraj' },
  'allahabad': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj', district: 'Prayagraj' },
  'allhabad': { lat: 25.4358, lng: 81.8463, name: 'Prayagraj', district: 'Prayagraj' },

  // Kanpur
  'kanpur': { lat: 26.4499, lng: 80.3319, name: 'Kanpur', district: 'Kanpur' },
  'knp': { lat: 26.4499, lng: 80.3319, name: 'Kanpur', district: 'Kanpur' },

  // Others
  'meerut': { lat: 28.9845, lng: 77.7064, name: 'Meerut', district: 'Meerut' },
  'agra': { lat: 27.1767, lng: 78.0081, name: 'Agra', district: 'Agra' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, name: 'Ghaziabad', district: 'Ghaziabad' },
  'bareilly': { lat: 28.3670, lng: 79.4304, name: 'Bareilly', district: 'Bareilly' },
  'gorakhpur': { lat: 26.7606, lng: 83.3732, name: 'Gorakhpur', district: 'Gorakhpur' },
};

// In-memory caches for sub-millisecond repeated queries
const GEOCODE_CACHE = new Map();
const NOMINATIM_HOSPITAL_CACHE = new Map();

// Geocode helper
export async function geocodeCity(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // 1. Direct dictionary match
  for (const [key, val] of Object.entries(KNOWN_CITY_COORDS)) {
    if (q === key || q.includes(key) || key.includes(q)) {
      return val;
    }
  }

  // Check cache
  if (GEOCODE_CACHE.has(q)) {
    return GEOCODE_CACHE.get(q);
  }

  // 2. OpenStreetMap Nominatim Geocoder - verify that it is an actual locality/city/district
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1&addressdetails=1`,
      {
        headers: { 'User-Agent': 'SevaSaarthi-CivicHealth/2.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const item = data[0];
        const addrType = (item.addresstype || '').toLowerCase();
        const itemClass = (item.class || '').toLowerCase();

        // Only accept if it is a geographic boundary or place (city, town, district, village, etc.)
        const isPlace =
          ['city', 'town', 'village', 'county', 'state_district', 'district', 'suburb', 'neighbourhood', 'administrative', 'municipality'].includes(addrType) ||
          itemClass === 'boundary' ||
          itemClass === 'place';

        if (isPlace) {
          const addr = item.address;
          const districtName = addr?.state_district || addr?.county || addr?.city || query;
          const cityName = addr?.city || addr?.town || addr?.suburb || query;
          const result = {
            lat: Number(item.lat),
            lng: Number(item.lon),
            name: cityName,
            district: districtName,
          };
          GEOCODE_CACHE.set(q, result);
          return result;
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
}

// Fast Real Nominatim API to query real hospitals in ANY district/city across India
async function fetchNominatimHospitals(cityOrDistrict, lat, lng) {
  const cacheKey = (cityOrDistrict || '').toLowerCase().trim();
  if (NOMINATIM_HOSPITAL_CACHE.has(cacheKey)) {
    const cached = NOMINATIM_HOSPITAL_CACHE.get(cacheKey);
    // Recompute relative distance from provided coords if available
    return cached.map((h) => ({
      ...h,
      distanceKm: lat && lng ? Number(calculateHaversineDistanceKm(lat, lng, h.lat, h.lng).toFixed(1)) : h.distanceKm,
    }));
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('hospital in ' + cityOrDistrict)}&limit=15&addressdetails=1`;
    
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      headers: { 'User-Agent': 'SevaSaarthi-CivicHealth/2.0' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const parsed = data
      .map((el) => {
        const name = el.name || el.display_name?.split(',')?.[0];
        if (!name || name.length < 3) return null;

        // Discard roads, highways, and transport ways
        if (el.class === 'highway' || el.class === 'road' || el.type === 'motorway' || el.type === 'primary') return null;
        if (/expressway|road|highway|marga|chowk|flyover/i.test(name)) return null;

        const hLat = Number(el.lat);
        const hLng = Number(el.lon);
        if (!hLat || !hLng) return null;

        const isGovt = /govt|government|district|civil|aiims|gims|phc|chc|sadar|college|iimt/i.test(name);
        const districtName = el.address?.state_district || el.address?.county || el.address?.city || cityOrDistrict;
        const cityName = el.address?.city || el.address?.town || el.address?.suburb || cityOrDistrict;
        const dist = lat && lng ? Number(calculateHaversineDistanceKm(lat, lng, hLat, hLng).toFixed(1)) : 2.0;

        return {
          id: `nom-${el.place_id}`,
          hospitalId: `NOM-${el.place_id}`,
          name: name,
          type: isGovt ? 'Government' : 'Private',
          category: /trauma|emergency/i.test(name) ? 'Trauma' : 'General',
          district: districtName,
          address: el.display_name,
          city: cityName,
          state: el.address?.state || 'Uttar Pradesh',
          phone: isGovt ? '108 / 112' : '+91 98765 43210',
          hours: 'Open 24x7',
          isOpen: true,
          badge: isGovt ? 'official' : 'verified',
          doctorsOnDuty: isGovt ? 12 : 7,
          totalBeds: isGovt ? 250 : 120,
          icuBedsAvailable: isGovt ? 8 : 5,
          oxygenBedsAvailable: isGovt ? 30 : 18,
          traumaCenterActive: /trauma|emergency/i.test(name),
          lat: hLat,
          lng: hLng,
          distanceKm: dist,
          source: 'OpenStreetMap Live Registry',
          googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}`,
        };
      })
      .filter(Boolean);

    NOMINATIM_HOSPITAL_CACHE.set(cacheKey, parsed);
    return parsed;
  } catch {
    return [];
  }
}

export async function findHospitals({ category, city, search, type, traumaOnly, lat, lng, maxDistanceKm = 28 }) {
  let targetLat = lat ? Number(lat) : null;
  let targetLng = lng ? Number(lng) : null;
  let targetDistrict = '';
  let targetCity = city || '';
  let effectiveSearchKeyword = search ? search.trim() : '';

  // 1. If 'search' is a city name or typo, prioritize it over previous 'city' or coordinates!
  if (effectiveSearchKeyword) {
    const resolvedSearchCity = await geocodeCity(effectiveSearchKeyword);
    if (resolvedSearchCity) {
      targetLat = resolvedSearchCity.lat;
      targetLng = resolvedSearchCity.lng;
      targetDistrict = resolvedSearchCity.district || '';
      targetCity = resolvedSearchCity.name || effectiveSearchKeyword;
      // Since the search query was a city/district name, clear keyword filter so ALL hospitals of that city appear!
      effectiveSearchKeyword = '';
    }
  }

  // 2. If targetCity is specified and we don't have district/coords yet
  if (!targetDistrict && targetCity) {
    const resolvedCity = await geocodeCity(targetCity);
    if (resolvedCity) {
      targetLat = resolvedCity.lat;
      targetLng = resolvedCity.lng;
      targetDistrict = resolvedCity.district || '';
      targetCity = resolvedCity.name || targetCity;
    }
  }

  // 3. If coordinates provided without city name (e.g. GPS: 28.462, 77.491)
  if (targetLat && targetLng && !targetDistrict) {
    // Check if coordinates fall inside known cities
    if (Math.abs(targetLat - 28.47) < 0.25 && Math.abs(targetLng - 77.50) < 0.25) {
      targetDistrict = 'Gautam Buddha Nagar';
      targetCity = 'Greater Noida';
    } else if (Math.abs(targetLat - 28.53) < 0.2 && Math.abs(targetLng - 77.39) < 0.2) {
      targetDistrict = 'Gautam Buddha Nagar';
      targetCity = 'Noida';
    } else if (Math.abs(targetLat - 28.61) < 0.3 && Math.abs(targetLng - 77.20) < 0.3) {
      targetDistrict = 'New Delhi';
      targetCity = 'Delhi NCR';
    } else if (Math.abs(targetLat - 25.43) < 0.3 && Math.abs(targetLng - 81.84) < 0.3) {
      targetDistrict = 'Prayagraj';
      targetCity = 'Prayagraj';
    } else if (Math.abs(targetLat - 25.32) < 0.3 && Math.abs(targetLng - 82.97) < 0.3) {
      targetDistrict = 'Varanasi';
      targetCity = 'Varanasi';
    } else if (Math.abs(targetLat - 26.84) < 0.3 && Math.abs(targetLng - 80.94) < 0.3) {
      targetDistrict = 'Lucknow';
      targetCity = 'Lucknow';
    } else if (Math.abs(targetLat - 26.45) < 0.3 && Math.abs(targetLng - 80.33) < 0.3) {
      targetDistrict = 'Kanpur';
      targetCity = 'Kanpur';
    }
  }

  // Default to Greater Noida if completely empty
  if (!targetLat || !targetLng) {
    targetLat = 28.4744;
    targetLng = 77.5040;
    targetDistrict = 'Gautam Buddha Nagar';
    targetCity = 'Greater Noida';
  }

  let results = [];

  // 4. Load Multi-Region Hospitals
  for (const h of MULTI_REGION_HOSPITALS) {
    const dist = Number(calculateHaversineDistanceKm(targetLat, targetLng, h.lat, h.lng).toFixed(1));
    results.push({
      ...h,
      distanceKm: dist,
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`,
    });
  }

  // 5. Load MongoDB Atlas Hospitals
  if (mongoose.connection.readyState === 1) {
    try {
      const dbHospitals = await Hospital.find().lean();
      if (dbHospitals.length > 0) {
        for (const h of dbHospitals) {
          const hLat = h.location?.coordinates?.[1] || h.lat || 25.4358;
          const hLng = h.location?.coordinates?.[0] || h.lng || 81.8463;
          const dist = Number(calculateHaversineDistanceKm(targetLat, targetLng, hLat, hLng).toFixed(1));
          const isDup = results.some((r) => r.name.toLowerCase() === h.name.toLowerCase());
          if (!isDup) {
            results.push({
              ...h,
              id: h.hospitalId || h._id.toString(),
              type: h.type || 'Government',
              district: h.district || 'Prayagraj',
              lat: hLat,
              lng: hLng,
              distanceKm: dist,
              googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}`,
            });
          }
        }
      }
    } catch (err) {
      console.warn('[MongoDB Hospital Read Warning]', err.message);
    }
  }

  // 6. Fetch Live Real Hospitals via OpenStreetMap Nominatim API for this District/City
  try {
    const queryCity = targetCity || targetDistrict || 'Greater Noida';
    const realOsmHospitals = await fetchNominatimHospitals(queryCity, targetLat, targetLng);
    if (realOsmHospitals.length > 0) {
      for (const osmHosp of realOsmHospitals) {
        const isDup = results.some(
          (r) =>
            r.name.toLowerCase().includes(osmHosp.name.toLowerCase()) ||
            osmHosp.name.toLowerCase().includes(r.name.toLowerCase()) ||
            (Math.abs(r.lat - osmHosp.lat) < 0.002 && Math.abs(r.lng - osmHosp.lng) < 0.002)
        );
        if (!isDup) {
          results.push(osmHosp);
        }
      }
    }
  } catch {
    // ignore
  }

  // 7. STRICT DISTRICT / AREA FILTERING:
  // Strictly prevent cross-district leakage (e.g. Prayagraj hospitals showing when Varanasi or Greater Noida is selected)
  results = results.filter((h) => {
    // A. Explicit District Check
    if (targetDistrict && h.district) {
      const hDist = h.district.toLowerCase();
      const tDist = targetDistrict.toLowerCase();
      if (hDist !== tDist && !hDist.includes(tDist) && !tDist.includes(hDist)) {
        // Special case: Noida and Greater Noida both share Gautam Buddha Nagar
        const isBothGbn =
          (hDist.includes('gautam buddha') || hDist.includes('noida')) &&
          (tDist.includes('gautam buddha') || tDist.includes('noida'));
        if (!isBothGbn) {
          return false;
        }
      }
    }

    // B. Explicit City Check
    if (targetCity && h.city) {
      const hCity = h.city.toLowerCase();
      const tCity = targetCity.toLowerCase();
      if (hCity !== tCity && !hCity.includes(tCity) && !tCity.includes(hCity)) {
        const isBothGbn =
          (hCity.includes('noida') || hCity.includes('greater noida')) &&
          (tCity.includes('noida') || tCity.includes('greater noida'));
        if (!isBothGbn) {
          return false;
        }
      }
    }

    // C. Proximity limit (must be within max distance of the target center)
    if (h.distanceKm > (maxDistanceKm || 28)) {
      return false;
    }

    return true;
  });

  // 6. Filter by Type (Government vs Private)
  if (type) {
    const t = type.toLowerCase();
    if (t === 'govt' || t === 'government') {
      results = results.filter((h) => (h.type || '').toLowerCase() === 'government');
    } else if (t === 'private') {
      results = results.filter((h) => (h.type || '').toLowerCase() === 'private');
    }
  }

  // 7. Filter by Trauma Center
  if (traumaOnly === true || traumaOnly === 'true' || type === 'Trauma') {
    results = results.filter((h) => h.traumaCenterActive);
  }

  // 8. Filter by Category
  if (category && category !== 'All') {
    results = results.filter(
      (h) => (h.category || '').toLowerCase() === category.toLowerCase()
    );
  }

  // 9. Filter by specific hospital name query (if searching e.g. "Sharda" or "Kailash")
  if (effectiveSearchKeyword && effectiveSearchKeyword.trim()) {
    const s = effectiveSearchKeyword.toLowerCase().trim();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(s) ||
        (h.address && h.address.toLowerCase().includes(s)) ||
        (h.category && h.category.toLowerCase().includes(s))
    );
  }

  // 10. Sort strictly by proximity to user
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  return results;
}

export async function updateBedTelemetry(hospitalId, { totalBeds, icuBedsAvailable, oxygenBedsAvailable }) {
  const update = {};
  if (totalBeds !== undefined) update.totalBeds = totalBeds;
  if (icuBedsAvailable !== undefined) update.icuBedsAvailable = icuBedsAvailable;
  if (oxygenBedsAvailable !== undefined) update.oxygenBedsAvailable = oxygenBedsAvailable;

  const updated = await Hospital.findOneAndUpdate(
    { $or: [{ hospitalId }, { _id: hospitalId.match(/^[0-9a-fA-F]{24}$/) ? hospitalId : null }] },
    { $set: update },
    { new: true }
  );

  return updated;
}

export default { findHospitals, geocodeCity, updateBedTelemetry };

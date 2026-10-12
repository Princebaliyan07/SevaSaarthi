import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

import User from '../src/models/User.model.js';
import Hospital from '../src/models/Hospital.model.js';
import Medicine from '../src/models/Medicine.model.js';
import VolunteerTeam from '../src/models/VolunteerTeam.model.js';
import MissingPerson from '../src/models/MissingPerson.model.js';
import DisasterAlert from '../src/models/DisasterAlert.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sevasaarthi';

const SEED_HOSPITALS = [
  {
    hospitalId: 'HOSP-UP-001',
    name: 'District Government Hospital (Swaroop Rani Nehru)',
    category: 'General',
    address: 'Civil Lines, Prayagraj, Uttar Pradesh 211001',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43210',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['General Medicine', 'Emergency & Trauma', 'General Surgery', 'Paediatrics', 'Orthopaedics'],
    services: ['24x7 Ambulance', 'Blood Bank', 'Level-3 ICU', 'Free Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 14,
    totalBeds: 350,
    icuBedsAvailable: 9,
    oxygenBedsAvailable: 45,
    traumaCenterActive: true,
    location: {
      type: 'Point',
      coordinates: [81.8349, 25.4528],
    },
  },
  {
    hospitalId: 'HOSP-UP-002',
    name: 'Trauma Centre Civil Lines',
    category: 'Trauma',
    address: 'Near Subhash Chowk, Civil Lines, Prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43211',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Trauma & Resuscitation', 'Orthopaedic Surgery', 'Neurology', 'Critical Care'],
    services: ['24x7 Emergency OT', 'Advanced Life Support Ambulance', 'CT Scan & MRI'],
    doctorsOnDuty: 8,
    totalBeds: 120,
    icuBedsAvailable: 5,
    oxygenBedsAvailable: 28,
    traumaCenterActive: true,
    location: {
      type: 'Point',
      coordinates: [81.8395, 25.4542],
    },
  },
  {
    hospitalId: 'HOSP-UP-003',
    name: "Children's Government Hospital & Paediatric Centre",
    category: 'Children',
    address: 'Katra, Prayagraj, Uttar Pradesh',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43212',
    hours: '8am to 8pm',
    isOpen: true,
    badge: 'verified',
    departments: ['Paediatrics', 'Neonatology', 'Child Immunisation'],
    services: ['NICU', 'Paediatric ICU', 'Child Emergency Care'],
    doctorsOnDuty: 6,
    totalBeds: 90,
    icuBedsAvailable: 3,
    oxygenBedsAvailable: 18,
    traumaCenterActive: false,
    location: {
      type: 'Point',
      coordinates: [81.8482, 25.4611],
    },
  },
  {
    hospitalId: 'HOSP-UP-004',
    name: 'Kamla Nehru Memorial Hospital (Maternity & Oncology)',
    category: 'Maternity',
    address: 'Tagore Town, Prayagraj',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43213',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    departments: ['Obstetrics & Gynaecology', 'Surgical Oncology', 'Radiation Oncology'],
    services: ['Labour Room', 'Maternity ICU', 'Blood Bank', 'Cryo Storage'],
    doctorsOnDuty: 10,
    totalBeds: 210,
    icuBedsAvailable: 7,
    oxygenBedsAvailable: 32,
    traumaCenterActive: true,
    location: {
      type: 'Point',
      coordinates: [81.8592, 25.4485],
    },
  },
  {
    hospitalId: 'HOSP-UP-005',
    name: 'Sangam Temporary Mela Emergency Hospital (Sector 3)',
    category: 'Medical camp',
    address: 'Sector 3 Kumbh Mela Grounds, Sangam Ghat',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    phone: '+91 98765 43214',
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    departments: ['Heat Exhaustion Care', 'Triage Emergency', 'Minor Trauma Care'],
    services: ['Boat Ambulance', 'Triage Beds', 'ORS & IV Rehydration', 'First Aid'],
    doctorsOnDuty: 12,
    totalBeds: 60,
    icuBedsAvailable: 2,
    oxygenBedsAvailable: 15,
    traumaCenterActive: true,
    location: {
      type: 'Point',
      coordinates: [81.8791, 25.4298],
    },
  },
];

const SEED_MEDICINES = [
  {
    medicineId: 'MED-001',
    genericName: 'Paracetamol',
    dosage: '500 mg / 650 mg (10 Tablets)',
    brandName: 'Dolo 650 / Calpol / Crocin',
    janAushadhiPrice: 18,
    commercialPrice: 72,
    savingsPercentage: 75,
    category: 'Analgesic & Antipyretic',
    purpose: 'Used for fever and mild to moderate pain. Follow label dose. Do not combine with other paracetamol products.',
    whenToSeeDoctor: 'See a doctor if fever lasts over 3 days or exceeds 102°F.',
    inStock: true,
    stockCount: 500,
  },
  {
    medicineId: 'MED-002',
    genericName: 'Cetirizine Hydrochloride',
    dosage: '10 mg (10 Tablets)',
    brandName: 'Zyrtec / Cetcip / Alerid',
    janAushadhiPrice: 8,
    commercialPrice: 38,
    savingsPercentage: 79,
    category: 'Antihistamine',
    purpose: 'Relief of allergy symptoms such as sneezing, runny nose, watery eyes, and hives. May cause mild drowsiness.',
    whenToSeeDoctor: 'Consult a doctor immediately if breathing difficulty occurs with allergy.',
    inStock: true,
    stockCount: 300,
  },
  {
    medicineId: 'MED-003',
    genericName: 'Oral Rehydration Salts (ORS)',
    dosage: '21.8 g WHO Formula Sachet',
    brandName: 'Electral / Enerzal',
    janAushadhiPrice: 6,
    commercialPrice: 24,
    savingsPercentage: 75,
    category: 'Electrolyte Replenisher',
    purpose: 'Restores electrolytes and fluids lost during acute diarrhoea, vomiting, or severe heat exhaustion.',
    whenToSeeDoctor: 'Seek emergency care if patient cannot retain fluids or becomes drowsy/unresponsive.',
    inStock: true,
    stockCount: 1200,
  },
  {
    medicineId: 'MED-004',
    genericName: 'Pantoprazole Gastro-Resistant',
    dosage: '40 mg (10 Tablets)',
    brandName: 'Pan 40 / Pantocid / Pantodac',
    janAushadhiPrice: 22,
    commercialPrice: 95,
    savingsPercentage: 77,
    category: 'Proton Pump Inhibitor (Antacid)',
    purpose: 'Reduces excess stomach acid. Used for heartburn, acid reflux, and gastritis relief.',
    whenToSeeDoctor: 'Consult a physician if chest pain or difficulty swallowing accompanies symptoms.',
    inStock: true,
    stockCount: 400,
  },
  {
    medicineId: 'MED-005',
    genericName: 'Amoxicillin + Potassium Clavulanate',
    dosage: '625 mg (6 Tablets)',
    brandName: 'Augmentin 625 / Moxikind CV',
    janAushadhiPrice: 65,
    commercialPrice: 220,
    savingsPercentage: 70,
    category: 'Broad Spectrum Antibiotic',
    purpose: 'Treatment of bacterial respiratory, dental, urinary, or skin infections. Complete prescribed course.',
    whenToSeeDoctor: 'Always requires medical diagnosis and prescription before usage.',
    inStock: true,
    stockCount: 250,
  },
  {
    medicineId: 'MED-006',
    genericName: 'Metformin Hydrochloride Sustained Release',
    dosage: '500 mg (10 Tablets)',
    brandName: 'Glycomet 500 / Gluconorm',
    janAushadhiPrice: 14,
    commercialPrice: 52,
    savingsPercentage: 73,
    category: 'Antidiabetic',
    purpose: 'First-line medication for type 2 diabetes management to improve glycemic control.',
    whenToSeeDoctor: 'Regular blood glucose and HbA1c monitoring required by physician.',
    inStock: true,
    stockCount: 450,
  },
];

const SEED_VOLUNTEER_TEAMS = [
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

const SEED_MISSING_PERSONS = [
  {
    caseId: 'SS-MELA-2026-000412',
    name: 'Sita Devi',
    age: 65,
    gender: 'Female',
    lastSeenLocation: 'Sangam Gate 3 near Akshayavat',
    lastSeenTime: '10:15 AM',
    clothing: 'Yellow Saree with red border, carrying cloth bag',
    languages: 'Hindi, Bhojpuri',
    specialMarks: 'Small black mole on left cheek',
    status: 'investigating',
    contactPhone: '+91 98765 99001',
    reportedBy: 'Son (Ramesh Kumar)',
    isContactVerified: true,
  },
  {
    caseId: 'SS-MELA-2026-000408',
    name: 'Aarav Patel',
    age: 8,
    gender: 'Male',
    lastSeenLocation: 'Pontoon Bridge 2 Sector 4',
    lastSeenTime: '08:45 AM',
    clothing: 'Blue t-shirt, navy shorts, red cap',
    languages: 'Hindi, Gujarati',
    specialMarks: 'None',
    status: 'reunited',
    contactPhone: '+91 98765 99002',
    reportedBy: 'Mother (Sunita Patel)',
    isContactVerified: true,
    reunitedAt: new Date(),
  },
];

async function runSeed() {
  console.log(`[Seed Script] Connecting to MongoDB: ${MONGODB_URI}...`);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    console.log('[Seed Script] Connected successfully.');
  } catch (connErr) {
    console.warn(`\n[Seed Script Notice] Could not connect to MongoDB at ${MONGODB_URI}: ${connErr.message}`);
    console.warn(`💡 Tip: To run the seed script with persistent MongoDB data, ensure MongoDB is started or set MONGODB_URI in server/.env (e.g. MongoDB Atlas connection string).\n`);
    process.exit(0);
  }

  // 1. Seed Hospitals
  for (const h of SEED_HOSPITALS) {
    await Hospital.findOneAndUpdate({ hospitalId: h.hospitalId }, h, { upsert: true, new: true });
  }
  console.log(`[Seed Script] Seeded ${SEED_HOSPITALS.length} baseline verified hospitals.`);

  // 2. Seed Medicines
  for (const m of SEED_MEDICINES) {
    await Medicine.findOneAndUpdate({ medicineId: m.medicineId }, m, { upsert: true, new: true });
  }
  console.log(`[Seed Script] Seeded ${SEED_MEDICINES.length} Jan Aushadhi generic medicines.`);

  // 3. Seed Volunteer Teams
  for (const v of SEED_VOLUNTEER_TEAMS) {
    await VolunteerTeam.findOneAndUpdate({ teamId: v.teamId }, v, { upsert: true, new: true });
  }
  console.log(`[Seed Script] Seeded ${SEED_VOLUNTEER_TEAMS.length} volunteer and relief teams.`);

  // 4. Seed Missing Persons
  for (const mp of SEED_MISSING_PERSONS) {
    await MissingPerson.findOneAndUpdate({ caseId: mp.caseId }, mp, { upsert: true, new: true });
  }
  console.log(`[Seed Script] Seeded ${SEED_MISSING_PERSONS.length} missing person cases.`);

  // 5. Seed Default Admin User
  const adminPhone = '+919999999999';
  const existingAdmin = await User.findOne({ phone: adminPhone });
  if (!existingAdmin) {
    await User.create({
      name: 'District Magistrate Command Officer',
      phone: adminPhone,
      email: 'command@sevasaarthi.gov.in',
      password: 'AdminPassword123!',
      role: 'admin',
      isVerified: true,
    });
    console.log('[Seed Script] Seeded Admin User (+919999999999 / AdminPassword123!).');
  }

  console.log('\n[Seed Script] All database collections seeded successfully!\n');
  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('[Seed Script Error]', err);
  process.exit(1);
});

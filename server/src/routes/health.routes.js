import { Router } from 'express';

const router = Router();

const HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'District Government Hospital',
    category: 'General',
    distanceKm: 2.4,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    address: 'Civil Lines, Prayagraj, Uttar Pradesh 211001',
    phone: '+91 98765 43210',
    departments: ['Medicine', 'Surgery', 'Paediatrics', 'Orthopaedics'],
    services: ['Ambulance', 'Blood bank', 'ICU', 'Pharmacy'],
    doctorsOnDuty: 12,
    totalBeds: 350,
    icuBedsAvailable: 8,
    traumaCenterActive: true,
    lat: 25.4528,
    lng: 81.8349,
  },
  {
    id: 'hosp-2',
    name: 'Trauma Centre, Civil Lines',
    category: 'Trauma',
    distanceKm: 3.1,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    address: 'Near Subhash Chowk, Civil Lines, Prayagraj',
    phone: '+91 98765 43211',
    departments: ['Trauma & Emergency', 'Orthopaedic Surgery', 'Neurology'],
    services: ['24x7 Emergency OT', 'Advanced Life Support Ambulance', 'CT Scan'],
    doctorsOnDuty: 8,
    totalBeds: 120,
    icuBedsAvailable: 4,
    traumaCenterActive: true,
    lat: 25.4542,
    lng: 81.8395,
  },
  {
    id: 'hosp-3',
    name: "Children's Government Hospital",
    category: 'Children',
    distanceKm: 4.6,
    hours: '8am to 8pm',
    isOpen: true,
    badge: 'verified',
    address: 'Katra, Prayagraj',
    phone: '+91 98765 43212',
    departments: ['Paediatrics', 'Neonatology', 'Immunisation'],
    services: ['NICU', 'Paediatric ICU', 'OPD'],
    doctorsOnDuty: 5,
    totalBeds: 90,
    icuBedsAvailable: 2,
    traumaCenterActive: false,
    lat: 25.4612,
    lng: 81.8491,
  },
  {
    id: 'hosp-4',
    name: 'Kamla Nehru Memorial Hospital',
    category: 'Maternity',
    distanceKm: 5.2,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    address: 'Tagore Town, Prayagraj',
    phone: '+91 98765 43213',
    departments: ['Obstetrics & Gynaecology', 'Oncology'],
    services: ['Labour Room', 'Maternity ICU', 'Blood Bank'],
    doctorsOnDuty: 9,
    totalBeds: 210,
    icuBedsAvailable: 6,
    traumaCenterActive: true,
    lat: 25.4485,
    lng: 81.8592,
  },
];

const MEDICINES = [
  {
    id: 'med-1',
    genericName: 'Paracetamol',
    dosage: '500 mg (10 tablets)',
    brandName: 'Crocin / Calpol / Dolo 650',
    janAushadhiPrice: 8,
    commercialPrice: 32,
    purpose: 'Fever, mild-to-moderate pain, headache, and body aches.',
    whenToSeeDoctor: 'Fever above 102°F or lasting more than 3 days.',
    inStock: true,
  },
  {
    id: 'med-2',
    genericName: 'Cetirizine',
    dosage: '10 mg (10 tablets)',
    brandName: 'Cetzine / Zyrtec / Alerid',
    janAushadhiPrice: 6,
    commercialPrice: 42,
    purpose: 'Allergies, runny nose, sneezing, skin itching, and urticaria.',
    whenToSeeDoctor: 'Difficulty breathing or facial swelling (Emergency).',
    inStock: true,
  },
  {
    id: 'med-3',
    genericName: 'Pantoprazole',
    dosage: '40 mg (10 tablets)',
    brandName: 'Pan 40 / Pantocid',
    janAushadhiPrice: 14,
    commercialPrice: 95,
    purpose: 'Acidity, heartburn, acid reflux, and gastric discomfort.',
    whenToSeeDoctor: 'Severe chest pain or difficulty swallowing.',
    inStock: true,
  },
  {
    id: 'med-4',
    genericName: 'Oral Rehydration Salts (ORS)',
    dosage: '21.8 g sachet',
    brandName: 'Electral / Enerzal',
    janAushadhiPrice: 5,
    commercialPrice: 22,
    purpose: 'Dehydration caused by diarrhoea, vomiting, heat exhaustion.',
    whenToSeeDoctor: 'Inability to keep fluids down or extreme drowsiness.',
    inStock: true,
  },
];

const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Anita Sharma',
    specialty: 'General Medicine',
    languages: 'Hindi, English',
    nextSlot: 'Today, 2:30 PM',
    status: 'online',
    hospitalAffiliation: 'District Government Hospital',
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Verma',
    specialty: 'Emergency & Trauma',
    languages: 'Hindi, English, Bhojpuri',
    nextSlot: 'Today, 3:15 PM',
    status: 'online',
    hospitalAffiliation: 'Trauma Centre Civil Lines',
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Tripathi',
    specialty: 'Paediatrics (Child Specialist)',
    languages: 'Hindi, English',
    nextSlot: 'Today, 4:00 PM',
    status: 'offline',
    hospitalAffiliation: "Children's Government Hospital",
  },
];

// GET /api/v1/health/hospitals
router.get('/hospitals', (req, res) => {
  const { category } = req.query;
  let list = HOSPITALS;
  if (category && category !== 'All') {
    list = list.filter((h) => h.category.toLowerCase() === category.toLowerCase());
  }
  return res.json({ success: true, count: list.length, data: list });
});

// GET /api/v1/health/medicines
router.get('/medicines', (req, res) => {
  return res.json({ success: true, count: MEDICINES.length, data: MEDICINES });
});

// GET /api/v1/health/doctors
router.get('/doctors', (req, res) => {
  return res.json({ success: true, count: DOCTORS.length, data: DOCTORS });
});

// POST /api/v1/health/consultation
router.post('/consultation', (req, res) => {
  const { doctorId, patientName, phone, symptoms, mode } = req.body;
  const bookingId = `BK-${Date.now().toString().slice(-6)}`;
  return res.status(201).json({
    success: true,
    message: 'OPD Consultation Booked Successfully',
    bookingId,
    details: { doctorId, patientName, phone, symptoms, mode },
  });
});

export default router;

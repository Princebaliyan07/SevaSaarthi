import api from './api';

const MOCK_HOSPITALS = [
  // --- GREATER NOIDA & NOIDA (Gautam Buddha Nagar) ---
  {
    id: 'HOSP-GN-001',
    name: 'Government Institute of Medical Sciences (GIMS)',
    type: 'Government',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    city: 'Greater Noida',
    address: 'Kasna, Greater Noida, Gautam Buddha Nagar, UP 201310',
    distanceKm: 1.1,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    phone: '+91 120 234 1738',
    departments: ['General Medicine', 'Trauma & Emergency', 'Surgery', 'Paediatrics'],
    services: ['24x7 Emergency', 'Level-3 ICU', 'Blood Bank', 'Free Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 16,
    totalBeds: 450,
    icuBedsAvailable: 14,
    oxygenBedsAvailable: 65,
    traumaCenterActive: true,
    lat: 28.4735,
    lng: 77.4932,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4735,77.4932',
  },
  {
    id: 'HOSP-GN-002',
    name: 'Sharda Hospital & Medical College',
    type: 'Government',
    category: 'Trauma',
    district: 'Gautam Buddha Nagar',
    city: 'Greater Noida',
    address: 'Plot No. 32, 34, Knowledge Park III, Greater Noida, UP 201306',
    distanceKm: 2.1,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    phone: '+91 120 232 9999',
    departments: ['Trauma & Emergency', 'Critical Care', 'Cardiology', 'Neurology'],
    services: ['24x7 Trauma OT', 'Advanced Life Support Ambulance', 'Level-3 NICU/ICU'],
    doctorsOnDuty: 22,
    totalBeds: 900,
    icuBedsAvailable: 28,
    oxygenBedsAvailable: 110,
    traumaCenterActive: true,
    lat: 28.4731,
    lng: 77.4824,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4731,77.4824',
  },
  {
    id: 'HOSP-GN-003',
    name: 'Kailash Hospital & Neuro Institute',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    city: 'Greater Noida',
    address: 'Knowledge Park I, Near Pari Chowk, Greater Noida, UP 201310',
    distanceKm: 0.4,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    phone: '+91 120 232 7799',
    departments: ['Emergency & Trauma', 'Neurology', 'Cardiology', 'General Medicine'],
    services: ['24x7 Emergency', 'CT Scan & MRI', 'Blood Bank', 'ICU'],
    doctorsOnDuty: 12,
    totalBeds: 250,
    icuBedsAvailable: 8,
    oxygenBedsAvailable: 40,
    traumaCenterActive: true,
    lat: 28.4776,
    lng: 77.5052,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4776,77.5052',
  },
  {
    id: 'HOSP-GN-004',
    name: 'Yatharth Super Speciality Hospital',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    city: 'Greater Noida',
    address: 'Plot No. 1, Omega 1, Builders Area, Greater Noida, UP 201308',
    distanceKm: 2.3,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    phone: '+91 88003 33555',
    departments: ['Critical Care', 'Emergency Resuscitation', 'Orthopaedics'],
    services: ['24x7 Ambulance', 'Advanced ICU', 'Dialysis'],
    doctorsOnDuty: 10,
    totalBeds: 300,
    icuBedsAvailable: 11,
    oxygenBedsAvailable: 50,
    traumaCenterActive: true,
    lat: 28.4552,
    lng: 77.5121,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4552,77.5121',
  },
  {
    id: 'HOSP-GN-005',
    name: 'Navin Hospital',
    type: 'Private',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    city: 'Greater Noida',
    address: 'NH-3, Pocket F, Sector Alpha II, Greater Noida, UP 201308',
    distanceKm: 1.6,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    phone: '+91 120 232 2394',
    departments: ['General Medicine', 'Maternity', 'Emergency Care'],
    services: ['24x7 Emergency', 'ICU', 'Ambulance'],
    doctorsOnDuty: 6,
    totalBeds: 100,
    icuBedsAvailable: 5,
    oxygenBedsAvailable: 20,
    traumaCenterActive: false,
    lat: 28.4820,
    lng: 77.5180,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4820,77.5180',
  },
  {
    id: 'HOSP-NOI-006',
    name: 'District Combined Hospital, Sector 39 Noida',
    type: 'Government',
    category: 'General',
    district: 'Gautam Buddha Nagar',
    city: 'Noida',
    address: 'Sector 39, Near City Centre, Noida, UP 201301',
    distanceKm: 18.6,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    phone: '+91 120 250 8333',
    departments: ['Trauma & Emergency', 'Medicine', 'Surgery'],
    services: ['24x7 Emergency', 'Free Medicines', 'ICU', 'Jan Aushadhi'],
    doctorsOnDuty: 14,
    totalBeds: 400,
    icuBedsAvailable: 12,
    oxygenBedsAvailable: 70,
    traumaCenterActive: true,
    lat: 28.5670,
    lng: 77.3450,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.5670,77.3450',
  },
  {
    id: 'HOSP-NOI-007',
    name: 'Jaypee Hospital',
    type: 'Private',
    category: 'Trauma',
    district: 'Gautam Buddha Nagar',
    city: 'Noida',
    address: 'Sector 128, Noida-Greater Noida Expressway, UP 201304',
    distanceKm: 13.7,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    phone: '+91 120 412 2222',
    departments: ['Emergency & Trauma', 'Organ Transplant', 'Cardiac ICU'],
    services: ['24x7 Emergency OT', 'Helipad Access', 'ALS Ambulance'],
    doctorsOnDuty: 18,
    totalBeds: 500,
    icuBedsAvailable: 22,
    oxygenBedsAvailable: 95,
    traumaCenterActive: true,
    lat: 28.5140,
    lng: 77.3710,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.5140,77.3710',
  },

  // --- LUCKNOW ---
  {
    id: 'HOSP-LKO-001',
    name: "King George's Medical University (KGMU) Trauma Center",
    type: 'Government',
    category: 'Trauma',
    district: 'Lucknow',
    city: 'Lucknow',
    address: 'Shah Mina Road, Chowk, Lucknow, UP 226003',
    distanceKm: 4.0,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    phone: '+91 522 225 7540',
    departments: ['Emergency Trauma', 'Resuscitation', 'Neuro Surgery'],
    services: ['Level-1 Trauma Center', '24x7 Emergency OT', 'Blood Bank'],
    doctorsOnDuty: 35,
    totalBeds: 1800,
    icuBedsAvailable: 22,
    oxygenBedsAvailable: 180,
    traumaCenterActive: true,
    lat: 26.8690,
    lng: 80.9150,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.8690,80.9150',
  },

  // --- VARANASI ---
  {
    id: 'HOSP-VNS-001',
    name: 'Sir Sunderlal Hospital, IMS BHU',
    type: 'Government',
    category: 'Trauma',
    district: 'Varanasi',
    city: 'Varanasi',
    address: 'Banaras Hindu University Campus, Varanasi, UP 221005',
    distanceKm: 5.4,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    phone: '+91 542 236 9291',
    departments: ['Trauma Center', 'General Medicine', 'General Surgery'],
    services: ['24x7 Trauma OT', 'Level-3 ICU', 'Free Jan Aushadhi Pharmacy'],
    doctorsOnDuty: 26,
    totalBeds: 1500,
    icuBedsAvailable: 18,
    oxygenBedsAvailable: 140,
    traumaCenterActive: true,
    lat: 25.2750,
    lng: 82.9990,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.2750,82.9990',
  },

  // --- PRAYAGRAJ ---
  {
    id: 'hosp-1',
    name: 'District Government Hospital (Swaroop Rani Nehru)',
    type: 'Government',
    category: 'General',
    district: 'Prayagraj',
    city: 'Prayagraj',
    distanceKm: 2.2,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'official',
    address: 'Civil Lines, Prayagraj, Uttar Pradesh 211001',
    phone: '+91 98765 43210',
    departments: ['Medicine', 'Surgery', 'Paediatrics', 'Orthopaedics'],
    services: ['Ambulance', 'Blood bank', 'ICU', 'Pharmacy'],
    doctorsOnDuty: 12,
    totalBeds: 350,
    icuBedsAvailable: 8,
    oxygenBedsAvailable: 45,
    traumaCenterActive: true,
    lat: 25.4528,
    lng: 81.8349,
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4528,81.8349',
  },
  {
    id: 'hosp-6',
    name: "Maternity Wing, Women's Hospital",
    category: 'Maternity',
    distanceKm: 3.8,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    address: 'Tagore Town, Prayagraj',
    phone: '+91 98765 43215',
    departments: ['Obstetrics', 'Gynaecology', 'Fetal Medicine'],
    services: ['High-Risk Delivery', '24x7 Labour OT', 'Lactation Consultation'],
    doctorsOnDuty: 9,
    totalBeds: 180,
    icuBedsAvailable: 6,
    traumaCenterActive: false,
    lat: 25.4485,
    lng: 81.8562,
  },
  {
    id: 'hosp-7',
    name: 'Burn Unit, Medical College',
    category: 'Burn unit',
    distanceKm: 5.2,
    hours: 'Open 24x7',
    isOpen: true,
    badge: 'verified',
    address: 'Hospital Road, Prayagraj',
    phone: '+91 98765 43216',
    departments: ['Plastic & Reconstructive Surgery', 'Critical Burn Care'],
    services: ['Sterile Burn ICU', 'Skin Bank Access', 'Hyperbaric Oxygen'],
    doctorsOnDuty: 5,
    totalBeds: 45,
    icuBedsAvailable: 2,
    traumaCenterActive: true,
    lat: 25.4402,
    lng: 81.8621,
  },
  {
    id: 'hosp-8',
    name: 'Medical Camp, Sector 7',
    category: 'Medical camp',
    distanceKm: 1.9,
    hours: '8am to 6pm',
    isOpen: true,
    badge: 'official',
    address: 'Kumbh Sector 7 Near Parade Ground',
    phone: '+91 98765 43217',
    departments: ['Triage & First Aid', 'Heat Stroke Stabilization', 'Dehydration Relief'],
    services: ['Free Rapid Test', 'Emergency ORS Point', 'Ambulance Staging Hub'],
    doctorsOnDuty: 7,
    totalBeds: 40,
    icuBedsAvailable: 0,
    traumaCenterActive: false,
    lat: 25.4298,
    lng: 81.8791,
  },
];

const MOCK_MEDICINES = [
  {
    id: 'med-1',
    genericName: 'Paracetamol',
    brandName: 'Dolo 650 / Calpol',
    dosage: '500 mg / 650 mg',
    janAushadhiPrice: 18,
    commercialPrice: 72,
    purpose: 'Used for fever and mild pain. Follow label dose. Do not combine with other paracetamol products.',
    whenToSeeDoctor: 'See a doctor if fever lasts over 3 days.',
    prescriptionRequired: false,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'],
  },
  {
    id: 'med-2',
    genericName: 'Cetirizine',
    brandName: 'Zyrtec / Cetcip',
    dosage: '10 mg',
    janAushadhiPrice: 8,
    commercialPrice: 38,
    purpose: 'Relief of allergy symptoms such as sneezing, runny nose, and hives. May cause mild drowsiness.',
    whenToSeeDoctor: 'Consult doctor if breathing difficulty occurs with allergy.',
    prescriptionRequired: false,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4', 'Katra Medical Kendra'],
  },
  {
    id: 'med-3',
    genericName: 'Oral Rehydration Salts (ORS)',
    brandName: 'Electral',
    dosage: '21.8 g sachet',
    janAushadhiPrice: 6,
    commercialPrice: 24,
    purpose: 'Restores electrolytes and fluids lost during acute diarrhoea, vomiting, or severe heat exhaustion.',
    whenToSeeDoctor: 'Seek emergency care if patient cannot retain fluids or becomes lethargic.',
    prescriptionRequired: false,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7'],
  },
  {
    id: 'med-4',
    genericName: 'Pantoprazole',
    brandName: 'Pan 40 / Pantocid',
    dosage: '40 mg',
    janAushadhiPrice: 22,
    commercialPrice: 95,
    purpose: 'Reduces excess stomach acid. Used for heartburn, acid reflux, and gastritis prevention.',
    whenToSeeDoctor: 'Consult a physician if chest pain or difficulty swallowing accompanies symptoms.',
    prescriptionRequired: true,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4'],
  },
  {
    id: 'med-5',
    genericName: 'Amoxicillin + Clavulanic Acid',
    brandName: 'Augmentin 625',
    dosage: '625 mg',
    janAushadhiPrice: 65,
    commercialPrice: 220,
    purpose: 'Broad-spectrum antibiotic for bacterial respiratory, dental, or skin infections. Complete full prescribed course.',
    whenToSeeDoctor: 'Always requires medical diagnosis and prescription.',
    prescriptionRequired: true,
    inStock: false,
    stores: ['District Hospital Pharmacy'],
  },
  {
    id: 'med-6',
    genericName: 'Metformin Hydrochloride',
    brandName: 'Glycomet 500',
    dosage: '500 mg',
    janAushadhiPrice: 14,
    commercialPrice: 52,
    purpose: 'First-line medication for type 2 diabetes management to improve glycemic control.',
    whenToSeeDoctor: 'Regular HbA1c monitoring required by qualified diabetologist.',
    prescriptionRequired: true,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4'],
  },
];

const MOCK_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. A. Sharma',
    specialty: 'General medicine',
    languages: 'EN, HI',
    nextSlot: 'Today 4:30 pm',
    status: 'online',
    hospitalAffiliation: 'District Government Hospital',
    experienceYears: 14,
    badge: 'verified',
  },
  {
    id: 'doc-2',
    name: 'Dr. R. Verma',
    specialty: 'Paediatrics',
    languages: 'HI',
    nextSlot: 'Tomorrow 10:00 am',
    status: 'offline',
    hospitalAffiliation: "Children's Hospital",
    experienceYears: 9,
    badge: 'verified',
  },
  {
    id: 'doc-3',
    name: 'Dr. S. Khan',
    specialty: 'Orthopaedics',
    languages: 'EN, HI, UR',
    nextSlot: 'Today 6:00 pm',
    status: 'online',
    hospitalAffiliation: 'Trauma Centre, Civil Lines',
    experienceYears: 18,
    badge: 'verified',
  },
  {
    id: 'doc-4',
    name: 'Dr. M. Iyer',
    specialty: 'Gynaecology',
    languages: 'EN, HI',
    nextSlot: 'Online now',
    status: 'online',
    hospitalAffiliation: "Women's Hospital",
    experienceYears: 12,
    badge: 'verified',
  },
];

export async function getHospitals(params = {}) {
  const queryParams = typeof params === 'string' ? { category: params } : params;
  try {
    const res = await api.get('/hospitals', { params: queryParams });
    if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (err) {
    console.error('Error fetching hospitals from API:', err);
  }

  // Smart fallback filtering
  let fallback = [...MOCK_HOSPITALS];
  const queryCity = (queryParams.city || '').toLowerCase();
  const searchCity = (queryParams.search || '').toLowerCase();
  const activeCity = queryCity || searchCity;
  const searchKeyword = (queryParams.search || '').trim().toLowerCase();

  if (activeCity) {
    const isVaranasi = activeCity.includes('varanasi') || activeCity.includes('varansi') || activeCity.includes('banaras') || activeCity.includes('kashi');
    const isGrNoida = activeCity.includes('greater noida') || activeCity.includes('gretaer noida') || activeCity.includes('gr noida');
    const isNoida = activeCity.includes('noida');
    const isPrayagraj = activeCity.includes('prayagraj') || activeCity.includes('prayarag') || activeCity.includes('prayag') || activeCity.includes('allahabad');
    const isLucknow = activeCity.includes('lucknow') || activeCity.includes('luknow') || activeCity.includes('lko');
    const isKanpur = activeCity.includes('kanpur') || activeCity.includes('knp');
    const isDelhi = activeCity.includes('delhi');

    const filtered = fallback.filter((h) => {
      const hc = (h.city || '').toLowerCase();
      const hd = (h.district || '').toLowerCase();
      if (isVaranasi) return hc === 'varanasi' || hd === 'varanasi';
      if (isGrNoida) return hc === 'greater noida' || hd === 'gautam buddha nagar';
      if (isNoida) return hc === 'noida' || hc === 'greater noida';
      if (isPrayagraj) return hc === 'prayagraj' || hd === 'prayagraj';
      if (isLucknow) return hc === 'lucknow' || hd === 'lucknow';
      if (isKanpur) return hc === 'kanpur' || hd === 'kanpur';
      if (isDelhi) return hc === 'new delhi' || hd === 'new delhi';
      return hc.includes(activeCity) || hd.includes(activeCity);
    });
    if (filtered.length > 0) fallback = filtered;
  } else if (queryParams.lat && queryParams.lng) {
    // Proximity fallback (Greater Noida / NCR coords)
    if (Math.abs(queryParams.lat - 28.47) < 0.3) {
      fallback = fallback.filter((h) => h.city === 'Greater Noida' || h.city === 'Noida');
    } else if (Math.abs(queryParams.lat - 25.43) < 0.3) {
      fallback = fallback.filter((h) => h.city === 'Prayagraj');
    } else if (Math.abs(queryParams.lat - 25.32) < 0.3) {
      fallback = fallback.filter((h) => h.city === 'Varanasi');
    }
  }

  if (queryParams.type) {
    const t = queryParams.type.toLowerCase();
    fallback = fallback.filter((h) => (h.type || '').toLowerCase() === t);
  }

  if (queryParams.traumaOnly) {
    fallback = fallback.filter((h) => h.traumaCenterActive);
  }

  if (searchKeyword) {
    fallback = fallback.filter(
      (h) =>
        (h.name || '').toLowerCase().includes(searchKeyword) ||
        (h.address && h.address.toLowerCase().includes(searchKeyword))
    );
  }

  const cat = queryParams.category;
  if (!cat || cat === 'All') return fallback;
  return fallback.filter(
    (h) => (h.category || '').toLowerCase() === cat.toLowerCase()
  );
}

export async function getNearestEmergencyHospital(coords = {}) {
  try {
    const res = await api.get('/hospitals/meta/emergency-nearest', { params: coords });
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.error('Error fetching nearest emergency hospital:', err);
  }
  const hospitals = await getHospitals(coords);
  return hospitals[0] || MOCK_HOSPITALS[0];
}

export async function compareGenericPrice(brandQuery) {
  try {
    const res = await api.get('/medicines/compare/price', { params: { brandQuery } });
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.error('Error comparing generic medicine price:', err);
  }
  return [];
}

export async function geocodeCity(query) {
  try {
    const res = await api.get('/hospitals/meta/geocode', { params: { q: query } });
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.error('Error geocoding city:', err);
  }
  return null;
}

export async function getMedicines(query = '') {
  try {
    const res = await api.get('/medicines', { params: { q: query } });
    if (res.data?.data) return res.data.data;
  } catch {
    // fallback
  }
  if (!query) return MOCK_MEDICINES;
  const q = query.toLowerCase();
  return MOCK_MEDICINES.filter(
    (m) =>
      m.genericName.toLowerCase().includes(q) ||
      m.brandName.toLowerCase().includes(q) ||
      m.purpose.toLowerCase().includes(q)
  );
}

export async function getDoctors() {
  try {
    const res = await api.get('/doctors');
    if (res.data?.data) return res.data.data;
  } catch {
    // fallback
  }
  return MOCK_DOCTORS;
}

export async function bookAppointment(payload) {
  try {
    const res = await api.post('/appointments', payload);
    return res.data;
  } catch {
    return {
      success: true,
      bookingId: `BK-${Date.now().toString().slice(-6)}`,
      message: 'Demo appointment booked successfully.',
      ...payload,
    };
  }
}

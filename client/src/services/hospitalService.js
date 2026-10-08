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
  { id: 'med-7', genericName: 'Azithromycin', brandName: 'Azithral 500 / Zithromax', dosage: '500 mg', janAushadhiPrice: 35, commercialPrice: 140, purpose: 'Antibiotic used for respiratory tract infections, typhoid, and skin infections.', whenToSeeDoctor: 'Always requires a prescription. See doctor if rash or severe diarrhea develops.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-8', genericName: 'Ibuprofen', brandName: 'Brufen 400 / Combiflam', dosage: '400 mg', janAushadhiPrice: 12, commercialPrice: 55, purpose: 'NSAID for pain relief, fever, and inflammation. Take with food to avoid stomach upset.', whenToSeeDoctor: 'Avoid in kidney disease. See doctor if pain persists beyond 5 days.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-9', genericName: 'Amoxicillin', brandName: 'Mox 500 / Novamox', dosage: '500 mg', janAushadhiPrice: 28, commercialPrice: 95, purpose: 'Antibiotic for ear infections, urinary tract infections, and pneumonia. Complete full course.', whenToSeeDoctor: 'Requires prescription. See doctor if allergic reaction appears.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-10', genericName: 'Atorvastatin', brandName: 'Lipitor / Atorva', dosage: '10 mg / 20 mg', janAushadhiPrice: 18, commercialPrice: 75, purpose: 'Statin for lowering LDL cholesterol and reducing risk of heart attack and stroke.', whenToSeeDoctor: 'Report muscle pain or weakness immediately. Requires lipid panel monitoring.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-11', genericName: 'Amlodipine', brandName: 'Norvasc / Amlokind', dosage: '5 mg', janAushadhiPrice: 10, commercialPrice: 45, purpose: 'Calcium channel blocker for hypertension and angina. Take daily at the same time.', whenToSeeDoctor: 'Regular blood pressure monitoring needed. See doctor if chest pain worsens.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-12', genericName: 'Omeprazole', brandName: 'Omez / Losec', dosage: '20 mg', janAushadhiPrice: 15, commercialPrice: 58, purpose: 'Proton pump inhibitor for acid reflux, peptic ulcers, and GERD. Take 30 minutes before meals.', whenToSeeDoctor: 'See doctor if symptoms persist beyond 2 weeks of use.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-13', genericName: 'Ciprofloxacin', brandName: 'Ciplox 500 / Cifran', dosage: '500 mg', janAushadhiPrice: 30, commercialPrice: 110, purpose: 'Fluoroquinolone antibiotic for UTI, typhoid, traveler\'s diarrhea, and skin infections.', whenToSeeDoctor: 'Requires prescription. Avoid in children and pregnant women.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-14', genericName: 'Metronidazole', brandName: 'Flagyl / Metrogyl', dosage: '400 mg', janAushadhiPrice: 12, commercialPrice: 42, purpose: 'Antibiotic for amoebic dysentery, giardiasis, dental infections, and bacterial vaginosis.', whenToSeeDoctor: 'Avoid alcohol during treatment. Requires prescription.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-15', genericName: 'Losartan', brandName: 'Cozaar / Losar', dosage: '50 mg', janAushadhiPrice: 16, commercialPrice: 65, purpose: 'ARB for high blood pressure and kidney protection in diabetics. Take regularly.', whenToSeeDoctor: 'Monitor kidney function and potassium levels regularly.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-16', genericName: 'Diclofenac', brandName: 'Voveran / Voltaren', dosage: '50 mg', janAushadhiPrice: 10, commercialPrice: 40, purpose: 'NSAID for pain relief in arthritis, back pain, sprains, and post-surgical pain.', whenToSeeDoctor: 'Avoid in ulcer patients. See doctor if abdominal pain or dark stools appear.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-17', genericName: 'Montelukast', brandName: 'Montair / Singulair', dosage: '10 mg', janAushadhiPrice: 25, commercialPrice: 95, purpose: 'Used for asthma prevention and seasonal allergic rhinitis. Take once daily at night.', whenToSeeDoctor: 'Report mood changes. Requires prescription.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-18', genericName: 'Salbutamol', brandName: 'Asthalin / Ventolin', dosage: '2 mg / 100 mcg inhaler', janAushadhiPrice: 30, commercialPrice: 120, purpose: 'Bronchodilator for relief of acute asthma and COPD attacks. Use inhaler as directed.', whenToSeeDoctor: 'Seek emergency care if breathing does not improve after 2 puffs.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'District Hospital Pharmacy'] },
  { id: 'med-19', genericName: 'Levothyroxine', brandName: 'Thyronorm / Eltroxin', dosage: '50 mcg', janAushadhiPrice: 20, commercialPrice: 80, purpose: 'Thyroid hormone replacement for hypothyroidism. Take on empty stomach 30 min before breakfast.', whenToSeeDoctor: 'Regular TSH monitoring required. Never stop without doctor advice.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-20', genericName: 'Ondansetron', brandName: 'Zofran / Emeset', dosage: '4 mg', janAushadhiPrice: 15, commercialPrice: 60, purpose: 'Anti-nausea medication for vomiting due to chemotherapy, surgery, or gastroenteritis.', whenToSeeDoctor: 'See doctor if vomiting persists beyond 24 hours, especially in children.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-21', genericName: 'Domperidone', brandName: 'Motilium / Domstal', dosage: '10 mg', janAushadhiPrice: 10, commercialPrice: 38, purpose: 'Anti-nausea and pro-motility agent for bloating, nausea, and delayed gastric emptying.', whenToSeeDoctor: 'Consult doctor for children or if cardiac symptoms develop.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-22', genericName: 'Prednisolone', brandName: 'Wysolone / Omnacortil', dosage: '10 mg', janAushadhiPrice: 18, commercialPrice: 70, purpose: 'Corticosteroid for severe allergic reactions, asthma, and autoimmune conditions.', whenToSeeDoctor: 'Never stop abruptly. Long-term use requires medical supervision.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-23', genericName: 'Doxycycline', brandName: 'Doxinate / Vibramycin', dosage: '100 mg', janAushadhiPrice: 20, commercialPrice: 85, purpose: 'Tetracycline antibiotic for malaria prophylaxis, acne, and respiratory infections.', whenToSeeDoctor: 'Avoid in pregnancy, children under 8. Take with food, avoid sun exposure.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-24', genericName: 'Loperamide', brandName: 'Imodium / Lopamide', dosage: '2 mg', janAushadhiPrice: 8, commercialPrice: 35, purpose: 'Anti-diarrheal for acute non-infectious diarrhea and traveler\'s diarrhea.', whenToSeeDoctor: 'Do not use for bloody diarrhoea or in children under 2.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7'] },
  { id: 'med-25', genericName: 'Vitamin D3', brandName: 'D-Rise / Calcirol', dosage: '60,000 IU weekly', janAushadhiPrice: 25, commercialPrice: 110, purpose: 'Vitamin D supplement for bone health, immunity, and deficiency treatment.', whenToSeeDoctor: 'High doses require doctor supervision. Monitor 25-OH Vitamin D levels.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-26', genericName: 'Vitamin B12 (Cyanocobalamin)', brandName: 'Methylcobal / Neurobion', dosage: '500 mcg', janAushadhiPrice: 15, commercialPrice: 65, purpose: 'Essential for nerve function, red blood cell formation, and energy metabolism.', whenToSeeDoctor: 'Persistent deficiency or neuropathy symptoms need specialist evaluation.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-27', genericName: 'Zinc Sulfate', brandName: 'Zincovit / Zinctus', dosage: '20 mg', janAushadhiPrice: 8, commercialPrice: 30, purpose: 'Zinc supplement for immunity, wound healing, and management of childhood diarrhea.', whenToSeeDoctor: 'Consult doctor for children\'s dosing. Excess zinc can be harmful.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7'] },
  { id: 'med-28', genericName: 'Atenolol', brandName: 'Tenormin / Aten', dosage: '50 mg', janAushadhiPrice: 12, commercialPrice: 48, purpose: 'Beta-blocker for hypertension, angina, and heart rhythm control.', whenToSeeDoctor: 'Never stop abruptly. Monitor heart rate regularly.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-29', genericName: 'Ramipril', brandName: 'Cardace / Ramace', dosage: '5 mg', janAushadhiPrice: 18, commercialPrice: 72, purpose: 'ACE inhibitor for high blood pressure, heart failure, and post-heart-attack protection.', whenToSeeDoctor: 'Report persistent dry cough or swelling of lips/tongue immediately.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-30', genericName: 'Loratadine', brandName: 'Clarityn / Lorfast', dosage: '10 mg', janAushadhiPrice: 7, commercialPrice: 35, purpose: 'Non-drowsy antihistamine for hay fever, allergic rhinitis, and skin allergies.', whenToSeeDoctor: 'See doctor if symptoms worsen or breathing becomes difficult.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-31', genericName: 'Sertraline', brandName: 'Zoloft / Sertima', dosage: '50 mg', janAushadhiPrice: 28, commercialPrice: 115, purpose: 'SSRI antidepressant for depression, anxiety disorders, OCD, and PTSD.', whenToSeeDoctor: 'Requires close psychiatric monitoring, especially in first 4 weeks.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-32', genericName: 'Clonazepam', brandName: 'Rivotril / Clonotril', dosage: '0.5 mg', janAushadhiPrice: 15, commercialPrice: 65, purpose: 'Benzodiazepine for epilepsy, anxiety, and panic disorders.', whenToSeeDoctor: 'Controlled substance — strictly requires prescription. Do not stop suddenly.', prescriptionRequired: true, inStock: false, stores: ['District Hospital Pharmacy'] },
  { id: 'med-33', genericName: 'Tramadol', brandName: 'Ultram / Contramal', dosage: '50 mg', janAushadhiPrice: 20, commercialPrice: 80, purpose: 'Opioid analgesic for moderate to severe pain management.', whenToSeeDoctor: 'Controlled substance. Requires prescription. Risk of dependence.', prescriptionRequired: true, inStock: false, stores: ['District Hospital Pharmacy'] },
  { id: 'med-34', genericName: 'Dexamethasone', brandName: 'Decadron / Dexona', dosage: '0.5 mg', janAushadhiPrice: 8, commercialPrice: 35, purpose: 'Potent corticosteroid for severe inflammation, cerebral edema, and COVID-related hypoxia.', whenToSeeDoctor: 'High-risk medication. Always use under medical supervision.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'District Hospital Pharmacy'] },
  { id: 'med-35', genericName: 'Lactulose', brandName: 'Duphalac / Lactulose', dosage: '10 g/15 mL', janAushadhiPrice: 45, commercialPrice: 150, purpose: 'Osmotic laxative for constipation and hepatic encephalopathy management.', whenToSeeDoctor: 'See doctor if constipation lasts more than 1 week or blood in stools.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-36', genericName: 'Naproxen', brandName: 'Naprosyn / Aleve', dosage: '250 mg', janAushadhiPrice: 14, commercialPrice: 55, purpose: 'NSAID for pain and inflammation in arthritis, dysmenorrhea, and musculoskeletal conditions.', whenToSeeDoctor: 'Avoid with blood thinners. See doctor for persistent joint pain.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-37', genericName: 'Famotidine', brandName: 'Aciloc / Famocid', dosage: '40 mg', janAushadhiPrice: 10, commercialPrice: 40, purpose: 'H2 blocker for heartburn, acidity, and peptic ulcer disease.', whenToSeeDoctor: 'See doctor if symptoms persist or if black stools appear.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-38', genericName: 'Chlorpheniramine', brandName: 'Piriton / Cadistin', dosage: '4 mg', janAushadhiPrice: 5, commercialPrice: 22, purpose: 'Antihistamine for common cold, hay fever, and allergic skin reactions. May cause drowsiness.', whenToSeeDoctor: 'See doctor if cold lasts over 7 days or fever develops.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7'] },
  { id: 'med-39', genericName: 'Dextromethorphan Cough Syrup', brandName: 'Benadryl DX / Kofarest', dosage: '10 mg/5mL', janAushadhiPrice: 30, commercialPrice: 95, purpose: 'Cough suppressant for dry, non-productive cough. Do not use with productive cough.', whenToSeeDoctor: 'See doctor if cough lasts over 2 weeks or is accompanied by blood.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-40', genericName: 'Antacid Gelusil', brandName: 'Gelusil / Digene', dosage: '200 mg + 200 mg', janAushadhiPrice: 12, commercialPrice: 45, purpose: 'Rapid relief from acidity, heartburn, and gastric discomfort. Take after meals.', whenToSeeDoctor: 'See doctor if acidity is severe or frequent, or if vomiting blood occurs.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7', 'Civil Lines Kendra'] },
  { id: 'med-41', genericName: 'Folic Acid', brandName: 'Folvite / Folinine', dosage: '5 mg', janAushadhiPrice: 5, commercialPrice: 20, purpose: 'Essential for preventing neural tube defects in pregnancy and treating anaemia.', whenToSeeDoctor: 'All pregnant women should consult their OB-GYN for dosing.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'] },
  { id: 'med-42', genericName: 'Iron + Folic Acid (IFA)', brandName: 'Autrin / Ferrous Sulfate', dosage: '100 mg Fe + 0.5 mg Folic', janAushadhiPrice: 8, commercialPrice: 35, purpose: 'Government IFA supplement for anaemia in pregnant women and adolescent girls.', whenToSeeDoctor: 'See doctor if haemoglobin remains low after 3 months of supplementation.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'PHC / Anganwadi Centre'] },
  { id: 'med-43', genericName: 'Aspirin', brandName: 'Ecosprin 75 / Disprin', dosage: '75 mg', janAushadhiPrice: 10, commercialPrice: 38, purpose: 'Antiplatelet for prevention of heart attacks and strokes in high-risk patients.', whenToSeeDoctor: 'Do not use in children with viral illness. Requires doctor prescription.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-44', genericName: 'Glimepiride', brandName: 'Amaryl / Glimpid', dosage: '2 mg', janAushadhiPrice: 18, commercialPrice: 70, purpose: 'Sulfonylurea for type 2 diabetes blood sugar control. Take before breakfast.', whenToSeeDoctor: 'Monitor for hypoglycemia (low blood sugar). Requires regular HbA1c check.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4'] },
  { id: 'med-45', genericName: 'Insulin Glargine', brandName: 'Lantus / Basalog', dosage: '100 IU/mL vial', janAushadhiPrice: 280, commercialPrice: 850, purpose: 'Long-acting basal insulin for type 1 and type 2 diabetes. Inject subcutaneously.', whenToSeeDoctor: 'Requires diabetologist guidance for dose adjustment. Check injection sites.', prescriptionRequired: true, inStock: false, stores: ['District Hospital Pharmacy', 'Jan Aushadhi Store, Sector 4'] },
  { id: 'med-46', genericName: 'Albendazole', brandName: 'Zentel / Bandy', dosage: '400 mg', janAushadhiPrice: 12, commercialPrice: 45, purpose: 'Anti-parasitic for worm infections (pinworm, roundworm, hookworm). Single dose effective.', whenToSeeDoctor: 'Pregnant women and children under 1 year should consult doctor first.', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'PHC / Anganwadi Centre'] },
  { id: 'med-47', genericName: 'Chloroquine', brandName: 'Lariago / Malarex', dosage: '250 mg', janAushadhiPrice: 20, commercialPrice: 75, purpose: 'Antimalarial for P. vivax malaria prophylaxis and treatment.', whenToSeeDoctor: 'See doctor for confirmed malaria diagnosis. Not for P. falciparum in India.', prescriptionRequired: true, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'District Hospital Pharmacy'] },
  { id: 'med-48', genericName: 'Povidone Iodine (Betadine)', brandName: 'Betadine / Wokadine', dosage: '5% solution / ointment', janAushadhiPrice: 18, commercialPrice: 65, purpose: 'Antiseptic for wound cleaning, minor cuts, burns, and surgical site preparation.', whenToSeeDoctor: 'See doctor if wound shows signs of deep infection (pus, red streaks, fever).', prescriptionRequired: false, inStock: true, stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7'] },
  { id: 'med-49', genericName: 'ORS + Zinc (IMNCI Protocol)', brandName: 'WHO ORS + Zinc 20mg', dosage: '1 sachet ORS + 20mg zinc daily', janAushadhiPrice: 14, commercialPrice: 55, purpose: 'WHO protocol for childhood diarrhoea: ORS prevents dehydration, zinc reduces duration.', whenToSeeDoctor: 'Seek emergency care if child shows sunken eyes, no urine, or lethargy.', prescriptionRequired: false, inStock: true, stores: ['PHC / Anganwadi Centre', 'Jan Aushadhi Store, Sector 4'] },
  { id: 'med-50', genericName: 'Adrenaline (Epinephrine)', brandName: 'Adrenaline Injection', dosage: '0.5 mg/mL IM injection', janAushadhiPrice: 25, commercialPrice: 90, purpose: 'Emergency treatment of severe anaphylaxis (life-threatening allergic reaction).', whenToSeeDoctor: 'Immediate emergency care required. Always call 112 after anaphylaxis.', prescriptionRequired: true, inStock: false, stores: ['District Hospital Pharmacy', 'Emergency Ward Only'] },
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

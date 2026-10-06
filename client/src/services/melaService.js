import api from './api';

const MOCK_MELA_DATA = {
  crowdStatus: 'Moderate',
  medicalCamps: 14,
  openIncidents: 6,
  missingReports: 9,
  helpDesks: 22,
  zones: [
    {
      id: 'z-sangam',
      name: 'Sangam Ghat',
      status: 'Critical',
      color: 'bg-red-200 border-red-400 text-red-950',
      densityPercent: 92,
      advisory: 'Sangam Ghat: crowd critical. Use alternate exit via Gate 4. Demo data.',
    },
    {
      id: 'z-maingate',
      name: 'Main Gate',
      status: 'High',
      color: 'bg-amber-200 border-amber-400 text-amber-950',
      densityPercent: 78,
      advisory: 'Main Gate: heavy inflow. Barricades active, redirecting to Gate 2.',
    },
    {
      id: 'z-sector1',
      name: 'Camp Sector 1',
      status: 'Moderate',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-950',
      densityPercent: 54,
      advisory: 'Camp Sector 1: smooth transit flow. Sanitation teams on duty.',
    },
    {
      id: 'z-medrow',
      name: 'Medical Camp Row',
      status: 'Normal',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-950',
      densityPercent: 30,
      advisory: 'Medical Camp Row: free movement. Triage doctors standing by.',
    },
    {
      id: 'z-foodwater',
      name: 'Food and Water',
      status: 'Moderate',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-950',
      densityPercent: 49,
      advisory: 'Food & Water Zone: clean RO water points functioning at capacity.',
    },
    {
      id: 'z-shelter',
      name: 'Shelter Area',
      status: 'Normal',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-950',
      densityPercent: 35,
      advisory: 'Shelter Area: comfortable seating and emergency bedding available.',
    },
  ],
  missingCases: [
    {
      caseId: 'SS-MELA-2026-000412',
      name: 'Sita Devi',
      age: 65,
      gender: 'Female',
      lastSeenLocation: 'Sangam Gate 3',
      lastSeenTime: '10:15 AM',
      clothing: 'Yellow Saree with red border, carrying cloth bag',
      status: 'Missing',
      nearestHelpDesk: 'Gate 3 Help Desk (400 m)',
      reportedBy: 'Son (Ramesh)',
    },
    {
      caseId: 'SS-MELA-2026-000408',
      name: 'Aarav Patel',
      age: 8,
      gender: 'Male',
      lastSeenLocation: 'Pontoon Bridge 2',
      lastSeenTime: '08:45 AM',
      clothing: 'Blue t-shirt, navy shorts, red cap',
      status: 'Located',
      nearestHelpDesk: 'Sector 2 Police Post',
      reportedBy: 'Mother (Sunita)',
    },
  ],
  helpPoints: [
    'Medical camps',
    'Police points',
    'Food and water',
    'Shelters',
    'Toilets',
    'Pharmacies',
    'Entry and exit gates',
    'Evacuation routes',
  ],
};

export async function getMelaOverview() {
  try {
    const res = await api.get('/mela/crowd-status');
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.error('Failed to get Mela live telemetry from API:', err);
  }
  return MOCK_MELA_DATA;
}

export async function reportMissingPerson(data) {
  try {
    const res = await api.post('/mela/missing-persons', data);
    return res.data;
  } catch (err) {
    console.error('Error in reportMissingPerson API call:', err);
    throw err;
  }
}

export async function reunitePerson(id) {
  try {
    const res = await api.patch(`/mela/missing-persons/${id}/reunite`);
    return res.data;
  } catch (err) {
    console.error('Error in reunitePerson API call:', err);
    throw err;
  }
}

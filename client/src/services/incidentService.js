import api from './api';

const MOCK_INCIDENTS = [
  {
    id: 'SS-2026-0412',
    title: 'Crowd risk, Sangam',
    category: 'Crowd',
    severity: 'critical',
    status: 'Responding',
    reportedAt: '10:30 AM',
    team: 'Police and medical',
    eta: '8 min',
    location: 'Sangam Ghat, Prayagraj',
    lat: 25.4298,
    lng: 81.8791,
    notes: 'Heavy pilgrim influx detected at Sangam point. Diversion gates activated.',
  },
  {
    id: 'SS-2026-0409',
    title: 'Waterlogging, Civil Lines',
    category: 'Flood',
    severity: 'high',
    status: 'Assigned',
    reportedAt: '10:15 AM',
    team: 'SDRF Drainage Unit',
    eta: '14 min',
    location: 'Civil Lines Underpass',
    lat: 25.4518,
    lng: 81.8341,
    notes: 'Storm water backflow causing traffic choke. Heavy pumping deployed.',
  },
  {
    id: 'SS-2026-0405',
    title: 'Medical camp support',
    category: 'Medical',
    severity: 'high',
    status: 'Received',
    reportedAt: '09:50 AM',
    team: 'Medical Reserve Unit 2',
    eta: '20 min',
    location: 'Sector 7 Parade Ground',
    lat: 25.4385,
    lng: 81.8512,
    notes: 'Emergency IV fluids and heat-exhaustion packs requested for 15 pilgrims.',
  },
  {
    id: 'SS-2026-0398',
    title: 'Road blockage, Jhunsi',
    category: 'Road',
    severity: 'moderate',
    status: 'Responding',
    reportedAt: '09:30 AM',
    team: 'Traffic Police & Towing',
    eta: '12 min',
    location: 'Old Bridge Approach, Jhunsi',
    lat: 25.4312,
    lng: 81.8985,
    notes: 'Overturned tractor trailer cleared onto shoulder; single lane flowing.',
  },
  {
    id: 'SS-2026-0391',
    title: 'Missing person case',
    category: 'Crowd',
    severity: 'moderate',
    status: 'Assigned',
    reportedAt: '09:10 AM',
    team: 'Lost & Found Booth 4',
    eta: '5 min',
    location: 'Gate 3, Kumbh Grounds',
    lat: 25.4265,
    lng: 81.8711,
    notes: 'Elderly pilgrim separated during Aarti. Description broadcast on PA.',
  },
];

const MOCK_ANALYTICS = {
  activeEmergencies: 24,
  openIncidents: 41,
  volunteersActive: 312,
  hospitalLoad: 76,
  resolved: 118,
  missingPersons: 9,
  incidentsByType: [
    { type: 'Flood', count: 90 },
    { type: 'Fire', count: 50 },
    { type: 'Medical', count: 110 },
    { type: 'Road', count: 70 },
    { type: 'Crowd', count: 80 },
  ],
  responseTimeTrend: [
    { day: 'Mon', time: 12 },
    { day: 'Tue', time: 14 },
    { day: 'Wed', time: 13 },
    { day: 'Thu', time: 17 },
    { day: 'Fri', time: 15 },
    { day: 'Sat', time: 19 },
    { day: 'Sun', time: 18 },
  ],
  agencies: [
    { name: 'NDRF Battalion 11', status: 'Active', deployed: 42, available: 18 },
    { name: 'State Police Quick Response', status: 'Active', deployed: 120, available: 35 },
    { name: 'Fire & Emergency Service', status: 'Standby', deployed: 16, available: 24 },
    { name: 'Civil Hospital Rapid Health', status: 'High Load', deployed: 64, available: 12 },
  ],
};

export async function reportIncident(data) {
  try {
    const res = await api.post('/incidents', data);
    return res.data;
  } catch {
    const newId = `SS-EMG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const mockCreated = {
      id: newId,
      incidentId: newId,
      ...data,
      status: 'Reported',
      createdAt: new Date().toISOString(),
      slaDeadline: '15 min',
    };
    return { success: true, data: mockCreated };
  }
}

export async function getIncidents() {
  try {
    const res = await api.get('/incidents');
    if (res.data?.data) return res.data.data;
  } catch {
    // fallback
  }
  return MOCK_INCIDENTS;
}

export async function updateIncidentStatus(id, newStatus) {
  try {
    const res = await api.patch(`/incidents/${id}/status`, { status: newStatus });
    return res.data;
  } catch {
    return { success: true, id, status: newStatus };
  }
}

export async function getCommandStats() {
  try {
    const res = await api.get('/command/stats');
    if (res.data?.data) return res.data.data;
  } catch {
    // fallback
  }
  return MOCK_ANALYTICS;
}

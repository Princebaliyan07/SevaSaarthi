import api from './api';

// ==========================================
// MELA OVERVIEW
// ==========================================
export async function getMelaOverview() {
  try {
    const res = await api.get('/mela/crowd-status');
    if (res.data?.data) return res.data.data;
  } catch (err) {
    console.error('Failed to get Mela live telemetry from API:', err);
  }
  return null;
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

// ==========================================
// FEATURE 1: MELA FACILITIES & MAP
// ==========================================
export async function getMelaFacilities(params = {}) {
  try {
    const res = await api.get('/mela/facilities', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching mela facilities:', err);
    return [];
  }
}

export async function createMelaFacility(data) {
  const res = await api.post('/mela/facilities', data);
  return res.data?.data;
}

export async function updateMelaFacility(id, data) {
  const res = await api.patch(`/mela/facilities/${id}`, data);
  return res.data?.data;
}

export async function deleteMelaFacility(id) {
  const res = await api.delete(`/mela/facilities/${id}`);
  return res.data;
}

// ==========================================
// FEATURE 2: MISSING PERSONS & LOST & FOUND
// ==========================================
export async function createLostFoundReport(data) {
  const res = await api.post('/mela/reports', data);
  return res.data?.data;
}

export async function getLostFoundReports(params = {}) {
  try {
    const res = await api.get('/mela/reports', { params });
    return res.data?.data || { reports: [], pagination: { total: 0 } };
  } catch (err) {
    console.error('Error fetching lost and found reports:', err);
    return { reports: [], pagination: { total: 0 } };
  }
}

export async function getReportDetails(id, secretKey = '') {
  const url = secretKey ? `/mela/reports/${id}?secretKey=${encodeURIComponent(secretKey)}` : `/mela/reports/${id}`;
  const res = await api.get(url);
  return res.data?.data;
}

export async function updateReportStatus(id, data) {
  const res = await api.patch(`/mela/reports/${id}/status`, data);
  return res.data?.data;
}

export async function submitPossibleMatch(id, data) {
  const res = await api.post(`/mela/reports/${id}/match`, data);
  return res.data?.data;
}

export async function sendReportMessage(id, data) {
  const res = await api.post(`/mela/reports/${id}/messages`, data);
  return res.data?.data;
}

// ==========================================
// FEATURE 3: MELA CROWD SAFETY & ALERTS
// ==========================================
export async function getMelaAlerts(params = {}) {
  try {
    const res = await api.get('/mela/alerts', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching mela alerts:', err);
    return [];
  }
}

export async function createMelaAlert(data) {
  const res = await api.post('/mela/alerts', data);
  return res.data?.data;
}

export async function updateMelaAlert(id, data) {
  const res = await api.patch(`/mela/alerts/${id}`, data);
  return res.data?.data;
}

export async function resolveMelaAlert(id) {
  const res = await api.patch(`/mela/alerts/${id}/resolve`);
  return res.data?.data;
}

// ==========================================
// FEATURE 4: MULTIPLE GROUND MAPS
// ==========================================
export async function getMelaMaps() {
  try {
    const res = await api.get('/mela/maps');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching mela maps:', err);
    return [
      {
        mapId: 'prayagraj_kumbh',
        name: 'Prayagraj Maha Kumbh 2025 (Sangam Ground)',
        imageUrl: '/mela-blueprint-map.jpg',
        description: 'Sangam confluence, Akhada camp, Kalpwas sectors, and pontoon bridges ground layout.',
        isDefault: true,
      },
    ];
  }
}

export async function createMelaMap(data) {
  const res = await api.post('/mela/maps', data);
  return res.data?.data;
}

export async function deleteMelaMap(mapId) {
  const res = await api.delete(`/mela/maps/${mapId}`);
  return res.data?.data;
}

// ==========================================
// FEATURE 5: CROWD DENSITY ZONES — FULLY DYNAMIC
// ==========================================
export async function getCrowdZones(mapId) {
  try {
    const params = mapId ? { mapId } : {};
    const res = await api.get('/mela/crowd-zones', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching crowd zones:', err);
    return [];
  }
}

export async function createCrowdZone(data) {
  const res = await api.post('/mela/crowd-zones', data);
  return res.data?.data;
}

export async function updateCrowdZone(id, data) {
  const res = await api.patch(`/mela/crowd-zones/${id}`, data);
  return res.data?.data;
}

export async function deleteCrowdZone(id) {
  const res = await api.delete(`/mela/crowd-zones/${id}`);
  return res.data;
}

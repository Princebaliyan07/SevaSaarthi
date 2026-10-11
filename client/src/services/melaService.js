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

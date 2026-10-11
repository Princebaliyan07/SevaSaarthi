import api from './api';

// ==========================================
// 1. VOLUNTEER TEAMS & MEMBERSHIP
// ==========================================

export async function getVolunteerTeams(params = {}) {
  try {
    const res = await api.get('/volunteer/teams', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching volunteer teams:', err);
    return [];
  }
}

export async function getVolunteerTeamDetails(teamId) {
  const res = await api.get(`/volunteer/teams/${teamId}`);
  return res.data?.data;
}

export async function createVolunteerTeam(data) {
  const res = await api.post('/volunteer/teams', data);
  return res.data?.data;
}

export async function requestJoinTeam(teamId, data) {
  const res = await api.post(`/volunteer/teams/${teamId}/join`, data);
  return res.data?.data;
}

export async function getTeamJoinRequests(params = {}) {
  try {
    const res = await api.get('/volunteer/team-requests', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching team requests:', err);
    return [];
  }
}

export async function reviewTeamJoinRequest(requestId, data) {
  const res = await api.patch(`/volunteer/team-requests/${requestId}`, data);
  return res.data?.data;
}

export async function reviewVolunteerTeam(teamId, data) {
  const res = await api.patch(`/volunteer/teams/${teamId}/review`, data);
  return res.data?.data;
}

export async function deleteVolunteerTeam(teamId) {
  const res = await api.delete(`/volunteer/teams/${teamId}`);
  return res.data?.data;
}

// ==========================================
// 2. VOLUNTEER REGISTRATION (MULTI-STEP)
// ==========================================

export async function registerVolunteer(data) {
  const res = await api.post('/volunteer/register', data);
  return res.data?.data;
}

export async function getVolunteerApplications(params = {}) {
  try {
    const res = await api.get('/volunteer/applications', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching volunteer applications:', err);
    return [];
  }
}

export async function reviewVolunteerApplication(regId, data) {
  const res = await api.patch(`/volunteer/applications/${regId}/review`, data);
  return res.data?.data;
}

// ==========================================
// 3. DISASTER RELIEF CAMPAIGNS & DONATIONS
// ==========================================

export async function getReliefCampaigns(params = {}) {
  try {
    const res = await api.get('/volunteer/campaigns', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching relief campaigns:', err);
    return [];
  }
}

export async function createReliefCampaign(data) {
  const res = await api.post('/volunteer/campaigns', data);
  return res.data?.data;
}

export async function deleteReliefCampaign(campaignId) {
  const res = await api.delete(`/volunteer/campaigns/${campaignId}`);
  return res.data?.data;
}

export async function donateToCampaign(campaignId, data) {
  const res = await api.post(`/volunteer/campaigns/${campaignId}/donate`, data);
  return res.data?.data;
}

export async function getCampaignDonations(params = {}) {
  try {
    const res = await api.get('/volunteer/donations', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching donations:', err);
    return [];
  }
}

// ==========================================
// 4. CERTIFIED SUPPLIERS & SHOPS
// ==========================================

export async function getReliefSuppliers(params = {}) {
  try {
    const res = await api.get('/volunteer/suppliers', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    return [];
  }
}

export async function registerSupplier(data) {
  const res = await api.post('/volunteer/suppliers', data);
  return res.data?.data;
}

export async function reviewSupplier(supplierId, data) {
  const res = await api.patch(`/volunteer/suppliers/${supplierId}/review`, data);
  return res.data?.data;
}

// ==========================================
// 5. ESSENTIAL GOODS SUPPLY ORDERS & DELIVERIES
// ==========================================

export async function createSupplyOrder(data) {
  const res = await api.post('/volunteer/orders', data);
  return res.data?.data;
}

export async function getSupplyOrders(params = {}) {
  try {
    const res = await api.get('/volunteer/orders', { params });
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching supply orders:', err);
    return [];
  }
}

export async function updateSupplyOrderStatus(orderId, data) {
  const res = await api.patch(`/volunteer/orders/${orderId}/status`, data);
  return res.data?.data;
}

export async function claimDeliveryOrder(orderId, data) {
  const res = await api.patch(`/volunteer/orders/${orderId}/claim`, data);
  return res.data?.data;
}

// ==========================================
// 6. COMMAND CENTRE OVERVIEW & AUDIT LOGS
// ==========================================

export async function getReliefCommandOverview() {
  try {
    const res = await api.get('/volunteer/command-overview');
    return res.data?.data || null;
  } catch (err) {
    console.error('Error fetching relief command overview:', err);
    return null;
  }
}

export async function getAuditLogs() {
  try {
    const res = await api.get('/volunteer/audit-logs');
    return res.data?.data || [];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

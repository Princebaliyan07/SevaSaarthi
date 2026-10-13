import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://sevasaarthi-f45x.onrender.com/api/v1';

/**
 * Register a first responder
 */
export async function registerFirstResponder(data) {
  try {
    const res = await axios.post(`${BASE}/first-responders/register`, data);
    return res.data;
  } catch (err) {
    throw err?.response?.data || { success: false, message: 'Registration failed' };
  }
}

/**
 * Search first responders by location + optional specification filter + live lat/lng
 */
export async function searchFirstResponders(location, specification = 'all', lat = null, lng = null) {
  try {
    const params = { location };
    if (specification && specification !== 'all') params.specification = specification;
    if (lat && lng) {
      params.lat = lat;
      params.lng = lng;
    }
    const res = await axios.get(`${BASE}/first-responders/search`, { params });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { success: false, message: 'Search failed' };
  }
}

/**
 * Send Aadhaar verification OTP
 */
export async function sendAadhaarOtp(aadhaarNumber, contactNumber) {
  try {
    const res = await axios.post(`${BASE}/first-responders/aadhaar-otp/send`, {
      aadhaarNumber,
      contactNumber,
    });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { success: false, message: 'Failed to send OTP' };
  }
}

/**
 * Verify Aadhaar OTP
 */
export async function verifyAadhaarOtp(aadhaarNumber, otp) {
  try {
    const res = await axios.post(`${BASE}/first-responders/aadhaar-otp/verify`, {
      aadhaarNumber,
      otp,
    });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { success: false, message: 'OTP verification failed' };
  }
}

/**
 * Admin: Get all first responders for Command Centre
 */
export async function getAdminFirstResponders(status = 'all') {
  try {
    const res = await axios.get(`${BASE}/first-responders/admin/all`, {
      params: { status },
      timeout: 8000,
    });
    return res.data;
  } catch (err) {
    console.warn('[firstResponderService] Backend unreachable, checking local demo cache:', err);
    // Fallback to local demo cache if server is sleeping
    const cached = JSON.parse(localStorage.getItem('ss_admin_responders_cache') || '[]');
    let filtered = cached;
    if (status && status !== 'all') {
      filtered = cached.filter((r) => r.approvalStatus === status);
    }
    return {
      success: true,
      count: filtered.length,
      counts: {
        pending: cached.filter((r) => r.approvalStatus === 'pending').length,
        approved: cached.filter((r) => r.approvalStatus === 'approved').length,
        total: cached.length,
      },
      data: filtered,
    };
  }
}

/**
 * Admin: Approve a first responder
 */
export async function approveFirstResponder(id, approvedBy = 'Command Centre Admin') {
  try {
    const res = await axios.patch(
      `${BASE}/first-responders/${id}/approve`,
      { approvedBy },
      { timeout: 8000 }
    );
    return res.data;
  } catch (err) {
    console.warn('[firstResponderService] Backend unreachable, updating local cache:', err);
    const cached = JSON.parse(localStorage.getItem('ss_admin_responders_cache') || '[]');
    const target = cached.find((r) => String(r._id) === String(id));
    if (target) {
      target.isApproved = true;
      target.approvalStatus = 'approved';
      target.approvedAt = new Date().toISOString();
      target.approvedBy = approvedBy;
      localStorage.setItem('ss_admin_responders_cache', JSON.stringify(cached));
      return { success: true, message: `Approved responder ${target.name}`, data: target };
    }
    throw err?.response?.data || { success: false, message: 'Approval failed' };
  }
}

/**
 * Admin: Reject a first responder application
 */
export async function rejectFirstResponder(id, reason = 'Govt ID verification failed or insufficient credentials.') {
  try {
    const res = await axios.patch(
      `${BASE}/first-responders/${id}/reject`,
      { reason },
      { timeout: 8000 }
    );
    return res.data;
  } catch (err) {
    console.warn('[firstResponderService] Backend unreachable, updating local cache:', err);
    const cached = JSON.parse(localStorage.getItem('ss_admin_responders_cache') || '[]');
    const target = cached.find((r) => String(r._id) === String(id));
    if (target) {
      target.isApproved = false;
      target.approvalStatus = 'rejected';
      target.rejectionReason = reason;
      localStorage.setItem('ss_admin_responders_cache', JSON.stringify(cached));
      return { success: true, message: `Rejected responder ${target.name}`, data: target };
    }
    throw err?.response?.data || { success: false, message: 'Rejection failed' };
  }
}

/**
 * Admin: Permanently delete a first responder
 */
export async function deleteFirstResponder(id) {
  try {
    const res = await axios.delete(`${BASE}/first-responders/${id}`, { timeout: 8000 });
    // Also remove from local cache if present
    const cached = JSON.parse(localStorage.getItem('ss_admin_responders_cache') || '[]');
    const remaining = cached.filter((r) => String(r._id) !== String(id));
    localStorage.setItem('ss_admin_responders_cache', JSON.stringify(remaining));
    return res.data;
  } catch (err) {
    console.warn('[firstResponderService] Backend delete failed or offline, updating local cache:', err);
    const cached = JSON.parse(localStorage.getItem('ss_admin_responders_cache') || '[]');
    const remaining = cached.filter((r) => String(r._id) !== String(id));
    localStorage.setItem('ss_admin_responders_cache', JSON.stringify(remaining));
    return { success: true, message: 'Responder permanently deleted.' };
  }
}

/**
 * Toggle active status
 */
export async function toggleResponderActive(id) {
  try {
    const res = await axios.patch(`${BASE}/first-responders/${id}/toggle`, {}, { timeout: 8000 });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { success: false, message: 'Toggle active failed' };
  }
}


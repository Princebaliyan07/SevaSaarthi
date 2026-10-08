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

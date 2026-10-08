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
 * Search first responders by location + optional specification filter
 */
export async function searchFirstResponders(location, specification = 'all') {
  try {
    const params = { location };
    if (specification && specification !== 'all') params.specification = specification;
    const res = await axios.get(`${BASE}/first-responders/search`, { params });
    return res.data;
  } catch (err) {
    throw err?.response?.data || { success: false, message: 'Search failed' };
  }
}

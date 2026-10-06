/**
 * Haversine formula to compute great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 2.5;
  }
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export const calculateHaversineDistanceKm = calculateDistanceKm;

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Approximate Indian State detection based on coordinates
 */
export function approximateIndiaState(lat, lng) {
  if (lat >= 28.0 && lat <= 32.0 && lng >= 77.0 && lng <= 81.0) return 'Uttarakhand';
  if (lat >= 23.5 && lat <= 28.5 && lng >= 78.0 && lng <= 84.5) return 'Uttar Pradesh';
  if (lat >= 24.0 && lat <= 30.0 && lng >= 69.0 && lng <= 78.0) return 'Rajasthan';
  if (lat >= 17.5 && lat <= 22.5 && lng >= 81.0 && lng <= 87.5) return 'Odisha';
  if (lat >= 24.0 && lat <= 28.5 && lng >= 89.5 && lng <= 96.0) return 'Assam';
  if (lat >= 8.0 && lat <= 13.0 && lng >= 75.0 && lng <= 77.5) return 'Kerala';
  if (lat >= 18.0 && lat <= 22.0 && lng >= 72.5 && lng <= 80.5) return 'Maharashtra';
  if (lat >= 28.3 && lat <= 28.9 && lng >= 76.8 && lng <= 77.4) return 'Delhi NCR';
  if (lat >= 21.5 && lat <= 27.5 && lng >= 85.5 && lng <= 89.5) return 'West Bengal';
  if (lat >= 11.5 && lat <= 18.5 && lng >= 74.0 && lng <= 78.5) return 'Karnataka';
  if (lat >= 8.0 && lat <= 13.5 && lng >= 77.0 && lng <= 80.5) return 'Tamil Nadu';
  if (lat >= 32.0 && lat <= 36.0 && lng >= 73.5 && lng <= 79.5) return 'Jammu & Kashmir';
  if (lat >= 30.5 && lat <= 33.0 && lng >= 75.5 && lng <= 79.0) return 'Himachal Pradesh';
  return 'India / South Asia Region';
}

export default {
  calculateDistanceKm,
  calculateHaversineDistanceKm,
  approximateIndiaState,
};

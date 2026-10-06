import { ApiError } from '../utils/ApiError.js';

export function validateMissingPersonReport(req, res, next) {
  const { name, age, lastSeenLocation, clothing, contactPhone } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Name is required');
  }

  if (age === undefined || age === null || isNaN(Number(age))) {
    throw new ApiError(400, 'Valid age is required');
  }

  if (!lastSeenLocation || !lastSeenLocation.trim()) {
    throw new ApiError(400, 'Last seen location is required');
  }

  // Provide sensible defaults if not passed from quick forms
  if (!clothing || !clothing.trim()) {
    req.body.clothing = 'Standard attire / clothing description pending';
  }

  if (!contactPhone || !contactPhone.trim()) {
    req.body.contactPhone = '+91 98765 43210';
  }

  if (!req.body.gender) {
    req.body.gender = 'Other';
  }

  next();
}

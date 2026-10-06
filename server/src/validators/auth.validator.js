import { ApiError } from '../utils/ApiError.js';

export function validateRegister(req, res, next) {
  const { name, phone, password } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Name is required');
  }

  if (!phone || !/^\+?[0-9]{10,13}$/.test(phone.trim())) {
    throw new ApiError(400, 'Valid 10-digit mobile number is required');
  }

  if (!password || password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long');
  }

  next();
}

export function validateLogin(req, res, next) {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new ApiError(400, 'Phone and password are required');
  }

  next();
}

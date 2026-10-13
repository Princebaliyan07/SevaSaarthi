import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: No token provided');
  }

  // Reject any forged or unsigned demo tokens
  if (token.startsWith('demo-jwt-')) {
    throw new ApiError(401, 'Unauthorized request: Insecure demo tokens are strictly disallowed');
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'sevasaarthi_dev_secret_key_2026'
    );

    let user = null;
    try {
      user = await User.findById(decodedToken?._id).select('-password');
    } catch {
      // DB may be disconnected or in memory
    }

    if (!user) {
      // If user doc not found in mongo, use decoded payload claims
      user = {
        _id: decodedToken._id,
        name: decodedToken.name || 'Authorized User',
        role: decodedToken.role || 'citizen',
        phone: decodedToken.phone,
      };
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

export const verifyJwt = verifyJWT;
export default verifyJWT;

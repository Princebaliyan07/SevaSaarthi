import { ApiError } from '../utils/ApiError.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Forbidden: Role [${req.user?.role || 'anonymous'}] is not authorized to access this resource`
      );
    }
    next();
  };
};

import { ApiError } from '../utils/ApiError.js';

export function validateIncidentReport(req, res, next) {
  const { title, category } = req.body;

  if (!title && !category) {
    throw new ApiError(400, 'Either title or emergency category is required');
  }

  next();
}

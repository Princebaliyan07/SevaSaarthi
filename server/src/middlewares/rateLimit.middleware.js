import rateLimit from 'express-rate-limit';

// General API Rate Limiting (150 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Rate Limiter (Brute-force protection: 20 attempts per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Emergency SOS Dispatch Rate Limiter (Protects 112 hotline from flood/spam)
export const emergencyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Max 20 SOS calls per minute per IP
  message: {
    success: false,
    message: 'Emergency submission rate threshold reached. For immediate dispatch, dial 112 directly.',
  },
});

export default { apiLimiter, authLimiter, emergencyLimiter };

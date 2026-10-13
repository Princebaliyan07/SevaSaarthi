import rateLimit from 'express-rate-limit';

// General API Rate Limiting (3,000 requests per 15 minutes for real-time dashboards)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 3000 : 10000,
  skip: (req) => req.method === 'OPTIONS' || req.path.includes('/health'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after a few minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Rate Limiter (Brute-force protection: 100 attempts per 15 minutes; ignore successful logins)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many failed login attempts. Please try again after 15 minutes.',
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

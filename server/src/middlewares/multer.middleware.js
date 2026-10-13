import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { ApiError } from '../utils/ApiError.js';

// Temporary secure upload directory
const uploadDir = './public/temp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.pdf',
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate secure random filename to prevent path traversal and file collision
    const randomHex = crypto.randomBytes(16).toString('hex');
    const safeExt = path.extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(safeExt)) {
      return cb(new ApiError(400, 'Disallowed file extension. Only JPG, PNG, WEBP, and PDF files are allowed.'));
    }

    const field = file.fieldname.replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `${field}-${Date.now()}-${randomHex}${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Validate both MIME type and file extension
  if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      new ApiError(
        400,
        'Invalid file type. Only secure images (JPG, PNG, WEBP) and PDF documents are permitted.'
      ),
      false
    );
  }

  // Reject files with double extensions or null bytes (e.g., shell.php.jpg or exploit.js\0.png)
  if (file.originalname.includes('\0') || (file.originalname.match(/\./g) || []).length > 2) {
    return cb(new ApiError(400, 'Potentially unsafe file naming detected.'), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB strict limit
    files: 5,
  },
});

export default upload;

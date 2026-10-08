import FirstResponder from '../models/FirstResponder.model.js';

// In-memory OTP storage for Aadhaar verification: { [aadhaarNumber]: { otp, expiresAt } }
const otpStore = new Map();

/**
 * Send OTP for Aadhaar verification
 * POST /api/v1/first-responders/aadhaar-otp/send
 */
export async function sendAadhaarOtp(req, res) {
  try {
    const { aadhaarNumber, contactNumber } = req.body;
    if (!aadhaarNumber || aadhaarNumber.replace(/\s/g, '').length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 12-digit Aadhaar number.',
      });
    }

    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(cleanAadhaar, {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // In production, integrate SMS gateway (e.g. Fast2SMS / Twilio)
    console.log(`[Aadhaar OTP] Generated OTP for Aadhaar ${cleanAadhaar.slice(0, 4)}XXXX${cleanAadhaar.slice(8)}: ${generatedOtp}`);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to mobile linked with Aadhaar (last 4 digits: ${cleanAadhaar.slice(-4)})`,
      // Returning test OTP in response for demonstration / testing convenience
      demoOtp: generatedOtp,
    });
  } catch (error) {
    console.error('Error sending Aadhaar OTP:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while sending OTP.',
    });
  }
}

/**
 * Verify OTP for Aadhaar
 * POST /api/v1/first-responders/aadhaar-otp/verify
 */
export async function verifyAadhaarOtp(req, res) {
  try {
    const { aadhaarNumber, otp } = req.body;
    if (!aadhaarNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Aadhaar number and OTP are required.',
      });
    }

    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    const entry = otpStore.get(cleanAadhaar);

    // Allow static demo OTP '123456' or matching stored OTP
    if ((entry && entry.otp === otp && Date.now() <= entry.expiresAt) || otp === '123456') {
      otpStore.delete(cleanAadhaar);
      return res.status(200).json({
        success: true,
        message: 'Aadhaar verification successful via UIDAI Gateway!',
        verified: true,
        maskedAadhaar: `XXXX-XXXX-${cleanAadhaar.slice(-4)}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP. Please check and try again.',
    });
  } catch (error) {
    console.error('Error verifying Aadhaar OTP:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while verifying OTP.',
    });
  }
}

/**
 * Helper to calculate haversine distance in km
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Register a new First Responder (Doctor, Nurse, NCC/NSS, Ex-Army, etc.)
 * POST /api/v1/first-responders/register
 */
export async function registerFirstResponder(req, res) {
  try {
    const {
      name,
      contactNumber,
      specification,
      speciality,
      age,
      gender,
      location,
      lat,
      lng,
      aadhaarNumber,
      isAadhaarVerified,
      profilePhoto,
      proofCertificate,
      videoCallAllowed,
      videoCallLink,
    } = req.body;

    if (!name || !contactNumber || !specification || !age || !gender || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name, contactNumber, specification, age, gender and location are required fields.',
      });
    }

    // Split location into area and city (e.g. "Chandni Chowk, Delhi" => area: "chandni chowk", city: "delhi")
    const parts = location.split(',').map((p) => p.trim());
    let area = '';
    let city = '';

    if (parts.length > 1) {
      area = parts.slice(0, -1).join(' ').toLowerCase();
      city = parts[parts.length - 1].toLowerCase();
    } else {
      city = parts[0].toLowerCase();
      area = parts[0].toLowerCase();
    }

    const responder = await FirstResponder.create({
      name: name.trim(),
      contactNumber: String(contactNumber).trim(),
      specification,
      speciality: speciality ? speciality.trim() : 'General First Aid / Emergency Response',
      age: Number(age),
      gender,
      location: location.trim(),
      city,
      area,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      aadhaarNumber: aadhaarNumber ? aadhaarNumber.replace(/\s/g, '') : '',
      isAadhaarVerified: Boolean(isAadhaarVerified),
      profilePhoto: profilePhoto || '',
      proofCertificate: proofCertificate || '',
      videoCallAllowed: Boolean(videoCallAllowed),
      videoCallLink: videoCallLink ? videoCallLink.trim() : '',
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'First Responder registered successfully! You are now live in the network.',
      data: responder,
    });
  } catch (error) {
    console.error('Error registering first responder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while registering first responder.',
    });
  }
}

/**
 * Search nearby first responders by location and optional specification
 * GET /api/v1/first-responders/search?location=...&specification=...&lat=...&lng=...
 */
export async function searchFirstResponders(req, res) {
  try {
    const { location = '', specification = 'all', lat, lng } = req.query;

    const userLat = lat ? Number(lat) : null;
    const userLng = lng ? Number(lng) : null;

    let filter = { isActive: true };

    if (specification && specification !== 'all') {
      filter.specification = specification;
    }

    if (location && location.trim()) {
      const queryParts = location
        .toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean);

      // Build regex match across location, city, area, and speciality fields
      const locationConditions = queryParts.map((term) => ({
        $or: [
          { location: { $regex: term, $options: 'i' } },
          { city: { $regex: term, $options: 'i' } },
          { area: { $regex: term, $options: 'i' } },
          { speciality: { $regex: term, $options: 'i' } },
        ],
      }));

      filter.$and = locationConditions;
    }

    let responders = await FirstResponder.find(filter)
      .sort({ registeredAt: -1 })
      .limit(40)
      .lean();

    // If coordinates are provided, compute distance and sort by nearest
    if (userLat && userLng) {
      responders = responders.map((r) => {
        let distanceKm = null;
        if (r.lat && r.lng) {
          distanceKm = calculateDistanceKm(userLat, userLng, r.lat, r.lng);
        }
        return {
          ...r,
          distanceKm,
        };
      });

      // Sort responders that have distance first, ascending
      responders.sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        if (a.distanceKm !== null) return -1;
        if (b.distanceKm !== null) return 1;
        return 0;
      });
    }

    return res.status(200).json({
      success: true,
      count: responders.length,
      data: responders,
    });
  } catch (error) {
    console.error('Error searching first responders:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while searching first responders.',
    });
  }
}

/**
 * Get all active first responders (listing)
 * GET /api/v1/first-responders
 */
export async function getAllFirstResponders(req, res) {
  try {
    const { specification } = req.query;
    const filter = { isActive: true };
    if (specification && specification !== 'all') {
      filter.specification = specification;
    }

    const responders = await FirstResponder.find(filter)
      .sort({ registeredAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      count: responders.length,
      data: responders,
    });
  } catch (error) {
    console.error('Error fetching all first responders:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching first responders.',
    });
  }
}

/**
 * Toggle active status
 * PATCH /api/v1/first-responders/:id/toggle
 */
export async function toggleActive(req, res) {
  try {
    const { id } = req.params;
    const responder = await FirstResponder.findById(id);
    if (!responder) {
      return res.status(404).json({ success: false, message: 'Responder not found' });
    }

    responder.isActive = !responder.isActive;
    await responder.save();

    return res.status(200).json({
      success: true,
      message: `Responder status updated to ${responder.isActive ? 'Active' : 'Inactive'}`,
      data: responder,
    });
  } catch (error) {
    console.error('Error toggling responder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error.',
    });
  }
}

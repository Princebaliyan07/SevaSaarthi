import FirstResponder from '../models/FirstResponder.model.js';

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
      age,
      gender,
      location,
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
      age: Number(age),
      gender,
      location: location.trim(),
      city,
      area,
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
 * GET /api/v1/first-responders/search?location=...&specification=...
 */
export async function searchFirstResponders(req, res) {
  try {
    const { location = '', specification = 'all' } = req.query;

    if (!location.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a location to search for nearby responders.',
      });
    }

    const queryParts = location
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean);

    // Build regex match across location, city, and area fields
    const locationConditions = queryParts.map((term) => ({
      $or: [
        { location: { $regex: term, $options: 'i' } },
        { city: { $regex: term, $options: 'i' } },
        { area: { $regex: term, $options: 'i' } },
      ],
    }));

    const filter = {
      isActive: true,
      $and: locationConditions,
    };

    if (specification && specification !== 'all') {
      filter.specification = specification;
    }

    const responders = await FirstResponder.find(filter)
      .sort({ registeredAt: -1 })
      .limit(30)
      .lean();

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

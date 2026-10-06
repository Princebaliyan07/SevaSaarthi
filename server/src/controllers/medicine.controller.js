import mongoose from 'mongoose';
import Medicine from '../models/Medicine.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const BASELINE_MEDICINES = [
  {
    id: 'med-1',
    medicineId: 'MED-001',
    genericName: 'Paracetamol',
    dosage: '500 mg / 650 mg',
    brandName: 'Dolo 650 / Calpol',
    janAushadhiPrice: 18,
    commercialPrice: 72,
    savingsPercentage: 75,
    purpose: 'Used for fever and mild pain. Follow label dose. Do not combine with other paracetamol products.',
    whenToSeeDoctor: 'See a doctor if fever lasts over 3 days.',
    prescriptionRequired: false,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4', 'Civil Lines Kendra'],
  },
  {
    id: 'med-2',
    medicineId: 'MED-002',
    genericName: 'Cetirizine',
    dosage: '10 mg',
    brandName: 'Zyrtec / Cetcip',
    janAushadhiPrice: 8,
    commercialPrice: 38,
    savingsPercentage: 79,
    purpose: 'Relief of allergy symptoms such as sneezing, runny nose, and hives. May cause mild drowsiness.',
    whenToSeeDoctor: 'Consult doctor if breathing difficulty occurs with allergy.',
    prescriptionRequired: false,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4', 'Katra Medical Kendra'],
  },
  {
    id: 'med-3',
    medicineId: 'MED-003',
    genericName: 'Oral Rehydration Salts (ORS)',
    dosage: '21.8 g sachet',
    brandName: 'Electral',
    janAushadhiPrice: 6,
    commercialPrice: 24,
    savingsPercentage: 75,
    purpose: 'Restores electrolytes and fluids lost during acute diarrhoea, vomiting, or severe heat exhaustion.',
    whenToSeeDoctor: 'Seek emergency care if patient cannot retain fluids or becomes lethargic.',
    prescriptionRequired: false,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4', 'Medical Camp, Sector 7'],
  },
  {
    id: 'med-4',
    medicineId: 'MED-004',
    genericName: 'Pantoprazole',
    dosage: '40 mg',
    brandName: 'Pan 40 / Pantocid',
    janAushadhiPrice: 22,
    commercialPrice: 95,
    savingsPercentage: 77,
    purpose: 'Reduces excess stomach acid. Used for heartburn, acid reflux, and gastritis prevention.',
    whenToSeeDoctor: 'Consult a physician if chest pain or difficulty swallowing accompanies symptoms.',
    prescriptionRequired: true,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4'],
  },
  {
    id: 'med-5',
    medicineId: 'MED-005',
    genericName: 'Amoxicillin + Clavulanic Acid',
    dosage: '625 mg',
    brandName: 'Augmentin 625',
    janAushadhiPrice: 65,
    commercialPrice: 220,
    savingsPercentage: 70,
    purpose: 'Broad-spectrum antibiotic for bacterial respiratory, dental, or skin infections. Complete full prescribed course.',
    whenToSeeDoctor: 'Always requires medical diagnosis and prescription.',
    prescriptionRequired: true,
    inStock: false,
    stores: ['District Hospital Pharmacy'],
  },
  {
    id: 'med-6',
    medicineId: 'MED-006',
    genericName: 'Metformin Hydrochloride',
    dosage: '500 mg',
    brandName: 'Glycomet 500',
    janAushadhiPrice: 14,
    commercialPrice: 52,
    savingsPercentage: 73,
    purpose: 'First-line medication for type 2 diabetes management to improve glycemic control.',
    whenToSeeDoctor: 'Regular HbA1c monitoring required by qualified diabetologist.',
    prescriptionRequired: true,
    inStock: true,
    stores: ['Jan Aushadhi Store, Sector 4'],
  },
];

export const getMedicinesList = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = {};
      if (q && q.trim()) {
        const regex = new RegExp(q.trim(), 'i');
        filter.$or = [{ genericName: regex }, { brandName: regex }, { purpose: regex }];
      }

      const list = await Medicine.find(filter).sort({ genericName: 1 }).lean();
      const formatted = list.map((m) => ({
        ...m,
        id: m.medicineId || m._id.toString(),
        savingsPercentage:
          m.savingsPercentage ||
          (m.commercialPrice > 0
            ? Math.round(((m.commercialPrice - m.janAushadhiPrice) / m.commercialPrice) * 100)
            : 65),
      }));
      return res.status(200).json(new ApiResponse(200, formatted, 'Medicines retrieved successfully'));
    } catch (err) {
      console.error('[Medicine DB Query Error]', err);
    }
  }

  // Baseline Fallback
  let result = [...BASELINE_MEDICINES];
  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    result = result.filter(
      (m) =>
        m.genericName.toLowerCase().includes(query) ||
        m.brandName.toLowerCase().includes(query) ||
        m.purpose.toLowerCase().includes(query)
    );
  }

  return res.status(200).json(new ApiResponse(200, result, 'Medicines retrieved successfully'));
});

export const getMedicineById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      const medicine = await Medicine.findOne({
        $or: [{ medicineId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });
      if (medicine) {
        return res.status(200).json(new ApiResponse(200, medicine, 'Medicine details'));
      }
    } catch {
      // fallback
    }
  }

  const fallback = BASELINE_MEDICINES.find((m) => m.id === id || m.medicineId === id);
  if (!fallback) {
    throw new ApiError(404, `Medicine with ID ${id} not found`);
  }

  return res.status(200).json(new ApiResponse(200, fallback, 'Medicine details'));
});

export const comparePrice = asyncHandler(async (req, res) => {
  const { brandQuery } = req.query;

  if (!brandQuery) {
    throw new ApiError(400, 'brandQuery parameter is required');
  }

  const q = brandQuery.trim().toLowerCase();

  if (mongoose.connection.readyState === 1) {
    try {
      const regex = new RegExp(q, 'i');
      const matches = await Medicine.find({
        $or: [{ genericName: regex }, { brandName: regex }],
      }).lean();

      if (matches.length > 0) {
        return res.status(200).json(
          new ApiResponse(
            200,
            matches.map((m) => ({
              searchedBrand: brandQuery,
              janAushadhiGeneric: m.genericName,
              dosage: m.dosage,
              janAushadhiMRP: m.janAushadhiPrice,
              commercialBrandMRP: m.commercialPrice,
              citizenSavingsRupees: m.commercialPrice - m.janAushadhiPrice,
              savingsPercentage: `${m.savingsPercentage || Math.round(((m.commercialPrice - m.janAushadhiPrice) / m.commercialPrice) * 100)}%`,
            })),
            'Generic price match comparison'
          )
        );
      }
    } catch (err) {
      console.error('[Medicine Price Match DB Error]', err);
    }
  }

  const matches = BASELINE_MEDICINES.filter(
    (m) => m.brandName.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      matches.map((m) => ({
        searchedBrand: brandQuery,
        janAushadhiGeneric: m.genericName,
        dosage: m.dosage,
        janAushadhiMRP: m.janAushadhiPrice,
        commercialBrandMRP: m.commercialPrice,
        citizenSavingsRupees: m.commercialPrice - m.janAushadhiPrice,
        savingsPercentage: `${m.savingsPercentage || 70}%`,
      })),
      'Generic price match comparison'
    )
  );
});

export default {
  getMedicinesList,
  getMedicineById,
  comparePrice,
};

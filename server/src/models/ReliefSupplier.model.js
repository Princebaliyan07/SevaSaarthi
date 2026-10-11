import mongoose from 'mongoose';

const reliefSupplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    supplierCategory: {
      type: String,
      enum: [
        'Medical Store / Pharmacy',
        'Grocery & Dry Food',
        'Packaged Water & Beverages',
        'Clothing & Blankets',
        'Emergency Hardware & Tools',
      ],
      required: true,
      index: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    licenseVerified: {
      type: Boolean,
      default: false,
    },
    city: {
      type: String,
      required: true,
      default: 'Prayagraj',
    },
    district: {
      type: String,
      default: 'Prayagraj',
    },
    state: {
      type: String,
      default: 'Uttar Pradesh',
    },
    address: {
      type: String,
      required: true,
    },
    coords: {
      lat: { type: Number, default: 25.4358 },
      lng: { type: Number, default: 81.8463 },
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending Verification', 'Verified', 'Suspended'],
      default: 'Pending Verification',
      index: true,
    },
    isOpenForEmergencyOrders: {
      type: Boolean,
      default: true,
    },
    catalog: [
      {
        itemId: String,
        name: String,
        category: String,
        unit: String,
        unitPrice: Number,
        availableStock: Number,
      },
    ],
  },
  { timestamps: true }
);

reliefSupplierSchema.index({ city: 1, verificationStatus: 1 });

const ReliefSupplier = mongoose.model('ReliefSupplier', reliefSupplierSchema);
export default ReliefSupplier;

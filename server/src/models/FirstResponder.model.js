import mongoose from 'mongoose';

const firstResponderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    specification: {
      type: String,
      required: [true, 'Specification is required'],
      enum: ['Doctor', 'Nurse', 'NCC/NSS Volunteer', 'Ex-Army/Defence', 'Paramedic', 'NDRF/SDRF Trained'],
    },
    speciality: {
      type: String,
      trim: true,
      default: 'General First Aid / Emergency Response',
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Minimum age is 18'],
      max: [80, 'Maximum age is 80'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    area: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
    // Aadhaar Verification details
    aadhaarNumber: {
      type: String,
      trim: true,
      default: '',
    },
    isAadhaarVerified: {
      type: Boolean,
      default: false,
    },
    // Proof & Photo URLs (base64 or storage url)
    profilePhoto: {
      type: String,
      default: '',
    },
    proofCertificate: {
      type: String,
      default: '',
    },
    videoCallAllowed: {
      type: Boolean,
      default: false,
    },
    videoCallLink: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for full-text city/area/speciality search
firstResponderSchema.index({ city: 'text', area: 'text', speciality: 'text' });

export default mongoose.model('FirstResponder', firstResponderSchema);

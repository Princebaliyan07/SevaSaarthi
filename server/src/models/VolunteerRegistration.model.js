import mongoose from 'mongoose';

const volunteerRegistrationSchema = new mongoose.Schema(
  {
    regId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Step 1: Personal Details
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      required: true,
      default: 'Uttar Pradesh',
    },
    district: {
      type: String,
      required: true,
      default: '',
    },
    city: {
      type: String,
      required: true,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    preferredServiceArea: {
      type: String,
      default: '',
    },
    locationCoords: {
      lat: { type: Number, default: 25.4358 },
      lng: { type: Number, default: 81.8463 },
    },
    // Step 2: Volunteer Skills & Qualifications
    skills: {
      type: [String],
      default: ['First Aid'],
    },
    qualifications: {
      type: String,
      default: '',
    },
    // Step 3: Availability
    availableDays: {
      type: [String],
      default: ['Weekends'],
    },
    availableHours: {
      type: String,
      default: '4-8 hours/week',
    },
    emergencyAvailability: {
      type: Boolean,
      default: true,
    },
    travelDistanceKm: {
      type: Number,
      default: 15,
    },
    hasVehicle: {
      type: Boolean,
      default: false,
    },
    vehicleType: {
      type: String,
      default: 'None',
    },
    languages: {
      type: [String],
      default: ['Hindi', 'English'],
    },
    // Step 4: Identity Verification Workflow (Carefully Protected)
    idType: {
      type: String,
      enum: ['Aadhaar Virtual ID', 'Voter ID', 'Driving License', 'Government ID', 'Not Provided'],
      default: 'Not Provided',
    },
    idReferenceMasked: {
      type: String,
      default: '',
      // Only stores masked non-sensitive reference e.g. "VID-XXXX-1234"
    },
    consentGiven: {
      type: Boolean,
      required: true,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending Review', 'Verified', 'Rejected', 'Not Required'],
      default: 'Pending Review',
      index: true,
    },
    // Review and Application Status
    applicationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Suspended'],
      default: 'Pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

volunteerRegistrationSchema.index({ state: 1, district: 1 });

const VolunteerRegistration = mongoose.model('VolunteerRegistration', volunteerRegistrationSchema);
export default VolunteerRegistration;

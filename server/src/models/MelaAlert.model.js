import mongoose from 'mongoose';

const melaAlertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    alertType: {
      type: String,
      required: true,
      enum: [
        'High Crowd Density',
        'Avoid This Area',
        'Gate Closed',
        'Gate Open',
        'Route Temporarily Closed',
        'Medical Emergency',
        'Restricted Area',
        'Evacuation Instruction',
        'General Safety Announcement',
      ],
      index: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['Informational', 'Advisory', 'Warning', 'Critical'],
      default: 'Advisory',
      index: true,
    },
    affectedLocation: {
      type: String,
      required: true,
      trim: true,
    },
    recommendedAction: {
      type: String,
      required: true,
      trim: true,
    },
    issuingAuthority: {
      type: String,
      default: 'Mela Administration & Police Command',
      trim: true,
    },
    mapX: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    mapY: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    latitude: {
      type: Number,
      default: 25.4284,
    },
    longitude: {
      type: Number,
      default: 81.8845,
    },
    areaRadiusMeters: {
      type: Number,
      default: 250,
    },
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Deactivated'],
      default: 'Active',
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    isSensorVerified: {
      type: Boolean,
      default: false,
    },
    reportedSource: {
      type: String,
      default: 'Administration-Reported (Timestamped)',
    },
  },
  { timestamps: true }
);

const MelaAlert = mongoose.model('MelaAlert', melaAlertSchema);
export default MelaAlert;

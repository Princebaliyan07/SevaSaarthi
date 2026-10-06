import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    disasterType: {
      type: String,
      required: true,
      index: true,
      enum: [
        'landslide',
        'flood',
        'severeStorm',
        'cyclone',
        'wildfire',
        'earthquake',
        'heatwave',
        'heavyRain',
        'tsunami',
        'drought',
        'medical',
        'road',
        'fire',
        'missing',
        'crime',
        'other',
      ],
      default: 'other',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    state: {
      type: String,
      index: true,
      trim: true,
      default: 'All India',
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    locationName: {
      type: String,
      trim: true,
      default: '',
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'moderate', 'low'],
      default: 'moderate',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'assigned', 'investigating', 'resolved', 'closed'],
      default: 'active',
      index: true,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: '',
    },
    sourceType: {
      type: String,
      enum: ['official_gov', 'external_scientific', 'citizen_report', 'demo'],
      default: 'external_scientific',
      index: true,
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    alertCode: {
      type: String,
      trim: true,
      default: '',
    },
    actionRequired: {
      type: String,
      trim: true,
      default: '',
    },
    assignedAgency: {
      type: String,
      default: 'District Emergency Command',
    },
    slaMinutesRemaining: {
      type: Number,
      default: 15,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    audioUrl: String,
    imageUrl: String,
    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ disasterType: 1, status: 1, severity: 1 });

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;

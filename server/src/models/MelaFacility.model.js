import mongoose from 'mongoose';

const melaFacilitySchema = new mongoose.Schema(
  {
    facilityId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'hospital_medical',
        'medicine_distribution',
        'drinking_water',
        'toilet',
        'entry_gate',
        'exit_gate',
        'emergency_shelter',
        'help_desk',
        'crowded_area',
        'restricted_area',
        'temporarily_closed_route',
      ],
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
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
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['Operational', 'Congested', 'Restricted', 'Closed', 'Under Maintenance'],
      default: 'Operational',
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    operatingHours: {
      type: String,
      default: '24x7 (Demo Schedule)',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    sector: {
      type: String,
      default: 'Sector 1 - Sangam',
    },
    isDemoData: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: 'Admin',
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  { timestamps: true }
);

melaFacilitySchema.index({ location: '2dsphere' });

const MelaFacility = mongoose.model('MelaFacility', melaFacilitySchema);
export default MelaFacility;

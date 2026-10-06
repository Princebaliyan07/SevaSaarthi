import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['General', 'Trauma', 'Children', 'Maternity', 'Burn unit', 'Medical camp', 'Medicine store', 'Blood bank'],
      default: 'General',
      index: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Prayagraj',
      index: true,
    },
    state: {
      type: String,
      default: 'Uttar Pradesh',
    },
    phone: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      default: 'Open 24x7',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      enum: ['verified', 'official', 'provisional'],
      default: 'verified',
    },
    departments: [String],
    services: [String],
    doctorsOnDuty: {
      type: Number,
      default: 5,
    },
    totalBeds: {
      type: Number,
      default: 100,
    },
    icuBedsAvailable: {
      type: Number,
      default: 5,
      index: true,
    },
    oxygenBedsAvailable: {
      type: Number,
      default: 20,
    },
    traumaCenterActive: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true }
);

hospitalSchema.index({ location: '2dsphere' });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;

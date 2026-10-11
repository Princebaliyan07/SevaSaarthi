import mongoose from 'mongoose';

const crowdZoneSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    mapId: {
      type: String,
      default: 'prayagraj_kumbh',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Normal', 'Moderate', 'High', 'Critical'],
      default: 'Normal',
    },
    density: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    advisory: {
      type: String,
      trim: true,
      default: 'Standard crowd management protocols in effect.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: 'admin',
    },
  },
  { timestamps: true }
);

crowdZoneSchema.index({ mapId: 1, isActive: 1 });

export default mongoose.model('CrowdZone', crowdZoneSchema);

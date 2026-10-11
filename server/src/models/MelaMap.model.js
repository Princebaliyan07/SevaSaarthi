import mongoose from 'mongoose';

const melaMapSchema = new mongoose.Schema(
  {
    mapId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameHi: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const MelaMap = mongoose.model('MelaMap', melaMapSchema);
export default MelaMap;

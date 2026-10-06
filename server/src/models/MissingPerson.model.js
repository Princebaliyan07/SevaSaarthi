import mongoose from 'mongoose';

const missingPersonSchema = new mongoose.Schema(
  {
    caseId: {
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
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    lastSeenLocation: {
      type: String,
      required: true,
    },
    lastSeenTime: {
      type: String,
      required: true,
    },
    clothing: {
      type: String,
      default: 'Not specified',
    },
    languages: {
      type: String,
      default: 'Hindi',
    },
    specialMarks: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['investigating', 'broadcasting', 'reunited', 'closed'],
      default: 'broadcasting',
      index: true,
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    reportedBy: {
      type: String,
      default: 'Family Member',
    },
    isContactVerified: {
      type: Boolean,
      default: true,
    },
    reunitedAt: Date,
  },
  { timestamps: true }
);

const MissingPerson = mongoose.model('MissingPerson', missingPersonSchema);
export default MissingPerson;

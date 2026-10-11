import mongoose from 'mongoose';

const teamJoinRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamId: {
      type: String,
      required: true,
      index: true,
    },
    teamName: {
      type: String,
      default: '',
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
    },
    currentLocation: {
      type: String,
      default: '',
    },
    skills: [String],
    availability: {
      type: String,
      default: 'Flexible / On-Call',
    },
    qualifications: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    safetyGuidelinesAgreed: {
      type: Boolean,
      required: true,
      default: true,
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Approved', 'Rejected', 'Waitlisted'],
      default: 'Pending Review',
      index: true,
    },
    reviewedBy: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

teamJoinRequestSchema.index({ teamId: 1, phone: 1 });

const TeamJoinRequest = mongoose.model('TeamJoinRequest', teamJoinRequestSchema);
export default TeamJoinRequest;

import mongoose from 'mongoose';

const lostFoundReportSchema = new mongoose.Schema(
  {
    reportRefId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: ['missing_person', 'found_person'],
      default: 'missing_person',
      index: true,
    },
    // Person Details
    personName: {
      type: String,
      trim: true,
      default: '',
    },
    personAge: {
      type: Number,
      default: null,
    },
    personGender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Unknown'],
      default: 'Unknown',
    },
    clothingDescription: {
      type: String,
      trim: true,
      default: '',
    },
    distinguishingFeatures: {
      type: String,
      trim: true,
      default: '',
    },
    relationshipToPerson: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    dateTimeApprox: {
      type: String,
      required: true,
      trim: true,
    },
    // Photos for Dual Comparison
    photoUrl: {
      type: String,
      default: '', // Photo provided when missing was reported
    },
    foundPhotoUrl: {
      type: String,
      default: '', // Photo uploaded when person was found by finder / police / volunteer
    },
    foundLocation: {
      type: String,
      default: '', // The exact location where the person was located / found
    },
    foundFinderName: {
      type: String,
      default: '',
    },
    foundFinderContact: {
      type: String,
      default: '',
    },
    // Private Reporter Contact
    reporterName: {
      type: String,
      required: true,
      trim: true,
    },
    reporterPhone: {
      type: String,
      required: true,
      trim: true,
    },
    reporterEmail: {
      type: String,
      trim: true,
      default: '',
    },
    // Secret Access Key
    secretAccessKey: {
      type: String,
      required: true,
      index: true,
    },
    // Workflow status
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Possible Match', 'Verified Match', 'Resolved', 'Rejected'],
      default: 'Submitted',
      index: true,
    },
    isPublicApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
    matchNotes: {
      type: String,
      default: '',
    },
    // Private messages thread
    messages: [
      {
        messageId: {
          type: String,
          required: true,
        },
        senderName: {
          type: String,
          required: true,
        },
        senderRole: {
          type: String,
          enum: ['reporter', 'claimant', 'admin'],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const LostFoundReport = mongoose.model('LostFoundReport', lostFoundReportSchema);
export default LostFoundReport;

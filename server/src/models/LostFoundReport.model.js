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
      enum: ['missing_person', 'lost_item', 'found_person', 'found_item'],
      index: true,
    },
    // Person fields
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
    // Item fields
    itemCategory: {
      type: String,
      trim: true,
      default: '', // 'Bag/Luggage', 'Mobile/Electronics', 'Documents/Wallet', 'Jewelry/Valuables', 'Other'
    },
    itemDescription: {
      type: String,
      trim: true,
      default: '',
    },
    // Common incident fields
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
    photoUrl: {
      type: String,
      default: '',
    },
    // Private Contact Info (HIDDEN from public listings)
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
    // Secret Access Key for anonymous report owners to view & participate in private messages
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
    // Match linkage
    matchedReportRefId: {
      type: String,
      default: null,
    },
    matchNotes: {
      type: String,
      default: '',
    },
    // Private messages thread on this report
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

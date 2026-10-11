import mongoose from 'mongoose';

const reliefAuditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Volunteer', 'Team', 'Campaign', 'Donation', 'Supplier', 'Order', 'System'],
      default: 'System',
    },
    performedBy: {
      type: String,
      default: 'Admin Officer',
    },
    targetRef: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  { timestamps: true }
);

const ReliefAuditLog = mongoose.model('ReliefAuditLog', reliefAuditLogSchema);
export default ReliefAuditLog;

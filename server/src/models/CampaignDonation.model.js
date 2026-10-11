import mongoose from 'mongoose';

const campaignDonationSchema = new mongoose.Schema(
  {
    donationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    campaignId: {
      type: String,
      required: true,
      index: true,
    },
    campaignTitle: {
      type: String,
      default: '',
    },
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorPhone: {
      type: String,
      trim: true,
      default: '',
    },
    donorEmail: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    type: {
      type: String,
      enum: ['Monetary Contribution', 'Essential Supplies Sponsorship'],
      default: 'Monetary Contribution',
    },
    sponsoredItems: [
      {
        itemKey: String,
        itemName: String,
        quantity: Number,
        unit: String,
        unitPrice: Number,
      },
    ],
    // Payment Gateway / Verified Direct Integration
    paymentProvider: {
      type: String,
      default: 'Razorpay Sandbox (Official Testing)',
    },
    paymentOrderId: {
      type: String,
      default: '',
    },
    paymentTransactionId: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['Initiated', 'Pending', 'Successful', 'Failed', 'Refunded'],
      default: 'Successful',
      index: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

campaignDonationSchema.index({ campaignId: 1, paymentStatus: 1 });

const CampaignDonation = mongoose.model('CampaignDonation', campaignDonationSchema);
export default CampaignDonation;

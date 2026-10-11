import mongoose from 'mongoose';

const reliefCampaignSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    disasterCategory: {
      type: String,
      enum: ['Floods', 'Earthquakes', 'Cyclones', 'Landslides', 'Fires', 'Heatwaves', 'Severe Storms', 'Other'],
      default: 'Floods',
      index: true,
    },
    affectedState: {
      type: String,
      required: true,
      default: 'Uttar Pradesh',
    },
    affectedDistrict: {
      type: String,
      required: true,
      default: 'Prayagraj',
    },
    locationCoords: {
      lat: { type: Number, default: 25.4358 },
      lng: { type: Number, default: 81.8463 },
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 500000,
    },
    confirmedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    // Government / NGO Recipient details
    isGovernmentFund: {
      type: Boolean,
      default: false,
    },
    recipientAgency: {
      type: String,
      required: true,
      default: 'State Disaster Relief Fund (SDRF) / District Administration',
    },
    recipientAccountType: {
      type: String,
      default: 'Official Government Treasury Account / Registered NGO Escrow',
    },
    status: {
      type: String,
      enum: ['Active', 'Urgent', 'Target Reached', 'Closed', 'Paused'],
      default: 'Active',
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Verified essentials needed
    verifiedNeeds: [
      {
        itemKey: String,
        itemName: String,
        unit: String,
        requestedQty: Number,
        fundedQty: { type: Number, default: 0 },
        deliveredQty: { type: Number, default: 0 },
        unitPrice: Number,
      },
    ],
    // Verified updates / audit milestones
    verifiedUpdates: [
      {
        title: String,
        text: String,
        author: { type: String, default: 'District Relief Commissioner' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

reliefCampaignSchema.index({ affectedState: 1, affectedDistrict: 1 });
reliefCampaignSchema.index({ status: 1 });

const ReliefCampaign = mongoose.model('ReliefCampaign', reliefCampaignSchema);
export default ReliefCampaign;

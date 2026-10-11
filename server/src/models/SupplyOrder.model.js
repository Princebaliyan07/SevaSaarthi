import mongoose from 'mongoose';

const supplyOrderSchema = new mongoose.Schema(
  {
    orderId: {
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
      default: 'Anonymous Contributor',
    },
    supplierId: {
      type: String,
      required: true,
      index: true,
    },
    supplierName: {
      type: String,
      required: true,
    },
    supplierAddress: {
      type: String,
      default: '',
    },
    items: [
      {
        itemKey: String,
        name: String,
        unit: String,
        quantity: Number,
        unitPrice: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    destinationCamp: {
      type: String,
      required: true,
    },
    destinationCoords: {
      lat: { type: Number, default: 25.4358 },
      lng: { type: Number, default: 81.8463 },
    },
    orderStatus: {
      type: String,
      enum: [
        'Requested',
        'Paid',
        'Accepted',
        'Preparing',
        'Ready for Pickup',
        'Assigned for Delivery',
        'Dispatched',
        'Delivered',
        'Cancelled',
      ],
      default: 'Paid',
      index: true,
    },
    assignedVolunteerId: {
      type: String,
      default: '',
    },
    assignedVolunteerName: {
      type: String,
      default: '',
    },
    assignedVolunteerPhone: {
      type: String,
      default: '',
    },
    pickupConfirmedAt: Date,
    deliveredAt: Date,
    deliveryConfirmationNote: {
      type: String,
      default: '',
    },
    deliveryEvidenceUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

supplyOrderSchema.index({ supplierId: 1, orderStatus: 1 });
supplyOrderSchema.index({ assignedVolunteerId: 1 });

const SupplyOrder = mongoose.model('SupplyOrder', supplyOrderSchema);
export default SupplyOrder;

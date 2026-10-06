import mongoose from 'mongoose';

const deliveryRequestSchema = new mongoose.Schema(
  {
    deliveryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    patientPhone: {
      type: String,
      required: true,
    },
    medicinesList: [
      {
        medicineName: String,
        quantity: Number,
      },
    ],
    deliveryAddress: {
      type: String,
      required: true,
    },
    destinationCoords: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
      default: 'requested',
      index: true,
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    volunteerName: String,
    volunteerPhone: String,
    urgency: {
      type: String,
      enum: ['critical', 'urgent', 'normal'],
      default: 'urgent',
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const DeliveryRequest = mongoose.model('DeliveryRequest', deliveryRequestSchema);
export default DeliveryRequest;

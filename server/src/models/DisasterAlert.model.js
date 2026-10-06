import mongoose from 'mongoose';

const disasterAlertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['Monsoon Flood', 'Tropical Cyclone', 'Landslide Hazard', 'Heatwave Thermal', 'Earthquake', 'Other'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      enum: ['Monsoon', 'Summer', 'Winter', 'Post-Monsoon', 'Year-Round'],
      default: 'Monsoon',
      index: true,
    },
    affectedRegion: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['Red Alert', 'Orange Alert', 'Yellow Alert', 'Watch'],
      default: 'Orange Alert',
    },
    agency: {
      type: String,
      default: 'IMD / NDMA Sachet',
    },
    leadTime: String,
    dosAndDonts: [String],
    reliefCenterNearby: String,
    coords: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

const DisasterAlert = mongoose.model('DisasterAlert', disasterAlertSchema);
export default DisasterAlert;

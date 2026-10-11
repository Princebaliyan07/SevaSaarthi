import mongoose from 'mongoose';

const volunteerTeamSchema = new mongoose.Schema(
  {
    teamId: {
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
    description: {
      type: String,
      default: '',
    },
    teamCategory: {
      type: String,
      enum: ['Community NGO', 'NDRF/SDRF Affiliate', 'Civil Defence', 'Red Cross / Medical Corps', 'Citizen Action Group'],
      default: 'Citizen Action Group',
    },
    supportedDisasters: {
      type: [String],
      default: ['Floods', 'General Emergency'],
    },
    // Location and Geospatial Coordinates
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Prayagraj',
      index: true,
    },
    district: {
      type: String,
      default: 'Prayagraj',
      index: true,
    },
    state: {
      type: String,
      default: 'Uttar Pradesh',
    },
    pincode: {
      type: String,
      default: '',
    },
    serviceArea: {
      type: String,
      default: 'Within 25 km of city center',
    },
    coords: {
      lat: { type: Number, default: 25.4358 },
      lng: { type: Number, default: 81.8463 },
    },
    // Leadership & Public Display
    leaderName: {
      type: String,
      required: true,
    },
    leaderPhone: {
      type: String,
      required: true,
    },
    // Capacity and Actual Database Membership
    capacity: {
      type: Number,
      default: 50,
    },
    activeMembers: {
      type: Number,
      default: 1,
    },
    approvedMembers: [
      {
        memberId: String,
        fullName: String,
        phoneMasked: String,
        role: { type: String, default: 'Volunteer' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    skills: {
      type: [String],
      default: ['First Aid', 'Food Distribution'],
    },
    // Verification & Operational Status
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Suspended'],
      default: 'Pending',
      index: true,
    },
    operationalStatus: {
      type: String,
      enum: ['Accepting Members', 'At Capacity', 'Active Relief Operation', 'Temporarily Unavailable', 'Inactive'],
      default: 'Accepting Members',
      index: true,
    },
    currentMission: {
      type: String,
      default: 'Ready for emergency deployment',
    },
    completedMissions: {
      type: Number,
      default: 0,
    },
    // Documentation reference
    registrationDocRef: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      default: 'System',
    },
  },
  { timestamps: true }
);

volunteerTeamSchema.index({ 'coords.lat': 1, 'coords.lng': 1 });
volunteerTeamSchema.index({ city: 1, state: 1 });

const VolunteerTeam = mongoose.model('VolunteerTeam', volunteerTeamSchema);
export default VolunteerTeam;

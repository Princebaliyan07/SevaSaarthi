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
    location: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: 'Uttar Pradesh',
    },
    leaderName: {
      type: String,
      required: true,
    },
    leaderPhone: {
      type: String,
      required: true,
    },
    activeMembers: {
      type: Number,
      default: 10,
    },
    skills: [String], // e.g. ['First Aid', 'Boat Rescue', 'Food Distribution']
    isVerified: {
      type: Boolean,
      default: true,
    },
    currentMission: {
      type: String,
      default: 'Ready for deployment',
    },
  },
  { timestamps: true }
);

const VolunteerTeam = mongoose.model('VolunteerTeam', volunteerTeamSchema);
export default VolunteerTeam;

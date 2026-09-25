const mongoose = require('mongoose');

// Sub-schema for team members
const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Member email is required'],
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

// Main Team Schema
const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
    },
    teamLeader: {
      type: String,
      required: [true, 'Team leader name is required'],
      trim: true,
    },
    teamLeaderEmail: {
      type: String,
      required: [true, 'Team leader email is required'],
      trim: true,
      lowercase: true,
    },
    members: {
      type: [memberSchema],
      required: [true, 'Team members are required'],
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

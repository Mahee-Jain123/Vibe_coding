
const mongoose = require('mongoose');

// Sub-schema for the 4 other team members
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

    // Reference to the User who registered the team
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team leader is required'],
    },

    // Four other members; the leader is stored separately above
    members: {
      type: [memberSchema],
      required: [true, 'Team members are required'],
      validate: {
        validator: function (val) {
          return val.length === 4;
        },
        message:
          'A team must have exactly 4 members (5 total including the team leader).',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;

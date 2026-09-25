const Team = require('../model/team');
const User = require('../model/user');
const { teamRegistrationSchema } = require('../validators/teamValidator');

// POST /api/teams/register
// Open endpoint — no JWT required.
// The team leader is identified by their email and looked up in the User collection.
const registerTeam = async (req, res) => {
  try {
    // 1. Validate request body with Zod
    const parseResult = teamRegistrationSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: parseResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { teamName, teamLeaderEmail, members } = parseResult.data;

    // 2. Look up the team leader in the User collection by email
    const leaderUser = await User.findOne({ email: teamLeaderEmail });

    if (!leaderUser) {
      return res.status(404).json({
        message: `No registered user found with email "${teamLeaderEmail}". The team leader must have an account first.`,
      });
    }

    // 3. Check if team name already exists
    const existingTeam = await Team.findOne({ teamName });

    if (existingTeam) {
      return res.status(409).json({
        message: `A team with the name "${teamName}" already exists. Please choose a different team name.`,
      });
    }

    // 4. Create and save the team — leader details come from MongoDB, not the client
    const newTeam = new Team({
      teamName,
      teamLeader: leaderUser.username,
      teamLeaderEmail: leaderUser.email,
      members,
    });

    await newTeam.save();

    // 5. Return success response
    return res.status(201).json({
      message: 'Team registered successfully.',
      team: {
        _id: newTeam._id,
        teamName: newTeam.teamName,
        teamLeader: newTeam.teamLeader,
        teamLeaderEmail: newTeam.teamLeaderEmail,
        members: newTeam.members,
        createdAt: newTeam.createdAt,
      },
    });

  } catch (error) {
    console.error('Team registration error:', error.message);

    return res.status(500).json({
      message: 'Server error during team registration.',
      error: error.message,
    });
  }
};

// GET /api/teams
// Admin only — requires valid JWT with role "admin"
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Teams retrieved successfully.',
      count: teams.length,
      teams,
    });

  } catch (error) {
    console.error('Get teams error:', error.message);

    return res.status(500).json({
      message: 'Server error while retrieving teams.',
      error: error.message,
    });
  }
};

module.exports = { registerTeam, getAllTeams };

const { z } = require('zod');

// Schema for a single member
const memberSchema = z.object({
  name: z.string({ required_error: 'Member name is required' }).min(1, 'Member name cannot be empty'),
  email: z.string({ required_error: 'Member email is required' }).email('Member email must be a valid email address'),
});

// Schema for team registration.
// teamLeaderEmail is used to look up the team leader in the User collection.
// teamLeader name is NOT sent by the client — it is pulled from MongoDB.
const teamRegistrationSchema = z.object({
  teamName: z
    .string({ required_error: 'Team name is required' })
    .min(1, 'Team name cannot be empty'),

  teamLeaderEmail: z
    .string({ required_error: 'Team leader email is required' })
    .email('Team leader email must be a valid email address'),

  members: z
    .array(memberSchema, { required_error: 'Members are required' })
    .min(1, 'At least one member is required'),
});

module.exports = { teamRegistrationSchema };

const express = require('express');
const router = express.Router();
const { registerTeam, getAllTeams } = require('../controllers/teamController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

// POST /api/teams/register
// Open endpoint — no JWT required. Uniqueness is enforced by name check + DB unique index.
router.post('/register', registerTeam);

// GET /api/teams
// Requires: valid JWT + role "admin"
router.get(
  '/',
  authenticateToken,
  authorizeRoles('admin'),
  getAllTeams
);

module.exports = router;

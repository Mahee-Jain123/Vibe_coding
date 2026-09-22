const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');

// POST /register -> /api/auth/register when mounted
router.post('/register', register);

module.exports = router;

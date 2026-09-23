const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /register -> /api/auth/register when mounted
router.post('/register', register);

// POST /login -> /api/auth/login when mounted
router.post('/login', login);

module.exports = router;

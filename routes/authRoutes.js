const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

const {
  authenticateToken
} = require('../middlewares/authMiddleware');

// POST /register -> /api/auth/register when mounted
router.post('/register', register);

// POST /login -> /api/auth/login when mounted
router.post('/login', login);

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({
    message: 'Authenticated successfully',
    user: req.user
  });
});

module.exports = router;

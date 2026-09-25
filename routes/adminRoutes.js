const express = require('express');

const router = express.Router();

const {
  authenticateToken,
  authorizeRoles
} = require('../middlewares/authMiddleware');

router.get(
  '/test',
  authenticateToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.status(200).json({
      message: 'Welcome Admin',
      user: req.user
    });
  }
);

module.exports = router;
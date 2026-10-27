const express = require('express');
const router = express.Router();
const { login, getMe, logout } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', protectAdmin, getMe);
router.post('/logout', protectAdmin, logout);

module.exports = router;

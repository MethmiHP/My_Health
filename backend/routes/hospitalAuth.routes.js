// routes/hospitalAuth.routes.js
const express = require('express');
const router = express.Router();
const { registerHospital, login, me } = require('../controllers/hospitalAuth.controller');
const auth = require('../middleware/authMiddleware');

// Public
router.post('/register', registerHospital);
router.post('/login', login);

// Private
router.get('/me', auth([]), me);

module.exports = router;

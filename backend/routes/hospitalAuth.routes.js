
// routes/hospitalAuth.routes.js
const express = require('express');
const router = express.Router();
const { registerHospital, login, me } = require('../controllers/hospitalAuth.controller');
const auth = require('../middleware/authMiddleware');

// -------------------- Hospital Auth Routes -------------------- //
// Public routes
router.post('/register', registerHospital);
router.post('/login', login);

// Private route
router.get('/me', auth([]), me);

module.exports = router;

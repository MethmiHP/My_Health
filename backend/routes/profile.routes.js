// routes/profile.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/profile.controller');

// allow any authenticated role
router.get('/me', auth([]), ctrl.me);

module.exports = router;

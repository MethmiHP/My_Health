const express = require('express');
const router = express.Router();
const { registerHospital, loginHospitalAdmin } = require('../controllers/hospitalAuth.controller');

// PUBLIC: Hospital self-registration (creates hospital + first admin)
router.post('/register', registerHospital);

// PUBLIC: Hospital admin login
router.post('/login', loginHospitalAdmin);

module.exports = router;

// routes/hospitalUsers.routes.js
const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createDoctor, createPatient, createCashier } = require('../controllers/hospitalUser.controller');

router.post('/doctor',  auth(['admin']), createDoctor);
router.post('/patient', auth(['admin']), createPatient);
router.post('/cashier', auth(['admin']), createCashier);

module.exports = router;




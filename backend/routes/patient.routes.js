
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const patientController = require('../controllers/patientController');

// Routes
router.get('/user/:userId', auth(['patient']), patientController.getPatientByUserId);
router.get('/', auth(['admin', 'reception', 'doctor']), patientController.getAllPatients);
router.get('/:id', auth(['admin', 'reception', 'doctor', 'patient']), patientController.getPatientById);
router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), patientController.updatePatient);
router.delete('/:id', auth(['admin']), patientController.deletePatient);
router.get('/barcode/:barcode', auth(['admin', 'reception', 'doctor']), patientController.getPatientByBarcode);

module.exports = router;
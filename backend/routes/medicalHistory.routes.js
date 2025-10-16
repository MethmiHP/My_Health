// routes/medicalHistory.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const medicalHistoryController = require('../controllers/medicalHistoryController');

// -------------------- ROUTES -------------------- //

// Get medical history
router.get('/patient/:userId', auth(['patient', 'doctor', 'admin']), medicalHistoryController.getMedicalHistory);

// Update medical history
router.put('/patient/:userId', auth(['doctor', 'admin']), medicalHistoryController.updateMedicalHistory);

// Add specific record
router.post('/patient/:userId/:recordType', auth(['doctor', 'admin']), medicalHistoryController.addMedicalRecord);

// Update specific record
router.put('/patient/:userId/:recordType/:recordId', auth(['doctor', 'admin']), medicalHistoryController.updateMedicalRecord);

// Delete specific record
router.delete('/patient/:userId/:recordType/:recordId', auth(['doctor', 'admin']), medicalHistoryController.deleteMedicalRecord);

module.exports = router;

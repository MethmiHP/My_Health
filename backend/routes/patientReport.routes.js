
// routes/patientReport.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const patientReportController = require('../controllers/patientReportController');

// Patient routes
router.post('/', auth(['patient']), patientReportController.createReport);
router.get('/my-reports', auth(['patient']), patientReportController.getMyReports);

// Doctor/Admin routes
router.get('/doctor', auth(['doctor', 'admin']), patientReportController.getDoctorReports);
router.put('/:reportId/respond', auth(['doctor', 'admin']), patientReportController.respondToReport);
router.put('/:reportId/read', auth(['doctor', 'admin']), patientReportController.markReportAsRead);

module.exports = router;



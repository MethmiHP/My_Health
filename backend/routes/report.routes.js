const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Import the entire controller module to avoid destructuring undefined
const reportCtrl = require('../controllers/reportController');

// Admin-only guard
const adminOnly = auth(['admin']);

// Optional sanity checks (remove after things work)
[
  'getReportSummary',
  'getDetailedReport',
  'saveReport',
  'getSavedReports',
  'addReportComment',
  'downloadReport',
  'scheduleReport',
  'deleteReport',
].forEach(fn =>
  typeof reportCtrl[fn] !== 'function' &&
  console.error(`[reports] ${fn} is not a function — check controllers/reportController.js`)
);


router.get('/download', adminOnly, reportCtrl.downloadReport);


// Routes
router.get('/summary',  adminOnly, reportCtrl.getReportSummary);
router.get('/detailed', adminOnly, reportCtrl.getDetailedReport);
router.post('/save',    adminOnly, reportCtrl.saveReport);
router.get('/saved',    adminOnly, reportCtrl.getSavedReports);
router.post('/:reportId/comment', adminOnly, reportCtrl.addReportComment);
router.get('/download', adminOnly, reportCtrl.downloadReport);
router.post('/schedule', adminOnly, reportCtrl.scheduleReport);
router.delete('/:reportId', adminOnly, reportCtrl.deleteReport);

// (If you also have update/getById/cancel, mount them too)
module.exports = router;

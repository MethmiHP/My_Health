// // routes/report.routes.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/authMiddleware');
// const {
//   getReportSummary,
//   getDetailedReport,
//   saveReport,
//   getSavedReports,
//   addReportComment,
//   downloadReport,
//   scheduleReport,
//   deleteReport
// } = require('../controllers/reportController');

// // All routes require admin/manager authentication
// const managerAuth = auth(['admin']);

// // @route   GET /api/reports/summary
// // @desc    Get comprehensive report summary with filters
// // @access  Private (Admin/Manager)
// // @query   startDate, endDate, department, doctorId, serviceType, compareWith
// router.get('/summary', managerAuth, getReportSummary);

// // @route   GET /api/reports/detailed
// // @desc    Get detailed drill-down report
// // @access  Private (Admin/Manager)
// // @query   type (doctor|department|service), id, startDate, endDate
// router.get('/detailed', managerAuth, getDetailedReport);

// // @route   POST /api/reports/save
// // @desc    Save report configuration and data
// // @access  Private (Admin/Manager)
// router.post('/save', managerAuth, saveReport);

// // @route   GET /api/reports/saved
// // @desc    Get list of saved reports
// // @access  Private (Admin/Manager)
// // @query   status, type, page, limit
// router.get('/saved', managerAuth, getSavedReports);

// // @route   POST /api/reports/:reportId/comment
// // @desc    Add comment to a report
// // @access  Private (Admin/Manager)
// router.post('/:reportId/comment', managerAuth, addReportComment);

// // @route   GET /api/reports/download
// // @desc    Download report as PDF or CSV
// // @access  Private (Admin/Manager)
// // @query   format (pdf|csv), startDate, endDate, department, doctorId
// router.get('/download', managerAuth, downloadReport);

// // @route   POST /api/reports/schedule
// // @desc    Schedule automatic report generation
// // @access  Private (Admin/Manager)
// // @body    reportId, frequency (daily|weekly|monthly), recipients[]
// router.post('/schedule', managerAuth, scheduleReport);

// // @route   DELETE /api/reports/:reportId
// // @desc    Delete a saved report
// // @access  Private (Admin/Manager)
// router.delete('/:reportId', managerAuth, deleteReport);

// module.exports = router;
// routes/report.routes.js
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

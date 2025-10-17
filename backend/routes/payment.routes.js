
const express = require('express');
const router = express.Router();
const {
  getPatientBillByNIC,
  processPayment,
  getPaymentReceipt,
  getPaymentHistory,
  refundPayment,
  voidPayment
} = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/payments/patient/nic/:nic
// @desc    Get patient and calculate bill by NIC
// @access  Private (Cashier only)
router.get('/patient/nic/:nic', auth(['cashier', 'admin']), getPatientBillByNIC);

// @route   POST /api/payments/process
// @desc    Process a payment
// @access  Private (Cashier only)
router.post('/process', auth(['cashier', 'admin']), processPayment);

// @route   GET /api/payments/receipt/:receiptNumber
// @desc    Get payment receipt
// @access  Private (Cashier only)
router.get('/receipt/:receiptNumber', auth(['cashier', 'admin']), getPaymentReceipt);

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private (Cashier only)
router.get('/history', auth(['cashier', 'admin']), getPaymentHistory);

// @route   POST /api/payments/refund/:receiptNumber
// @desc    Refund a payment
// @access  Private (Cashier only)
router.post('/refund/:receiptNumber', auth(['cashier', 'admin']), refundPayment);

// @route   POST /api/payments/void/:receiptNumber
// @desc    Void a payment
// @access  Private (Cashier only)
router.post('/void/:receiptNumber', auth(['cashier', 'admin']), voidPayment);

module.exports = router;



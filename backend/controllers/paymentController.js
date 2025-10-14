// const Payment = require("../models/paymentModel");
// const MedicalHistory = require("../models/medicalHistoryModel");
// const PatientProfile = require("../models/patientProfileModel");

// // Hard-coded medication prices
// const MEDICATION_PRICES = {
//   Paracetamol: 50,
//   Amoxicillin: 100,
//   Ibuprofen: 80,
//   Cetirizine: 60,
//   VitaminC: 40,
//   Azithromycin: 150,
//   Metformin: 120,
//   Atorvastatin: 200,
//   Omeprazole: 90,
//   Losartan: 110,
//   Panadol: 20,
//   Aspirin: 30,
//   Diclofenac: 70,
//   Lisinopril: 130,
//   Simvastatin: 140,
//   Insulin: 300,
// };

// // ✅ 1️⃣ Fetch medications & calculate bill
// exports.calculateBill = async (req, res) => {
//   try {
//     const { nic } = req.params;
//     if (!nic) return res.status(400).json({ message: "NIC is required" });

//     const patient = await PatientProfile.findOne({ nic: nic.trim() });
//     if (!patient)
//       return res.status(404).json({ message: "Patient not found for this NIC" });

//     // Try to fetch medical history
//     let history = await MedicalHistory.findOne({ userId: patient.userId });

//     // fallback if no history (use patient.medications if exists)
//     if (!history) {
//       history = { medications: (patient.medications || []).map((m) => ({ name: m })) };
//     }

//     const meds = history.medications || [];
//     let total = 0;
//     meds.forEach((m) => (total += MEDICATION_PRICES[m.name] || 0));

//     return res.json({
//       patientId: patient._id,
//       patientName: `${patient.firstName} ${patient.lastName}`,
//       medications: meds,
//       total,
//       priceList: MEDICATION_PRICES,
//     });
//   } catch (err) {
//     console.error("calculateBill error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ 2️⃣ Make payment
// exports.makePayment = async (req, res) => {
//   try {
//     const { visitId, patientId, method, amount, note } = req.body;
//     if (!visitId || !patientId || !method || !amount)
//       return res.status(400).json({ message: "Missing required fields" });

//     const cashierId = req.user?.sub || req.user?._id || "unknown";

//     const payment = new Payment({
//       visitId,
//       patientId,
//       cashierId,
//       method,
//       amount,
//       note,
//       status: "paid",
//     });

//     await payment.save();
//     res.status(201).json({
//       message: "Payment successful",
//       payment,
//     });
//   } catch (err) {
//     console.error("makePayment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ 3️⃣ Refund payment
// exports.refundPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await Payment.findById(paymentId);
//     if (!payment)
//       return res.status(404).json({ message: "Payment not found" });

//     payment.status = "refunded";
//     await payment.save();

//     res.json({ message: "Payment refunded successfully", payment });
//   } catch (err) {
//     console.error("refundPayment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ 4️⃣ Void payment
// exports.voidPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await Payment.findById(paymentId);
//     if (!payment)
//       return res.status(404).json({ message: "Payment not found" });

//     payment.status = "void";
//     await payment.save();

//     res.json({ message: "Payment voided successfully", payment });
//   } catch (err) {
//     console.error("voidPayment error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ============================================
// // 3. PAYMENT CONTROLLER (controllers/paymentController.js)
// // ============================================
// const Payment = require('../models/paymentModel');
// const PatientProfile = require('../models/patientProfileModel');
// const User = require('../models/userModel');
// const { calculateMedicationBill } = require('../utils/medicationPrices');

// // Get patient by NIC and calculate bill
// exports.getPatientBillByNIC = async (req, res) => {
//   try {
//     const { nic } = req.params;
//     const hospitalId = req.user?.hospitalId;

//     if (!hospitalId) {
//       return res.status(400).json({ message: 'Hospital context required' });
//     }

//     // Find patient by NIC
//     const patient = await PatientProfile.findOne({ 
//       nic, 
//       hospitalId 
//     }).populate('userId', 'firstName lastName email phone');

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found with this NIC' });
//     }

//     // Check if patient has medications
//     if (!patient.medications || patient.medications.length === 0) {
//       return res.status(404).json({ 
//         message: 'No medications found for this patient',
//         patient: {
//           _id: patient._id,
//           name: `${patient.userId.firstName} ${patient.userId.lastName}`,
//           nic: patient.nic,
//           barcode: patient.barcode
//         }
//       });
//     }

//     // Calculate bill
//     const bill = calculateMedicationBill(patient.medications);

//     res.status(200).json({
//       success: true,
//       patient: {
//         _id: patient._id,
//         userId: patient.userId._id,
//         name: `${patient.userId.firstName} ${patient.userId.lastName}`,
//         email: patient.userId.email,
//         phone: patient.userId.phone,
//         nic: patient.nic,
//         barcode: patient.barcode,
//         bloodGroup: patient.bloodGroup,
//         medications: patient.medications
//       },
//       bill: {
//         medications: bill.items,
//         subtotal: bill.subtotal,
//         tax: bill.tax,
//         discount: bill.discount,
//         totalAmount: bill.total
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching patient bill:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while fetching patient bill',
//       error: error.message 
//     });
//   }
// };

// // Process payment
// exports.processPayment = async (req, res) => {
//   try {
//     const {
//       patientId,
//       userId,
//       medications,
//       paymentMethod,
//       paymentDetails,
//       receiptDelivery,
//       notes
//     } = req.body;

//     const hospitalId = req.user?.hospitalId;
//     const cashierId = req.user?.sub;

//     if (!hospitalId || !cashierId) {
//       return res.status(400).json({ message: 'Hospital and cashier context required' });
//     }

//     // Validate required fields
//     if (!patientId || !userId || !medications || !paymentMethod) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Calculate bill
//     const bill = calculateMedicationBill(medications);

//     if (bill.items.length === 0) {
//       return res.status(400).json({ message: 'No valid medications to bill' });
//     }

//     // Generate visit ID
//     const visitId = `VST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

//     // Create payment record
//     const payment = new Payment({
//       patientId,
//       userId,
//       hospitalId,
//       visitId,
//       cashierId,
//       medications: bill.items,
//       subtotal: bill.subtotal,
//       tax: bill.tax,
//       discount: bill.discount,
//       totalAmount: bill.total,
//       paymentMethod,
//       paymentDetails: paymentDetails || {},
//       paymentStatus: 'completed',
//       receiptDelivery: receiptDelivery || { print: true },
//       notes
//     });

//     await payment.save();

//     // Populate cashier info
//     await payment.populate('cashierId', 'firstName lastName');

//     res.status(201).json({
//       success: true,
//       message: 'Payment processed successfully',
//       payment: {
//         _id: payment._id,
//         receiptNumber: payment.receiptNumber,
//         visitId: payment.visitId,
//         totalAmount: payment.totalAmount,
//         paymentMethod: payment.paymentMethod,
//         paymentStatus: payment.paymentStatus,
//         medications: payment.medications,
//         cashier: payment.cashierId,
//         createdAt: payment.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('Error processing payment:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while processing payment',
//       error: error.message 
//     });
//   }
// };

// // Get payment receipt
// exports.getPaymentReceipt = async (req, res) => {
//   try {
//     const { receiptNumber } = req.params;
//     const hospitalId = req.user?.hospitalId;

//     const payment = await Payment.findOne({ 
//       receiptNumber, 
//       hospitalId 
//     })
//     .populate('patientId')
//     .populate('userId', 'firstName lastName email phone')
//     .populate('cashierId', 'firstName lastName');

//     if (!payment) {
//       return res.status(404).json({ message: 'Receipt not found' });
//     }

//     res.status(200).json({
//       success: true,
//       receipt: payment
//     });

//   } catch (error) {
//     console.error('Error fetching receipt:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while fetching receipt',
//       error: error.message 
//     });
//   }
// };

// // Get payment history (for cashier)
// exports.getPaymentHistory = async (req, res) => {
//   try {
//     const hospitalId = req.user?.hospitalId;
//     const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

//     const query = { hospitalId };

//     if (status) {
//       query.paymentStatus = status;
//     }

//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     const payments = await Payment.find(query)
//       .populate('userId', 'firstName lastName')
//       .populate('cashierId', 'firstName lastName')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const totalPayments = await Payment.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       payments,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalPayments / limit),
//         totalPayments
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching payment history:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while fetching payment history',
//       error: error.message 
//     });
//   }
// };

// // Refund payment
// exports.refundPayment = async (req, res) => {
//   try {
//     const { receiptNumber } = req.params;
//     const { refundAmount, refundReason } = req.body;
//     const hospitalId = req.user?.hospitalId;
//     const cashierId = req.user?.sub;

//     const payment = await Payment.findOne({ receiptNumber, hospitalId });

//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     if (payment.paymentStatus === 'refunded') {
//       return res.status(400).json({ message: 'Payment already refunded' });
//     }

//     if (refundAmount > payment.totalAmount) {
//       return res.status(400).json({ message: 'Refund amount cannot exceed payment amount' });
//     }

//     payment.refundAmount = refundAmount;
//     payment.refundReason = refundReason;
//     payment.refundDate = new Date();
//     payment.refundBy = cashierId;
//     payment.paymentStatus = 'refunded';

//     await payment.save();

//     res.status(200).json({
//       success: true,
//       message: 'Payment refunded successfully',
//       payment
//     });

//   } catch (error) {
//     console.error('Error refunding payment:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while refunding payment',
//       error: error.message 
//     });
//   }
// };

// // Void payment
// exports.voidPayment = async (req, res) => {
//   try {
//     const { receiptNumber } = req.params;
//     const { voidReason } = req.body;
//     const hospitalId = req.user?.hospitalId;
//     const cashierId = req.user?.sub;

//     const payment = await Payment.findOne({ receiptNumber, hospitalId });

//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     if (payment.paymentStatus === 'void') {
//       return res.status(400).json({ message: 'Payment already voided' });
//     }

//     payment.voidReason = voidReason;
//     payment.voidDate = new Date();
//     payment.voidBy = cashierId;
//     payment.paymentStatus = 'void';

//     await payment.save();

//     res.status(200).json({
//       success: true,
//       message: 'Payment voided successfully',
//       payment
//     });

//   } catch (error) {
//     console.error('Error voiding payment:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error while voiding payment',
//       error: error.message 
//     });
//   }
// };


// // controllers/paymentController.js
// const Payment = require('../models/paymentModel');
// const PatientProfile = require('../models/patientProfileModel');
// const User = require('../models/userModel');
// const { calculateMedicationBill } = require('../utils/medicationPrices');

// // Get patient by NIC and calculate bill
// exports.getPatientBillByNIC = async (req, res) => {
//   try {
//     const { nic } = req.params;
//     const hospitalId = req.user?.hospitalId;

//     if (!hospitalId) {
//       return res.status(400).json({ message: 'Hospital context required' });
//     }

//     const patient = await PatientProfile.findOne({
//       nic,
//       hospitalId
//     }).populate('userId', 'firstName lastName email phone');

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found with this NIC' });
//     }

//     if (!patient.medications || patient.medications.length === 0) {
//       return res.status(404).json({
//         message: 'No medications found for this patient',
//         patient: {
//           _id: patient._id,
//           name: `${patient.userId.firstName} ${patient.userId.lastName}`,
//           nic: patient.nic,
//           barcode: patient.barcode
//         }
//       });
//     }

//     const bill = calculateMedicationBill(patient.medications);

//     res.status(200).json({
//       success: true,
//       patient: {
//         _id: patient._id,
//         userId: patient.userId._id,
//         name: `${patient.userId.firstName} ${patient.userId.lastName}`,
//         email: patient.userId.email,
//         phone: patient.userId.phone,
//         nic: patient.nic,
//         barcode: patient.barcode,
//         bloodGroup: patient.bloodGroup,
//         medications: patient.medications
//       },
//       bill: {
//         medications: bill.items,
//         subtotal: bill.subtotal,
//         tax: bill.tax,
//         discount: bill.discount,
//         totalAmount: bill.total
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching patient bill:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching patient bill',
//       error: error.message
//     });
//   }
// };

// // Process payment
// exports.processPayment = async (req, res) => {
//   try {
//     const {
//       patientId,
//       userId,
//       medications,
//       paymentMethod,
//       paymentDetails,
//       receiptDelivery,
//       notes
//     } = req.body;

//     const hospitalId = req.user?.hospitalId;
//     const cashierId = req.user?.sub;

//     if (!hospitalId || !cashierId) {
//       return res.status(400).json({ message: 'Hospital and cashier context required' });
//     }

//     if (!patientId || !userId || !medications || !paymentMethod) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Validate insurance payment details
//     if (paymentMethod === 'insurance') {
//       if (!paymentDetails?.insuranceName || !paymentDetails?.insuranceLocation || !paymentDetails?.insuranceAmount) {
//         return res.status(400).json({ 
//           message: 'Insurance name, location, and amount are required for insurance payments' 
//         });
//       }
//       if (paymentDetails.insuranceAmount <= 0) {
//         return res.status(400).json({ message: 'Insurance amount must be greater than 0' });
//       }
//     }

//     const bill = calculateMedicationBill(medications);

//     if (bill.items.length === 0) {
//       return res.status(400).json({ message: 'No valid medications to bill' });
//     }

//     const visitId = `VST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

//     // Generate insurance claim number if insurance payment
//     if (paymentMethod === 'insurance' && !paymentDetails.insuranceClaimNumber) {
//       const claimCount = await Payment.countDocuments({ paymentMethod: 'insurance' });
//       paymentDetails.insuranceClaimNumber = `INS-${Date.now()}-${String(claimCount + 1).padStart(5, '0')}`;
//     }

//     // Set payment status based on payment method
//     const paymentStatus = paymentMethod === 'insurance' ? 'pending' : 'completed';

//     const payment = new Payment({
//       patientId,
//       userId,
//       hospitalId,
//       visitId,
//       cashierId,
//       medications: bill.items,
//       subtotal: bill.subtotal,
//       tax: bill.tax,
//       discount: bill.discount,
//       totalAmount: bill.total,
//       paymentMethod,
//       paymentDetails: paymentDetails || {},
//       paymentStatus,
//       receiptDelivery: receiptDelivery || { print: true },
//       notes
//     });

//     await payment.save();
//     await payment.populate('cashierId', 'firstName lastName');

//     res.status(201).json({
//       success: true,
//       message: paymentMethod === 'insurance' 
//         ? 'Insurance claim submitted successfully' 
//         : 'Payment processed successfully',
//       payment: {
//         _id: payment._id,
//         receiptNumber: payment.receiptNumber,
//         visitId: payment.visitId,
//         totalAmount: payment.totalAmount,
//         paymentMethod: payment.paymentMethod,
//         paymentStatus: payment.paymentStatus,
//         medications: payment.medications,
//         cashier: payment.cashierId,
//         createdAt: payment.createdAt,
//         insuranceClaimNumber: paymentDetails?.insuranceClaimNumber
//       }
//     });
//   } catch (error) {
//     console.error('Error processing payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while processing payment',
//       error: error.message
//     });
//   }
// };

// // Get payment receipt
// exports.getPaymentReceipt = async (req, res) => {
//   try {
//     const { receiptNumber } = req.params;
//     const hospitalId = req.user?.hospitalId;

//     const payment = await Payment.findOne({
//       receiptNumber,
//       hospitalId
//     })
//     .populate('patientId')
//     .populate('userId', 'firstName lastName email phone')
//     .populate('cashierId', 'firstName lastName');

//     if (!payment) {
//       return res.status(404).json({ message: 'Receipt not found' });
//     }

//     res.status(200).json({
//       success: true,
//       receipt: payment
//     });
//   } catch (error) {
//     console.error('Error fetching receipt:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching receipt',
//       error: error.message
//     });
//   }
// };

// // Get payment history
// exports.getPaymentHistory = async (req, res) => {
//   try {
//     const hospitalId = req.user?.hospitalId;
//     const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

//     const query = { hospitalId };

//     if (status) {
//       query.paymentStatus = status;
//     }

//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     const payments = await Payment.find(query)
//       .populate('userId', 'firstName lastName')
//       .populate('cashierId', 'firstName lastName')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const totalPayments = await Payment.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       payments,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalPayments / limit),
//         totalPayments
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching payment history:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching payment history',
//       error: error.message
//     });
//   }
// };

// // Refund payment
// exports.refundPayment = async (req, res) => {
//   try {
//     const { receiptNumber } = req.params;
//     const { refundAmount, refundReason } = req.body;
//     const hospitalId = req.user?.hospitalId;
//     const cashierId = req.user?.sub;

//     const payment = await Payment.findOne({ receiptNumber, hospitalId });

//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     if (payment.paymentStatus === 'refunded') {
//       return res.status(400).json({ message: 'Payment already refunded' });
//     }

//     if (refundAmount > payment.totalAmount) {
//       return res.status(400).json({ message: 'Refund amount cannot exceed payment amount' });
//     }

//     payment.refundAmount = refundAmount;
//     payment.refundReason = refundReason;
//     payment.refundDate = new Date();
//     payment.refundBy = cashierId;
//     payment.paymentStatus = 'refunded';

//     await payment.save();

//     res.status(200).json({
//       success: true,
//       message: 'Payment refunded successfully',
//       payment
//     });
//   } catch (error) {
//     console.error('Error refunding payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while refunding payment',
//       error: error.message
//     });
//   }
// };

// // Void payment
// exports.voidPayment = async (req, res) => {
//   try {
//     const { receiptNumber } = req.params;
//     const { voidReason } = req.body;
//     const hospitalId = req.user?.hospitalId;
//     const cashierId = req.user?.sub;

//     const payment = await Payment.findOne({ receiptNumber, hospitalId });

//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     if (payment.paymentStatus === 'void') {
//       return res.status(400).json({ message: 'Payment already voided' });
//     }

//     payment.voidReason = voidReason;
//     payment.voidDate = new Date();
//     payment.voidBy = cashierId;
//     payment.paymentStatus = 'void';

//     await payment.save();

//     res.status(200).json({
//       success: true,
//       message: 'Payment voided successfully',
//       payment
//     });
//   } catch (error) {
//     console.error('Error voiding payment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while voiding payment',
//       error: error.message
//     });
//   }
// };


// backend/controllers/paymentController.js - UPDATED VERSION

const Payment = require('../models/paymentModel');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel'); // Add this import
const { calculateMedicationBill } = require('../utils/medicationPrices');

// Get patient by NIC and calculate bill
exports.getPatientBillByNIC = async (req, res) => {
  try {
    const { nic } = req.params;
    const hospitalId = req.user?.hospitalId;

    if (!hospitalId) {
      return res.status(400).json({ message: 'Hospital context required' });
    }

    const patient = await PatientProfile.findOne({
      nic,
      hospitalId
    }).populate('userId', 'firstName lastName email phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found with this NIC' });
    }

    // Extract medications
    const medications = patient.medications || [];
    
    // Extract surgeries and procedures from patient profile
    const surgeries = [];
    const procedures = [];
    
    if (patient.surgeries && Array.isArray(patient.surgeries)) {
      patient.surgeries.forEach(item => {
        if (item.type === 'surgery') {
          surgeries.push(item.name);
        } else if (item.type === 'scan' || item.type === 'procedure' || item.type === 'treatment') {
          procedures.push(item.name);
        }
      });
    }

    // Get appointment fee (if there's an active appointment)
    let appointmentFee = 0;
    try {
      const recentAppointment = await Appointment.findOne({
        patientId: patient.userId._id,
        status: { $in: ['scheduled', 'confirmed', 'completed'] },
        slotStart: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      }).populate('doctorId', 'firstName lastName appointmentFee').sort({ slotStart: -1 });

      if (recentAppointment && recentAppointment.doctorId?.appointmentFee) {
        appointmentFee = recentAppointment.doctorId.appointmentFee;
      }
    } catch (error) {
      console.log('No recent appointment found or error fetching:', error.message);
    }

    // Check if there's anything to bill
    if (medications.length === 0 && surgeries.length === 0 && procedures.length === 0 && appointmentFee === 0) {
      return res.status(404).json({
        message: 'No medications, surgeries, procedures, or appointments found for this patient',
        patient: {
          _id: patient._id,
          name: `${patient.userId.firstName} ${patient.userId.lastName}`,
          nic: patient.nic,
          barcode: patient.barcode
        }
      });
    }

    // Calculate comprehensive bill
    const bill = calculateMedicationBill(medications, surgeries, procedures, appointmentFee);

    res.status(200).json({
      success: true,
      patient: {
        _id: patient._id,
        userId: patient.userId._id,
        name: `${patient.userId.firstName} ${patient.userId.lastName}`,
        email: patient.userId.email,
        phone: patient.userId.phone,
        nic: patient.nic,
        barcode: patient.barcode,
        bloodGroup: patient.bloodGroup,
        medications: patient.medications,
        surgeries: surgeries,
        procedures: procedures
      },
      bill: {
        items: bill.items, // Contains medications, surgeries, procedures, and appointment fee
        subtotal: bill.subtotal,
        tax: bill.tax,
        discount: bill.discount,
        totalAmount: bill.total
      }
    });

  } catch (error) {
    console.error('Error fetching patient bill:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching patient bill',
      error: error.message
    });
  }
};

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const {
      patientId,
      userId,
      medications,
      surgeries,
      procedures,
      appointmentFee,
      paymentMethod,
      paymentDetails,
      receiptDelivery,
      notes
    } = req.body;

    const hospitalId = req.user?.hospitalId;
    const cashierId = req.user?.sub;

    if (!hospitalId || !cashierId) {
      return res.status(400).json({ message: 'Hospital and cashier context required' });
    }

    if (!patientId || !userId || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate insurance payment details
    if (paymentMethod === 'insurance') {
      if (!paymentDetails?.insuranceName || !paymentDetails?.insuranceLocation || !paymentDetails?.insuranceAmount) {
        return res.status(400).json({
          message: 'Insurance name, location, and amount are required for insurance payments'
        });
      }

      if (paymentDetails.insuranceAmount <= 0) {
        return res.status(400).json({ message: 'Insurance amount must be greater than 0' });
      }
    }

    // Calculate comprehensive bill
    const bill = calculateMedicationBill(
      medications || [],
      surgeries || [],
      procedures || [],
      appointmentFee || 0
    );

    if (bill.items.length === 0) {
      return res.status(400).json({ message: 'No items to bill' });
    }

    const visitId = `VST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Generate insurance claim number if insurance payment
    if (paymentMethod === 'insurance' && !paymentDetails.insuranceClaimNumber) {
      const claimCount = await Payment.countDocuments({ paymentMethod: 'insurance' });
      paymentDetails.insuranceClaimNumber = `INS-${Date.now()}-${String(claimCount + 1).padStart(5, '0')}`;
    }

    // Set payment status based on payment method
    const paymentStatus = paymentMethod === 'insurance' ? 'pending' : 'completed';

    const payment = new Payment({
      patientId,
      userId,
      hospitalId,
      visitId,
      cashierId,
      medications: bill.items.filter(item => item.type === 'medication'),
      surgeries: bill.items.filter(item => item.type === 'surgery'),
      procedures: bill.items.filter(item => item.type === 'procedure'),
      appointmentFee: bill.items.find(item => item.type === 'appointment')?.totalPrice || 0,
      subtotal: bill.subtotal,
      tax: bill.tax,
      discount: bill.discount,
      totalAmount: bill.total,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      paymentStatus,
      receiptDelivery: receiptDelivery || { print: true },
      notes
    });

    await payment.save();
    await payment.populate('cashierId', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: paymentMethod === 'insurance'
        ? 'Insurance claim submitted successfully'
        : 'Payment processed successfully',
      payment: {
        _id: payment._id,
        receiptNumber: payment.receiptNumber,
        visitId: payment.visitId,
        totalAmount: payment.totalAmount,
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        medications: payment.medications,
        surgeries: payment.surgeries,
        procedures: payment.procedures,
        appointmentFee: payment.appointmentFee,
        cashier: payment.cashierId,
        createdAt: payment.createdAt,
        insuranceClaimNumber: paymentDetails?.insuranceClaimNumber
      }
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing payment',
      error: error.message
    });
  }
};

// Get payment receipt
exports.getPaymentReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const hospitalId = req.user?.hospitalId;

    const payment = await Payment.findOne({
      receiptNumber,
      hospitalId
    })
    .populate('patientId')
    .populate('userId', 'firstName lastName email phone')
    .populate('cashierId', 'firstName lastName');

    if (!payment) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.status(200).json({
      success: true,
      receipt: payment
    });

  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching receipt',
      error: error.message
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const hospitalId = req.user?.hospitalId;
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = { hospitalId };

    if (status) {
      query.paymentStatus = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('userId', 'firstName lastName')
      .populate('cashierId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalPayments = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPayments / limit),
        totalPayments
      }
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history',
      error: error.message
    });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const { refundAmount, refundReason } = req.body;
    const hospitalId = req.user?.hospitalId;
    const cashierId = req.user?.sub;

    const payment = await Payment.findOne({ receiptNumber, hospitalId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentStatus === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    if (refundAmount > payment.totalAmount) {
      return res.status(400).json({ message: 'Refund amount cannot exceed payment amount' });
    }

    payment.refundAmount = refundAmount;
    payment.refundReason = refundReason;
    payment.refundDate = new Date();
    payment.refundBy = cashierId;
    payment.paymentStatus = 'refunded';

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      payment
    });

  } catch (error) {
    console.error('Error refunding payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while refunding payment',
      error: error.message
    });
  }
};

// Void payment
exports.voidPayment = async (req, res) => {
  try {
    const { receiptNumber } = req.params;
    const { voidReason } = req.body;
    const hospitalId = req.user?.hospitalId;
    const cashierId = req.user?.sub;

    const payment = await Payment.findOne({ receiptNumber, hospitalId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentStatus === 'void') {
      return res.status(400).json({ message: 'Payment already voided' });
    }

    payment.voidReason = voidReason;
    payment.voidDate = new Date();
    payment.voidBy = cashierId;
    payment.paymentStatus = 'void';

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment voided successfully',
      payment
    });

  } catch (error) {
    console.error('Error voiding payment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while voiding payment',
      error: error.message
    });
  }
};
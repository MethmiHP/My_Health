// // // controllers/reportController.js
// // const mongoose = require('mongoose');
// // const { Types } = mongoose;

// // const Report = require('../models/reportModel');
// // const Appointment = require('../models/appointmentModel');
// // const Payment = require('../models/paymentModel');
// // const PatientProfile = require('../models/patientProfileModel');
// // const PatientReport = require('../models/patientReportModel');
// // const DoctorProfile = require('../models/doctorProfileModel');
// // const User = require('../models/userModel');
// // const Hospital = require('../models/hospitalModel');
// // const PDFDocument = require('pdfkit');
// // const { Parser } = require('json2csv');
// // const cron = require('node-cron');

// // // Helper to get hospital ID from request
// // const getHospitalId = (req) => req.user?.hospitalId;

// // // Store active cron schedules
// // const activeSchedules = new Map();

// // // ============================================
// // // 1. GET REPORT SUMMARY (Main Analytics Dashboard)
// // // ============================================
// // exports.getReportSummary = async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     if (!hospitalId) {
// //       return res.status(400).json({ message: 'Hospital context required' });
// //     }

// //     // Cast for aggregations
// //     const hid = Types.ObjectId.isValid(hospitalId) ? new Types.ObjectId(hospitalId) : hospitalId;

// //     const {
// //       startDate,
// //       endDate,
// //       department,
// //       doctorId,
// //       serviceType,
// //       compareWith // 'week', 'month', 'year'
// //     } = req.query;

// //     // Build date filter
// //     const dateFilter = {};
// //     if (startDate) dateFilter.$gte = new Date(startDate);
// //     if (endDate) dateFilter.$lte = new Date(endDate);

// //     // Calculate comparison period if requested
// //     let comparisonDateFilter = null;
// //     if (compareWith && startDate && endDate) {
// //       const start = new Date(startDate);
// //       const end = new Date(endDate);
// //       const diff = end - start;
      
// //       const compStart = new Date(start.getTime() - diff);
// //       const compEnd = new Date(start.getTime());
      
// //       comparisonDateFilter = {
// //         $gte: compStart,
// //         $lte: compEnd
// //       };
// //     }

// //     // ==================== APPOINTMENTS ANALYTICS ====================
// //     const appointmentQuery = { hospitalId : hid };
// //     if (Object.keys(dateFilter).length > 0) {
// //       appointmentQuery.slotStart = dateFilter;
// //     }
// //     if (doctorId) appointmentQuery.doctorId = doctorId;

// //     const [appointmentStats, appointmentsByStatus, appointmentsByDay, appointmentsByChannel] = await Promise.all([
// //       // Total appointments with status breakdown
// //       Appointment.aggregate([
// //         { $match: appointmentQuery },
// //         {
// //           $group: {
// //             _id: null,
// //             total: { $sum: 1 },
// //             booked: { $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] } },
// //             completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
// //             cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
// //             noShow: { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } }
// //           }
// //         }
// //       ]),
      
// //       // Appointments grouped by status
// //       Appointment.aggregate([
// //         { $match: appointmentQuery },
// //         { 
// //           $group: { 
// //             _id: '$status', 
// //             count: { $sum: 1 } 
// //           } 
// //         },
// //         { $sort: { count: -1 } }
// //       ]),
      
// //       // Appointments by day (for line chart)
// //       Appointment.aggregate([
// //         { $match: appointmentQuery },
// //         {
// //           $group: {
// //             _id: { $dateToString: { format: '%Y-%m-%d', date: '$slotStart' } },
// //             count: { $sum: 1 }
// //           }
// //         },
// //         { $sort: { _id: 1 } },
// //         { $limit: 30 }
// //       ]),

// //       // Appointments by channel (patient vs reception)
// //       Appointment.aggregate([
// //         { $match: appointmentQuery },
// //         {
// //           $group: {
// //             _id: '$channel',
// //             count: { $sum: 1 }
// //           }
// //         }
// //       ])
// //     ]);

// //     // ==================== PAYMENT/REVENUE ANALYTICS ====================
// //     const paymentQuery = { hospitalId : hid, paymentStatus: 'completed' };
// //     if (Object.keys(dateFilter).length > 0) {
// //       paymentQuery.createdAt = dateFilter;
// //     }

// //     const [paymentStats, paymentsByMethod, dailyRevenue, revenueByService] = await Promise.all([
// //       // Total revenue and transaction stats
// //       Payment.aggregate([
// //         { $match: paymentQuery },
// //         {
// //           $group: {
// //             _id: null,
// //             totalRevenue: { $sum: '$totalAmount' },
// //             totalTransactions: { $sum: 1 },
// //             avgTransaction: { $avg: '$totalAmount' },
// //             totalTax: { $sum: '$tax' },
// //             totalDiscount: { $sum: '$discount' },
// //             totalRefunded: { 
// //               $sum: { 
// //                 $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$totalAmount', 0] 
// //               } 
// //             }
// //           }
// //         }
// //       ]),
      
// //       // Revenue breakdown by payment method
// //       Payment.aggregate([
// //         { $match: paymentQuery },
// //         {
// //           $group: {
// //             _id: '$paymentMethod',
// //             total: { $sum: '$totalAmount' },
// //             count: { $sum: 1 },
// //             avgAmount: { $avg: '$totalAmount' }
// //           }
// //         },
// //         { $sort: { total: -1 } }
// //       ]),
      
// //       // Daily revenue trend (for line chart)
// //       Payment.aggregate([
// //         { $match: paymentQuery },
// //         {
// //           $group: {
// //             _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
// //             revenue: { $sum: '$totalAmount' },
// //             transactions: { $sum: 1 }
// //           }
// //         },
// //         { $sort: { _id: 1 } },
// //         { $limit: 30 }
// //       ]),

// //       // Revenue by service type (medications, surgeries, procedures)
// //       Payment.aggregate([
// //         { $match: paymentQuery },
// //         {
// //           $project: {
// //             medicationRevenue: {
// //               $sum: {
// //                 $map: {
// //                   input: { $ifNull: ['$medications', []] },
// //                   as: 'med',
// //                   in: '$$med.totalPrice'
// //                 }
// //               }
// //             },
// //             surgeryRevenue: {
// //               $sum: {
// //                 $map: {
// //                   input: { $ifNull: ['$surgeries', []] },
// //                   as: 'surg',
// //                   in: '$$surg.totalPrice'
// //                 }
// //               }
// //             },
// //             procedureRevenue: {
// //               $sum: {
// //                 $map: {
// //                   input: { $ifNull: ['$procedures', []] },
// //                   as: 'proc',
// //                   in: '$$proc.totalPrice'
// //                 }
// //               }
// //             },
// //             appointmentFee: '$appointmentFee'
// //           }
// //         },
// //         {
// //           $group: {
// //             _id: null,
// //             medications: { $sum: '$medicationRevenue' },
// //             surgeries: { $sum: '$surgeryRevenue' },
// //             procedures: { $sum: '$procedureRevenue' },
// //             appointments: { $sum: '$appointmentFee' }
// //           }
// //         }
// //       ])
// //     ]);

// //     // ==================== PATIENT ANALYTICS ====================
// //     const patientStats = await PatientProfile.aggregate([
// //       { $match: { hospitalId : hid } },
// //       {
// //         $group: {
// //           _id: null,
// //           total: { $sum: 1 },
// //           maleCount: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
// //           femaleCount: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
// //           otherCount: { $sum: { $cond: [{ $eq: ['$gender', 'other'] }, 1, 0] } },
// //           withInsurance: { 
// //             $sum: { 
// //               $cond: [
// //                 { $and: [
// //                   { $ne: ['$insurance.provider', null] },
// //                   { $ne: ['$insurance.provider', ''] }
// //                 ]},
// //                 1,
// //                 0
// //               ] 
// //             } 
// //           },
// //           withAllergies: {
// //             $sum: {
// //               $cond: [
// //                 { $gt: [{ $size: { $ifNull: ['$allergies', []] } }, 0] },
// //                 1,
// //                 0
// //               ]
// //             }
// //           }
// //         }
// //       }
// //     ]);

// //     // Patient age distribution
// //     const patientAgeDistribution = await PatientProfile.aggregate([
// //       { $match: { hospitalId : hid } },
// //       {
// //         $project: {
// //           age: {
// //             $floor: {
// //               $divide: [
// //                 { $subtract: [new Date(), '$dob'] },
// //                 1000 * 60 * 60 * 24 * 365.25
// //               ]
// //             }
// //           }
// //         }
// //       },
// //       {
// //         $bucket: {
// //           groupBy: '$age',
// //           boundaries: [0, 18, 30, 45, 60, 75, 100],
// //           default: 'Other',
// //           output: {
// //             count: { $sum: 1 }
// //           }
// //         }
// //       }
// //     ]);

// //     // ==================== DOCTOR ANALYTICS ====================
// //     const doctorQuery = { hospitalId };
// //     if (department) doctorQuery.specialties = { $in: [department] };

// //     const [doctorCount, topDoctors, doctorsBySpecialty] = await Promise.all([
// //       DoctorProfile.countDocuments(doctorQuery),
      
// //       // Top doctors by appointment count
// //       Appointment.aggregate([
// //         { $match: appointmentQuery },
// //         { $group: { _id: '$doctorId', appointmentCount: { $sum: 1 } } },
// //         { $sort: { appointmentCount: -1 } },
// //         { $limit: 10 },
// //         {
// //           $lookup: {
// //             from: 'users',
// //             localField: '_id',
// //             foreignField: '_id',
// //             as: 'doctor'
// //           }
// //         },
// //         { $unwind: '$doctor' },
// //         {
// //           $lookup: {
// //             from: 'doctorprofiles',
// //             localField: '_id',
// //             foreignField: 'userId',
// //             as: 'profile'
// //           }
// //         },
// //         { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
// //         {
// //           $project: {
// //             doctorId: '$_id',
// //             name: { $concat: ['$doctor.firstName', ' ', '$doctor.lastName'] },
// //             specialty: { $arrayElemAt: ['$profile.specialties', 0] },
// //             appointmentCount: 1
// //           }
// //         }
// //       ]),

// //       // Doctors grouped by specialty
// //       DoctorProfile.aggregate([
// //         { $match: doctorQuery },
// //         { $unwind: '$specialties' },
// //         {
// //           $group: {
// //             _id: '$specialties',
// //             count: { $sum: 1 }
// //           }
// //         },
// //         { $sort: { count: -1 } }
// //       ])
// //     ]);

// //     // ==================== PATIENT REPORTS ANALYTICS ====================
// //     const patientReportQuery = { hospitalId : hid };
// //     if (Object.keys(dateFilter).length > 0) {
// //       patientReportQuery.createdAt = dateFilter;
// //     }

// //     const patientReportStats = await PatientReport.aggregate([
// //       { $match: patientReportQuery },
// //       {
// //         $group: {
// //           _id: null,
// //           total: { $sum: 1 },
// //           newReports: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
// //           readReports: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
// //           respondedReports: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
// //           highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } }
// //         }
// //       }
// //     ]);

// //     // ==================== COMPARISON DATA ====================
// //     let comparisonData = null;
// //     if (comparisonDateFilter) {
// //       const [compAppointments, compPayments] = await Promise.all([
// //         Appointment.countDocuments({ 
// //           ...appointmentQuery, 
// //           slotStart: comparisonDateFilter 
// //         }),
// //         Payment.aggregate([
// //           { 
// //             $match: { 
// //               ...paymentQuery, 
// //               createdAt: comparisonDateFilter 
// //             } 
// //           },
// //           { 
// //             $group: { 
// //               _id: null, 
// //               total: { $sum: '$totalAmount' },
// //               count: { $sum: 1 }
// //             } 
// //           }
// //         ])
// //       ]);

// //       comparisonData = {
// //         appointments: compAppointments,
// //         revenue: compPayments[0]?.total || 0,
// //         transactions: compPayments[0]?.count || 0
// //       };
// //     }

// //     // ==================== TOP MEDICATIONS ====================
// //     const topMedications = await Payment.aggregate([
// //       { $match: paymentQuery },
// //       { $unwind: '$medications' },
// //       {
// //         $group: {
// //           _id: '$medications.name',
// //           totalQuantity: { $sum: '$medications.quantity' },
// //           totalRevenue: { $sum: '$medications.totalPrice' },
// //           prescriptionCount: { $sum: 1 }
// //         }
// //       },
// //       { $sort: { totalRevenue: -1 } },
// //       { $limit: 10 }
// //     ]);

// //     // ==================== BUILD RESPONSE ====================
// //     res.json({
// //       success: true,
// //       period: {
// //         startDate: startDate || 'all time',
// //         endDate: endDate || 'present',
// //         compareWith: compareWith || 'none'
// //       },
// //       summary: {
// //         appointments: {
// //           total: appointmentStats[0]?.total || 0,
// //           booked: appointmentStats[0]?.booked || 0,
// //           completed: appointmentStats[0]?.completed || 0,
// //           cancelled: appointmentStats[0]?.cancelled || 0,
// //           noShow: appointmentStats[0]?.noShow || 0
// //         },
// //         revenue: {
// //           total: paymentStats[0]?.totalRevenue || 0,
// //           transactions: paymentStats[0]?.totalTransactions || 0,
// //           average: paymentStats[0]?.avgTransaction || 0,
// //           tax: paymentStats[0]?.totalTax || 0,
// //           discount: paymentStats[0]?.totalDiscount || 0,
// //           refunded: paymentStats[0]?.totalRefunded || 0
// //         },
// //         patients: {
// //           total: patientStats[0]?.total || 0,
// //           male: patientStats[0]?.maleCount || 0,
// //           female: patientStats[0]?.femaleCount || 0,
// //           other: patientStats[0]?.otherCount || 0,
// //           withInsurance: patientStats[0]?.withInsurance || 0,
// //           withAllergies: patientStats[0]?.withAllergies || 0
// //         },
// //         doctors: {
// //           total: doctorCount
// //         },
// //         patientReports: {
// //           total: patientReportStats[0]?.total || 0,
// //           new: patientReportStats[0]?.newReports || 0,
// //           read: patientReportStats[0]?.readReports || 0,
// //           responded: patientReportStats[0]?.respondedReports || 0,
// //           highPriority: patientReportStats[0]?.highPriority || 0
// //         }
// //       },
// //       charts: {
// //         appointmentsByStatus,
// //         appointmentsByDay,
// //         appointmentsByChannel,
// //         paymentsByMethod,
// //         dailyRevenue,
// //         revenueByService: revenueByService[0] || {},
// //         topDoctors,
// //         doctorsBySpecialty,
// //         patientAgeDistribution,
// //         topMedications
// //       },
// //       comparison: comparisonData
// //     });

// //   } catch (error) {
// //     console.error('Get report summary error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to generate report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 2. GET DETAILED REPORT (Drill Down)
// // // ============================================
// // exports.getDetailedReport = async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const { type, id, startDate, endDate } = req.query;

// //     if (!type) {
// //       return res.status(400).json({ message: 'Report type required' });
// //     }

// //     const dateFilter = {};
// //     if (startDate) dateFilter.$gte = new Date(startDate);
// //     if (endDate) dateFilter.$lte = new Date(endDate);

// //     let data = null;

// //     switch (type) {
// //       case 'doctor':
// //         if (!id) {
// //           return res.status(400).json({ message: 'Doctor ID required' });
// //         }

// //         // Get doctor details
// //         const doctor = await User.findById(id).select('firstName lastName email');
// //         const doctorProfile = await DoctorProfile.findOne({ userId: id });

// //         // Get appointments
// //         const doctorAppointments = await Appointment.find({
// //           hospitalId,
// //           doctorId: id,
// //           ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
// //         })
// //         .populate('patientId', 'firstName lastName')
// //         .sort({ slotStart: -1 })
// //         .limit(100);

// //         // Calculate revenue from medications prescribed by this doctor
// //         const doctorRevenue = await Payment.aggregate([
// //           {
// //             $match: {
// //               hospitalId,
// //               ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
// //             }
// //           },
// //           { $unwind: { path: '$medications', preserveNullAndEmptyArrays: true } },
// //           {
// //             $group: {
// //               _id: null,
// //               totalRevenue: { $sum: '$medications.totalPrice' },
// //               medicationCount: { $sum: 1 }
// //             }
// //           }
// //         ]);

// //         // Appointment statistics
// //         const doctorAppointmentStats = await Appointment.aggregate([
// //           {
// //             $match: {
// //               hospitalId,
// //               doctorId: id,
// //               ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
// //             }
// //           },
// //           {
// //             $group: {
// //               _id: '$status',
// //               count: { $sum: 1 }
// //             }
// //           }
// //         ]);

// //         data = {
// //           doctor: {
// //             id: doctor._id,
// //             name: `${doctor.firstName} ${doctor.lastName}`,
// //             email: doctor.email,
// //             specialty: doctorProfile?.specialties || [],
// //             consultationFee: doctorProfile?.consultationFee || 0,
// //             roomNo: doctorProfile?.roomNo || 'N/A'
// //           },
// //           appointments: doctorAppointments,
// //           appointmentStats: doctorAppointmentStats,
// //           revenue: doctorRevenue[0] || { totalRevenue: 0, medicationCount: 0 }
// //         };
// //         break;

// //       case 'department':
// //         if (!id) {
// //           return res.status(400).json({ message: 'Department name required' });
// //         }

// //         // Get doctors in this department
// //         const deptDoctors = await DoctorProfile.find({
// //           hospitalId,
// //           specialties: { $in: [id] }
// //         }).populate('userId', 'firstName lastName email');

// //         const doctorIds = deptDoctors.map(d => d.userId._id);

// //         // Get appointments for this department
// //         const deptAppointments = await Appointment.countDocuments({
// //           hospitalId,
// //           doctorId: { $in: doctorIds },
// //           ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
// //         });

// //         // Get revenue statistics
// //         const deptRevenue = await Payment.aggregate([
// //           {
// //             $match: {
// //               hospitalId,
// //               ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
// //             }
// //           },
// //           {
// //             $group: {
// //               _id: null,
// //               total: { $sum: '$totalAmount' }
// //             }
// //           }
// //         ]);

// //         data = {
// //           department: id,
// //           doctors: deptDoctors.map(d => ({
// //             id: d.userId._id,
// //             name: `${d.userId.firstName} ${d.userId.lastName}`,
// //             email: d.userId.email,
// //             consultationFee: d.consultationFee,
// //             roomNo: d.roomNo
// //           })),
// //           totalAppointments: deptAppointments,
// //           totalRevenue: deptRevenue[0]?.total || 0
// //         };
// //         break;

// //       case 'service':
// //         // Get service-wise breakdown
// //         const servicePayments = await Payment.find({
// //           hospitalId,
// //           ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
// //         })
// //         .select('medications surgeries procedures appointmentFee totalAmount createdAt')
// //         .populate('userId', 'firstName lastName')
// //         .sort({ createdAt: -1 })
// //         .limit(100);

// //         // Aggregate service statistics
// //         const serviceStats = await Payment.aggregate([
// //           {
// //             $match: {
// //               hospitalId,
// //               ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
// //             }
// //           },
// //           {
// //             $group: {
// //               _id: null,
// //               totalMedicationRevenue: {
// //                 $sum: {
// //                   $sum: {
// //                     $map: {
// //                       input: { $ifNull: ['$medications', []] },
// //                       as: 'med',
// //                       in: '$$med.totalPrice'
// //                     }
// //                   }
// //                 }
// //               },
// //               totalSurgeryRevenue: {
// //                 $sum: {
// //                   $sum: {
// //                     $map: {
// //                       input: { $ifNull: ['$surgeries', []] },
// //                       as: 'surg',
// //                       in: '$$surg.totalPrice'
// //                     }
// //                   }
// //                 }
// //               },
// //               totalProcedureRevenue: {
// //                 $sum: {
// //                   $sum: {
// //                     $map: {
// //                       input: { $ifNull: ['$procedures', []] },
// //                       as: 'proc',
// //                       in: '$$proc.totalPrice'
// //                     }
// //                   }
// //                 }
// //               },
// //               totalAppointmentFees: { $sum: '$appointmentFee' }
// //             }
// //           }
// //         ]);

// //         data = {
// //           payments: servicePayments,
// //           statistics: serviceStats[0] || {}
// //         };
// //         break;

// //       case 'patient':
// //         if (!id) {
// //           return res.status(400).json({ message: 'Patient ID required' });
// //         }

// //         // Get patient profile
// //         const patient = await PatientProfile.findOne({ userId: id, hospitalId })
// //           .populate('userId', 'firstName lastName email phone');

// //         if (!patient) {
// //           return res.status(404).json({ message: 'Patient not found' });
// //         }

// //         // Get patient appointments
// //         const patientAppointments = await Appointment.find({
// //           hospitalId,
// //           patientId: id,
// //           ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
// //         })
// //         .populate('doctorId', 'firstName lastName')
// //         .sort({ slotStart: -1 });

// //         // Get patient payments
// //         const patientPayments = await Payment.find({
// //           hospitalId,
// //           userId: id,
// //           ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
// //         })
// //         .sort({ createdAt: -1 });

// //         // Get patient reports
// //         const patientReports = await PatientReport.find({
// //           hospitalId,
// //           userId: id,
// //           ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
// //         })
// //         .populate('respondedBy', 'firstName lastName')
// //         .sort({ createdAt: -1 });

// //         data = {
// //           patient: {
// //             id: patient._id,
// //             name: `${patient.userId.firstName} ${patient.userId.lastName}`,
// //             email: patient.userId.email,
// //             phone: patient.userId.phone,
// //             dob: patient.dob,
// //             gender: patient.gender,
// //             bloodGroup: patient.bloodGroup,
// //             allergies: patient.allergies,
// //             chronicConditions: patient.chronicConditions,
// //             medications: patient.medications
// //           },
// //           appointments: patientAppointments,
// //           payments: patientPayments,
// //           reports: patientReports,
// //           totalSpent: patientPayments.reduce((sum, p) => sum + p.totalAmount, 0)
// //         };
// //         break;

// //       default:
// //         return res.status(400).json({ message: 'Invalid report type' });
// //     }

// //     res.json({
// //       success: true,
// //       type,
// //       data
// //     });

// //   } catch (error) {
// //     console.error('Get detailed report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch detailed report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 3. SAVE REPORT CONFIGURATION
// // // ============================================
// // exports.saveReport = async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const userId = req.user.sub;

// //     const { reportType, title, description, filters = {}, data, schedule } = req.body;

// //     if (!reportType || !title) {
// //       return res.status(400).json({ message: 'Report type and title required' });
// //     }

// //     // sanitize filters (strip empty values and cast dates)
// //     const cleanFilters = {};
// //     if (filters.startDate) cleanFilters.startDate = new Date(filters.startDate);
// //     if (filters.endDate)   cleanFilters.endDate   = new Date(filters.endDate);
// //    ['department','serviceType','paymentMethod','status'].forEach(k => {
// //      if (filters[k]) cleanFilters[k] = filters[k];
// //    });
// //     if (filters.doctorId) cleanFilters.doctorId = filters.doctorId; // mongoose will cast ObjectId

// //     const report = new Report({
// //       hospitalId,
// //       createdBy: userId,
// //       reportType,
// //       title,
// //       description,
// //       filters: cleanFilters,
// //       data,
// //       schedule
// //     });



// //     await report.save();

// //     res.status(201).json({
// //       success: true,
// //       message: 'Report saved successfully',
// //       report: {
// //         _id: report._id,
// //         reportId: report.reportId,
// //         title: report.title,
// //         reportType: report.reportType,
// //         createdAt: report.createdAt
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Save report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to save report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 4. GET SAVED REPORTS
// // // ============================================
// // exports.getSavedReports = async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const { status, type, page = 1, limit = 20 } = req.query;

// //     const query = { hospitalId };
// //     if (status) query.status = status;
// //     if (type) query.reportType = type;

// //     const reports = await Report.find(query)
// //       .populate('createdBy', 'firstName lastName email')
// //       .sort({ createdAt: -1 })
// //       .limit(limit * 1)
// //       .skip((page - 1) * limit);

// //     const total = await Report.countDocuments(query);

// //     res.json({
// //       success: true,
// //       reports,
// //       pagination: {
// //         currentPage: parseInt(page),
// //         totalPages: Math.ceil(total / limit),
// //         totalReports: total
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Get saved reports error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch reports',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 5. ADD COMMENT TO REPORT
// // // ============================================
// // exports.addReportComment = async (req, res) => {
// //   try {
// //     const { reportId } = req.params;
// //     const { comment } = req.body;
// //     const userId = req.user.sub;

// //     if (!comment || comment.trim().length === 0) {
// //       return res.status(400).json({ message: 'Comment is required' });
// //     }

// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     const report = await Report.findByIdAndUpdate(
// //       reportId,
// //       {
// //         $push: {
// //           comments: {
// //             userId,
// //             userName: `${user.firstName} ${user.lastName}`,
// //             comment: comment.trim(),
// //             createdAt: new Date()
// //           }
// //         }
// //       },
// //       { new: true }
// //     );

// //     if (!report) {
// //       return res.status(404).json({ message: 'Report not found' });
// //     }

// //     res.json({
// //       success: true,
// //       message: 'Comment added successfully',
// //       comments: report.comments
// //     });

// //   } catch (error) {
// //     console.error('Add comment error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to add comment',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 6. DOWNLOAD REPORT (PDF/CSV)
// // // ============================================
// // exports.downloadReport = async (req, res) => {
// //   try {
// //     const { format } = req.query;
// //     const hospitalId = getHospitalId(req);

// //     if (!format || !['pdf', 'csv'].includes(format)) {
// //       return res.status(400).json({ message: 'Invalid format. Use "pdf" or "csv"' });
// //     }

// //     // Get report data (reuse summary endpoint logic)
// //     const { startDate, endDate, department, doctorId } = req.query;

// //     const dateFilter = {};
// //     if (startDate) dateFilter.$gte = new Date(startDate);
// //     if (endDate) dateFilter.$lte = new Date(endDate);

// //     const appointmentQuery = { hospitalId };
// //     if (Object.keys(dateFilter).length > 0) {
// //       appointmentQuery.slotStart = dateFilter;
// //     }

// //     const paymentQuery = { hospitalId, paymentStatus: 'completed' };
// //     if (Object.keys(dateFilter).length > 0) {
// //       paymentQuery.createdAt = dateFilter;
// //     }

// //     const [appointments, payments, hospital] = await Promise.all([
// //       Appointment.find(appointmentQuery)
// //         .populate('doctorId', 'firstName lastName')
// //         .populate('patientId', 'firstName lastName')
// //         .sort({ slotStart: -1 })
// //         .limit(1000),
// //       Payment.find(paymentQuery)
// //         .populate('userId', 'firstName lastName')
// //         .sort({ createdAt: -1 })
// //         .limit(1000),
// //       Hospital.findById(hospitalId)
// //     ]);

// //     if (format === 'csv') {
// //       // ==================== CSV EXPORT ====================
// //       const appointmentFields = [
// //         { label: 'Date', value: (row) => new Date(row.slotStart).toLocaleDateString() },
// //         { label: 'Time', value: (row) => new Date(row.slotStart).toLocaleTimeString() },
// //         { label: 'Patient', value: (row) => row.patientId ? `${row.patientId.firstName} ${row.patientId.lastName}` : 'N/A' },
// //         { label: 'Doctor', value: (row) => row.doctorId ? `${row.doctorId.firstName} ${row.doctorId.lastName}` : 'N/A' },
// //         { label: 'Status', value: 'status' },
// //         { label: 'Reason', value: 'reason' },
// //         { label: 'Channel', value: 'channel' }
// //       ];

// //       const paymentFields = [
// //         { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleDateString() },
// //         { label: 'Receipt Number', value: 'receiptNumber' },
// //         { label: 'Patient', value: (row) => row.userId ? `${row.userId.firstName} ${row.userId.lastName}` : 'N/A' },
// //         { label: 'Amount (LKR)', value: 'totalAmount' },
// //         { label: 'Payment Method', value: 'paymentMethod' },
// //         { label: 'Status', value: 'paymentStatus' },
// //         { label: 'Tax (LKR)', value: 'tax' },
// //         { label: 'Discount (LKR)', value: 'discount' }
// //       ];

// //       try {
// //         const appointmentParser = new Parser({ fields: appointmentFields });
// //         const paymentParser = new Parser({ fields: paymentFields });

// //         const appointmentCsv = appointments.length > 0 ? appointmentParser.parse(appointments) : 'No appointments data';
// //         const paymentCsv = payments.length > 0 ? paymentParser.parse(payments) : 'No payments data';

// //         // Calculate totals
// //         const totalRevenue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
// //         const totalAppointments = appointments.length;

// //         const combinedCsv = `Hospital Report - ${hospital?.name || 'Unknown'}\n` +
// //           `Generated: ${new Date().toLocaleString()}\n` +
// //           `Period: ${startDate || 'All time'} to ${endDate || 'Present'}\n\n` +
// //           `SUMMARY\n` +
// //           `Total Appointments,${totalAppointments}\n` +
// //           `Total Revenue,LKR ${totalRevenue.toFixed(2)}\n` +
// //           `Total Transactions,${payments.length}\n\n` +
// //           `APPOINTMENTS\n${appointmentCsv}\n\n` +
// //           `PAYMENTS\n${paymentCsv}`;

// //         res.setHeader('Content-Type', 'text/csv');
// //         res.setHeader('Content-Disposition', `attachment; filename=hospital-report-${Date.now()}.csv`);
// //         res.send(combinedCsv);

// //       } catch (csvError) {
// //         console.error('CSV generation error:', csvError);
// //         return res.status(500).json({ 
// //           success: false, 
// //           message: 'Failed to generate CSV', 
// //           error: csvError.message 
// //         });
// //       }

// //     } else if (format === 'pdf') {
// //       // ==================== PDF EXPORT ====================
// //       const doc = new PDFDocument({ 
// //         margin: 50,
// //         size: 'A4'
// //       });
      
// //       const filename = `hospital-report-${Date.now()}.pdf`;

// //       res.setHeader('Content-Type', 'application/pdf');
// //       res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

// //       doc.pipe(res);

// //       // Header with hospital info
// //       doc.fontSize(24)
// //          .fillColor('#0d9488')
// //          .text('Hospital Analytics Report', { align: 'center' });
      
// //       doc.moveDown(0.5);
// //       doc.fontSize(12)
// //          .fillColor('#333')
// //          .text(hospital?.name || 'Hospital Name', { align: 'center' });
      
// //       doc.fontSize(10)
// //          .fillColor('#666')
// //          .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      
// //       if (startDate || endDate) {
// //         doc.text(`Period: ${startDate || 'All time'} to ${endDate || 'Present'}`, { align: 'center' });
// //       }

// //       doc.moveDown(2);

// //       // Summary Section
// //       doc.fontSize(16)
// //          .fillColor('#0d9488')
// //          .text('Summary', { underline: true });
      
// //       doc.moveDown(0.5);

// //       const totalRevenue = payments.reduce((sum, p) => sum + p.totalAmount, 0);
// //       const totalTax = payments.reduce((sum, p) => sum + (p.tax || 0), 0);
// //       const avgTransaction = payments.length > 0 ? totalRevenue / payments.length : 0;

// //       doc.fontSize(11)
// //          .fillColor('#333')
// //          .text(`Total Appointments: ${appointments.length}`, { continued: true })
// //          .text(`    Total Revenue: LKR ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, { align: 'right' });
      
// //       doc.text(`Completed: ${appointments.filter(a => a.status === 'completed').length}`, { continued: true })
// //          .text(`    Total Transactions: ${payments.length}`, { align: 'right' });
      
// //       doc.text(`Cancelled: ${appointments.filter(a => a.status === 'cancelled').length}`, { continued: true })
// //          .text(`    Avg Transaction: LKR ${avgTransaction.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, { align: 'right' });

// //       doc.moveDown(2);

// //       // Appointments Section
// //       doc.fontSize(16)
// //          .fillColor('#0d9488')
// //          .text('Recent Appointments', { underline: true });
      
// //       doc.moveDown(0.5);

// //       if (appointments.length > 0) {
// //         // Table header
// //         doc.fontSize(10)
// //            .fillColor('#0d9488')
// //            .text('Date', 50, doc.y, { width: 80, continued: true })
// //            .text('Patient', 130, doc.y, { width: 120, continued: true })
// //            .text('Doctor', 250, doc.y, { width: 120, continued: true })
// //            .text('Status', 370, doc.y, { width: 80, continued: true })
// //            .text('Channel', 450, doc.y, { width: 100 });

// //         doc.moveDown(0.3);
// //         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#0d9488');
// //         doc.moveDown(0.3);

// //         // Table rows (limit to first 20 for PDF)
// //         doc.fontSize(9).fillColor('#333');
// //         appointments.slice(0, 20).forEach((appt, index) => {
// //           const y = doc.y;
// //           const date = new Date(appt.slotStart).toLocaleDateString();
// //           const patient = appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}` : 'N/A';
// //           const doctor = appt.doctorId ? `${appt.doctorId.firstName} ${appt.doctorId.lastName}` : 'N/A';
// //           const status = appt.status || 'unknown';
// //           const channel = appt.channel || 'N/A';

// //           // Alternate row colors
// //           if (index % 2 === 0) {
// //             doc.rect(50, y - 2, 500, 20).fill('#f9fafb');
// //           }

// //           doc.fillColor('#333')
// //              .text(date, 50, y, { width: 80, continued: true })
// //              .text(patient, 130, y, { width: 120, continued: true })
// //              .text(doctor, 250, y, { width: 120, continued: true })
// //              .text(status, 370, y, { width: 80, continued: true })
// //              .text(channel, 450, y, { width: 100 });

// //           doc.moveDown(0.8);

// //           // Add new page if needed
// //           if (doc.y > 700) {
// //             doc.addPage();
// //             doc.fontSize(10).fillColor('#666').text('(Continued...)', { align: 'center' });
// //             doc.moveDown(1);
// //           }
// //         });

// //         if (appointments.length > 20) {
// //           doc.moveDown(0.5);
// //           doc.fontSize(9)
// //              .fillColor('#666')
// //              .text(`... and ${appointments.length - 20} more appointments`, { align: 'center', italics: true });
// //         }
// //       } else {
// //         doc.fontSize(10)
// //            .fillColor('#666')
// //            .text('No appointments found for this period.', { italics: true });
// //       }

// //       doc.moveDown(2);

// //       // Payments Section
// //       if (doc.y > 600) {
// //         doc.addPage();
// //       }

// //       doc.fontSize(16)
// //          .fillColor('#0d9488')
// //          .text('Recent Payments', { underline: true });
      
// //       doc.moveDown(0.5);

// //       if (payments.length > 0) {
// //         // Table header
// //         doc.fontSize(10)
// //            .fillColor('#0d9488')
// //            .text('Date', 50, doc.y, { width: 80, continued: true })
// //            .text('Receipt', 130, doc.y, { width: 100, continued: true })
// //            .text('Patient', 230, doc.y, { width: 120, continued: true })
// //            .text('Method', 350, doc.y, { width: 80, continued: true })
// //            .text('Amount (LKR)', 430, doc.y, { width: 120, align: 'right' });

// //         doc.moveDown(0.3);
// //         doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#0d9488');
// //         doc.moveDown(0.3);

// //         // Table rows (limit to first 20)
// //         doc.fontSize(9).fillColor('#333');
// //         payments.slice(0, 20).forEach((payment, index) => {
// //           const y = doc.y;
// //           const date = new Date(payment.createdAt).toLocaleDateString();
// //           const receipt = payment.receiptNumber || 'N/A';
// //           const patient = payment.userId ? `${payment.userId.firstName} ${payment.userId.lastName}` : 'N/A';
// //           const method = payment.paymentMethod || 'N/A';
// //           const amount = payment.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 });

// //           // Alternate row colors
// //           if (index % 2 === 0) {
// //             doc.rect(50, y - 2, 500, 20).fill('#f9fafb');
// //           }

// //           doc.fillColor('#333')
// //              .text(date, 50, y, { width: 80, continued: true })
// //              .text(receipt, 130, y, { width: 100, continued: true })
// //              .text(patient, 230, y, { width: 120, continued: true })
// //              .text(method, 350, y, { width: 80, continued: true })
// //              .text(amount, 430, y, { width: 120, align: 'right' });

// //           doc.moveDown(0.8);

// //           // Add new page if needed
// //           if (doc.y > 700) {
// //             doc.addPage();
// //             doc.fontSize(10).fillColor('#666').text('(Continued...)', { align: 'center' });
// //             doc.moveDown(1);
// //           }
// //         });

// //         if (payments.length > 20) {
// //           doc.moveDown(0.5);
// //           doc.fontSize(9)
// //              .fillColor('#666')
// //              .text(`... and ${payments.length - 20} more transactions`, { align: 'center', italics: true });
// //         }
// //       } else {
// //         doc.fontSize(10)
// //            .fillColor('#666')
// //            .text('No payments found for this period.', { italics: true });
// //       }

// //       // Footer
// //       doc.moveDown(3);
// //       doc.fontSize(8)
// //          .fillColor('#999')
// //          .text('This is a system-generated report. No signature required.', { align: 'center' });
      
// //       doc.text(`Page 1 of ${doc.bufferedPageRange().count}`, { align: 'center' });

// //       doc.end();

// //     } else {
// //       return res.status(400).json({ message: 'Invalid format specified' });
// //     }

// //   } catch (error) {
// //     console.error('Download report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to download report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 7. SCHEDULE REPORT (Node-Cron)
// // // ============================================
// // exports.scheduleReport = async (req, res) => {
// //   try {
// //     const { reportId, frequency, recipients } = req.body;

// //     if (!reportId || !frequency || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
// //       return res.status(400).json({ 
// //         message: 'Report ID, frequency, and recipients array required' 
// //       });
// //     }

// //     // Validate email addresses
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     const invalidEmails = recipients.filter(email => !emailRegex.test(email));
// //     if (invalidEmails.length > 0) {
// //       return res.status(400).json({ 
// //         message: `Invalid email addresses: ${invalidEmails.join(', ')}` 
// //       });
// //     }

// //     // Determine cron expression based on frequency
// //     let cronExpression;
// //     switch (frequency) {
// //       case 'daily':
// //         cronExpression = '0 9 * * *'; // 9 AM daily
// //         break;
// //       case 'weekly':
// //         cronExpression = '0 9 * * 1'; // 9 AM every Monday
// //         break;
// //       case 'monthly':
// //         cronExpression = '0 9 1 * *'; // 9 AM first day of month
// //         break;
// //       case 'custom':
// //         cronExpression = req.body.cronExpression;
// //         if (!cronExpression) {
// //           return res.status(400).json({ message: 'Custom cron expression required' });
// //         }
// //         // Validate cron expression
// //         if (!cron.validate(cronExpression)) {
// //           return res.status(400).json({ message: 'Invalid cron expression' });
// //         }
// //         break;
// //       default:
// //         return res.status(400).json({ message: 'Invalid frequency. Use: daily, weekly, monthly, or custom' });
// //     }

// //     // Update report with schedule
// //     const report = await Report.findByIdAndUpdate(
// //       reportId,
// //       {
// //         'schedule.enabled': true,
// //         'schedule.frequency': frequency,
// //         'schedule.cronExpression': cronExpression,
// //         'schedule.recipients': recipients,
// //         'schedule.nextRun': getNextRunDate(cronExpression)
// //       },
// //       { new: true }
// //     );

// //     if (!report) {
// //       return res.status(404).json({ message: 'Report not found' });
// //     }

// //     // Cancel existing schedule if any
// //     if (activeSchedules.has(reportId)) {
// //       activeSchedules.get(reportId).stop();
// //       activeSchedules.delete(reportId);
// //     }

// //     // Create new cron job
// //     const task = cron.schedule(cronExpression, async () => {
// //       console.log(`[CRON] Running scheduled report: ${reportId}`);
      
// //       try {
// //         // Update lastRun timestamp
// //         await Report.findByIdAndUpdate(reportId, {
// //           'schedule.lastRun': new Date(),
// //           'schedule.nextRun': getNextRunDate(cronExpression)
// //         });

// //         // Here you would generate and email the report
// //         // For now, just log
// //         console.log(`[CRON] Report ${reportId} executed successfully`);
// //         console.log(`[CRON] Recipients: ${recipients.join(', ')}`);
        
// //         // TODO: Implement email sending with nodemailer
// //         // await emailReport(reportId, recipients);
        
// //       } catch (error) {
// //         console.error(`[CRON] Error running scheduled report ${reportId}:`, error);
// //       }
// //     });

// //     // Store the task
// //     activeSchedules.set(reportId, task);

// //     res.json({
// //       success: true,
// //       message: 'Report scheduled successfully',
// //       schedule: {
// //         enabled: report.schedule.enabled,
// //         frequency: report.schedule.frequency,
// //         cronExpression: report.schedule.cronExpression,
// //         recipients: report.schedule.recipients,
// //         nextRun: report.schedule.nextRun
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Schedule report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to schedule report',
// //       error: error.message
// //     });
// //   }
// // };

// // // Helper to calculate next run date from cron expression
// // function getNextRunDate(cronExpression) {
// //   try {
// //     // Simple calculation - in production use a proper cron parser library
// //     const now = new Date();
// //     const parts = cronExpression.split(' ');
    
// //     // For daily (0 9 * * *)
// //     if (parts[0] === '0' && parts[1] !== '*' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
// //       const next = new Date(now);
// //       next.setHours(parseInt(parts[1]), 0, 0, 0);
// //       if (next <= now) {
// //         next.setDate(next.getDate() + 1);
// //       }
// //       return next;
// //     }
    
// //     // For weekly (0 9 * * 1)
// //     if (parts[0] === '0' && parts[1] !== '*' && parts[2] === '*' && parts[3] === '*' && parts[4] !== '*') {
// //       const next = new Date(now);
// //       const targetDay = parseInt(parts[4]);
// //       const currentDay = next.getDay();
// //       let daysUntil = targetDay - currentDay;
// //       if (daysUntil <= 0) daysUntil += 7;
// //       next.setDate(next.getDate() + daysUntil);
// //       next.setHours(parseInt(parts[1]), 0, 0, 0);
// //       return next;
// //     }
    
// //     // For monthly (0 9 1 * *)
// //     if (parts[0] === '0' && parts[1] !== '*' && parts[2] !== '*' && parts[3] === '*' && parts[4] === '*') {
// //       const next = new Date(now);
// //       next.setDate(parseInt(parts[2]));
// //       next.setHours(parseInt(parts[1]), 0, 0, 0);
// //       if (next <= now) {
// //         next.setMonth(next.getMonth() + 1);
// //       }
// //       return next;
// //     }
    
// //     // Default: add 1 day
// //     const defaultNext = new Date(now);
// //     defaultNext.setDate(defaultNext.getDate() + 1);
// //     return defaultNext;
    
// //   } catch (error) {
// //     console.error('Error calculating next run date:', error);
// //     const fallback = new Date();
// //     fallback.setDate(fallback.getDate() + 1);
// //     return fallback;
// //   }
// // }

// // // ============================================
// // // 8. DELETE REPORT
// // // ============================================
// // exports.deleteReport = async (req, res) => {
// //   try {
// //     const { reportId } = req.params;
// //     const hospitalId = getHospitalId(req);

// //     const report = await Report.findOneAndDelete({
// //       _id: reportId,
// //       hospitalId
// //     });

// //     if (!report) {
// //       return res.status(404).json({ message: 'Report not found' });
// //     }

// //     // Stop and remove scheduled task if exists
// //     if (activeSchedules.has(reportId)) {
// //       activeSchedules.get(reportId).stop();
// //       activeSchedules.delete(reportId);
// //       console.log(`[CRON] Stopped scheduled task for deleted report: ${reportId}`);
// //     }

// //     res.json({
// //       success: true,
// //       message: 'Report deleted successfully'
// //     });

// //   } catch (error) {
// //     console.error('Delete report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to delete report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 9. UPDATE REPORT
// // // ============================================
// // exports.updateReport = async (req, res) => {
// //   try {
// //     const { reportId } = req.params;
// //     const hospitalId = getHospitalId(req);
// //     const userId = req.user.sub;

// //     const {
// //       title,
// //       description,
// //       filters,
// //       data,
// //       status
// //     } = req.body;

// //     const report = await Report.findOne({ _id: reportId, hospitalId });

// //     if (!report) {
// //       return res.status(404).json({ message: 'Report not found' });
// //     }

// //     // Save previous version before updating
// //     if (report.data) {
// //       report.previousVersions.push({
// //         version: report.version,
// //         data: report.data,
// //         updatedAt: new Date(),
// //         updatedBy: userId
// //       });
// //     }

// //     // Update fields
// //     if (title) report.title = title;
// //     if (description !== undefined) report.description = description;
// //     if (filters) report.filters = filters;
// //     if (data) report.data = data;
// //     if (status) report.status = status;

// //     report.version += 1;
// //     await report.save();

// //     res.json({
// //       success: true,
// //       message: 'Report updated successfully',
// //       report: {
// //         _id: report._id,
// //         reportId: report.reportId,
// //         title: report.title,
// //         version: report.version,
// //         updatedAt: report.updatedAt
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Update report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to update report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 10. GET REPORT BY ID
// // // ============================================
// // exports.getReportById = async (req, res) => {
// //   try {
// //     const { reportId } = req.params;
// //     const hospitalId = getHospitalId(req);

// //     const report = await Report.findOne({ _id: reportId, hospitalId })
// //       .populate('createdBy', 'firstName lastName email')
// //       .populate('comments.userId', 'firstName lastName');

// //     if (!report) {
// //       return res.status(404).json({ message: 'Report not found' });
// //     }

// //     // Increment view count
// //     report.views += 1;
// //     await report.save();

// //     res.json({
// //       success: true,
// //       report
// //     });

// //   } catch (error) {
// //     console.error('Get report by ID error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch report',
// //       error: error.message
// //     });
// //   }
// // };

// // // ============================================
// // // 11. CANCEL SCHEDULED REPORT
// // // ============================================
// // exports.cancelScheduledReport = async (req, res) => {
// //   try {
// //     const { reportId } = req.params;
// //     const hospitalId = getHospitalId(req);

// //     const report = await Report.findOneAndUpdate(
// //       { _id: reportId, hospitalId },
// //       {
// //         'schedule.enabled': false,
// //         'schedule.nextRun': null
// //       },
// //       { new: true }
// //     );

// //     if (!report) {
// //       return res.status(404).json({ message: 'Report not found' });
// //     }

// //     // Stop the cron task
// //     if (activeSchedules.has(reportId)) {
// //       activeSchedules.get(reportId).stop();
// //       activeSchedules.delete(reportId);
// //       console.log(`[CRON] Cancelled scheduled task for report: ${reportId}`);
// //     }

// //     res.json({
// //       success: true,
// //       message: 'Scheduled report cancelled successfully',
// //       schedule: report.schedule
// //     });

// //   } catch (error) {
// //     console.error('Cancel scheduled report error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to cancel scheduled report',
// //       error: error.message
// //     });
// //   }
// // };

// // // Export active schedules for monitoring
// // exports.getActiveSchedules = () => {
// //   return Array.from(activeSchedules.keys());
// // };

// const mongoose = require('mongoose');
// const { Types } = mongoose;

// const Report = require('../models/reportModel');
// const Appointment = require('../models/appointmentModel');
// const Payment = require('../models/paymentModel');
// const PatientProfile = require('../models/patientProfileModel');
// const PatientReport = require('../models/patientReportModel');
// const DoctorProfile = require('../models/doctorProfileModel');
// const User = require('../models/userModel');
// const Hospital = require('../models/hospitalModel');
// const PDFDocument = require('pdfkit');
// const { Parser } = require('json2csv');
// const cron = require('node-cron');

// // ---------- helpers to read auth context robustly ----------
// const getHospitalId = (req) =>
//   req.user?.hospitalId ||
//   req.user?.hospital?._id ||
//   req.user?.hospital ||
//   req.headers['x-hospital-id']; // optional override

// const getUserId = (req) =>
//   req.user?.id || req.user?._id || req.user?.sub || req.user?.userId;

// // store active cron jobs
// const activeSchedules = new Map();

// // ============================================
// // 1) GET REPORT SUMMARY
// // ============================================
// exports.getReportSummary = async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });

//     const hid = Types.ObjectId.isValid(hospitalId) ? new Types.ObjectId(hospitalId) : hospitalId;

//     const { startDate, endDate, department, doctorId, compareWith } = req.query;

//     const dateFilter = {};
//     if (startDate) dateFilter.$gte = new Date(startDate);
//     if (endDate) dateFilter.$lte = new Date(endDate);

//     let comparisonDateFilter = null;
//     if (compareWith && startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       const diff = end - start;
//       comparisonDateFilter = { $gte: new Date(start.getTime() - diff), $lte: new Date(start.getTime()) };
//     }

//     // ----- Appointments -----
//     const appointmentQuery = { hospitalId: hid };
//     if (Object.keys(dateFilter).length) appointmentQuery.slotStart = dateFilter;
//     if (doctorId) appointmentQuery.doctorId = doctorId;

//     const [appointmentStats, appointmentsByStatus, appointmentsByDay, appointmentsByChannel] = await Promise.all([
//       Appointment.aggregate([
//         { $match: appointmentQuery },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: 1 },
//             booked: { $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] } },
//             completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
//             cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
//             noShow: { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } },
//           },
//         },
//       ]),
//       Appointment.aggregate([{ $match: appointmentQuery }, { $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
//       Appointment.aggregate([
//         { $match: appointmentQuery },
//         { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$slotStart' } }, count: { $sum: 1 } } },
//         { $sort: { _id: 1 } },
//         { $limit: 30 },
//       ]),
//       Appointment.aggregate([{ $match: appointmentQuery }, { $group: { _id: '$channel', count: { $sum: 1 } } }]),
//     ]);

//     // ----- Payments -----
//     const paymentQuery = { hospitalId: hid, paymentStatus: 'completed' };
//     if (Object.keys(dateFilter).length) paymentQuery.createdAt = dateFilter;

//     const [paymentStats, paymentsByMethod, dailyRevenue, revenueByService] = await Promise.all([
//       Payment.aggregate([
//         { $match: paymentQuery },
//         {
//           $group: {
//             _id: null,
//             totalRevenue: { $sum: '$totalAmount' },
//             totalTransactions: { $sum: 1 },
//             avgTransaction: { $avg: '$totalAmount' },
//             totalTax: { $sum: '$tax' },
//             totalDiscount: { $sum: '$discount' },
//             totalRefunded: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$totalAmount', 0] } },
//           },
//         },
//       ]),
//       Payment.aggregate([
//         { $match: paymentQuery },
//         { $group: { _id: '$paymentMethod', total: { $sum: '$totalAmount' }, count: { $sum: 1 }, avgAmount: { $avg: '$totalAmount' } } },
//         { $sort: { total: -1 } },
//       ]),
//       Payment.aggregate([
//         { $match: paymentQuery },
//         { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, transactions: { $sum: 1 } } },
//         { $sort: { _id: 1 } },
//         { $limit: 30 },
//       ]),
//       Payment.aggregate([
//         { $match: paymentQuery },
//         {
//           $project: {
//             medicationRevenue: { $sum: { $map: { input: { $ifNull: ['$medications', []] }, as: 'm', in: '$$m.totalPrice' } } },
//             surgeryRevenue: { $sum: { $map: { input: { $ifNull: ['$surgeries', []] }, as: 's', in: '$$s.totalPrice' } } },
//             procedureRevenue: { $sum: { $map: { input: { $ifNull: ['$procedures', []] }, as: 'p', in: '$$p.totalPrice' } } },
//             appointmentFee: '$appointmentFee',
//           },
//         },
//         { $group: { _id: null, medications: { $sum: '$medicationRevenue' }, surgeries: { $sum: '$surgeryRevenue' }, procedures: { $sum: '$procedureRevenue' }, appointments: { $sum: '$appointmentFee' } } },
//       ]),
//     ]);

//     // ----- Patients -----
//     const patientStats = await PatientProfile.aggregate([
//       { $match: { hospitalId: hid } },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           maleCount: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
//           femaleCount: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
//           otherCount: { $sum: { $cond: [{ $eq: ['$gender', 'other'] }, 1, 0] } },
//           withInsurance: {
//             $sum: {
//               $cond: [{ $and: [{ $ne: ['$insurance.provider', null] }, { $ne: ['$insurance.provider', ''] }] }, 1, 0],
//             },
//           },
//           withAllergies: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$allergies', []] } }, 0] }, 1, 0] } },
//         },
//       },
//     ]);

//     // ----- Doctors -----
//     const doctorQuery = { hospitalId };
//     if (department) doctorQuery.specialties = { $in: [department] };

//     const [doctorCount, topDoctors, doctorsBySpecialty] = await Promise.all([
//       DoctorProfile.countDocuments(doctorQuery),
//       Appointment.aggregate([
//         { $match: appointmentQuery },
//         { $group: { _id: '$doctorId', appointmentCount: { $sum: 1 } } },
//         { $sort: { appointmentCount: -1 } },
//         { $limit: 10 },
//         { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'doctor' } },
//         { $unwind: '$doctor' },
//         { $lookup: { from: 'doctorprofiles', localField: '_id', foreignField: 'userId', as: 'profile' } },
//         { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
//         {
//           $project: {
//             doctorId: '$_id',
//             name: { $concat: ['$doctor.firstName', ' ', '$doctor.lastName'] },
//             specialty: { $arrayElemAt: ['$profile.specialties', 0] },
//             appointmentCount: 1,
//           },
//         },
//       ]),
//       DoctorProfile.aggregate([{ $match: doctorQuery }, { $unwind: '$specialties' }, { $group: { _id: '$specialties', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
//     ]);

//     // ----- Patient reports -----
//     const patientReportQuery = { hospitalId: hid };
//     if (Object.keys(dateFilter).length) patientReportQuery.createdAt = dateFilter;

//     const patientReportStats = await PatientReport.aggregate([
//       { $match: patientReportQuery },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           newReports: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
//           readReports: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
//           respondedReports: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
//           highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
//         },
//       },
//     ]);

//     // ----- comparison -----
//     let comparisonData = null;
//     if (comparisonDateFilter) {
//       const [compAppointments, compPayments] = await Promise.all([
//         Appointment.countDocuments({ ...appointmentQuery, slotStart: comparisonDateFilter }),
//         Payment.aggregate([{ $match: { ...paymentQuery, createdAt: comparisonDateFilter } }, { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }]),
//       ]);
//       comparisonData = { appointments: compAppointments, revenue: compPayments[0]?.total || 0, transactions: compPayments[0]?.count || 0 };
//     }

//     // ----- top meds -----
//     const topMedications = await Payment.aggregate([
//       { $match: paymentQuery },
//       { $unwind: '$medications' },
//       { $group: { _id: '$medications.name', totalQuantity: { $sum: '$medications.quantity' }, totalRevenue: { $sum: '$medications.totalPrice' }, prescriptionCount: { $sum: 1 } } },
//       { $sort: { totalRevenue: -1 } },
//       { $limit: 10 },
//     ]);

//     res.json({
//       success: true,
//       period: { startDate: startDate || 'all time', endDate: endDate || 'present', compareWith: compareWith || 'none' },
//       summary: {
//         appointments: {
//           total: appointmentStats[0]?.total || 0,
//           booked: appointmentStats[0]?.booked || 0,
//           completed: appointmentStats[0]?.completed || 0,
//           cancelled: appointmentStats[0]?.cancelled || 0,
//           noShow: appointmentStats[0]?.noShow || 0,
//         },
//         revenue: {
//           total: paymentStats[0]?.totalRevenue || 0,
//           transactions: paymentStats[0]?.totalTransactions || 0,
//           average: paymentStats[0]?.avgTransaction || 0,
//           tax: paymentStats[0]?.totalTax || 0,
//           discount: paymentStats[0]?.totalDiscount || 0,
//           refunded: paymentStats[0]?.totalRefunded || 0,
//         },
//         patients: {
//           total: patientStats[0]?.total || 0,
//           male: patientStats[0]?.maleCount || 0,
//           female: patientStats[0]?.femaleCount || 0,
//           other: patientStats[0]?.otherCount || 0,
//           withInsurance: patientStats[0]?.withInsurance || 0,
//           withAllergies: patientStats[0]?.withAllergies || 0,
//         },
//         doctors: { total: doctorCount },
//         patientReports: {
//           total: patientReportStats[0]?.total || 0,
//           new: patientReportStats[0]?.newReports || 0,
//           read: patientReportStats[0]?.readReports || 0,
//           responded: patientReportStats[0]?.respondedReports || 0,
//           highPriority: patientReportStats[0]?.highPriority || 0,
//         },
//       },
//       charts: {
//         appointmentsByStatus,
//         appointmentsByDay,
//         appointmentsByChannel,
//         paymentsByMethod,
//         dailyRevenue,
//         revenueByService: revenueByService[0] || {},
//         topDoctors,
//         doctorsBySpecialty,
//         patientAgeDistribution: await PatientProfile.aggregate([
//           { $match: { hospitalId: hid } },
//           {
//             $project: {
//               age: {
//                 $floor: { $divide: [{ $subtract: [new Date(), '$dob'] }, 1000 * 60 * 60 * 24 * 365.25] },
//               },
//             },
//           },
//           { $bucket: { groupBy: '$age', boundaries: [0, 18, 30, 45, 60, 75, 100], default: 'Other', output: { count: { $sum: 1 } } } },
//         ]),
//         topMedications,
//       },
//       comparison: comparisonData,
//     });
//   } catch (err) {
//     console.error('Get report summary error:', err);
//     res.status(500).json({ success: false, message: 'Failed to generate report', error: err.message });
//   }
// };

// // ============================================
// // 2) SAVE REPORT
// // ============================================
// exports.saveReport = async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = getUserId(req);

//     if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });
//     if (!userId) return res.status(400).json({ message: 'User context required' });

//     const { reportType, title, description, filters = {}, data, schedule } = req.body;
//     if (!reportType || !title) return res.status(400).json({ message: 'Report type and title required' });

//     // sanitize filters
//     const clean = {};
//     if (filters.startDate) clean.startDate = new Date(filters.startDate);
//     if (filters.endDate) clean.endDate = new Date(filters.endDate);
//     ['department', 'serviceType', 'paymentMethod', 'status'].forEach((k) => {
//       if (filters[k]) clean[k] = filters[k];
//     });
//     if (filters.doctorId) clean.doctorId = filters.doctorId;

//     const report = new Report({
//       hospitalId,
//       createdBy: userId,
//       reportType,
//       title,
//       description,
//       filters: clean,
//       data,
//       schedule,
//     });

//     await report.save();

//     res.status(201).json({
//       success: true,
//       message: 'Report saved successfully',
//       report: { _id: report._id, reportId: report.reportId, title: report.title, reportType: report.reportType, createdAt: report.createdAt },
//     });
//   } catch (err) {
//     console.error('Save report error:', err);
//     // turn mongoose validation into 400
//     if (err?.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
//     res.status(500).json({ success: false, message: 'Failed to save report', error: err.message });
//   }
// };

// // ============================================
// // 3) DOWNLOAD REPORT (PDF/CSV)
// // ============================================
// exports.downloadReport = async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });

//     const { format, startDate, endDate } = req.query;
//     if (!format || !['pdf', 'csv'].includes(format)) return res.status(400).json({ message: 'Invalid format. Use "pdf" or "csv"' });

//     const dateFilter = {};
//     if (startDate) dateFilter.$gte = new Date(startDate);
//     if (endDate) dateFilter.$lte = new Date(endDate);

//     const appointmentQuery = { hospitalId };
//     if (Object.keys(dateFilter).length) appointmentQuery.slotStart = dateFilter;

//     const paymentQuery = { hospitalId, paymentStatus: 'completed' };
//     if (Object.keys(dateFilter).length) paymentQuery.createdAt = dateFilter;

//     const [appointments, payments, hospital] = await Promise.all([
//       Appointment.find(appointmentQuery).populate('doctorId', 'firstName lastName').populate('patientId', 'firstName lastName').sort({ slotStart: -1 }).limit(1000),
//       Payment.find(paymentQuery).populate('userId', 'firstName lastName').sort({ createdAt: -1 }).limit(1000),
//       Hospital.findById(hospitalId),
//     ]);

//     if (format === 'csv') {
//       const appointmentFields = [
//         { label: 'Date', value: (row) => new Date(row.slotStart).toLocaleDateString() },
//         { label: 'Time', value: (row) => new Date(row.slotStart).toLocaleTimeString() },
//         { label: 'Patient', value: (row) => (row.patientId ? `${row.patientId.firstName} ${row.patientId.lastName}` : 'N/A') },
//         { label: 'Doctor', value: (row) => (row.doctorId ? `${row.doctorId.firstName} ${row.doctorId.lastName}` : 'N/A') },
//         { label: 'Status', value: 'status' },
//         { label: 'Reason', value: 'reason' },
//         { label: 'Channel', value: 'channel' },
//       ];

//       const paymentFields = [
//         { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleDateString() },
//         { label: 'Receipt Number', value: 'receiptNumber' },
//         { label: 'Patient', value: (row) => (row.userId ? `${row.userId.firstName} ${row.userId.lastName}` : 'N/A') },
//         { label: 'Amount (LKR)', value: 'totalAmount' },
//         { label: 'Payment Method', value: 'paymentMethod' },
//         { label: 'Status', value: 'paymentStatus' },
//         { label: 'Tax (LKR)', value: 'tax' },
//         { label: 'Discount (LKR)', value: 'discount' },
//       ];

//       try {
//         const appointmentParser = new Parser({ fields: appointmentFields });
//         const paymentParser = new Parser({ fields: paymentFields });

//         const appointmentCsv = appointments.length ? appointmentParser.parse(appointments) : 'No appointments data';
//         const paymentCsv = payments.length ? paymentParser.parse(payments) : 'No payments data';

//         const totalRevenue = payments.reduce((s, p) => s + p.totalAmount, 0);
//         const combinedCsv = [
//           `Hospital Report - ${hospital?.name || 'Unknown'}`,
//           `Generated: ${new Date().toLocaleString()}`,
//           `Period: ${startDate || 'All time'} to ${endDate || 'Present'}`,
//           '',
//           'SUMMARY',
//           `Total Appointments,${appointments.length}`,
//           `Total Revenue,LKR ${totalRevenue.toFixed(2)}`,
//           `Total Transactions,${payments.length}`,
//           '',
//           'APPOINTMENTS',
//           appointmentCsv,
//           '',
//           'PAYMENTS',
//           paymentCsv,
//         ].join('\n');

//         res.setHeader('Content-Type', 'text/csv');
//         res.setHeader('Content-Disposition', `attachment; filename="hospital-report-${Date.now()}.csv"`);
//         return res.send(combinedCsv);
//       } catch (csvErr) {
//         console.error('CSV generation error:', csvErr);
//         return res.status(500).json({ success: false, message: 'Failed to generate CSV', error: csvErr.message });
//       }
//     }

//     // PDF
//     const doc = new PDFDocument({ margin: 50, size: 'A4' });
//     const filename = `hospital-report-${Date.now()}.pdf`;
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     doc.pipe(res);

//     doc.fontSize(24).fillColor('#0d9488').text('Hospital Analytics Report', { align: 'center' });
//     doc.moveDown(0.5);
//     doc.fontSize(12).fillColor('#333').text(hospital?.name || 'Hospital Name', { align: 'center' });
//     doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
//     if (startDate || endDate) doc.text(`Period: ${startDate || 'All time'} to ${endDate || 'Present'}`, { align: 'center' });
//     doc.moveDown(2);

//     // Summary
//     const totalRevenue = payments.reduce((s, p) => s + p.totalAmount, 0);
//     const completed = appointments.filter((a) => a.status === 'completed').length;
//     const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
//     const avgTx = payments.length ? totalRevenue / payments.length : 0;

//     doc.fontSize(16).fillColor('#0d9488').text('Summary', { underline: true });
//     doc.moveDown(0.5);
//     doc.fontSize(11).fillColor('#333').text(`Total Appointments: ${appointments.length}`);
//     doc.text(`Completed: ${completed}`);
//     doc.text(`Cancelled: ${cancelled}`);
//     doc.text(`Total Revenue: LKR ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
//     doc.text(`Total Transactions: ${payments.length}`);
//     doc.text(`Avg Transaction: LKR ${avgTx.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
//     doc.moveDown(1.5);

//     // (trimmed table render to keep length reasonable)
//     doc.fontSize(10).fillColor('#666').text('See CSV export for full data tables.');
//     doc.end();
//   } catch (err) {
//     console.error('Download report error:', err);
//     res.status(500).json({ success: false, message: 'Failed to download report', error: err.message });
//   }
// };

// // ============================================
// // (Other endpoints — getDetailedReport, getSavedReports, addReportComment,
// // scheduleReport, deleteReport, updateReport, getReportById, cancelScheduledReport)
// // remain the same, but make sure any string interpolation uses backticks
// // and any header values are quoted strings.
// // ============================================


// controllers/reportController.js
const mongoose = require('mongoose');
const { Types } = mongoose;

const Report = require('../models/reportModel');
const Appointment = require('../models/appointmentModel');
const Payment = require('../models/paymentModel');
const PatientProfile = require('../models/patientProfileModel');
const PatientReport = require('../models/patientReportModel');
const DoctorProfile = require('../models/doctorProfileModel');
const User = require('../models/userModel');
const Hospital = require('../models/hospitalModel');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const cron = require('node-cron');

const getHospitalId = (req) => req.user?.hospitalId;
const activeSchedules = new Map();

/* ========================= 1) SUMMARY ========================= */
exports.getReportSummary = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });

    const hid = Types.ObjectId.isValid(hospitalId) ? new Types.ObjectId(hospitalId) : hospitalId;

    const { startDate, endDate, department, doctorId, compareWith } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let comparisonDateFilter = null;
    if (compareWith && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end - start;
      comparisonDateFilter = { $gte: new Date(start.getTime() - diff), $lte: new Date(start.getTime()) };
    }

    // ---- Appointments
    const appointmentQuery = { hospitalId: hid };
    if (Object.keys(dateFilter).length) appointmentQuery.slotStart = dateFilter;
    if (doctorId) appointmentQuery.doctorId = Types.ObjectId.isValid(doctorId) ? new Types.ObjectId(doctorId) : doctorId;

    const [appointmentStats, appointmentsByStatus, appointmentsByDay, appointmentsByChannel] = await Promise.all([
      Appointment.aggregate([
        { $match: appointmentQuery },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            booked: { $sum: { $cond: [{ $eq: ['$status', 'booked'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
            noShow: { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } }
          }
        }
      ]),
      Appointment.aggregate([
        { $match: appointmentQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Appointment.aggregate([
        { $match: appointmentQuery },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$slotStart' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      Appointment.aggregate([
        { $match: appointmentQuery },
        { $group: { _id: '$channel', count: { $sum: 1 } } }
      ])
    ]);

    // ---- Payments
    const paymentQuery = { hospitalId: hid, paymentStatus: 'completed' };
    if (Object.keys(dateFilter).length) paymentQuery.createdAt = dateFilter;

    const [paymentStats, paymentsByMethod, dailyRevenue, revenueByService] = await Promise.all([
      Payment.aggregate([
        { $match: paymentQuery },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalTransactions: { $sum: 1 },
            avgTransaction: { $avg: '$totalAmount' },
            totalTax: { $sum: '$tax' },
            totalDiscount: { $sum: '$discount' },
            totalRefunded: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$totalAmount', 0] }
            }
          }
        }
      ]),
      Payment.aggregate([
        { $match: paymentQuery },
        { $group: { _id: '$paymentMethod', total: { $sum: '$totalAmount' }, count: { $sum: 1 }, avgAmount: { $avg: '$totalAmount' } } },
        { $sort: { total: -1 } }
      ]),
      Payment.aggregate([
        { $match: paymentQuery },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, transactions: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      Payment.aggregate([
        { $match: paymentQuery },
        {
          $project: {
            medicationRevenue: {
              $sum: { $map: { input: { $ifNull: ['$medications', []] }, as: 'm', in: '$$m.totalPrice' } }
            },
            surgeryRevenue: {
              $sum: { $map: { input: { $ifNull: ['$surgeries', []] }, as: 's', in: '$$s.totalPrice' } }
            },
            procedureRevenue: {
              $sum: { $map: { input: { $ifNull: ['$procedures', []] }, as: 'p', in: '$$p.totalPrice' } }
            },
            appointmentFee: '$appointmentFee'
          }
        },
        {
          $group: {
            _id: null,
            medications: { $sum: '$medicationRevenue' },
            surgeries: { $sum: '$surgeryRevenue' },
            procedures: { $sum: '$procedureRevenue' },
            appointments: { $sum: '$appointmentFee' }
          }
        }
      ])
    ]);

    // ---- Patients
    const patientStats = await PatientProfile.aggregate([
      { $match: { hospitalId: hid } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          maleCount: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
          femaleCount: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
          otherCount: { $sum: { $cond: [{ $eq: ['$gender', 'other'] }, 1, 0] } },
          withInsurance: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$insurance.provider', null] }, { $ne: ['$insurance.provider', ''] }] },
                1,
                0
              ]
            }
          },
          withAllergies: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ['$allergies', []] } }, 0] }, 1, 0] } }
        }
      }
    ]);

    const patientAgeDistribution = await PatientProfile.aggregate([
      { $match: { hospitalId: hid } },
      {
        $project: {
          age: {
            $floor: {
              $divide: [{ $subtract: [new Date(), '$dob'] }, 1000 * 60 * 60 * 24 * 365.25]
            }
          }
        }
      },
      { $bucket: { groupBy: '$age', boundaries: [0, 18, 30, 45, 60, 75, 100], default: 'Other', output: { count: { $sum: 1 } } } }
    ]);

    // ---- Doctors
    const doctorQuery = { hospitalId: hid };
    if (department) doctorQuery.specialties = { $in: [department] };

    const [doctorCount, topDoctors, doctorsBySpecialty] = await Promise.all([
      DoctorProfile.countDocuments(doctorQuery),
      Appointment.aggregate([
        { $match: appointmentQuery },
        { $group: { _id: '$doctorId', appointmentCount: { $sum: 1 } } },
        { $sort: { appointmentCount: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'doctor' } },
        { $unwind: '$doctor' },
        { $lookup: { from: 'doctorprofiles', localField: '_id', foreignField: 'userId', as: 'profile' } },
        { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            doctorId: '$_id',
            name: { $concat: ['$doctor.firstName', ' ', '$doctor.lastName'] },
            specialty: { $arrayElemAt: ['$profile.specialties', 0] },
            appointmentCount: 1
          }
        }
      ]),
      DoctorProfile.aggregate([
        { $match: doctorQuery },
        { $unwind: '$specialties' },
        { $group: { _id: '$specialties', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // ---- Patient Reports
    const patientReportQuery = { hospitalId: hid };
    if (Object.keys(dateFilter).length) patientReportQuery.createdAt = dateFilter;

    const patientReportStats = await PatientReport.aggregate([
      { $match: patientReportQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          newReports: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          readReports: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
          respondedReports: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } }
        }
      }
    ]);

    // ---- Comparison
    let comparisonData = null;
    if (comparisonDateFilter) {
      const [compAppointments, compPayments] = await Promise.all([
        Appointment.countDocuments({ ...appointmentQuery, slotStart: comparisonDateFilter }),
        Payment.aggregate([
          { $match: { ...paymentQuery, createdAt: comparisonDateFilter } },
          { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
        ])
      ]);
      comparisonData = {
        appointments: compAppointments,
        revenue: compPayments[0]?.total || 0,
        transactions: compPayments[0]?.count || 0
      };
    }

    // ---- Top Medications
    const topMedications = await Payment.aggregate([
      { $match: paymentQuery },
      { $unwind: '$medications' },
      { $group: { _id: '$medications.name', totalQuantity: { $sum: '$medications.quantity' }, totalRevenue: { $sum: '$medications.totalPrice' }, prescriptionCount: { $sum: 1 } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      period: { startDate: startDate || 'all time', endDate: endDate || 'present', compareWith: compareWith || 'none' },
      summary: {
        appointments: {
          total: appointmentStats[0]?.total || 0,
          booked: appointmentStats[0]?.booked || 0,
          completed: appointmentStats[0]?.completed || 0,
          cancelled: appointmentStats[0]?.cancelled || 0,
          noShow: appointmentStats[0]?.noShow || 0
        },
        revenue: {
          total: paymentStats[0]?.totalRevenue || 0,
          transactions: paymentStats[0]?.totalTransactions || 0,
          average: paymentStats[0]?.avgTransaction || 0,
          tax: paymentStats[0]?.totalTax || 0,
          discount: paymentStats[0]?.totalDiscount || 0,
          refunded: paymentStats[0]?.totalRefunded || 0
        },
        patients: {
          total: patientStats[0]?.total || 0,
          male: patientStats[0]?.maleCount || 0,
          female: patientStats[0]?.femaleCount || 0,
          other: patientStats[0]?.otherCount || 0,
          withInsurance: patientStats[0]?.withInsurance || 0,
          withAllergies: patientStats[0]?.withAllergies || 0
        },
        doctors: { total: doctorCount },
        patientReports: {
          total: patientReportStats[0]?.total || 0,
          new: patientReportStats[0]?.newReports || 0,
          read: patientReportStats[0]?.readReports || 0,
          responded: patientReportStats[0]?.respondedReports || 0,
          highPriority: patientReportStats[0]?.highPriority || 0
        }
      },
      charts: {
        appointmentsByStatus,
        appointmentsByDay,
        appointmentsByChannel,
        paymentsByMethod,
        dailyRevenue,
        revenueByService: revenueByService[0] || {},
        topDoctors,
        doctorsBySpecialty,
        patientAgeDistribution,
        topMedications
      },
      comparison: comparisonData
    });
  } catch (error) {
    console.error('Get report summary error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report', error: error.message });
  }
};

/* ==================== 2) DETAILED ==================== */
exports.getDetailedReport = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { type, id, startDate, endDate } = req.query;
    if (!type) return res.status(400).json({ message: 'Report type required' });

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let data = null;

    if (type === 'doctor') {
      if (!id) return res.status(400).json({ message: 'Doctor ID required' });
      const doctor = await User.findById(id).select('firstName lastName email');
      const doctorProfile = await DoctorProfile.findOne({ userId: id });

      const doctorAppointments = await Appointment.find({
        hospitalId,
        doctorId: id,
        ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
      })
        .populate('patientId', 'firstName lastName')
        .sort({ slotStart: -1 })
        .limit(100);

      const doctorRevenue = await Payment.aggregate([
        { $match: { hospitalId, ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }) } },
        { $unwind: { path: '$medications', preserveNullAndEmptyArrays: true } },
        { $group: { _id: null, totalRevenue: { $sum: '$medications.totalPrice' }, medicationCount: { $sum: 1 } } }
      ]);

      const doctorAppointmentStats = await Appointment.aggregate([
        { $match: { hospitalId, doctorId: id, ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter }) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      data = {
        doctor: {
          id: doctor._id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          email: doctor.email,
          specialty: doctorProfile?.specialties || [],
          consultationFee: doctorProfile?.consultationFee || 0,
          roomNo: doctorProfile?.roomNo || 'N/A'
        },
        appointments: doctorAppointments,
        appointmentStats: doctorAppointmentStats,
        revenue: doctorRevenue[0] || { totalRevenue: 0, medicationCount: 0 }
      };
    } else if (type === 'department') {
      if (!id) return res.status(400).json({ message: 'Department name required' });

      const deptDoctors = await DoctorProfile.find({
        hospitalId,
        specialties: { $in: [id] }
      }).populate('userId', 'firstName lastName email');

      const doctorIds = deptDoctors.map((d) => d.userId._id);

      const deptAppointments = await Appointment.countDocuments({
        hospitalId,
        doctorId: { $in: doctorIds },
        ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
      });

      const deptRevenue = await Payment.aggregate([
        { $match: { hospitalId, ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }) } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      data = {
        department: id,
        doctors: deptDoctors.map((d) => ({
          id: d.userId._id,
          name: `${d.userId.firstName} ${d.userId.lastName}`,
          email: d.userId.email,
          consultationFee: d.consultationFee,
          roomNo: d.roomNo
        })),
        totalAppointments: deptAppointments,
        totalRevenue: deptRevenue[0]?.total || 0
      };
    } else if (type === 'service') {
      const servicePayments = await Payment.find({
        hospitalId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      })
        .select('medications surgeries procedures appointmentFee totalAmount createdAt')
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(100);

      const serviceStats = await Payment.aggregate([
        { $match: { hospitalId, ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: null,
            totalMedicationRevenue: {
              $sum: {
                $sum: { $map: { input: { $ifNull: ['$medications', []] }, as: 'm', in: '$$m.totalPrice' } }
              }
            },
            totalSurgeryRevenue: {
              $sum: {
                $sum: { $map: { input: { $ifNull: ['$surgeries', []] }, as: 's', in: '$$s.totalPrice' } }
              }
            },
            totalProcedureRevenue: {
              $sum: {
                $sum: { $map: { input: { $ifNull: ['$procedures', []] }, as: 'p', in: '$$p.totalPrice' } }
              }
            },
            totalAppointmentFees: { $sum: '$appointmentFee' }
          }
        }
      ]);

      data = { payments: servicePayments, statistics: serviceStats[0] || {} };
    } else if (type === 'patient') {
      if (!id) return res.status(400).json({ message: 'Patient ID required' });

      const patient = await PatientProfile.findOne({ userId: id, hospitalId }).populate('userId', 'firstName lastName email phone');
      if (!patient) return res.status(404).json({ message: 'Patient not found' });

      const patientAppointments = await Appointment.find({
        hospitalId,
        patientId: id,
        ...(Object.keys(dateFilter).length > 0 && { slotStart: dateFilter })
      })
        .populate('doctorId', 'firstName lastName')
        .sort({ slotStart: -1 });

      const patientPayments = await Payment.find({
        hospitalId,
        userId: id,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      }).sort({ createdAt: -1 });

      const patientReports = await PatientReport.find({
        hospitalId,
        userId: id,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter })
      })
        .populate('respondedBy', 'firstName lastName')
        .sort({ createdAt: -1 });

      data = {
        patient: {
          id: patient._id,
          name: `${patient.userId.firstName} ${patient.userId.lastName}`,
          email: patient.userId.email,
          phone: patient.userId.phone,
          dob: patient.dob,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          allergies: patient.allergies,
          chronicConditions: patient.chronicConditions,
          medications: patient.medications
        },
        appointments: patientAppointments,
        payments: patientPayments,
        reports: patientReports,
        totalSpent: patientPayments.reduce((sum, p) => sum + p.totalAmount, 0)
      };
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({ success: true, type, data });
  } catch (error) {
    console.error('Get detailed report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch detailed report', error: error.message });
  }
};

/* ==================== 3) SAVE REPORT ==================== */
exports.saveReport = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.user.sub;

    const { reportType, title, description, filters = {}, data, schedule } = req.body;
    if (!reportType || !title) return res.status(400).json({ message: 'Report type and title required' });

    const cleanFilters = {};
    if (filters.startDate) cleanFilters.startDate = new Date(filters.startDate);
    if (filters.endDate) cleanFilters.endDate = new Date(filters.endDate);
    ['department', 'serviceType', 'paymentMethod', 'status'].forEach((k) => {
      if (filters[k]) cleanFilters[k] = filters[k];
    });
    if (filters.doctorId) cleanFilters.doctorId = filters.doctorId;

    const report = new Report({
      hospitalId,
      createdBy: userId,
      reportType,
      title,
      description,
      filters: cleanFilters,
      data,
      schedule
    });

    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report saved successfully',
      report: {
        _id: report._id,
        reportId: report.reportId,
        title: report.title,
        reportType: report.reportType,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Save report error:', error);
    res.status(500).json({ success: false, message: 'Failed to save report', error: error.message });
  }
};

/* ==================== 4) GET SAVED REPORTS ==================== */
exports.getSavedReports = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { status, type, page = 1, limit = 20 } = req.query;

    const query = { hospitalId };
    if (status) query.status = status;
    if (type) query.reportType = type;

    const reports = await Report.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      reports,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalReports: total
      }
    });
  } catch (error) {
    console.error('Get saved reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
  }
};

/* ==================== 5) ADD COMMENT ==================== */
exports.addReportComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { comment } = req.body;
    const userId = req.user.sub;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        $push: {
          comments: {
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            comment: comment.trim(),
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.json({ success: true, message: 'Comment added successfully', comments: report.comments });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message });
  }
};

// ==================== 6) DOWNLOAD REPORT (polished PDF layout, no blank pages; fixed revenue; no "Completed") ====================
exports.downloadReport = async (req, res) => {
  try {
    const { format } = req.query;
    const hospitalId = getHospitalId(req);

    if (!format || !['pdf', 'csv'].includes(format)) {
      return res.status(400).json({ message: 'Invalid format. Use "pdf" or "csv"' });
    }

    // Normalize hospitalId -> works whether DB stores string or ObjectId
    const hid = Types.ObjectId.isValid(hospitalId) ? new Types.ObjectId(hospitalId) : hospitalId;

    // --- Pull the data ---
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const appointmentQuery = { hospitalId: hid };
    if (Object.keys(dateFilter).length) appointmentQuery.slotStart = dateFilter;

    const paymentMatch = { hospitalId: hid, paymentStatus: 'completed' };
    if (Object.keys(dateFilter).length) paymentMatch.createdAt = dateFilter;

    const [
      appointments,
      payments,
      hospital,
      paymentsByMethodAgg,
      revenueByServiceAgg
    ] = await Promise.all([
      Appointment.find(appointmentQuery)
        .populate('doctorId', 'firstName lastName')
        .populate('patientId', 'firstName lastName')
        .sort({ slotStart: -1 })
        .limit(1000),

      Payment.find(paymentMatch)
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(1000),

      Hospital.findById(hid),

      // Payment methods breakdown
      Payment.aggregate([
        { $match: paymentMatch },
        { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
        { $sort: { total: -1 } }
      ]),

      // Revenue by service
      Payment.aggregate([
        { $match: paymentMatch },
        {
          $project: {
            medicationRevenue: { $sum: { $map: { input: { $ifNull: ['$medications', []] }, as: 'm', in: '$$m.totalPrice' } } },
            surgeryRevenue:    { $sum: { $map: { input: { $ifNull: ['$surgeries',  []] }, as: 's', in: '$$s.totalPrice' } } },
            procedureRevenue:  { $sum: { $map: { input: { $ifNull: ['$procedures', []] }, as: 'p', in: '$$p.totalPrice' } } },
            appointmentFee: '$appointmentFee'
          }
        },
        {
          $group: {
            _id: null,
            medications: { $sum: '$medicationRevenue' },
            surgeries:   { $sum: '$surgeryRevenue' },
            procedures:  { $sum: '$procedureRevenue' },
            appointments:{ $sum: '$appointmentFee' }
          }
        }
      ])
    ]);

    if (format === 'csv') {
      const appointmentFields = [
        { label: 'Date', value: (row) => new Date(row.slotStart).toLocaleDateString() },
        { label: 'Time', value: (row) => new Date(row.slotStart).toLocaleTimeString() },
        { label: 'Patient', value: (row) => (row.patientId ? `${row.patientId.firstName} ${row.patientId.lastName}` : 'N/A') },
        { label: 'Doctor', value: (row) => (row.doctorId ? `${row.doctorId.firstName} ${row.doctorId.lastName}` : 'N/A') },
        { label: 'Status', value: 'status' },
        { label: 'Reason', value: 'reason' },
        { label: 'Channel', value: 'channel' }
      ];
      const paymentFields = [
        { label: 'Date', value: (row) => new Date(row.createdAt).toLocaleDateString() },
        { label: 'Receipt Number', value: 'receiptNumber' },
        { label: 'Patient', value: (row) => (row.userId ? `${row.userId.firstName} ${row.userId.lastName}` : 'N/A') },
        { label: 'Amount (LKR)', value: 'totalAmount' },
        { label: 'Payment Method', value: 'paymentMethod' },
        { label: 'Status', value: 'paymentStatus' },
        { label: 'Tax (LKR)', value: 'tax' },
        { label: 'Discount (LKR)', value: 'discount' }
      ];
      const appointmentParser = new Parser({ fields: appointmentFields });
      const paymentParser = new Parser({ fields: paymentFields });

      const appointmentCsv = appointments.length ? appointmentParser.parse(appointments) : 'No appointments data';
      const paymentCsv = payments.length ? paymentParser.parse(payments) : 'No payments data';

      const totalRevenue = payments.reduce((s, p) => s + (p.totalAmount || 0), 0);
      const totalAppointments = appointments.length;

      const header =
        `Hospital Report - ${hospital?.name || 'Unknown'}\n` +
        `Generated: ${new Date().toLocaleString()}\n` +
        `Period: ${startDate || 'All time'} to ${endDate || 'Present'}\n\n` +
        `SUMMARY\n` +
        `Total Appointments,${totalAppointments}\n` +
        `Total Revenue,LKR ${totalRevenue.toFixed(2)}\n` +
        `Total Transactions,${payments.length}\n\n` +
        `APPOINTMENTS\n`;

      const combinedCsv = header + appointmentCsv + `\n\nPAYMENTS\n` + paymentCsv;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=hospital-report-${Date.now()}.csv`);
      return res.send(combinedCsv);
    }

    // ---------------- PDF ----------------
    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

    // helpers
    const pageWidth = 595.28; // A4 width pt
    const left = 50;
    const right = pageWidth - 50;
    const brand = '#0d9488';
    const muted = '#6b7280';
    const gridGap = 10;

    function money(n) {
      return (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function drawDivider() {
      const y = doc.y + 4;
      doc.moveTo(left, y).lineTo(right, y).strokeColor(brand).lineWidth(0.5).stroke();
      doc.moveDown(0.6);
    }
    function kpi(title, value, x, y, w, h) {
      doc.save();
      doc.roundedRect(x, y, w, h, 6).fillOpacity(0.06).fill(brand).fillOpacity(1).strokeColor('#e5e7eb').lineWidth(0.5).stroke();
      doc.fillColor(muted).fontSize(9).text(title, x + 10, y + 8, { width: w - 20 });
      doc.fillColor('#111827').fontSize(16).text(value, x + 10, y + 24, { width: w - 20 });
      doc.restore();
    }
    function writePageNumbers() {
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        const txt = `Page ${i + 1} of ${range.count}`;
        doc.fontSize(8).fillColor(muted).text(txt, left, 810, { width: right - left, align: 'center' });
      }
    }
    function table({ columns, rows, topY, zebra = true }) {
      const colX = [];
      let x = left;
      columns.forEach((c) => { colX.push(x); x += c.width; });
      const headerY = topY;

      // header
      doc.fontSize(9).fillColor(brand);
      columns.forEach((c, i) => {
        doc.text(c.label, colX[i] + 2, headerY, { width: c.width - 4 });
      });
      doc.moveTo(left, headerY + 12).lineTo(right, headerY + 12).strokeColor(brand).lineWidth(0.5).stroke();

      // body
      doc.fontSize(9).fillColor('#111827');
      let y = headerY + 16;
      rows.forEach((row, idx) => {
        if (y > 760) {
          doc.addPage();
          y = 60;
          // redraw header
          doc.fontSize(9).fillColor(brand);
          columns.forEach((c, i) => doc.text(c.label, colX[i], y, { width: c.width - 4 }));
          doc.moveTo(left, y + 12).lineTo(right, y + 12).strokeColor(brand).lineWidth(0.5).stroke();
          y += 16;
        }
        if (zebra && idx % 2 === 0) {
          doc.save();
          doc.rect(left, y - 2, right - left, 14).fillOpacity(0.05).fill('#f3f4f6').fillOpacity(1);
          doc.restore();
        }
        columns.forEach((c, i) => {
          const val = typeof c.accessor === 'function' ? c.accessor(row) : row[c.accessor];
          doc.fillColor('#111827').text(String(val ?? ''), colX[i] + 2, y, { width: c.width - 4 });
        });
        y += 16;
      });
      doc.moveDown(1);
      return y;
    }

    // KPIs (NO "Completed")
    const totalRevenue = payments.reduce((s, p) => s + (p.totalAmount || 0), 0);
    const avgTxn = payments.length ? totalRevenue / payments.length : 0;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const revenueByService = revenueByServiceAgg[0] || { medications: 0, surgeries: 0, procedures: 0, appointments: 0 };

    // header
    const filename = `hospital-report-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    doc.pipe(res);

    doc.fontSize(22).fillColor(brand).text('Hospital Analytics Report', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor('#111827').text(hospital?.name || 'Hospital', { align: 'center' });
    doc.fontSize(10).fillColor(muted).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    if (startDate || endDate) doc.text(`Period: ${startDate || 'All time'} → ${endDate || 'Present'}`, { align: 'center' });
    doc.moveDown(1);
    drawDivider();

    // KPI grid (3 + 2 cards)
    const cardW = (right - left - gridGap * 2) / 3;
    const cardH = 52;
    let yKpi = doc.y;
    kpi('Appointments', appointments.length, left, yKpi, cardW, cardH);
    kpi('Cancelled', cancelled, left + cardW + gridGap, yKpi, cardW, cardH);
    kpi('Revenue (LKR)', money(totalRevenue), left + (cardW + gridGap) * 2, yKpi, cardW, cardH);
    yKpi += cardH + gridGap;
    kpi('Avg Transaction (LKR)', money(avgTxn), left, yKpi, cardW, cardH);
    kpi('Transactions', payments.length, left + cardW + gridGap, yKpi, cardW, cardH);
    // (third card intentionally left empty for balance)
    doc.y = yKpi + cardH + 12;

    // Appointments table
    doc.fontSize(14).fillColor('#111827').text('Recent Appointments');
    drawDivider();
    if (!appointments.length) {
      doc.fontSize(10).fillColor(muted).text('No appointments found for this period.');
    } else {
      table({
        topY: doc.y,
        columns: [
          { label: 'Date',    width: 90,  accessor: (r) => new Date(r.slotStart).toLocaleDateString() },
          { label: 'Patient', width: 150, accessor: (r) => r.patientId ? `${r.patientId.firstName} ${r.patientId.lastName}` : 'N/A' },
          { label: 'Doctor',  width: 150, accessor: (r) => r.doctorId ? `${r.doctorId.firstName} ${r.doctorId.lastName}` : 'N/A' },
          { label: 'Status',  width: 80,  accessor: (r) => r.status || '—' },
          { label: 'Channel', width: 75,  accessor: (r) => r.channel || '—' }
        ],
        rows: appointments.slice(0, 200)
      });
    }

    // Payments table
    if (doc.y > 640) doc.addPage();
    doc.fontSize(14).fillColor('#111827').text('Recent Payments');
    drawDivider();
    if (!payments.length) {
      doc.fontSize(10).fillColor(muted).text('No payments found for this period.');
    } else {
      table({
        topY: doc.y,
        columns: [
          { label: 'Date',          width: 90,  accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
          { label: 'Receipt',       width: 90,  accessor: (r) => r.receiptNumber || '—' },
          { label: 'Patient',       width: 150, accessor: (r) => r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : 'N/A' },
          { label: 'Method',        width: 90,  accessor: (r) => r.paymentMethod || '—' },
          { label: 'Amount (LKR)',  width: 110, accessor: (r) => money(r.totalAmount) }
        ],
        rows: payments.slice(0, 200)
      });
    }

    // Payment methods breakdown
    if (doc.y > 640) doc.addPage();
    doc.fontSize(14).fillColor('#111827').text('Payment Methods Breakdown');
    drawDivider();
    table({
      topY: doc.y,
      columns: [
        { label: 'Method',       width: 220, accessor: (r) => r._id || '—' },
        { label: 'Transactions', width: 120, accessor: (r) => r.count },
        { label: 'Total (LKR)',  width: 150, accessor: (r) => money(r.total) }
      ],
      rows: paymentsByMethodAgg
    });

    // Revenue by service
    if (doc.y > 640) doc.addPage();
    doc.fontSize(14).fillColor('#111827').text('Revenue by Service');
    drawDivider();
    const serviceRows = [
      { label: 'Medications',      total: revenueByService.medications || 0 },
      { label: 'Surgeries',        total: revenueByService.surgeries   || 0 },
      { label: 'Procedures',       total: revenueByService.procedures  || 0 },
      { label: 'Appointment Fees', total: revenueByService.appointments|| 0 }
    ];
    table({
      topY: doc.y,
      columns: [
        { label: 'Service',     width: 300, accessor: (r) => r.label },
        { label: 'Total (LKR)', width: 220, accessor: (r) => money(r.total) }
      ],
      rows: serviceRows,
      zebra: false
    });

    // Top medications
    const topMedsAgg = await Payment.aggregate([
      { $match: paymentMatch },
      { $unwind: '$medications' },
      { $group: {
          _id: '$medications.name',
          totalQuantity: { $sum: '$medications.quantity' },
          totalRevenue:  { $sum: '$medications.totalPrice' }
        } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 15 }
    ]);
    if (topMedsAgg.length) {
      if (doc.y > 640) doc.addPage();
      doc.fontSize(14).fillColor('#111827').text('Top Medications');
      drawDivider();
      table({
        topY: doc.y,
        columns: [
          { label: 'Medication',     width: 260, accessor: (r) => r._id || '—' },
          { label: 'Quantity',       width: 120, accessor: (r) => r.totalQuantity },
          { label: 'Revenue (LKR)',  width: 160, accessor: (r) => money(r.totalRevenue) }
        ],
        rows: topMedsAgg
      });
    }

    // closing note
    doc.moveDown(2);
    doc.fontSize(9).fillColor(muted).text('This is a system-generated report.', { align: 'center' });

    // page numbers at the very end (prevents blank trailing pages)
    writePageNumbers();
    doc.end();
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ success: false, message: 'Failed to download report', error: error.message });
  }
};


/* ==================== 7) SCHEDULE REPORT ==================== */
exports.scheduleReport = async (req, res) => {
  try {
    const { reportId, frequency, recipients } = req.body;

    if (!reportId || !frequency || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'Report ID, frequency, and recipients array required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({ message: `Invalid email addresses: ${invalidEmails.join(', ')}` });
    }

    let cronExpression;
    switch (frequency) {
      case 'daily':   cronExpression = '0 9 * * *'; break;
      case 'weekly':  cronExpression = '0 9 * * 1'; break;
      case 'monthly': cronExpression = '0 9 1 * *'; break;
      case 'custom':
        cronExpression = req.body.cronExpression;
        if (!cronExpression || !cron.validate(cronExpression)) {
          return res.status(400).json({ message: 'Invalid cron expression' });
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid frequency. Use: daily, weekly, monthly, or custom' });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        'schedule.enabled': true,
        'schedule.frequency': frequency,
        'schedule.cronExpression': cronExpression,
        'schedule.recipients': recipients,
        'schedule.nextRun': getNextRunDate(cronExpression)
      },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (activeSchedules.has(reportId)) {
      activeSchedules.get(reportId).stop();
      activeSchedules.delete(reportId);
    }

    const task = cron.schedule(cronExpression, async () => {
      try {
        await Report.findByIdAndUpdate(reportId, {
          'schedule.lastRun': new Date(),
          'schedule.nextRun': getNextRunDate(cronExpression)
        });
        // Email sending would go here
      } catch (err) {
        console.error(`[CRON] Error running scheduled report ${reportId}:`, err);
      }
    });

    activeSchedules.set(reportId, task);

    res.json({
      success: true,
      message: 'Report scheduled successfully',
      schedule: {
        enabled: report.schedule.enabled,
        frequency: report.schedule.frequency,
        cronExpression: report.schedule.cronExpression,
        recipients: report.schedule.recipients,
        nextRun: report.schedule.nextRun
      }
    });
  } catch (error) {
    console.error('Schedule report error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule report', error: error.message });
  }
};

/* ==================== 8) DELETE REPORT ==================== */
exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const hospitalId = getHospitalId(req);

    const report = await Report.findOneAndDelete({ _id: reportId, hospitalId });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (activeSchedules.has(reportId)) {
      activeSchedules.get(reportId).stop();
      activeSchedules.delete(reportId);
    }

    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report', error: error.message });
  }
};

/* ========== (Optional) Helpers/other endpoints you had ========== */
exports.updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const hospitalId = getHospitalId(req);
    const userId = req.user.sub;

    const { title, description, filters, data, status } = req.body;
    const report = await Report.findOne({ _id: reportId, hospitalId });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (report.data) {
      report.previousVersions.push({
        version: report.version,
        data: report.data,
        updatedAt: new Date(),
        updatedBy: userId
      });
    }

    if (title) report.title = title;
    if (description !== undefined) report.description = description;
    if (filters) report.filters = filters;
    if (data) report.data = data;
    if (status) report.status = status;

    report.version += 1;
    await report.save();

    res.json({
      success: true,
      message: 'Report updated successfully',
      report: {
        _id: report._id,
        reportId: report.reportId,
        title: report.title,
        version: report.version,
        updatedAt: report.updatedAt
      }
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ success: false, message: 'Failed to update report', error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const hospitalId = getHospitalId(req);

    const report = await Report.findOne({ _id: reportId, hospitalId })
      .populate('createdBy', 'firstName lastName email')
      .populate('comments.userId', 'firstName lastName');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.views += 1;
    await report.save();

    res.json({ success: true, report });
  } catch (error) {
    console.error('Get report by ID error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report', error: error.message });
  }
};

exports.cancelScheduledReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const hospitalId = getHospitalId(req);

    const report = await Report.findOneAndUpdate(
      { _id: reportId, hospitalId },
      { 'schedule.enabled': false, 'schedule.nextRun': null },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (activeSchedules.has(reportId)) {
      activeSchedules.get(reportId).stop();
      activeSchedules.delete(reportId);
    }

    res.json({ success: true, message: 'Scheduled report cancelled successfully', schedule: report.schedule });
  } catch (error) {
    console.error('Cancel scheduled report error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel scheduled report', error: error.message });
  }
};

function getNextRunDate(cronExpression) {
  try {
    const now = new Date();
    const parts = cronExpression.split(' ');
    // Minimal next-run helper; for production use a cron parser lib
    const next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return next;
  } catch {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 1);
    return fallback;
  }
}

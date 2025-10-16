


// const express = require('express');
// const mongoose = require('mongoose');
// const router = express.Router();
// const auth = require('../middleware/authMiddleware');
// const MedicalHistory = require('../models/medicalHistoryModel');
// const PatientProfile = require('../models/patientProfileModel');
// const User = require('../models/userModel');

// // Helper function to get hospital ID from request
// const getHospitalId = (req) => {
//   return req.user?.hospitalId || req.user?.hospital?._id;
// };

// // -------------------- Medical History Routes -------------------- //

// // Get patient's medical history (patients can view their own, doctors can view any)
// router.get('/patient/:userId', auth(['patient', 'doctor', 'admin']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const rawUserId = req.params.userId;
//     const userId = (require('mongoose').Types.ObjectId.isValid(rawUserId)
//       ? new (require('mongoose')).Types.ObjectId(rawUserId)
//       : rawUserId);

//     // Patients can only view their own medical history
//     if (req.user.role === 'patient' && String(req.user.sub) !== String(userId)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Find the patient profile first
//     const patientProfile = await PatientProfile.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     if (!patientProfile) {
//       return res.status(404).json({ message: 'Patient profile not found' });
//     }

//     // Get or create medical history
//     let medicalHistory = await MedicalHistory.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     // If no medical history exists, create one with basic info from patient profile
//     if (!medicalHistory) {
//       medicalHistory = new MedicalHistory({
//         patientId: patientProfile._id,
//         userId,
//         hospitalId,
//         bloodType: patientProfile.bloodGroup,
//         allergies: patientProfile.allergies || [],
//         chronicConditions: patientProfile.chronicConditions || [],
//         familyConditions: patientProfile.familyConditions || [],
//         emergencyContact: patientProfile.emergencyContact || {},
//         medications: (patientProfile.medications || []).map(med => ({
//           name: med,
//           dosage: 'As prescribed',
//           startDate: new Date(),
//           status: 'active',
//           prescribedBy: 'Healthcare Provider'
//         })),
//         lastUpdatedBy: req.user.sub,
//         lastUpdatedAt: new Date()
//       });
//       await medicalHistory.save();
//     }

//     // Ensure medications reflect profile: add missing as active, mark removed as completed
//     try {
//       const profileMedNames = new Set((patientProfile.medications || []).filter(Boolean));
//       const historyByName = new Map((medicalHistory.medications || []).map(m => [m.name, m]));

//       let changed = false;

//       // Add any missing medications from profile to history as active entries
//       for (const name of profileMedNames) {
//         if (!historyByName.has(name)) {
//           medicalHistory.medications.push({
//             name,
//             dosage: 'As prescribed',
//             startDate: new Date(),
//             status: 'active',
//             prescribedBy: 'Healthcare Provider'
//           });
//           changed = true;
//         } else {
//           const entry = historyByName.get(name);
//           if (entry.status !== 'active') {
//             entry.status = 'active';
//             entry.endDate = undefined;
//             entry.dosage = entry.dosage || 'As prescribed';
//             entry.prescribedBy = entry.prescribedBy || 'Healthcare Provider';
//             if (!entry.startDate) entry.startDate = new Date();
//             changed = true;
//           }
//         }
//       }

//       // Mark meds that are not in profile as completed (past)
//       for (const entry of medicalHistory.medications) {
//         if (!profileMedNames.has(entry.name)) {
//           if (entry.status !== 'completed' && entry.status !== 'discontinued') {
//             entry.status = 'completed';
//             if (!entry.endDate) entry.endDate = new Date();
//             changed = true;
//           }
//         }
//       }

//       if (changed) {
//         medicalHistory.lastUpdatedBy = req.user.sub;
//         medicalHistory.lastUpdatedAt = new Date();
//         await medicalHistory.save();
//       }
//     } catch (syncErr) {
//       console.error('MedicalHistory GET sync medications error:', syncErr);
//       // Non-fatal for response
//     }

//     // Populate user info for responses
//     await medicalHistory.populate('lastUpdatedBy', 'firstName lastName');

//     res.json({
//       medicalHistory: {
//         _id: medicalHistory._id,
//         bloodType: medicalHistory.bloodType,
//         allergies: medicalHistory.allergies,
//         chronicConditions: medicalHistory.chronicConditions,
//         prescriptions: medicalHistory.prescriptions,
//         familyConditions: medicalHistory.familyConditions,
//         vitalSigns: medicalHistory.vitalSigns,
//         labResults: medicalHistory.labResults,
//         medications: medicalHistory.medications,
//         diagnoses: medicalHistory.diagnoses,
//         procedures: medicalHistory.procedures,
//         immunizations: medicalHistory.immunizations,
//         familyHistory: medicalHistory.familyHistory,
//         emergencyContact: medicalHistory.emergencyContact,
//         generalNotes: medicalHistory.generalNotes,
//         lastUpdatedBy: medicalHistory.lastUpdatedBy,
//         lastUpdatedAt: medicalHistory.lastUpdatedAt,
//         createdAt: medicalHistory.createdAt,
//         updatedAt: medicalHistory.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error('Get medical history error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update medical history (doctors and admin only)
// router.put('/patient/:userId', auth(['doctor', 'admin']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = req.params.userId;

//     // Find the patient profile
//     const patientProfile = await PatientProfile.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     if (!patientProfile) {
//       return res.status(404).json({ message: 'Patient profile not found' });
//     }

//     const updateData = {
//       ...req.body,
//       lastUpdatedBy: req.user.sub,
//       lastUpdatedAt: new Date()
//     };

//     const medicalHistory = await MedicalHistory.findOneAndUpdate(
//       { userId, hospitalId },
//       updateData,
//       { 
//         new: true, 
//         upsert: true, // Create if doesn't exist
//         setDefaultsOnInsert: true
//       }
//     ).populate('lastUpdatedBy', 'firstName lastName');

//     res.json({
//       message: 'Medical history updated successfully',
//       medicalHistory: {
//         _id: medicalHistory._id,
//         bloodType: medicalHistory.bloodType,
//         allergies: medicalHistory.allergies,
//         chronicConditions: medicalHistory.chronicConditions,
//         vitalSigns: medicalHistory.vitalSigns,
//         labResults: medicalHistory.labResults,
//         medications: medicalHistory.medications,
//         diagnoses: medicalHistory.diagnoses,
//         procedures: medicalHistory.procedures,
//         immunizations: medicalHistory.immunizations,
//         familyHistory: medicalHistory.familyHistory,
//         emergencyContact: medicalHistory.emergencyContact,
//         generalNotes: medicalHistory.generalNotes,
//         lastUpdatedBy: medicalHistory.lastUpdatedBy,
//         lastUpdatedAt: medicalHistory.lastUpdatedAt,
//         updatedAt: medicalHistory.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error('Update medical history error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add specific medical record (doctors and admin only)
// router.post('/patient/:userId/:recordType', auth(['doctor', 'admin']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = req.params.userId;
//     const recordType = req.params.recordType;

//     const validRecordTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    
//     if (!validRecordTypes.includes(recordType)) {
//       return res.status(400).json({ message: 'Invalid record type' });
//     }

//     // Find the patient profile
//     const patientProfile = await PatientProfile.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     if (!patientProfile) {
//       return res.status(404).json({ message: 'Patient profile not found' });
//     }

//     // Get or create medical history
//     let medicalHistory = await MedicalHistory.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     if (!medicalHistory) {
//       medicalHistory = new MedicalHistory({
//         patientId: patientProfile._id,
//         userId,
//         hospitalId,
//         bloodType: patientProfile.bloodGroup,
//         allergies: patientProfile.allergies || [],
//         chronicConditions: patientProfile.chronicConditions || [],
//         familyConditions: patientProfile.familyConditions || [],
//         emergencyContact: patientProfile.emergencyContact || {},
//         lastUpdatedBy: req.user.sub,
//         lastUpdatedAt: new Date()
//       });
//     }

//     // Validate minimal required fields for prescriptions
//     if (recordType === 'prescriptions') {
//       if (!req.body.medicationName || !req.body.dosage) {
//         return res.status(400).json({ message: 'medicationName and dosage are required' });
//       }
//     }

//     // Add the new record
//     const doctorName = [req.user?.firstName, req.user?.lastName].filter(Boolean).join(' ') || req.user?.name || 'Doctor';
//     const now = new Date();
//     const newRecord = {
//       ...req.body,
//       ...(recordType === 'vitalSigns' && req.body.weight && req.body.height && {
//         bmi: req.body.weight / Math.pow(req.body.height / 100, 2)
//       }),
//       ...(recordType === 'medications' && {
//         startDate: req.body.startDate ? new Date(req.body.startDate) : now,
//         status: req.body.status || 'active',
//         prescribedBy: req.body.prescribedBy || doctorName
//       }),
//       ...(recordType === 'prescriptions' && {
//         prescriptionId: req.body.prescriptionId || `RX-${now.getTime()}`,
//         medicationName: req.body.medicationName,
//         dosage: req.body.dosage || 'As prescribed',
//         prescribedBy: req.body.prescribedBy || doctorName,
//         prescribedDate: req.body.prescribedDate ? new Date(req.body.prescribedDate) : now,
//         startDate: req.body.startDate ? new Date(req.body.startDate) : now,
//         status: req.body.status || 'prescribed',
//         refills: typeof req.body.refills === 'number' ? req.body.refills : (req.body.refills ? Number(req.body.refills) : 0),
//         refillsUsed: typeof req.body.refillsUsed === 'number' ? req.body.refillsUsed : 0
//       })
//     };

//     // Defensive: ensure arrays are initialized
//     if (!medicalHistory.prescriptions) medicalHistory.prescriptions = [];
//     if (!medicalHistory.medications) medicalHistory.medications = [];

//     medicalHistory[recordType].push(newRecord);
//     medicalHistory.lastUpdatedBy = req.user.sub;
//     medicalHistory.lastUpdatedAt = new Date();

//     await medicalHistory.save();

//     res.json({
//       message: `${recordType} record added successfully`,
//       record: newRecord
//     });
//   } catch (error) {
//     console.error('Add medical record error:', error);
//     res.status(500).json({ message: error?.message || 'Server error' });
//   }
// });

// // Update specific medical record (doctors and admin only)
// router.put('/patient/:userId/:recordType/:recordId', auth(['doctor', 'admin']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = req.params.userId;
//     const recordType = req.params.recordType;
//     const recordId = req.params.recordId;

//     const validRecordTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    
//     if (!validRecordTypes.includes(recordType)) {
//       return res.status(400).json({ message: 'Invalid record type' });
//     }

//     const medicalHistory = await MedicalHistory.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     if (!medicalHistory) {
//       return res.status(404).json({ message: 'Medical history not found' });
//     }

//     // Find and update the specific record
//     const record = medicalHistory[recordType].id(recordId);
//     if (!record) {
//       return res.status(404).json({ message: 'Record not found' });
//     }

//     // Update the record
//     Object.assign(record, req.body);
    
//     // Recalculate BMI if vital signs are updated
//     if (recordType === 'vitalSigns' && req.body.weight && req.body.height) {
//       record.bmi = req.body.weight / Math.pow(req.body.height / 100, 2);
//     }

//     medicalHistory.lastUpdatedBy = req.user.sub;
//     medicalHistory.lastUpdatedAt = new Date();

//     await medicalHistory.save();

//     res.json({
//       message: `${recordType} record updated successfully`,
//       record: record
//     });
//   } catch (error) {
//     console.error('Update medical record error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete specific medical record (doctors and admin only)
// router.delete('/patient/:userId/:recordType/:recordId', auth(['doctor', 'admin']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = req.params.userId;
//     const recordType = req.params.recordType;
//     const recordId = req.params.recordId;

//     const validRecordTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    
//     if (!validRecordTypes.includes(recordType)) {
//       return res.status(400).json({ message: 'Invalid record type' });
//     }

//     const medicalHistory = await MedicalHistory.findOne({ 
//       userId, 
//       hospitalId 
//     });

//     if (!medicalHistory) {
//       return res.status(404).json({ message: 'Medical history not found' });
//     }

//     // Find the specific record
//     const record = medicalHistory[recordType].id(recordId);
//     if (!record) {
//       return res.status(404).json({ message: 'Record not found' });
//     }

//     if (recordType === 'medications') {
//       // Soft-complete medication instead of hard delete
//       record.status = 'completed';
//       record.endDate = new Date();
//     } else {
//       // Hard delete for other record types
//       record.remove();
//     }
//     medicalHistory.lastUpdatedBy = req.user.sub;
//     medicalHistory.lastUpdatedAt = new Date();

//     await medicalHistory.save();

//     res.json({
//       message: recordType === 'medications' 
//         ? 'Medication marked as completed successfully' 
//         : `${recordType} record deleted successfully`
//     });
//   } catch (error) {
//     console.error('Delete medical record error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


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

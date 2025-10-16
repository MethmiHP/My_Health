


// // routes/patient.routes.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/authMiddleware');
// const PatientProfile = require('../models/patientProfileModel');
// const User = require('../models/userModel');
// const MedicalHistory = require('../models/medicalHistoryModel');
// const mongoose = require('mongoose');

// // Helper to get hospital ID
// const getHospitalId = (req) => req.user?.hospitalId || req.user?.hospital?._id;

// // ================= Patient Routes ================= //

// // Get patient profile by user ID (patient dashboard)
// router.get('/user/:userId', auth(['patient']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = req.params.userId;

//     if (req.user.sub !== userId) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const userIdObjectId = mongoose.Types.ObjectId.isValid(userId)
//       ? new mongoose.Types.ObjectId(userId)
//       : userId;

//     const query = { userId: userIdObjectId };
//     if (hospitalId) query.hospitalId = hospitalId;

//     const patient = await PatientProfile.findOne(query)
//       .populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

//     res.json({
//       _id: patient._id,
//       user: patient.userId,
//       firstName: patient.firstName,
//       lastName: patient.lastName,
//       nic: patient.nic,
//       dob: patient.dob,
//       gender: patient.gender,
//       bloodGroup: patient.bloodGroup,
//       allergies: patient.allergies,
//       chronicConditions: patient.chronicConditions,
//       familyConditions: patient.familyConditions,
//       medications: patient.medications,
//       surgeries: patient.surgeries,
//       heightCm: patient.heightCm,
//       weightKg: patient.weightKg,
//       emergencyContact: patient.emergencyContact,
//       insurance: patient.insurance,
//       guardian: patient.guardian,
//       consent: patient.consent,
//       barcode: patient.barcode,
//       createdAt: patient.createdAt,
//       updatedAt: patient.updatedAt
//     });
//   } catch (error) {
//     console.error('Get patient by user ID error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get all patients for the hospital
// router.get('/', auth(['admin', 'reception', 'doctor']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });

//     const patients = await PatientProfile.find({ hospitalId })
//       .populate('userId', 'firstName lastName email phone userStatus')
//       .sort({ createdAt: -1 });

//     res.json({
//       count: patients.length,
//       patients: patients.map(p => ({
//         _id: p._id,
//         user: p.userId,
//         dob: p.dob,
//         gender: p.gender,
//         bloodGroup: p.bloodGroup,
//         barcode: p.barcode,
//         guardian: p.guardian,
//         consent: p.consent,
//         createdAt: p.createdAt
//       }))
//     });
//   } catch (error) {
//     console.error('Get patients error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get a patient by ID
// router.get('/:id', auth(['admin', 'reception', 'doctor', 'patient']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const patientId = req.params.id;

//     if (req.user.role === 'patient' && req.user.sub !== patientId) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const patient = await PatientProfile.findOne({ _id: patientId, hospitalId })
//       .populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) return res.status(404).json({ message: 'Patient not found' });

//     res.json({
//       _id: patient._id,
//       user: patient.userId,
//       dob: patient.dob,
//       gender: patient.gender,
//       bloodGroup: patient.bloodGroup,
//       allergies: patient.allergies,
//       chronicConditions: patient.chronicConditions,
//       familyConditions: patient.familyConditions,
//       surgeries: patient.surgeries,
//       medications: patient.medications,
//       heightCm: patient.heightCm,
//       weightKg: patient.weightKg,
//       emergencyContact: patient.emergencyContact,
//       insurance: patient.insurance,
//       guardian: patient.guardian,
//       consent: patient.consent,
//       barcode: patient.barcode,
//       createdAt: patient.createdAt,
//       updatedAt: patient.updatedAt
//     });
//   } catch (error) {
//     console.error('Get patient error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update patient profile (append surgeries + sync with MedicalHistory)
// router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const patientId = req.params.id;

//     const existing = await PatientProfile.findOne({ _id: patientId, hospitalId });
//     if (!existing) return res.status(404).json({ message: 'Patient not found' });

//     if (req.user.role === 'patient' && String(existing.userId) !== String(req.user.sub)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     let {
//       dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
//       heightCm, weightKg, emergencyContact, insurance, guardian, consent
//     } = req.body || {};

//     const normalizeList = (val) =>
//       Array.isArray(val) ? val :
//       typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) :
//       undefined;

//     const normAllergies         = normalizeList(allergies);
//     const normChronicConditions = normalizeList(chronicConditions);
//     const normFamilyConditions  = normalizeList(familyConditions);

//     // --- Merge Surgeries (append only new) ---
//     let mergedSurgeries;
//     if (Array.isArray(surgeries)) {
//       const incomingRaw = surgeries.filter(s => s && !s._id && s.name && String(s.name).trim());
//       const incoming = incomingRaw.map(s => ({
//         type: s.type || 'surgery',
//         name: String(s.name).trim(),
//         description: s.description || undefined,
//         date: s.date ? new Date(s.date) : undefined,
//         hospital: s.hospital || undefined,
//         surgeon: s.surgeon || undefined,
//         results: s.results || undefined,
//         followUpRequired: !!s.followUpRequired,
//         followUpDate: s.followUpDate ? new Date(s.followUpDate) : undefined,
//       }));

//       const keyOf = (s) =>
//         `${(s.name||'').trim().toLowerCase()}|${s.date ? new Date(s.date).toISOString().slice(0,10) : ''}|${(s.hospital||'').trim().toLowerCase()}|${(s.surgeon||'').trim().toLowerCase()}`;

//       const seen = new Set();
//       const incomingUnique = incoming.filter(s => {
//         const k = keyOf(s);
//         if (seen.has(k)) return false;
//         seen.add(k);
//         return true;
//       });

//       const existingKeys = new Set((existing.surgeries || []).map(keyOf));
//       const onlyNew = incomingUnique.filter(s => !existingKeys.has(keyOf(s)));

//       mergedSurgeries = [ ...(existing.surgeries || []), ...onlyNew ];
//     }

//     // --- Guardian/Consent checks for minors ---
//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const m = today.getMonth() - birthDate.getMonth();
//       const d = today.getDate() - birthDate.getDate();
//       if (m < 0 || (m === 0 && d < 0)) age--;
//       if (age <= 16) {
//         if (!guardian?.name || !guardian?.phone)
//           return res.status(400).json({ message: 'Guardian details are required for patients age 16 or under' });
//         if (!consent)
//           return res.status(400).json({ message: 'Guardian consent is required for patients age 16 or under' });
//       }
//     }

//     const updateData = {
//       ...(dob !== undefined && { dob }),
//       ...(gender !== undefined && { gender }),
//       ...(bloodGroup !== undefined && { bloodGroup }),
//       ...(normAllergies !== undefined && { allergies: normAllergies }),
//       ...(normChronicConditions !== undefined && { chronicConditions: normChronicConditions }),
//       ...(normFamilyConditions !== undefined && { familyConditions: normFamilyConditions }),
//       ...(medications !== undefined && { medications }),
//       ...(mergedSurgeries !== undefined && { surgeries: mergedSurgeries }),
//       ...(heightCm !== undefined && { heightCm }),
//       ...(weightKg !== undefined && { weightKg }),
//       ...(emergencyContact !== undefined && { emergencyContact }),
//       ...(insurance !== undefined && { insurance }),
//     };

//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const m = today.getMonth() - birthDate.getMonth();
//       const d = today.getDate() - birthDate.getDate();
//       if (m < 0 || (m === 0 && d < 0)) age--;
//       if (age <= 16) {
//         updateData.guardian = guardian;
//         updateData.consent = consent;
//       }
//     }

//     const patient = await PatientProfile.findOneAndUpdate(
//       { _id: existing._id, hospitalId },
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) return res.status(404).json({ message: 'Patient not found' });

//     // --- Sync MedicalHistory.medications ---
//     try {
//       const userIdForHistory = patient.user._id || patient.userId?._id || existing.userId;
//       const profileMedNames = new Set((patient.medications || []).filter(Boolean));
//       let medicalHistory = await MedicalHistory.findOne({ userId: userIdForHistory, hospitalId });

//       if (!medicalHistory) {
//         medicalHistory = new MedicalHistory({
//           patientId: patient._id,
//           userId: userIdForHistory,
//           hospitalId,
//         });
//       }

//       const historyByName = new Map((medicalHistory.medications || []).map(m => [m.name, m]));
//       for (const name of profileMedNames) {
//         const entry = historyByName.get(name);
//         if (entry) {
//           entry.status = 'active';
//           if (!entry.startDate) entry.startDate = new Date();
//           entry.dosage = entry.dosage || 'As prescribed';
//           entry.prescribedBy = entry.prescribedBy || 'Healthcare Provider';
//           entry.endDate = undefined;
//         } else {
//           medicalHistory.medications.push({
//             name,
//             dosage: 'As prescribed',
//             startDate: new Date(),
//             status: 'active',
//             prescribedBy: 'Healthcare Provider',
//           });
//         }
//       }

//       for (const entry of medicalHistory.medications) {
//         if (!profileMedNames.has(entry.name)) {
//           if (entry.status !== 'completed' && entry.status !== 'discontinued') {
//             entry.status = 'completed';
//             if (!entry.endDate) entry.endDate = new Date();
//           }
//         }
//       }

//       medicalHistory.lastUpdatedBy = req.user.sub;
//       medicalHistory.lastUpdatedAt = new Date();
//       await medicalHistory.save();
//     } catch (syncErr) {
//       console.error('Failed to sync MedicalHistory medications:', syncErr);
//     }

//     res.json({
//       message: 'Patient updated successfully',
//       patient: {
//         _id: patient._id,
//         user: patient.userId,
//         dob: patient.dob,
//         gender: patient.gender,
//         bloodGroup: patient.bloodGroup,
//         allergies: patient.allergies,
//         chronicConditions: patient.chronicConditions,
//         familyConditions: patient.familyConditions,
//         surgeries: patient.surgeries,
//         medications: patient.medications,
//         heightCm: patient.heightCm,
//         weightKg: patient.weightKg,
//         emergencyContact: patient.emergencyContact,
//         insurance: patient.insurance,
//         guardian: patient.guardian,
//         consent: patient.consent,
//         barcode: patient.barcode,
//         updatedAt: patient.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error('Update patient error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete patient (admin only)
// router.delete('/:id', auth(['admin']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const patientId = req.params.id;

//     const patient = await PatientProfile.findOneAndDelete({ _id: patientId, hospitalId });
//     if (!patient) return res.status(404).json({ message: 'Patient not found' });

//     await User.findByIdAndUpdate(patient.userId, { userStatus: 'inactive' });
//     res.json({ message: 'Patient deleted successfully' });
//   } catch (error) {
//     console.error('Delete patient error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get patient by barcode
// router.get('/barcode/:barcode', auth(['admin', 'reception', 'doctor']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const barcode = req.params.barcode;

//     const patient = await PatientProfile.findOne({ barcode, hospitalId })
//       .populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) return res.status(404).json({ message: 'Patient not found' });

//     res.json({
//       _id: patient._id,
//       user: patient.userId,
//       dob: patient.dob,
//       gender: patient.gender,
//       bloodGroup: patient.bloodGroup,
//       allergies: patient.allergies,
//       chronicConditions: patient.chronicConditions,
//       familyConditions: patient.familyConditions,
//       surgeries: patient.surgeries,
//       medications: patient.medications,
//       heightCm: patient.heightCm,
//       weightKg: patient.weightKg,
//       emergencyContact: patient.emergencyContact,
//       insurance: patient.insurance,
//       guardian: patient.guardian,
//       consent: patient.consent,
//       barcode: patient.barcode
//     });
//   } catch (error) {
//     console.error('Get patient by barcode error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


// routes/patient.routes.js

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
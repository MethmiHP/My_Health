// // routes/patient.routes.js
// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/authMiddleware');
// const PatientProfile = require('../models/patientProfileModel');
// const User = require('../models/userModel');

// // Helper function to get hospital ID from request
// const getHospitalId = (req) => {
//   return req.user?.hospitalId || req.user?.hospital?._id;
// };

// // -------------------- Patient Routes -------------------- //

// // Get patient profile by user ID (for patient dashboard)
// router.get('/user/:userId', auth(['patient']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const userId = req.params.userId;

//     // Patients can only view their own profile
//     if (req.user.sub !== userId) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Convert userId to ObjectId if it's a valid ObjectId string
//     const userIdObjectId = require('mongoose').Types.ObjectId.isValid(userId)
//       ? new (require('mongoose')).Types.ObjectId(userId)
//       : userId;

//     const query = { userId: userIdObjectId };
//     if (hospitalId) query.hospitalId = hospitalId;

//     const patient = await PatientProfile.findOne(query)
//       .populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient profile not found' });
//     }

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
//     if (!hospitalId) {
//       return res.status(400).json({ message: 'Hospital context required' });
//     }

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

//     // Patients can only view their own profile
//     if (req.user.role === 'patient' && req.user.sub !== patientId) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const patient = await PatientProfile.findOne({ 
//       _id: patientId, 
//       hospitalId 
//     }).populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     res.json({
//       _id: patient._id,
//       user: patient.userId,
//       dob: patient.dob,
//       gender: patient.gender,
//       bloodGroup: patient.bloodGroup,
//       allergies: patient.allergies,
//       chronicConditions: patient.chronicConditions,
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

// // // Update patient profile
// // router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const patientId = req.params.id;

// //     // Load the target patient profile first for authorization and context
// //     const existing = await PatientProfile.findOne({ _id: patientId, hospitalId });
// //     if (!existing) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     // Patients can only update their own profile (match profile.userId)
// //     if (req.user.role === 'patient' && String(existing.userId) !== String(req.user.sub)) {
// //       return res.status(403).json({ message: 'Access denied' });
// //     }

// //     let {
// //       dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
// //       heightCm, weightKg, emergencyContact, insurance, guardian, consent
// //     } = req.body || {};

// //     // Normalize list fields if provided as comma-separated strings
// //     const normalizeList = (val) =>
// //       Array.isArray(val)
// //         ? val
// //         : typeof val === 'string'
// //           ? val.split(',').map((s) => s.trim()).filter(Boolean)
// //           : undefined;
// //     allergies = normalizeList(allergies) ?? existing.allergies;
// //     chronicConditions = normalizeList(chronicConditions) ?? existing.chronicConditions;
// //     familyConditions = normalizeList(familyConditions) ?? existing.familyConditions;

// //     // Normalize surgeries if provided
// //     if (Array.isArray(surgeries)) {
// //       surgeries = surgeries
// //         .filter(s => s && s.name && String(s.name).trim())
// //         .map(s => ({
// //           type: s.type || 'surgery',
// //           name: String(s.name).trim(),
// //           description: s.description || undefined,
// //           date: s.date ? new Date(s.date) : undefined,
// //           hospital: s.hospital || undefined,
// //           surgeon: s.surgeon || undefined,
// //           results: s.results || undefined,
// //           followUpRequired: !!s.followUpRequired,
// //           followUpDate: s.followUpDate ? new Date(s.followUpDate) : undefined,
// //         }));
// //     }

// //     // If updating DOB, check age for guardian requirements
// //     if (dob) {
// //       const birthDate = new Date(dob);
// //       const today = new Date();
// //       let age = today.getFullYear() - birthDate.getFullYear();
// //       const monthDiff = today.getMonth() - birthDate.getMonth();
// //       const dayDiff = today.getDate() - birthDate.getDate();
// //       if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

// //       // If age <= 16, guardian details and consent are required
// //       if (age <= 16) {
// //         if (!guardian?.name || !guardian?.phone) {
// //           return res.status(400).json({ message: 'Guardian details are required for patients age 16 or under' });
// //         }
// //         if (!consent) {
// //           return res.status(400).json({ message: 'Guardian consent is required for patients age 16 or under' });
// //         }
// //       }
// //     }

// //     const updateData = {
// //       dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
// //       heightCm, weightKg, emergencyContact, insurance
// //     };

// //     // Include guardian info if patient is age <= 16
// //     if (dob) {
// //       const birthDate = new Date(dob);
// //       const today = new Date();
// //       let age = today.getFullYear() - birthDate.getFullYear();
// //       const monthDiff = today.getMonth() - birthDate.getMonth();
// //       const dayDiff = today.getDate() - birthDate.getDate();
// //       if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

// //       if (age <= 16) {
// //         updateData.guardian = guardian;
// //         updateData.consent = consent;
// //       }
// //     }

// //     const patient = await PatientProfile.findOneAndUpdate(
// //       { _id: existing._id, hospitalId },
// //       updateData,
// //       { new: true, runValidators: true }
// //     ).populate('userId', 'firstName lastName email phone userStatus');

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     res.json({
// //       message: 'Patient updated successfully',
// //       patient: {
// //         _id: patient._id,
// //         user: patient.userId,
// //         dob: patient.dob,
// //         gender: patient.gender,
// //         bloodGroup: patient.bloodGroup,
// //         allergies: patient.allergies,
// //         chronicConditions: patient.chronicConditions,
// //         familyConditions: patient.familyConditions,
// //         surgeries: patient.surgeries,
// //         medications: patient.medications,
// //         heightCm: patient.heightCm,
// //         weightKg: patient.weightKg,
// //         emergencyContact: patient.emergencyContact,
// //         insurance: patient.insurance,
// //         guardian: patient.guardian,
// //         consent: patient.consent,
// //         barcode: patient.barcode,
// //         updatedAt: patient.updatedAt
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Update patient error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // Update patient profile (MERGE surgeries instead of replacing)
// router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const patientId = req.params.id;

//     // Load the target patient profile first for authorization and context
//     const existing = await PatientProfile.findOne({ _id: patientId, hospitalId });
//     if (!existing) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     // Patients can only update their own profile (match profile.userId)
//     if (req.user.role === 'patient' && String(existing.userId) !== String(req.user.sub)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     // Pull fields from body (may be undefined)
//     let {
//       dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
//       heightCm, weightKg, emergencyContact, insurance, guardian, consent
//     } = req.body || {};

//     // Normalize list fields if provided as comma-separated strings
//     const normalizeList = (val) =>
//       Array.isArray(val)
//         ? val
//         : typeof val === 'string'
//           ? val.split(',').map((s) => s.trim()).filter(Boolean)
//           : undefined;

//     // If the field is undefined, keep existing; if provided, use normalized
//     const normAllergies          = normalizeList(allergies);
//     const normChronicConditions  = normalizeList(chronicConditions);
//     const normFamilyConditions   = normalizeList(familyConditions);

//     // Normalize surgeries if provided → we will MERGE with existing
//     let mergedSurgeries; // only set if client sent surgeries
//     if (Array.isArray(surgeries)) {
//       const incoming = surgeries
//         .filter(s => s && s.name && String(s.name).trim())
//         .map(s => ({
//           type: s.type || 'surgery',
//           name: String(s.name).trim(),
//           description: s.description || undefined,
//           date: s.date ? new Date(s.date) : undefined,
//           hospital: s.hospital || undefined,
//           surgeon: s.surgeon || undefined,
//           results: s.results || undefined,
//           followUpRequired: !!s.followUpRequired,
//           followUpDate: s.followUpDate ? new Date(s.followUpDate) : undefined,
//         }));

//       // 👇 Merge (append) instead of replacing
//       mergedSurgeries = [ ...(existing.surgeries || []), ...incoming ];
//     }
//     // If surgeries is undefined, we will NOT include it in updateData (keeps DB value as-is).

//     // If updating DOB, check age for guardian requirements
//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       const dayDiff = today.getDate() - birthDate.getDate();
//       if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

//       // If age <= 16, guardian details and consent are required
//       if (age <= 16) {
//         if (!guardian?.name || !guardian?.phone) {
//           return res.status(400).json({ message: 'Guardian details are required for patients age 16 or under' });
//         }
//         if (!consent) {
//           return res.status(400).json({ message: 'Guardian consent is required for patients age 16 or under' });
//         }
//       }
//     }

//     // Build update object ONLY with fields that are provided (avoid unintended unsets)
//     const updateData = {
//       ...(dob !== undefined && { dob }),
//       ...(gender !== undefined && { gender }),
//       ...(bloodGroup !== undefined && { bloodGroup }),
//       ...(normAllergies !== undefined && { allergies: normAllergies }),
//       ...(normChronicConditions !== undefined && { chronicConditions: normChronicConditions }),
//       ...(normFamilyConditions !== undefined && { familyConditions: normFamilyConditions }),
//       ...(medications !== undefined && { medications }),
//       ...(mergedSurgeries !== undefined && { surgeries: mergedSurgeries }), // 👈 merged array
//       ...(heightCm !== undefined && { heightCm }),
//       ...(weightKg !== undefined && { weightKg }),
//       ...(emergencyContact !== undefined && { emergencyContact }),
//       ...(insurance !== undefined && { insurance }),
//     };

//     // Include guardian info if patient is age <= 16 (when dob provided)
//     if (dob) {
//       const birthDate = new Date(dob);
//       const today = new Date();
//       let age = today.getFullYear() - birthDate.getFullYear();
//       const monthDiff = today.getMonth() - birthDate.getMonth();
//       const dayDiff = today.getDate() - birthDate.getDate();
//       if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
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

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
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

//     const patient = await PatientProfile.findOneAndDelete({ 
//       _id: patientId, 
//       hospitalId 
//     });

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     // Also deactivate the user account
//     await User.findByIdAndUpdate(patient.userId, { userStatus: 'inactive' });

//     res.json({ message: 'Patient deleted successfully' });
//   } catch (error) {
//     console.error('Delete patient error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // // Get patient by barcode (for scanning)
// // router.get('/barcode/:barcode', auth(['admin', 'reception', 'doctor']), async (req, res) => {
// //   try {
// //     const hospitalId = getHospitalId(req);
// //     const barcode = req.params.barcode;

// //     const patient = await PatientProfile.findOne({ 
// //       barcode, 
// //       hospitalId 
// //     }).populate('userId', 'firstName lastName email phone userStatus');

// //     if (!patient) {
// //       return res.status(404).json({ message: 'Patient not found' });
// //     }

// //     res.json({
// //       _id: patient._id,
// //       user: patient.userId,
// //       dob: patient.dob,
// //       gender: patient.gender,
// //       bloodGroup: patient.bloodGroup,
// //       allergies: patient.allergies,
// //       chronicConditions: patient.chronicConditions,
// //       medications: patient.medications,
// //       heightCm: patient.heightCm,
// //       weightKg: patient.weightKg,
// //       emergencyContact: patient.emergencyContact,
// //       insurance: patient.insurance,
// //       guardian: patient.guardian,
// //       consent: patient.consent,
// //       barcode: patient.barcode
// //     });
// //   } catch (error) {
// //     console.error('Get patient by barcode error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // Get patient by barcode (for scanning)
// router.get('/barcode/:barcode', auth(['admin', 'reception', 'doctor']), async (req, res) => {
//   try {
//     const hospitalId = getHospitalId(req);
//     const barcode = req.params.barcode;

//     const patient = await PatientProfile.findOne({ 
//       barcode, 
//       hospitalId 
//     }).populate('userId', 'firstName lastName email phone userStatus');

//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }

//     res.json({
//       _id: patient._id,
//       user: patient.userId,
//       dob: patient.dob,
//       gender: patient.gender,
//       bloodGroup: patient.bloodGroup,
//       allergies: patient.allergies,
//       chronicConditions: patient.chronicConditions,
//       familyConditions: patient.familyConditions,
//       medications: patient.medications,
//       surgeries: patient.surgeries,              // 👈 ADD THIS
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
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');

// Helper to get hospital id
const getHospitalId = (req) => req.user?.hospitalId || req.user?.hospital?._id;

// ================= Patient Routes ================= //

// Get patient profile by user ID (patient dashboard)
router.get('/user/:userId', auth(['patient']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;

    if (req.user.sub !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userIdObjectId = require('mongoose').Types.ObjectId.isValid(userId)
      ? new (require('mongoose')).Types.ObjectId(userId)
      : userId;

    const query = { userId: userIdObjectId };
    if (hospitalId) query.hospitalId = hospitalId;

    const patient = await PatientProfile.findOne(query)
      .populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    res.json({
      _id: patient._id,
      user: patient.userId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      nic: patient.nic,
      dob: patient.dob,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      chronicConditions: patient.chronicConditions,
      familyConditions: patient.familyConditions,
      medications: patient.medications,
      surgeries: patient.surgeries,
      heightCm: patient.heightCm,
      weightKg: patient.weightKg,
      emergencyContact: patient.emergencyContact,
      insurance: patient.insurance,
      guardian: patient.guardian,
      consent: patient.consent,
      barcode: patient.barcode,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    });
  } catch (error) {
    console.error('Get patient by user ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all patients for the hospital
router.get('/', auth(['admin', 'reception', 'doctor']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });

    const patients = await PatientProfile.find({ hospitalId })
      .populate('userId', 'firstName lastName email phone userStatus')
      .sort({ createdAt: -1 });

    res.json({
      count: patients.length,
      patients: patients.map(p => ({
        _id: p._id,
        user: p.userId,
        dob: p.dob,
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        barcode: p.barcode,
        guardian: p.guardian,
        consent: p.consent,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a patient by ID
router.get('/:id', auth(['admin', 'reception', 'doctor', 'patient']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const patientId = req.params.id;

    if (req.user.role === 'patient' && req.user.sub !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await PatientProfile.findOne({ _id: patientId, hospitalId })
      .populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json({
      _id: patient._id,
      user: patient.userId,
      dob: patient.dob,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      chronicConditions: patient.chronicConditions,
      medications: patient.medications,
      heightCm: patient.heightCm,
      weightKg: patient.weightKg,
      emergencyContact: patient.emergencyContact,
      insurance: patient.insurance,
      guardian: patient.guardian,
      consent: patient.consent,
      barcode: patient.barcode,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile (append surgeries with hard de-dupe)
router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const patientId = req.params.id;

    const existing = await PatientProfile.findOne({ _id: patientId, hospitalId });
    if (!existing) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.role === 'patient' && String(existing.userId) !== String(req.user.sub)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let {
      dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
      heightCm, weightKg, emergencyContact, insurance, guardian, consent
    } = req.body || {};

    const normalizeList = (val) =>
      Array.isArray(val) ? val
      : typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const normAllergies         = normalizeList(allergies);
    const normChronicConditions = normalizeList(chronicConditions);
    const normFamilyConditions  = normalizeList(familyConditions);

    // --- Surgeries: accept only brand-new rows (no _id), then de-dupe ---
    let mergedSurgeries;
    if (Array.isArray(surgeries)) {
      const incomingRaw = surgeries
        .filter(s => s && !s._id && s.name && String(s.name).trim()); // <— ignore anything that already exists (_id)

      const incoming = incomingRaw.map(s => ({
        type: s.type || 'surgery',
        name: String(s.name).trim(),
        description: s.description || undefined,
        date: s.date ? new Date(s.date) : undefined,
        hospital: s.hospital || undefined,
        surgeon: s.surgeon || undefined,
        results: s.results || undefined,
        followUpRequired: !!s.followUpRequired,
        followUpDate: s.followUpDate ? new Date(s.followUpDate) : undefined,
      }));

      const keyOf = (s) =>
        `${(s.name||'').trim().toLowerCase()}|${s.date ? new Date(s.date).toISOString().slice(0,10) : ''}|${(s.hospital||'').trim().toLowerCase()}|${(s.surgeon||'').trim().toLowerCase()}`;

      // de-dupe within the incoming payload itself
      const seen = new Set();
      const incomingUnique = incoming.filter(s => {
        const k = keyOf(s);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      // drop items that already exist on the document
      const existingKeys = new Set((existing.surgeries || []).map(keyOf));
      const onlyNew = incomingUnique.filter(s => !existingKeys.has(keyOf(s)));

      mergedSurgeries = [ ...(existing.surgeries || []), ...onlyNew ];
    }

    // DOB guardian checks
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const d = today.getDate() - birthDate.getDate();
      if (m < 0 || (m === 0 && d < 0)) age--;
      if (age <= 16) {
        if (!guardian?.name || !guardian?.phone) {
          return res.status(400).json({ message: 'Guardian details are required for patients age 16 or under' });
        }
        if (!consent) {
          return res.status(400).json({ message: 'Guardian consent is required for patients age 16 or under' });
        }
      }
    }

    const updateData = {
      ...(dob !== undefined && { dob }),
      ...(gender !== undefined && { gender }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(normAllergies !== undefined && { allergies: normAllergies }),
      ...(normChronicConditions !== undefined && { chronicConditions: normChronicConditions }),
      ...(normFamilyConditions !== undefined && { familyConditions: normFamilyConditions }),
      ...(medications !== undefined && { medications }),
      ...(mergedSurgeries !== undefined && { surgeries: mergedSurgeries }),
      ...(heightCm !== undefined && { heightCm }),
      ...(weightKg !== undefined && { weightKg }),
      ...(emergencyContact !== undefined && { emergencyContact }),
      ...(insurance !== undefined && { insurance }),
    };

    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      const d = today.getDate() - birthDate.getDate();
      if (m < 0 || (m === 0 && d < 0)) age--;
      if (age <= 16) {
        updateData.guardian = guardian;
        updateData.consent = consent;
      }
    }

    const patient = await PatientProfile.findOneAndUpdate(
      { _id: existing._id, hospitalId },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json({
      message: 'Patient updated successfully',
      patient: {
        _id: patient._id,
        user: patient.userId,
        dob: patient.dob,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions,
        familyConditions: patient.familyConditions,
        surgeries: patient.surgeries,
        medications: patient.medications,
        heightCm: patient.heightCm,
        weightKg: patient.weightKg,
        emergencyContact: patient.emergencyContact,
        insurance: patient.insurance,
        guardian: patient.guardian,
        consent: patient.consent,
        barcode: patient.barcode,
        updatedAt: patient.updatedAt
      }
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete patient (admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const patientId = req.params.id;

    const patient = await PatientProfile.findOneAndDelete({ _id: patientId, hospitalId });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await User.findByIdAndUpdate(patient.userId, { userStatus: 'inactive' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient by barcode (for scanning)
router.get('/barcode/:barcode', auth(['admin', 'reception', 'doctor']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const barcode = req.params.barcode;

    const patient = await PatientProfile.findOne({ barcode, hospitalId })
      .populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json({
      _id: patient._id,
      user: patient.userId,
      dob: patient.dob,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      chronicConditions: patient.chronicConditions,
      familyConditions: patient.familyConditions,
      medications: patient.medications,
      surgeries: patient.surgeries,
      heightCm: patient.heightCm,
      weightKg: patient.weightKg,
      emergencyContact: patient.emergencyContact,
      insurance: patient.insurance,
      guardian: patient.guardian,
      consent: patient.consent,
      barcode: patient.barcode
    });
  } catch (error) {
    console.error('Get patient by barcode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

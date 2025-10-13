// routes/patient.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');

// Helper function to get hospital ID from request
const getHospitalId = (req) => {
  return req.user?.hospitalId || req.user?.hospital?._id;
};

// -------------------- Patient Routes -------------------- //

// Get all patients for the hospital
router.get('/patients', auth(['admin', 'reception', 'doctor']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    if (!hospitalId) {
      return res.status(400).json({ message: 'Hospital context required' });
    }

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

    // Patients can only view their own profile
    if (req.user.role === 'patient' && req.user.sub !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await PatientProfile.findOne({ 
      _id: patientId, 
      hospitalId 
    }).populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

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

// Update patient profile
router.put('/:id', auth(['admin', 'reception', 'patient']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const patientId = req.params.id;

    // Patients can only update their own profile
    if (req.user.role === 'patient' && req.user.sub !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      dob, gender, bloodGroup, allergies, chronicConditions, medications,
      heightCm, weightKg, emergencyContact, insurance, guardian, consent
    } = req.body;

    // If updating DOB, check age for guardian requirements
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

      // If under 16, guardian details and consent are required
      if (age < 16) {
        if (!guardian?.name || !guardian?.relationship || !guardian?.phone) {
          return res.status(400).json({ message: 'Guardian details are required for patients under 16' });
        }
        if (!consent) {
          return res.status(400).json({ message: 'Guardian consent is required for patients under 16' });
        }
      }
    }

    const updateData = {
      dob, gender, bloodGroup, allergies, chronicConditions, medications,
      heightCm, weightKg, emergencyContact, insurance
    };

    // Include guardian info if patient is under 16
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

      if (age < 16) {
        updateData.guardian = guardian;
        updateData.consent = consent;
      }
    }

    const patient = await PatientProfile.findOneAndUpdate(
      { _id: patientId, hospitalId },
      updateData,
      { new: true }
    ).populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

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

    const patient = await PatientProfile.findOneAndDelete({ 
      _id: patientId, 
      hospitalId 
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Also deactivate the user account
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

    const patient = await PatientProfile.findOne({ 
      barcode, 
      hospitalId 
    }).populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

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
      barcode: patient.barcode
    });
  } catch (error) {
    console.error('Get patient by barcode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

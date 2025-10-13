// routes/patient.routes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');
const { validateBarcodeFormat, extractPatientIdFromBarcode, extractHospitalCodeFromBarcode } = require('../utils/barcodeUtils');

// Helper function to get hospital ID from request
const getHospitalId = (req) => {
  return req.user?.hospitalId || req.user?.hospital?._id;
};

// -------------------- Patient Routes -------------------- //

// Get all patients for the hospital
router.get('/', auth(['admin', 'reception', 'doctor']), async (req, res) => {
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

// Get patient profile by user ID (for patient dashboard)
router.get('/user/:userId', auth(['patient']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;

    // Patients can only view their own profile
    if (req.user.sub !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Convert userId to ObjectId if it's a valid ObjectId string
    const userIdObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    
    const patient = await PatientProfile.findOne({ 
      userId: userIdObjectId, 
      hospitalId 
    }).populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

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
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/:id', auth(['admin', 'reception', 'patient', 'doctor']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.id;

    // Patients can only update their own profile, doctors can update any patient in their hospital
    if (req.user.role === 'patient' && req.user.sub !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      firstName, lastName, nic, dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
      heightCm, weightKg, emergencyContact, insurance, guardian, consent
    } = req.body;

    console.log('Backend - Patient update request received');
    console.log('Backend - Patient ID:', userId);
    console.log('Backend - Hospital ID:', hospitalId);
    console.log('Backend - Request body:', req.body);
    console.log('Backend - Medications:', medications);

    // Validate NIC format if provided
    if (nic) {
      const nicRegex = /^[0-9]{10,12}[V]?$/i;
      if (!nicRegex.test(nic)) {
        return res.status(400).json({ message: 'NIC must be 10-12 digits with optional V suffix (e.g., 1234567890V)' });
      }
    }

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
      firstName, lastName, nic, dob, gender, bloodGroup, allergies, chronicConditions, familyConditions, medications, surgeries,
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

    console.log('Backend - Update data:', updateData);
    console.log('Backend - Searching for patient with userId:', userId, 'hospitalId:', hospitalId);
    
    const patient = await PatientProfile.findOneAndUpdate(
      { userId: userId, hospitalId },
      updateData,
      { new: true }
    ).populate('userId', 'firstName lastName email phone userStatus');

    console.log('Backend - Database update result:', patient);

    if (!patient) {
      console.log('Backend - Patient not found in database');
      return res.status(404).json({ message: 'Patient not found' });
    }

    console.log('Backend - Patient updated successfully - medications:', patient.medications);

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
        medications: patient.medications,
        surgeries: patient.surgeries,
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

    // Validate barcode format
    if (!validateBarcodeFormat(barcode)) {
      return res.status(400).json({ 
        message: 'Invalid barcode format. Expected format: PT-{HOSPITAL_CODE}-{PATIENT_ID}' 
      });
    }

    // Extract hospital code from barcode and verify it matches current hospital
    const barcodeHospitalCode = extractHospitalCodeFromBarcode(barcode);
    if (barcodeHospitalCode) {
      // Optional: Verify hospital code matches current hospital context
      // This adds an extra layer of security
    }

    const patient = await PatientProfile.findOne({ 
      barcode, 
      hospitalId 
    }).populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) {
      return res.status(404).json({ 
        message: 'Patient not found',
        barcode: barcode,
        hospitalCode: barcodeHospitalCode
      });
    }

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
      scannedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get patient by barcode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const MedicalHistory = require('../models/medicalHistoryModel');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');

// Helper function to get hospital ID from request
const getHospitalId = (req) => {
  return req.user?.hospitalId || req.user?.hospital?._id;
};

// -------------------- Medical History Routes -------------------- //

// Get patient's medical history (patients can view their own, doctors can view any)
router.get('/patient/:userId', auth(['patient', 'doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;

    // Patients can only view their own medical history
    if (req.user.role === 'patient' && req.user.sub !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the patient profile first
    const patientProfile = await PatientProfile.findOne({ 
      userId, 
      hospitalId 
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Get or create medical history
    let medicalHistory = await MedicalHistory.findOne({ 
      userId, 
      hospitalId 
    });

    // If no medical history exists, create one with basic info from patient profile
    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({
        patientId: patientProfile._id,
        userId,
        hospitalId,
        bloodType: patientProfile.bloodGroup,
        allergies: patientProfile.allergies || [],
        chronicConditions: patientProfile.chronicConditions || [],
        familyConditions: patientProfile.familyConditions || [],
        emergencyContact: patientProfile.emergencyContact || {},
        medications: (patientProfile.medications || []).map(med => ({
          name: med,
          dosage: 'As prescribed',
          startDate: new Date(),
          status: 'active',
          prescribedBy: 'Healthcare Provider'
        })),
        lastUpdatedBy: req.user.sub,
        lastUpdatedAt: new Date()
      });
      await medicalHistory.save();
    }

    // Populate user info for responses
    await medicalHistory.populate('lastUpdatedBy', 'firstName lastName');

    res.json({
      medicalHistory: {
        _id: medicalHistory._id,
        bloodType: medicalHistory.bloodType,
        allergies: medicalHistory.allergies,
        chronicConditions: medicalHistory.chronicConditions,
        familyConditions: medicalHistory.familyConditions,
        vitalSigns: medicalHistory.vitalSigns,
        labResults: medicalHistory.labResults,
        medications: medicalHistory.medications,
        diagnoses: medicalHistory.diagnoses,
        procedures: medicalHistory.procedures,
        immunizations: medicalHistory.immunizations,
        familyHistory: medicalHistory.familyHistory,
        emergencyContact: medicalHistory.emergencyContact,
        generalNotes: medicalHistory.generalNotes,
        lastUpdatedBy: medicalHistory.lastUpdatedBy,
        lastUpdatedAt: medicalHistory.lastUpdatedAt,
        createdAt: medicalHistory.createdAt,
        updatedAt: medicalHistory.updatedAt
      }
    });
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update medical history (doctors and admin only)
router.put('/patient/:userId', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;

    // Find the patient profile
    const patientProfile = await PatientProfile.findOne({ 
      userId, 
      hospitalId 
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const updateData = {
      ...req.body,
      lastUpdatedBy: req.user.sub,
      lastUpdatedAt: new Date()
    };

    const medicalHistory = await MedicalHistory.findOneAndUpdate(
      { userId, hospitalId },
      updateData,
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        setDefaultsOnInsert: true
      }
    ).populate('lastUpdatedBy', 'firstName lastName');

    res.json({
      message: 'Medical history updated successfully',
      medicalHistory: {
        _id: medicalHistory._id,
        bloodType: medicalHistory.bloodType,
        allergies: medicalHistory.allergies,
        chronicConditions: medicalHistory.chronicConditions,
        vitalSigns: medicalHistory.vitalSigns,
        labResults: medicalHistory.labResults,
        medications: medicalHistory.medications,
        diagnoses: medicalHistory.diagnoses,
        procedures: medicalHistory.procedures,
        immunizations: medicalHistory.immunizations,
        familyHistory: medicalHistory.familyHistory,
        emergencyContact: medicalHistory.emergencyContact,
        generalNotes: medicalHistory.generalNotes,
        lastUpdatedBy: medicalHistory.lastUpdatedBy,
        lastUpdatedAt: medicalHistory.lastUpdatedAt,
        updatedAt: medicalHistory.updatedAt
      }
    });
  } catch (error) {
    console.error('Update medical history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add specific medical record (doctors and admin only)
router.post('/patient/:userId/:recordType', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;
    const recordType = req.params.recordType;

    const validRecordTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    
    if (!validRecordTypes.includes(recordType)) {
      return res.status(400).json({ message: 'Invalid record type' });
    }

    // Find the patient profile
    const patientProfile = await PatientProfile.findOne({ 
      userId, 
      hospitalId 
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Get or create medical history
    let medicalHistory = await MedicalHistory.findOne({ 
      userId, 
      hospitalId 
    });

    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({
        patientId: patientProfile._id,
        userId,
        hospitalId,
        bloodType: patientProfile.bloodGroup,
        allergies: patientProfile.allergies || [],
        chronicConditions: patientProfile.chronicConditions || [],
        familyConditions: patientProfile.familyConditions || [],
        emergencyContact: patientProfile.emergencyContact || {},
        lastUpdatedBy: req.user.sub,
        lastUpdatedAt: new Date()
      });
    }

    // Add the new record
    const newRecord = {
      ...req.body,
      ...(recordType === 'vitalSigns' && req.body.weight && req.body.height && {
        bmi: req.body.weight / Math.pow(req.body.height / 100, 2)
      })
    };

    medicalHistory[recordType].push(newRecord);
    medicalHistory.lastUpdatedBy = req.user.sub;
    medicalHistory.lastUpdatedAt = new Date();

    await medicalHistory.save();

    res.json({
      message: `${recordType} record added successfully`,
      record: newRecord
    });
  } catch (error) {
    console.error('Add medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update specific medical record (doctors and admin only)
router.put('/patient/:userId/:recordType/:recordId', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;
    const recordType = req.params.recordType;
    const recordId = req.params.recordId;

    const validRecordTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    
    if (!validRecordTypes.includes(recordType)) {
      return res.status(400).json({ message: 'Invalid record type' });
    }

    const medicalHistory = await MedicalHistory.findOne({ 
      userId, 
      hospitalId 
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: 'Medical history not found' });
    }

    // Find and update the specific record
    const record = medicalHistory[recordType].id(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Update the record
    Object.assign(record, req.body);
    
    // Recalculate BMI if vital signs are updated
    if (recordType === 'vitalSigns' && req.body.weight && req.body.height) {
      record.bmi = req.body.weight / Math.pow(req.body.height / 100, 2);
    }

    medicalHistory.lastUpdatedBy = req.user.sub;
    medicalHistory.lastUpdatedAt = new Date();

    await medicalHistory.save();

    res.json({
      message: `${recordType} record updated successfully`,
      record: record
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete specific medical record (doctors and admin only)
router.delete('/patient/:userId/:recordType/:recordId', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;
    const recordType = req.params.recordType;
    const recordId = req.params.recordId;

    const validRecordTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    
    if (!validRecordTypes.includes(recordType)) {
      return res.status(400).json({ message: 'Invalid record type' });
    }

    const medicalHistory = await MedicalHistory.findOne({ 
      userId, 
      hospitalId 
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: 'Medical history not found' });
    }

    // Find and remove the specific record
    const record = medicalHistory[recordType].id(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    record.remove();
    medicalHistory.lastUpdatedBy = req.user.sub;
    medicalHistory.lastUpdatedAt = new Date();

    await medicalHistory.save();

    res.json({
      message: `${recordType} record deleted successfully`
    });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

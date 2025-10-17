// controllers/medicalHistoryController.js

const mongoose = require('mongoose');
const MedicalHistory = require('../models/medicalHistoryModel');
const PatientProfile = require('../models/patientProfileModel');

// Helper function to get hospital ID from request
const getHospitalId = (req) => req.user?.hospitalId || req.user?.hospital?._id;

// -------------------- CONTROLLERS -------------------- //

// Get patient’s medical history
exports.getMedicalHistory = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const rawUserId = req.params.userId;
    const userId = mongoose.Types.ObjectId.isValid(rawUserId)
      ? new mongoose.Types.ObjectId(rawUserId)
      : rawUserId;

    // Patients can only view their own medical history
    if (req.user.role === 'patient' && String(req.user.sub) !== String(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patientProfile = await PatientProfile.findOne({ userId, hospitalId });
    if (!patientProfile) return res.status(404).json({ message: 'Patient profile not found' });

    let medicalHistory = await MedicalHistory.findOne({ userId, hospitalId });

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

    // Sync medications with profile
    try {
      const profileMedNames = new Set((patientProfile.medications || []).filter(Boolean));
      const historyByName = new Map((medicalHistory.medications || []).map(m => [m.name, m]));
      let changed = false;

      for (const name of profileMedNames) {
        if (!historyByName.has(name)) {
          medicalHistory.medications.push({
            name,
            dosage: 'As prescribed',
            startDate: new Date(),
            status: 'active',
            prescribedBy: 'Healthcare Provider'
          });
          changed = true;
        } else {
          const entry = historyByName.get(name);
          if (entry.status !== 'active') {
            entry.status = 'active';
            entry.endDate = undefined;
            changed = true;
          }
        }
      }

      for (const entry of medicalHistory.medications) {
        if (!profileMedNames.has(entry.name)) {
          if (entry.status !== 'completed' && entry.status !== 'discontinued') {
            entry.status = 'completed';
            entry.endDate = new Date();
            changed = true;
          }
        }
      }

      if (changed) {
        medicalHistory.lastUpdatedBy = req.user.sub;
        medicalHistory.lastUpdatedAt = new Date();
        await medicalHistory.save();
      }
    } catch (syncErr) {
      console.error('Sync error:', syncErr);
    }

    await medicalHistory.populate('lastUpdatedBy', 'firstName lastName');

    res.json({ medicalHistory });
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update medical history
exports.updateMedicalHistory = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;

    const patientProfile = await PatientProfile.findOne({ userId, hospitalId });
    if (!patientProfile) return res.status(404).json({ message: 'Patient profile not found' });

    const updateData = {
      ...req.body,
      lastUpdatedBy: req.user.sub,
      lastUpdatedAt: new Date()
    };

    const medicalHistory = await MedicalHistory.findOneAndUpdate(
      { userId, hospitalId },
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('lastUpdatedBy', 'firstName lastName');

    res.json({ message: 'Medical history updated successfully', medicalHistory });
  } catch (error) {
    console.error('Update medical history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a specific record
exports.addMedicalRecord = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
  const { userId, recordType } = req.params;
  const validTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory', 'vitalSigns'];
    if (!validTypes.includes(recordType)) return res.status(400).json({ message: 'Invalid record type' });

    const patientProfile = await PatientProfile.findOne({ userId, hospitalId });
    if (!patientProfile) return res.status(404).json({ message: 'Patient profile not found' });

    let medicalHistory = await MedicalHistory.findOne({ userId, hospitalId });
    if (!medicalHistory) {
      medicalHistory = new MedicalHistory({
        patientId: patientProfile._id,
        userId,
        hospitalId,
        lastUpdatedBy: req.user.sub,
        lastUpdatedAt: new Date()
      });
    }

    const doctorName = [req.user?.firstName, req.user?.lastName].filter(Boolean).join(' ') || 'Doctor';
    const now = new Date();

    const newRecord = {
      ...req.body,
      ...(recordType === 'vitalSigns' && req.body.weight && req.body.height && {
        bmi: req.body.weight / Math.pow(req.body.height / 100, 2)
      }),
      ...(recordType === 'medications' && {
        startDate: req.body.startDate ? new Date(req.body.startDate) : now,
        status: req.body.status || 'active',
        prescribedBy: req.body.prescribedBy || doctorName
      }),
      ...(recordType === 'prescriptions' && {
        prescriptionId: req.body.prescriptionId || `RX-${now.getTime()}`,
        prescribedBy: req.body.prescribedBy || doctorName,
        prescribedDate: req.body.prescribedDate ? new Date(req.body.prescribedDate) : now,
        startDate: req.body.startDate ? new Date(req.body.startDate) : now
      })
    };

    medicalHistory[recordType] = medicalHistory[recordType] || [];
    medicalHistory[recordType].push(newRecord);
    medicalHistory.lastUpdatedBy = req.user.sub;
    medicalHistory.lastUpdatedAt = new Date();

    await medicalHistory.save();
    res.json({ message: `${recordType} record added successfully`, record: newRecord });
  } catch (error) {
    console.error('Add medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update specific record
exports.updateMedicalRecord = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { userId, recordType, recordId } = req.params;
    const validTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    if (!validTypes.includes(recordType)) return res.status(400).json({ message: 'Invalid record type' });

    const medicalHistory = await MedicalHistory.findOne({ userId, hospitalId });
    if (!medicalHistory) return res.status(404).json({ message: 'Medical history not found' });

    const record = medicalHistory[recordType].id(recordId);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    Object.assign(record, req.body);
    if (recordType === 'vitalSigns' && req.body.weight && req.body.height) {
      record.bmi = req.body.weight / Math.pow(req.body.height / 100, 2);
    }

    medicalHistory.lastUpdatedBy = req.user.sub;
    medicalHistory.lastUpdatedAt = new Date();
    await medicalHistory.save();

    res.json({ message: `${recordType} record updated successfully`, record });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete specific record
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { userId, recordType, recordId } = req.params;
    const validTypes = ['prescriptions', 'labResults', 'medications', 'diagnoses', 'procedures', 'immunizations', 'familyHistory'];
    if (!validTypes.includes(recordType)) return res.status(400).json({ message: 'Invalid record type' });

    const medicalHistory = await MedicalHistory.findOne({ userId, hospitalId });
    if (!medicalHistory) return res.status(404).json({ message: 'Medical history not found' });

    const record = medicalHistory[recordType].id(recordId);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    if (recordType === 'medications') {
      record.status = 'completed';
      record.endDate = new Date();
    } else {
      record.remove();
    }

    medicalHistory.lastUpdatedBy = req.user.sub;
    medicalHistory.lastUpdatedAt = new Date();
    await medicalHistory.save();

    res.json({ message: recordType === 'medications' ? 'Medication marked as completed' : `${recordType} record deleted successfully` });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

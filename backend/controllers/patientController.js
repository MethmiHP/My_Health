// controllers/patientController.js
const mongoose = require('mongoose');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');
const MedicalHistory = require('../models/medicalHistoryModel');

const getHospitalId = (req) => req.user?.hospitalId || req.user?.hospital?._id;

// ================= Controller Functions ================= //

// Get patient profile by user ID
exports.getPatientByUserId = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.params.userId;

    if (req.user.sub !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userIdObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const query = { userId: userIdObjectId };
    if (hospitalId) query.hospitalId = hospitalId;

    const patient = await PatientProfile.findOne(query)
      .populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    res.json(patient);
  } catch (error) {
    console.error('Get patient by user ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    if (!hospitalId) return res.status(400).json({ message: 'Hospital context required' });

    const patients = await PatientProfile.find({ hospitalId })
      .populate('userId', 'firstName lastName email phone userStatus')
      .sort({ createdAt: -1 });

    res.json({ count: patients.length, patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const patientId = req.params.id;

    if (req.user.role === 'patient' && req.user.sub !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await PatientProfile.findOne({ _id: patientId, hospitalId })
      .populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const patientId = req.params.id;

    const existing = await PatientProfile.findOne({ _id: patientId, hospitalId });
    if (!existing) return res.status(404).json({ message: 'Patient not found' });

    if (req.user.role === 'patient' && String(existing.userId) !== String(req.user.sub)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Extract and normalize data
    const {
      dob, gender, bloodGroup, allergies, chronicConditions, familyConditions,
      medications, surgeries, heightCm, weightKg, emergencyContact, insurance,
      guardian, consent
    } = req.body || {};

    const normalizeList = (val) =>
      Array.isArray(val) ? val :
      typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) :
      undefined;

    // --- Merge Surgeries (append-only new entries) ---
    let mergedSurgeries;
    if (Array.isArray(surgeries)) {
      // Only accept entries without _id and with a non-empty name
      const incomingRaw = surgeries.filter(s => s && !s._id && s.name && String(s.name).trim());
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

      const keyOf = (s) => `${(s.name||'').trim().toLowerCase()}|${s.date ? new Date(s.date).toISOString().slice(0,10) : ''}|${(s.hospital||'').trim().toLowerCase()}|${(s.surgeon||'').trim().toLowerCase()}`;
      const existingKeys = new Set((existing.surgeries || []).map(keyOf));
      const onlyNew = incoming.filter(s => !existingKeys.has(keyOf(s)));
      mergedSurgeries = [ ...(existing.surgeries || []), ...onlyNew ];
    }

    const updateData = {
      ...(dob && { dob }),
      ...(gender && { gender }),
      ...(bloodGroup && { bloodGroup }),
      ...(normalizeList(allergies) && { allergies: normalizeList(allergies) }),
      ...(normalizeList(chronicConditions) && { chronicConditions: normalizeList(chronicConditions) }),
      ...(normalizeList(familyConditions) && { familyConditions: normalizeList(familyConditions) }),
      ...(medications && { medications }),
      ...(mergedSurgeries !== undefined && { surgeries: mergedSurgeries }),
      ...(heightCm && { heightCm }),
      ...(weightKg && { weightKg }),
      ...(emergencyContact && { emergencyContact }),
      ...(insurance && { insurance }),
    };

    // Guardian/consent for minors
    if (dob) {
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      if (age <= 16) {
        if (!guardian?.name || !guardian?.phone)
          return res.status(400).json({ message: 'Guardian details required for minors' });
        if (!consent)
          return res.status(400).json({ message: 'Guardian consent required for minors' });

        updateData.guardian = guardian;
        updateData.consent = consent;
      }
    }

    const updated = await PatientProfile.findOneAndUpdate(
      { _id: patientId, hospitalId },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phone userStatus');

    res.json({ message: 'Patient updated successfully', patient: updated });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
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
};

// Get patient by barcode
exports.getPatientByBarcode = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const barcode = req.params.barcode;

    const patient = await PatientProfile.findOne({ barcode, hospitalId })
      .populate('userId', 'firstName lastName email phone userStatus');

    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json(patient);
  } catch (error) {
    console.error('Get patient by barcode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/hospitalUsers.controller.js
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Hospital = require('../models/hospitalModel');
const DoctorProfile = require('../models/doctorProfileModel');
const PatientProfile = require('../models/patientProfileModel');
const CashierProfile = require('../models/cashierProfileModel');

// Create base user for the current hospital (taken from token)
async function createBaseUser({ hospitalId, firstName, lastName, email, phone, password, role }) {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new Error('Email already in use');

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone,
    password: hash,
    role,
    hospitalId, // only ObjectId / string id
    userStatus: 'active',
    isVerified: true,
  });
  await user.save();
  return user;
}

const getHospitalIdFromReq = async (req) => {
  const hid = req.user?.hospitalId;
  if (!hid || !mongoose.Types.ObjectId.isValid(hid)) {
    throw new Error('Invalid or missing hospitalId in token');
  }
  const exists = await Hospital.exists({ _id: hid });
  if (!exists) throw new Error('Hospital not found');
  return hid;
};

// ---- POST /api/hospital/users/doctor ------------------------
exports.createDoctor = async (req, res) => {
  try {
    const hospitalId = await getHospitalIdFromReq(req);

    const {
      firstName, lastName, email, phone, password,
      licenseNumber, specialties = [], qualifications = [], availability = [],
      consultationFee = 0, roomNo = '',
    } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required user fields' });
    }

    const user = await createBaseUser({
      hospitalId,
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'doctor',
    });

    const doc = new DoctorProfile({
      userId: user._id,
      hospitalId,
      licenseNumber,
      specialties,
      qualifications,
      availability,
      consultationFee,
      roomNo,
    });
    await doc.save();

    res.status(201).json({
      message: 'Doctor created',
      user: {
        _id: user._id,
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      profile: doc,
    });
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ message: 'Duplicate key (check email or unique fields)' });
    res.status(400).json({ message: err.message || 'Failed to create doctor' });
  }
};

// ---- POST /api/hospital/users/patient -----------------------
exports.createPatient = async (req, res) => {
  try {
    const hospitalId = await getHospitalIdFromReq(req);
    const hospital = await Hospital.findById(hospitalId);

    const {
      firstName, lastName, email, phone, password,
      dob, gender, bloodGroup, allergies = [], chronicConditions = [], medications = [],
      heightCm, weightKg,
      emergencyContact = {}, insurance = {},
    } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required user fields' });
    }

    const user = await createBaseUser({
      hospitalId,
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'patient',
    });

    const barcode = `PT-${hospital.code}-${String(user.user_id).padStart(6, '0')}`;

    const patient = new PatientProfile({
      userId: user._id,
      hospitalId,
      dob,
      gender,
      bloodGroup,
      allergies,
      chronicConditions,
      medications,
      heightCm,
      weightKg,
      emergencyContact,
      insurance,
      barcode,
    });
    await patient.save();

    res.status(201).json({
      message: 'Patient created',
      user: {
        _id: user._id,
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      profile: patient,
    });
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ message: 'Duplicate key (check email or barcode)' });
    res.status(400).json({ message: err.message || 'Failed to create patient' });
  }
};

// ---- POST /api/hospital/users/cashier -----------------------
exports.createCashier = async (req, res) => {
  try {
    const hospitalId = await getHospitalIdFromReq(req);

    const {
      firstName, lastName, email, phone, password,
      employeeId, joinedAt, shift = 'rotational',
      permissions = { canRefund: true, canSplit: true },
    } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required user fields' });
    }

    const user = await createBaseUser({
      hospitalId,
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'cashier',
    });

    const cashier = new CashierProfile({
      userId: user._id,
      hospitalId,
      employeeId,
      joinedAt: joinedAt ? new Date(joinedAt) : undefined,
      shift,
      permissions,
    });
    await cashier.save();

    res.status(201).json({
      message: 'Cashier created',
      user: {
        _id: user._id,
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      profile: cashier,
    });
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ message: 'Duplicate key (check email or employeeId)' });
    res.status(400).json({ message: err.message || 'Failed to create cashier' });
  }
};

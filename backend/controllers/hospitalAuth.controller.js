const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitalModel');
const User = require('../models/userModel');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

// Helpers
const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      hospitalId: user.hospitalId?.toString() || null,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '1d' }
  );

// POST /api/hospital/auth/register
// Create Hospital + first Admin user (self-onboarding)
exports.registerHospital = async (req, res) => {
  try {
    const {
      hospital: { name, code, address, phone, email: hospitalEmail } = {},
      admin: { firstName, lastName, email, password, phone: adminPhone } = {},
    } = req.body || {};

    if (!name || !code || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Uniqueness checks
    const existingHospital = await Hospital.findOne({ code: code.toUpperCase() });
    if (existingHospital) {
      return res.status(409).json({ message: 'Hospital code already exists' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Admin email already in use' });
    }

    // Create Hospital
    const hospital = new Hospital({
      name,
      code: code.toUpperCase(),
      address,
      phone,
      email: hospitalEmail,
    });
    await hospital.save();

    // Create Admin User
    const hash = await bcrypt.hash(password, 10);
    const admin = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hash,
      phone: adminPhone,
      role: 'admin',
      hospitalId: hospital._id,
      isVerified: true,
      userStatus: 'active',
    });
    await admin.save();

    const token = signToken(admin);

    // sanitize output
    const adminSafe = {
      _id: admin._id,
      user_id: admin.user_id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      hospitalId: hospital._id,
    };

    res.status(201).json({
      message: 'Hospital onboarded successfully',
      hospital: {
        _id: hospital._id,
        hospital_id: hospital.hospital_id,
        name: hospital.name,
        code: hospital.code,
        status: hospital.status,
      },
      admin: adminSafe,
      token,
    });
  } catch (err) {
    // Handle duplicate keys gracefully
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(409).json({ message: `Duplicate ${field}` });
    }
    console.error('registerHospital error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/hospital/auth/login
// Login Hospital Admin (email/password → JWT)
exports.loginHospitalAdmin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' }).populate('hospitalId');
    if (!user || user.userStatus !== 'active') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.hospitalId || user.hospitalId.status !== 'active') {
      return res.status(403).json({ message: 'Hospital is inactive. Contact support.' });
    }

    const token = signToken(user);

    const userSafe = {
      _id: user._id,
      user_id: user.user_id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId._id,
      hospital: {
        _id: user.hospitalId._id,
        code: user.hospitalId.code,
        name: user.hospitalId.name,
      },
    };

    res.json({ success: true, token, user: userSafe });
  } catch (err) {
    console.error('loginHospitalAdmin error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// // // controllers/hospitalAuth.controller.js
// // const bcrypt = require('bcrypt');
// // const jwt = require('jsonwebtoken');
// // const Hospital = require('../models/hospitalModel');
// // const User = require('../models/userModel');
// // require('dotenv').config();

// // // const SECRET_KEY = process.env.SECRET_KEY;

// // const SECRET_KEY =
// //   process.env.SECRET_KEY ||
// //   process.env.JWT_SECRET ||
// //   'dev-insecure-secret-change-me';

// // // ---- Helpers -------------------------------------------------
// // const getHospitalIdString = (user) => {
// //   const hid = user && user.hospitalId
// //     ? (user.hospitalId._id ? user.hospitalId._id : user.hospitalId)
// //     : null;
// //   return hid ? hid.toString() : null;
// // };

// // const signToken = (user) =>
// //   jwt.sign(
// //     {
// //       sub: user._id.toString(),
// //       role: user.role,
// //       hospitalId: getHospitalIdString(user), // only the id!
// //       email: user.email,
// //     },
// //     SECRET_KEY,
// //     { expiresIn: '1d' }
// //   );

// // const sanitizeUser = (u) => ({
// //   _id: u._id,
// //   user_id: u.user_id,
// //   firstName: u.firstName,
// //   lastName: u.lastName,
// //   email: u.email,
// //   role: u.role,
// //   hospitalId: u.hospitalId?._id || u.hospitalId,
// //   hospital:
// //     u.hospitalId && u.hospitalId._id
// //       ? {
// //           _id: u.hospitalId._id,
// //           code: u.hospitalId.code,
// //           name: u.hospitalId.name,
// //           status: u.hospitalId.status,
// //         }
// //       : undefined,
// // });

// // // ---- POST /api/hospital/auth/register ------------------------
// // const registerHospital = async (req, res) => {
// //   try {
// //     const {
// //       hospital: { name, code, address, phone, email: hospitalEmail } = {},
// //       admin: { firstName, lastName, email, password, phone: adminPhone } = {},
// //     } = req.body || {};

// //     if (!name || !code || !firstName || !lastName || !email || !password) {
// //       return res.status(400).json({ message: 'Missing required fields' });
// //     }

// //     const existingHospital = await Hospital.findOne({ code: code.toUpperCase() });
// //     if (existingHospital)
// //       return res.status(409).json({ message: 'Hospital code already exists' });

// //     const existingUser = await User.findOne({ email: email.toLowerCase() });
// //     if (existingUser)
// //       return res.status(409).json({ message: 'Admin email already in use' });

// //     const hospital = await new Hospital({
// //       name,
// //       code: code.toUpperCase(),
// //       address,
// //       phone,
// //       email: hospitalEmail,
// //     }).save();

// //     const hash = await bcrypt.hash(password, 10);
// //     const admin = await new User({
// //       firstName,
// //       lastName,
// //       email: email.toLowerCase(),
// //       password: hash,
// //       phone: adminPhone,
// //       role: 'admin',
// //       hospitalId: hospital._id,
// //       isVerified: true,
// //       userStatus: 'active',
// //     }).save();

// //     const token = signToken(admin);

// //     return res.status(201).json({
// //       message: 'Hospital onboarded successfully',
// //       hospital: {
// //         _id: hospital._id,
// //         hospital_id: hospital.hospital_id,
// //         name: hospital.name,
// //         code: hospital.code,
// //         status: hospital.status,
// //       },
// //       admin: sanitizeUser(admin),
// //       token,
// //     });
// //   } catch (err) {
// //     if (err?.code === 11000) {
// //       const field = Object.keys(err.keyPattern || {})[0] || 'field';
// //       return res.status(409).json({ message: `Duplicate ${field}` });
// //     }
// //     console.error('registerHospital error', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // // ---- POST /api/hospital/auth/login --------------------------
// // const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body || {};
// //     if (!email || !password)
// //       return res.status(400).json({ message: 'Email and password required' });

// //     // generic login for any hospital user (admin/doctor/patient/cashier)
// //     const user = await User.findOne({ email: email.toLowerCase() }).populate('hospitalId');
// //     if (!user || user.userStatus !== 'active')
// //       return res.status(401).json({ message: 'Invalid credentials' });

// //     if (!user.hospitalId || user.hospitalId.status !== 'active') {
// //       return res
// //         .status(403)
// //         .json({ message: 'Hospital is inactive. Contact support.' });
// //     }

// //     const ok = await bcrypt.compare(password, user.password);
// //     if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

// //     const token = signToken(user);
// //     return res.json({ success: true, token, user: sanitizeUser(user) });
// //   } catch (err) {
// //     console.error('login error', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // // ---- GET /api/hospital/auth/me ------------------------------
// // const me = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.sub).populate('hospitalId');
// //     if (!user) return res.status(404).json({ message: 'User not found' });
// //     return res.json({ user: sanitizeUser(user) });
// //   } catch (e) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // module.exports = { registerHospital, login, me };

  
// // controllers/hospitalAuth.controller.js
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Hospital = require('../models/hospitalModel');
// const User = require('../models/userModel');

// require('dotenv').config();

// /**
//  * Use ONE secret everywhere.
//  * If missing in env, fall back to a dev string so local runs never crash.
//  * (In prod, make sure SECRET_KEY is set.)
//  */
// const SECRET_KEY =
//   process.env.SECRET_KEY ||
//   process.env.JWT_SECRET ||
//   'dev-insecure-secret-change-me';

// /* ------------------------------- Helpers ---------------------------------- */

// const getHospitalIdString = (user) => {
//   // works for ObjectId or populated document
//   const hid = user?.hospitalId
//     ? (user.hospitalId._id ? user.hospitalId._id : user.hospitalId)
//     : null;
//   return hid ? hid.toString() : null;
// };

// const signToken = (user) =>
//   jwt.sign(
//     {
//       sub: user._id.toString(),
//       role: user.role,
//       hospitalId: getHospitalIdString(user), // store only the id in the token
//       email: user.email,
//     },
//     SECRET_KEY,
//     { expiresIn: '1d' }
//   );

// const sanitizeUser = (u) => ({
//   _id: u._id,
//   user_id: u.user_id,
//   firstName: u.firstName,
//   lastName: u.lastName,
//   email: u.email,
//   role: u.role,
//   hospitalId: u.hospitalId?._id || u.hospitalId,
//   hospital:
//     u.hospitalId && u.hospitalId._id
//       ? {
//           _id: u.hospitalId._id,
//           code: u.hospitalId.code,
//           name: u.hospitalId.name,
//           status: u.hospitalId.status,
//         }
//       : undefined,
// });

// /* ----------------------- POST /api/hospital/auth/register ------------------ */
// /**
//  * Creates a Hospital and its first Admin user.
//  * Body: { hospital: { name, code, address, phone, email }, admin: { firstName, lastName, email, password, phone } }
//  */
// const registerHospital = async (req, res) => {
//   try {
//     const {
//       hospital: { name, code, address, phone, email: hospitalEmail } = {},
//       admin: { firstName, lastName, email, password, phone: adminPhone } = {},
//     } = req.body || {};

//     if (!name || !code || !firstName || !lastName || !email || !password) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const normalizedCode = String(code).toUpperCase().trim();
//     const normalizedEmail = String(email).toLowerCase().trim();

//     // Uniqueness checks
//     const existingHospital = await Hospital.findOne({ code: normalizedCode });
//     if (existingHospital) {
//       return res.status(409).json({ message: 'Hospital code already exists' });
//     }

//     const existingUser = await User.findOne({ email: normalizedEmail });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Admin email already in use' });
//     }

//     // Create Hospital
//     const hospital = await new Hospital({
//       name: name.trim(),
//       code: normalizedCode,
//       address: address || '',
//       phone: phone || '',
//       email: hospitalEmail || '',
//     }).save();

//     // Create Admin
//     const hash = await bcrypt.hash(password, 10);
//     const admin = await new User({
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       email: normalizedEmail,
//       password: hash,
//       phone: adminPhone || '',
//       role: 'admin',
//       hospitalId: hospital._id,
//       isVerified: true,
//       userStatus: 'active',
//     }).save();

//     const token = signToken(admin);

//     return res.status(201).json({
//       message: 'Hospital onboarded successfully',
//       hospital: {
//         _id: hospital._id,
//         hospital_id: hospital.hospital_id,
//         name: hospital.name,
//         code: hospital.code,
//         status: hospital.status,
//       },
//       admin: sanitizeUser(admin),
//       token,
//     });
//   } catch (err) {
//     if (err?.code === 11000) {
//       const field = Object.keys(err.keyPattern || {})[0] || 'field';
//       return res.status(409).json({ message: `Duplicate ${field}` });
//     }
//     console.error('registerHospital error', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// /* ------------------------- POST /api/hospital/auth/login ------------------- */
// /**
//  * Generic login for any role (admin/doctor/patient/cashier).
//  * Body: { email, password }
//  */
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password required' });
//     }

//     const normalizedEmail = String(email).toLowerCase().trim();

//     const user = await User.findOne({ email: normalizedEmail }).populate('hospitalId');
//     if (!user || user.userStatus !== 'active') {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     if (!user.hospitalId || user.hospitalId.status !== 'active') {
//       return res.status(403).json({ message: 'Hospital is inactive. Contact support.' });
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = signToken(user);
//     return res.json({ success: true, token, user: sanitizeUser(user) });
//   } catch (err) {
//     console.error('login error', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// /* --------------------------- GET /api/hospital/auth/me --------------------- */
// /**
//  * Requires auth middleware to set req.user (decoded JWT).
//  */
// const me = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.sub).populate('hospitalId');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     return res.json({ user: sanitizeUser(user) });
//   } catch (e) {
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   registerHospital,
//   login,
//   me,
// };

// backend/controllers/hospitalAuth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/hospitalModel');
const User = require('../models/userModel');
require('dotenv').config();

const SECRET_KEY =
  process.env.SECRET_KEY ||
  process.env.JWT_SECRET ||
  'dev-insecure-secret-change-me';

const getHospitalIdString = (user) => {
  const hid = user?.hospitalId ? (user.hospitalId._id || user.hospitalId) : null;
  return hid ? hid.toString() : null;
};

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      hospitalId: getHospitalIdString(user),
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '1d' }
  );

const sanitizeUser = (u) => ({
  _id: u._id,
  user_id: u.user_id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  role: u.role,
  hospitalId: u.hospitalId?._id || u.hospitalId,
  hospital: u.hospitalId && u.hospitalId._id
    ? { _id: u.hospitalId._id, code: u.hospitalId.code, name: u.hospitalId.name, status: u.hospitalId.status }
    : undefined,
});

exports.registerHospital = async (req, res) => {
  try {
    const {
      hospital: { name, code, address, phone, email: hospitalEmail } = {},
      admin: { firstName, lastName, email, password, phone: adminPhone } = {},
    } = req.body || {};

    if (!name || !code || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const normalizedCode = String(code).toUpperCase().trim();
    const normalizedEmail = String(email).toLowerCase().trim();

    const existingHospital = await Hospital.findOne({ code: normalizedCode });
    if (existingHospital) return res.status(409).json({ message: 'Hospital code already exists' });

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ message: 'Admin email already in use' });

    const hospital = await new Hospital({
      name: name.trim(),
      code: normalizedCode,
      address: address || '',
      phone: phone || '',
      email: hospitalEmail || '',
    }).save();

    const hash = await bcrypt.hash(password, 10);
    const admin = await new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hash,
      phone: adminPhone || '',
      role: 'admin',
      hospitalId: hospital._id,
      isVerified: true,
      userStatus: 'active',
    }).save();

    const token = signToken(admin);
    return res.status(201).json({
      message: 'Hospital onboarded successfully',
      hospital: {
        _id: hospital._id,
        hospital_id: hospital.hospital_id,
        name: hospital.name,
        code: hospital.code,
        status: hospital.status,
      },
      admin: sanitizeUser(admin),
      token,
    });
  } catch (err) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'field';
      return res.status(409).json({ message: `Duplicate ${field}` });
    }
    console.error('registerHospital error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).populate('hospitalId');
    if (!user || user.userStatus !== 'active') return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.hospitalId || user.hospitalId.status !== 'active') {
      return res.status(403).json({ message: 'Hospital is inactive. Contact support.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ success: true, token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).populate('hospitalId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: sanitizeUser(user) });
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
};


// controllers/profile.controller.js
const User = require('../models/userModel');                 // ← adjust if your path/name differs
const PatientProfile = require('../models/patientProfileModel'); // optional; if you store phone here

/**
 * GET /api/profile/me
 * Returns a minimal, role-agnostic profile payload for the current user.
 * Requires authMiddleware to set req.user.{sub, role}.
 */
exports.me = async (req, res) => {
  try {
    const { sub: id, role } = req.user || {};
    if (!id) return res.status(401).json({ message: 'Unauthorized' });

    // Base user (names + email likely live here)
    let userDoc = await User.findById(id);
    if (userDoc && typeof userDoc.lean === 'function') userDoc = await userDoc.lean().exec();
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    // Optional extra patient fields (e.g., phone)
    let patientDoc = null;
    if (role === 'patient') {
      try {
        patientDoc = await PatientProfile.findOne({ userId: id });
        if (patientDoc && typeof patientDoc.lean === 'function') patientDoc = await patientDoc.lean().exec();
      } catch (_) {}
    }

    const first = userDoc.firstName || userDoc.firstname || '';
    const last  = userDoc.lastName  || userDoc.lastname  || '';
    const name  = [first, last].filter(Boolean).join(' ').trim() || userDoc.name || userDoc.fullName || '';

    const email = userDoc.email || '';
    const phone = patientDoc?.phone || userDoc.phone || userDoc.mobile || userDoc.contactNumber || '';

    return res.json({ name, email, phone });
  } catch (err) {
    console.error('profile.me error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
//commit
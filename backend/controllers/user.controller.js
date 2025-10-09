// controllers/user.controller.js
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

exports.createUserForHospital = async (req, res) => {
  try {
    // req.user is set by your auth middleware (JWT). It contains hospitalId & role.
    const { role } = req.user || {};
    if (role !== 'admin') return res.status(403).json({ message: 'Only hospital admin can create users' });

    const { firstName, lastName, email, password, phone, role: newUserRole } = req.body || {};
    if (!firstName || !lastName || !email || !password || !newUserRole) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['doctor','cashier','reception','patient'].includes(newUserRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hash,
      phone,
      role: newUserRole,
      hospitalId: req.user.hospitalId,   // bind to admin’s hospital
      userStatus: 'active',
      isVerified: true,
    });
    await user.save();

    res.status(201).json({
      message: 'User created',
      user: {
        _id: user._id,
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('createUserForHospital error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsersForHospital = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only hospital admin can list users' });

    const { role, q } = req.query;
    const filter = { hospitalId: req.user.hospitalId };
    if (role) filter.role = role;
    if (q) {
      filter.$or = [
        { firstName: new RegExp(q, 'i') },
        { lastName: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    console.error('listUsersForHospital error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only hospital admin can update users' });

    const { id } = req.params;
    const { userStatus } = req.body || {};
    if (!['active','inactive'].includes(userStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, hospitalId: req.user.hospitalId },
      { userStatus },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Status updated', user });
  } catch (err) {
    console.error('updateUserStatus error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

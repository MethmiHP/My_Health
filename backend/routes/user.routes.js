// routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createUserForHospital, listUsersForHospital, updateUserStatus } = require('../controllers/user.controller');

// All routes here are admin-only (JWT must have role admin)
router.post('/', auth(['admin']), createUserForHospital);
router.get('/',  auth(['admin']), listUsersForHospital);
router.patch('/:id/status', auth(['admin']), updateUserStatus);

module.exports = router;

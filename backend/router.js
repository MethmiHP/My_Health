// /backend/router/index.js
const express = require('express');
const router = express.Router();

// Health check (through /api/health)
router.get('/health', (req, res) => res.json({ ok: true }));

// Hospital auth (register/login/me)
// -> POST /api/hospital/auth/register
// -> POST /api/hospital/auth/login
// -> GET  /api/hospital/auth/me
router.use('/hospital/auth', require('./routes/hospitalAuth.routes'));

// Role-specific creation (protected by admin)
// -> POST /api/hospital/users/doctor
// -> POST /api/hospital/users/patient
// -> POST /api/hospital/users/cashier
router.use('/hospital/users', require('./routes/hospitalUsers.routes'));

// OPTIONAL: legacy/general user routes (only if you still need them).
// Mount under /api/legacy/users to avoid confusion with hospital users.
router.use('/legacy/users', require('./routes/user.routes'));

// 404 for unknown /api routes (nice to have)
router.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: `/api${req.originalUrl}` });
});

module.exports = router;

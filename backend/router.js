// router/index.js
const express = require("express");
const router = express.Router();

const hospitalAuthRoutes = require('./routes/hospitalAuth.routes');
const userRoutes = require('./routes/user.routes');
const hospitalUsersRoutes = require('./routes/hospitalUsers.routes');
const patientRoutes = require('./routes/patient.routes');
const patientReportRoutes = require('./routes/patientReport.routes');
const medicalHistoryRoutes = require('./routes/medicalHistory.routes');
const mailService = require('./services/mail.service'); // <-- make sure this exists
const paymentRoutes = require('./routes/payment.routes'); // <-- payment routes
const reportRoutes = require('./routes/report.routes');

const authRoutes = require('./routes/hospitalAuth.routes');
router.use('/auth', authRoutes);

const profileRoutes        = require('./routes/profile.routes');
router.use('/profile', profileRoutes);

// Mount WITHOUT '/api' (app.js adds '/api')
router.use('/hospital/auth', hospitalAuthRoutes);
router.use('/users', userRoutes);
router.use('/hospital/users', hospitalUsersRoutes);
router.use('/patients', patientRoutes);
router.use('/patient-reports', patientReportRoutes);
router.use('/medical-history', medicalHistoryRoutes);
router.use('/appointments', require('./routes/appointment.routes'));
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);

// Health
router.get('/health', (req, res) => res.json({ ok: true }));

// --- Debug email: POST /api/debug/email ---
router.post('/debug/email', async (req, res) => {
  try {
    const { to = process.env.EMAIL_USER } = req.body || {};
    if (!to) return res.status(400).json({ message: 'Missing "to" address' });
    

    const info = await mailService.send({
      to,
      subject: 'SmartCare: Debug email',
      text: 'This is a test email from the SmartCare backend.',
      html: '<p>This is a <b>test email</b> from the SmartCare backend.</p>',
    });

    return res.json({
      ok: true,
      to,
      messageId: info?.messageId,
      preview: info?.previewURL || info?.preview || undefined,
    });
  } catch (err) {
    console.error('debug email error', err);
    return res.status(500).json({ ok: false, error: err.message || 'Email send failed' });
  }
});

module.exports = router;
//commit
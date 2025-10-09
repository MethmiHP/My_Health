// backend/routes/debug.routes.js
const express = require('express');
const { sendMail } = require('../services/mail.service');
const router = express.Router();

router.post('/email', async (req, res) => {
  try {
    const { to } = req.body;
    await sendMail({
      to,
      subject: 'SmartCare test email',
      text: 'If you can read this, SMTP is working.',
      html: '<p>If you can read this, <b>SMTP is working</b>.</p>',
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;

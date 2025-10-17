
// services/mail.service.js
const nodemailer = require('nodemailer');

const {
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  SMTP_SECURE = 'true',
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  DISABLE_EMAIL,
} = process.env;

const disabled = String(DISABLE_EMAIL || '').toLowerCase() === 'true';

let transporter = null;

function ensureTransporter() {
  if (disabled) return null;
  if (transporter) return transporter;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be set in .env');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true', // true=>465, false=>587
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  return transporter;
}

/**
 * Send an email
 * @param {Object} opts
 * @param {string|string[]} opts.to
 * @param {string} opts.subject
 * @param {string} [opts.text]
 * @param {string} [opts.html]
 * @param {Array} [opts.attachments]
 */
async function send({ to, subject, text, html, attachments } = {}) {
  if (!to) throw new Error('Missing "to" address');
  if (!subject) throw new Error('Missing "subject"');

  if (disabled) {
    // No-op mode for dev
    return {
      messageId: 'disabled-mode',
      envelope: { to: Array.isArray(to) ? to : [to] },
      previewURL: null,
      disabled: true,
    };
  }

  const t = ensureTransporter();

  const info = await t.sendMail({
    from: EMAIL_FROM || EMAIL_USER,
    to,
    subject,
    text,
    html,
    attachments,
  });

  return {
    messageId: info.messageId,
    envelope: info.envelope,
    previewURL: (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) || null,
  };
}

module.exports = { send };

// // backend/services/mail.service.js
// const nodemailer = require('nodemailer');

// const {
//   SMTP_HOST = 'smtp.gmail.com',
//   SMTP_PORT = '465',
//   SMTP_SECURE = 'true',
//   EMAIL_USER,
//   EMAIL_PASS,
//   EMAIL_FROM,
//   DISABLE_EMAIL = 'false',
//   NODE_ENV,
//   DEV_EMAIL_TO, // optional: override recipients during dev
// } = process.env;

// // Parse envs safely
// const toBool = (v) => String(v).toLowerCase() === 'true';
// const toInt = (v, def = 0) => (isNaN(parseInt(v, 10)) ? def : parseInt(v, 10));

// const EMAIL_DISABLED = toBool(DISABLE_EMAIL);
// const SECURE = toBool(SMTP_SECURE);
// const PORT = toInt(SMTP_PORT, 465);

// // Single transporter
// const transporter = nodemailer.createTransport({
//   host: SMTP_HOST,
//   port: PORT,
//   secure: SECURE, // true for 465, false for 587/STARTTLS
//   auth: { user: EMAIL_USER, pass: EMAIL_PASS },
//   // Helps in some corporate/local dev environments:
//   tls: { rejectUnauthorized: false },
// });

// // verify once and log
// let verifiedOnce = false;
// async function ensureReady() {
//   if (verifiedOnce) return;
//   try {
//     await transporter.verify();
//     verifiedOnce = true;
//     console.log(
//       `✅ SMTP ready → host=${SMTP_HOST} port=${PORT} secure=${SECURE} user=${EMAIL_USER}`
//     );
//   } catch (err) {
//     console.error('❌ SMTP verify failed:', err?.message || err);
//     throw err;
//   }
// }

// // Low-level send
// async function sendMail({ to, subject, html, text }) {
//   await ensureReady();

//   // Dev override so you don't accidentally email real people
//   const recipient =
//     NODE_ENV === 'development' && DEV_EMAIL_TO ? DEV_EMAIL_TO : to;

//   if (!recipient) throw new Error('sendMail: missing recipient');
//   if (!EMAIL_USER || !EMAIL_PASS)
//     throw new Error('sendMail: EMAIL_USER/PASS not configured');

//   if (EMAIL_DISABLED) {
//     console.log('✉️  Email disabled by env, would send →', {
//       to: recipient,
//       subject,
//     });
//     return { disabled: true };
//   }

//   const info = await transporter.sendMail({
//     from: EMAIL_FROM || EMAIL_USER, // Gmail prefers the authenticated address
//     to: recipient,
//     subject,
//     text,
//     html,
//   });

//   console.log(`✉️  Sent email → id=${info.messageId} to=${recipient} subj="${subject}"`);
//   return info;
// }

// /** High-level templates */

// async function sendAppointmentConfirmation({
//   to,
//   patientName,
//   doctorName,
//   dateLabel,         // preformatted string, e.g. "Fri 11 Oct 2025, 10:30 AM"
//   location = 'SmartCare Hospital',
// }) {
//   const subject = 'Your appointment is confirmed';
//   const text = `Hi ${patientName},

// Your appointment is confirmed.

// Doctor : ${doctorName}
// When   : ${dateLabel}
// Where  : ${location}

// Please arrive 10 minutes early.

// – SmartCare`;
//   const html = `
//     <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;">
//       <h2>Appointment Confirmation</h2>
//       <p>Hi <b>${patientName}</b>,</p>
//       <p>Your appointment is confirmed.</p>
//       <ul>
//         <li><b>Doctor:</b> ${doctorName}</li>
//         <li><b>When:</b> ${dateLabel}</li>
//         <li><b>Where:</b> ${location}</li>
//       </ul>
//       <p>Please arrive 10 minutes early.</p>
//       <p style="color:#0f766e">SmartCare</p>
//     </div>
//   `;

//   return sendMail({ to, subject, text, html });
// }

// module.exports = {
//   sendMail,
//   sendAppointmentConfirmation,
// };

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

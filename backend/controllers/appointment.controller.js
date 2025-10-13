// const Appointment = require('../models/appointmentModel');
// const User = require('../models/userModel');
// const DoctorProfile = require('../models/doctorProfileModel');
// const { getSlots } = require('../services/slot.service');
// const sendMail = require('../services/mail.service'); // simple nodemailer wrapper

// exports.listSpecialties = async (req, res) => {
//   // aggregate from DoctorProfile by hospitalId
//   const hospitalId = req.user.hospitalId;
//   const specs = await DoctorProfile.distinct('specialties', { hospitalId });
//   res.json({ specialties: specs.filter(Boolean).sort() });
// };

// exports.listDoctorsBySpecialty = async (req, res) => {
//   const { specialty } = req.query;
//   const hospitalId = req.user.hospitalId;
//   const docs = await DoctorProfile
//     .find({ hospitalId, specialties: { $in: [specialty] } })
//     .populate('userId', 'firstName lastName email')
//     .lean();
//   res.json({ doctors: docs.map(d => ({
//     doctorId: d.userId._id,
//     name: `${d.userId.firstName} ${d.userId.lastName}`,
//     roomNo: d.roomNo, fee: d.consultationFee
//   }))});
// };

// exports.getSlots = async (req, res) => {
//   const { doctorId, from, to, slotMinutes } = req.query;
//   const hospitalId = req.user.hospitalId;
//   const days = await getSlots({ doctorId, hospitalId, from, to, slotMinutes: Number(slotMinutes||15) });
//   res.json({ days });
// };

// exports.book = async (req, res) => {
//   const hospitalId = req.user.hospitalId;
//   const { doctorId, slotStart, slotEnd, reason, patientId: bodyPatientId } = req.body;

//   // who is the patient?
//   const isReception = req.user.role === 'reception' || req.user.role === 'admin';
//   const patientId = isReception ? bodyPatientId : req.user.sub;
//   if (!patientId) return res.status(400).json({ message: 'patientId required' });

//   // conflict check
//   const exists = await Appointment.findOne({ doctorId, slotStart: new Date(slotStart), status: 'booked' });
//   if (exists) return res.status(409).json({ message: 'Slot already booked' });

//   const appt = await Appointment.create({
//     hospitalId, doctorId, patientId,
//     slotStart: new Date(slotStart),
//     slotEnd:   new Date(slotEnd),
//     reason, status: 'booked', createdBy: req.user.sub,
//     channel: isReception ? 'reception' : 'patient'
//   });

//   // notify
//   try { await sendMail.appointmentConfirmed({ appointmentId: appt._id }); } catch {}

//   res.status(201).json({ message: 'Appointment confirmed', appointment: appt });
// };

// exports.cancel = async (req, res) => {
//   const appt = await Appointment.findById(req.params.id);
//   if (!appt) return res.status(404).json({ message: 'Not found' });

//   // permissions: patient can cancel own; reception/admin can cancel any in hospital
//   const isOwner = String(appt.patientId) === req.user.sub;
//   const isStaff = ['reception','admin'].includes(req.user.role) && String(appt.hospitalId) === req.user.hospitalId;
//   if (!isOwner && !isStaff) return res.status(403).json({ message: 'Forbidden' });

//   appt.status = 'cancelled';
//   appt.cancelledAt = new Date();
//   appt.cancellationReason = req.body?.reason || '';
//   await appt.save();

//   try { await sendMail.appointmentCancelled({ appointmentId: appt._id }); } catch {}
//   res.json({ message: 'Cancelled', appointment: appt });
// };

// exports.reschedule = async (req, res) => {
//   // Book a new slot (conflict check) then cancel old
//   const { newDoctorId, newSlotStart, newSlotEnd } = req.body || {};
//   req.body.doctorId = newDoctorId;
//   req.body.slotStart = newSlotStart;
//   req.body.slotEnd = newSlotEnd;

//   const createRes = await exports.book(req, { status:()=>({json:()=>{}}), json:()=>{} });
//   // naive reuse—alternatively duplicate conflict logic here and do proper transaction
//   const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled', cancelledAt: new Date(), cancellationReason: 'Rescheduled' }, { new: true });
//   res.json({ message: 'Rescheduled', cancelled: appt });
// };

// exports.myAppointments = async (req, res) => {
//   const list = await Appointment.find({ patientId: req.user.sub }).populate('doctorId','firstName lastName');
//   res.json({ appointments: list });
// };

// exports.doctorDayList = async (req, res) => {
//   const { date } = req.query; // YYYY-MM-DD
//   const start = new Date(date); start.setHours(0,0,0,0);
//   const end = new Date(start); end.setDate(end.getDate()+1);
//   const list = await Appointment.find({ doctorId: req.user.sub, slotStart: { $gte: start, $lt: end }, status: 'booked' })
//     .populate('patientId','firstName lastName');
//   res.json({ appointments: list });
// };

// controllers/appointment.controller.js
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const DoctorProfile = require('../models/doctorProfileModel');
const Hospital = require('../models/hospitalModel'); // NEW: for email context
const { getSlots } = require('../services/slot.service');
const mailService = require('../services/mail.service'); // uses mailService.send({ ... })

/* ---------------------------- helpers ---------------------------- */
function buildICS({ title, startISO, endISO, description, location }) {
  // minimal RFC5545 VCALENDAR; good enough for Google/Outlook/Apple
  const dt = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const uid = `${Date.now()}@smartcare`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmartCare//Appointments//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dt(new Date().toISOString())}`,
    `DTSTART:${dt(startISO)}`,
    `DTEND:${dt(endISO)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${(description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${location || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
    ''
  ].join('\r\n');
}

function fmtDateTime(date) {
  try {
    return new Date(date).toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
  } catch {
    return String(date);
  }
}

/* -------------------------- public APIs -------------------------- */

// GET /api/appointments/specialties
exports.listSpecialties = async (req, res) => {
  const hospitalId = req.user.hospitalId;
  const specs = await DoctorProfile.distinct('specialties', { hospitalId });
  res.json({ specialties: specs.filter(Boolean).sort() });
};

// GET /api/appointments/doctors?specialty=Cardiology
exports.listDoctorsBySpecialty = async (req, res) => {
  const { specialty } = req.query;
  const hospitalId = req.user.hospitalId;
  const docs = await DoctorProfile
    .find({ hospitalId, specialties: { $in: [specialty] } })
    .populate('userId', 'firstName lastName email')
    .lean();

  res.json({
    doctors: docs.map(d => ({
      doctorId: d.userId._id,
      name: `${d.userId.firstName} ${d.userId.lastName}`,
      roomNo: d.roomNo,
      fee: d.consultationFee
    }))
  });
};

// GET /api/appointments/slots?doctorId=...&from=YYYY-MM-DD&to=YYYY-MM-DD&slotMinutes=15
exports.getSlots = async (req, res) => {
  const { doctorId, from, to, slotMinutes } = req.query;
  const hospitalId = req.user.hospitalId;
  const days = await getSlots({
    doctorId,
    hospitalId,
    from,
    to,
    slotMinutes: Number(slotMinutes || 15)
  });
  res.json({ days });
};

// POST /api/appointments/book
exports.book = async (req, res) => {
  const hospitalId = req.user.hospitalId;
  const { doctorId, slotStart, slotEnd, reason, patientId: bodyPatientId } = req.body;

  // who is the patient?
  const isReception = req.user.role === 'reception' || req.user.role === 'admin';
  const patientId = isReception ? bodyPatientId : req.user.sub;
  if (!patientId) return res.status(400).json({ message: 'patientId required' });

  // conflict check
  const exists = await Appointment.findOne({
    doctorId,
    slotStart: new Date(slotStart),
    status: 'booked'
  });
  if (exists) return res.status(409).json({ message: 'Slot already booked' });

  // create appointment
  const appt = await Appointment.create({
    hospitalId,
    doctorId,
    patientId,
    slotStart: new Date(slotStart),
    slotEnd: new Date(slotEnd),
    reason,
    status: 'booked',
    createdBy: req.user.sub,
    channel: isReception ? 'reception' : 'patient'
  });

  // ---- EMAIL: Appointment confirmation (patient) ----
  try {
    // gather context
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);
    const hospital = await Hospital.findById(hospitalId);

    if (patient?.email) {
      const displayDate = fmtDateTime(appt.slotStart);
      const subject = `Appointment Confirmed — Dr. ${doctor.firstName} ${doctor.lastName} on ${displayDate}`;
      const text = `Your appointment is confirmed on ${displayDate} with Dr. ${doctor.firstName} ${doctor.lastName}.`;

      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6; color:#0f172a">
          <h2 style="color:#0f766e; margin:0 0 12px">Your appointment is confirmed</h2>
          <p>Hi ${patient.firstName},</p>
          <p>Your appointment details:</p>
          <ul>
            <li><b>Date & time:</b> ${displayDate}</li>
            <li><b>Doctor:</b> Dr. ${doctor.firstName} ${doctor.lastName}</li>
            ${reason ? `<li><b>Reason:</b> ${reason}</li>` : ''}
            ${hospital ? `<li><b>Hospital:</b> ${hospital.name} (${hospital.code})</li>` : ''}
          </ul>
          <p>If you need to reschedule, please contact the hospital reception.</p>
          <p style="margin-top:16px">— SmartCare</p>
        </div>
      `;

      // Optional ICS calendar invite
      const ics = buildICS({
        title: `Appointment: Dr. ${doctor.firstName} ${doctor.lastName}`,
        startISO: appt.slotStart.toISOString(),
        endISO: appt.slotEnd.toISOString(),
        description: reason || 'Consultation',
        location: hospital ? hospital.name : ''
      });

      await mailService.send({
        to: patient.email,
        subject,
        text,
        html,
        attachments: [
          {
            filename: 'appointment.ics',
            content: ics,
            contentType: 'text/calendar; charset=utf-8'
          }
        ]
      });
    }
  } catch (e) {
    // don't fail the booking if email fails
    console.error('[EMAIL][book] failed:', e.message);
  }

  res.status(201).json({ message: 'Appointment confirmed', appointment: appt });
};

// PATCH /api/appointments/:id/cancel
exports.cancel = async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });

  // permissions
  const isOwner = String(appt.patientId) === req.user.sub;
  const isStaff =
    ['reception', 'admin'].includes(req.user.role) &&
    String(appt.hospitalId) === req.user.hospitalId;

  if (!isOwner && !isStaff) return res.status(403).json({ message: 'Forbidden' });

  appt.status = 'cancelled';
  appt.cancelledAt = new Date();
  appt.cancellationReason = req.body?.reason || '';
  await appt.save();

  // ---- EMAIL: Cancellation notice (patient) ----
  try {
    const patient = await User.findById(appt.patientId);
    const doctor = await User.findById(appt.doctorId);
    const hospital = await Hospital.findById(appt.hospitalId);

    if (patient?.email) {
      const displayDate = fmtDateTime(appt.slotStart);
      const subject = `Appointment Cancelled — Dr. ${doctor.firstName} ${doctor.lastName} on ${displayDate}`;
      const reasonLine = appt.cancellationReason ? `Reason: ${appt.cancellationReason}` : '';
      const text = `Your appointment on ${displayDate} with Dr. ${doctor.firstName} ${doctor.lastName} has been cancelled. ${reasonLine}`;
      const html = `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.6; color:#0f172a">
          <h2 style="color:#b91c1c; margin:0 0 12px">Your appointment has been cancelled</h2>
          <p>Hi ${patient.firstName},</p>
          <p>The following appointment was cancelled:</p>
          <ul>
            <li><b>Date & time:</b> ${displayDate}</li>
            <li><b>Doctor:</b> Dr. ${doctor.firstName} ${doctor.lastName}</li>
            ${hospital ? `<li><b>Hospital:</b> ${hospital.name} (${hospital.code})</li>` : ''}
            ${appt.cancellationReason ? `<li><b>Reason:</b> ${appt.cancellationReason}</li>` : ''}
          </ul>
          <p>If this was a mistake, please create a new appointment.</p>
          <p style="margin-top:16px">— SmartCare</p>
        </div>
      `;

      await mailService.send({
        to: patient.email,
        subject,
        text,
        html
      });
    }
  } catch (e) {
    console.error('[EMAIL][cancel] failed:', e.message);
  }

  res.json({ message: 'Cancelled', appointment: appt });
};

// POST /api/appointments/:id/reschedule
// NOTE: you were reusing `book`—that sends a confirm email now.
// We still cancel the old one (and the cancel route will email).
exports.reschedule = async (req, res) => {
  const { newDoctorId, newSlotStart, newSlotEnd, reason } = req.body || {};

  // Create new appointment (sends confirmation email)
  req.body.doctorId = newDoctorId;
  req.body.slotStart = newSlotStart;
  req.body.slotEnd = newSlotEnd;
  req.body.reason = reason;

  // Call our own book() without breaking response; capture result
  const fakeRes = {
    status: () => fakeRes,
    json: (val) => (fakeRes.payload = val)
  };
  await exports.book(req, fakeRes);

  // Cancel old appointment (will send cancellation email)
  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled', cancelledAt: new Date(), cancellationReason: 'Rescheduled' },
    { new: true }
  );

  res.json({
    message: 'Rescheduled',
    new: fakeRes.payload?.appointment || null,
    cancelled: appt
  });
};

// GET /api/appointments/mine
exports.myAppointments = async (req, res) => {
  const list = await Appointment
    .find({ patientId: req.user.sub })
    .populate('doctorId', 'firstName lastName');
  res.json({ appointments: list });
};

// GET /api/appointments/doctor-day?date=YYYY-MM-DD
exports.doctorDayList = async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }
    
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const start = new Date(date); 
    start.setHours(0, 0, 0, 0);
    const end = new Date(start); 
    end.setDate(end.getDate() + 1);

    const list = await Appointment
      .find({
        doctorId: req.user.sub,
        slotStart: { $gte: start, $lt: end },
        status: 'booked'
      })
      .populate('patientId', 'firstName lastName');

    res.json({ appointments: list });
  } catch (error) {
    console.error('Doctor day list error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

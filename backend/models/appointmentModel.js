const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },
  patientId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  doctorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  // Slot
  slotStart: { type: Date, required: true, index: true },
  slotEnd:   { type: Date, required: true },

  // Booking details
  reason:      { type: String, default: '' },     // “disease details / symptoms”
  channel:     { type: String, enum: ['patient','reception'], default: 'patient' },
  status:      { type: String, enum: ['booked','cancelled','completed','no_show'], default: 'booked' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Audit
  createdAt: { type: Date, default: Date.now },
  cancelledAt: { type: Date },
  cancellationReason: { type: String }
}, { timestamps: true });

// Prevent double-booking the same slot for a doctor
AppointmentSchema.index({ doctorId: 1, slotStart: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'booked' } });

// Optional: prevent overlapping booking by patient at same time
AppointmentSchema.index({ patientId: 1, slotStart: 1, status: 1 }, { partialFilterExpression: { status: 'booked' } });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

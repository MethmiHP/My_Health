const mongoose = require('mongoose');
const { Schema } = mongoose;

const SlotSchema = new Schema({
  day: { type: Number, min: 0, max: 6, required: true }, // 0=Sun..6=Sat
  start: { type: String, required: true },               // "09:00"
  end:   { type: String, required: true },               // "12:30"
}, { _id: false });

const QualificationSchema = new Schema({
  degree: String,
  institution: String,
  year: Number,
}, { _id: false });

const DoctorProfileSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },

  licenseNumber: { type: String, trim: true },
  specialties:   [{ type: String, trim: true }],
  qualifications:[QualificationSchema],
  availability:  [SlotSchema], // optional list of weekly slots
  consultationFee: { type: Number, default: 0 },
  roomNo: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', DoctorProfileSchema);

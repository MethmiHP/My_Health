const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmergencyContactSchema = new Schema({
  name: String,
  phone: String,
  relation: String,
}, { _id: false });

const InsuranceSchema = new Schema({
  provider: String,
  policyNo: String,
}, { _id: false });

const PatientProfileSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },

  // Personal
  dob: Date,
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  bloodGroup: { type: String, trim: true },

  // Medical summary (lightweight – detailed history can live in a Records collection)
  allergies: [String],
  chronicConditions: [String],
  medications: [String],

  // Other
  heightCm: Number,
  weightKg: Number,
  emergencyContact: EmergencyContactSchema,
  insurance: InsuranceSchema,

  // Patient barcode/ID (doctor will scan this)
  barcode: { type: String, unique: true, sparse: true },
}, { timestamps: true });

PatientProfileSchema.index({ hospitalId: 1, barcode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.models.PatientProfile || mongoose.model('PatientProfile', PatientProfileSchema);

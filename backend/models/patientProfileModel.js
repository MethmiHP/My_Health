// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const EmergencyContactSchema = new Schema({
//   name: String,
//   phone: String,
//   relation: String,
// }, { _id: false });

// const InsuranceSchema = new Schema({
//   provider: String,
//   policyNo: String,
// }, { _id: false });

// const PatientProfileSchema = new Schema({
//   userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//   hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },

//   // Personal
//   dob: Date,
//   gender: { type: String, enum: ['male','female','other'], default: 'other' },
//   bloodGroup: { type: String, trim: true },

//   // Medical summary (lightweight – detailed history can live in a Records collection)
//   allergies: [String],
//   chronicConditions: [String],
//   medications: [String],

//   // Other
//   heightCm: Number,
//   weightKg: Number,
//   emergencyContact: EmergencyContactSchema,
//   insurance: InsuranceSchema,

//   // Patient barcode/ID (doctor will scan this)
//   barcode: { type: String, unique: true, sparse: true },
// }, { timestamps: true });

// PatientProfileSchema.index({ hospitalId: 1, barcode: 1 }, { unique: true, sparse: true });

// module.exports = mongoose.models.PatientProfile || mongoose.model('PatientProfile', PatientProfileSchema);


const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for emergency contact
const EmergencyContactSchema = new Schema({
  name: String,
  phone: String,
  relation: String,
}, { _id: false });

// Sub-schema for insurance
const InsuranceSchema = new Schema({
  provider: String,
  policyNo: String,
}, { _id: false });

// Sub-schema for guardian (for patients age 16 or under)
const GuardianSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  nic: { type: String },
  relationship: { type: String },
}, { _id: false });

const PatientProfileSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },

  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // Patient NIC is required only if age > 16; keep unique with sparse to allow null/undefined
  nic: { type: String, unique: true, sparse: true }, // National Identity Card number
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  bloodGroup: { type: String, trim: true },

  // Medical summary
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
  familyConditions: [String], // Family medical conditions
  surgeries: [{
    type: { type: String, enum: ['surgery', 'scan', 'procedure', 'treatment'], default: 'surgery' },
    name: { type: String, required: true },
    description: String,
    date: Date,
    hospital: String,
    surgeon: String,
    results: String, // For scans/procedures
    followUpRequired: { type: Boolean, default: false },
    followUpDate: Date
  }], // Current surgeries, scans, and procedures with descriptions

  // Other
  heightCm: Number,
  weightKg: Number,
  emergencyContact: EmergencyContactSchema,
  insurance: InsuranceSchema,

  // Guardian info for under-16 patients
  guardian: { type: GuardianSchema, default: null },
  consent: { type: Boolean, default: false },

  // Patient barcode/ID
  barcode: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// Index for hospital + barcode combination
PatientProfileSchema.index({ hospitalId: 1, barcode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.models.PatientProfile || mongoose.model('PatientProfile', PatientProfileSchema);

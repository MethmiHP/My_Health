
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema for prescriptions
const PrescriptionSchema = new Schema({
  prescriptionId: { type: String, required: true, trim: true }, // Unique prescription ID
  medicationName: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true }, // e.g., "10mg twice daily"
  quantity: { type: String, trim: true }, // e.g., "30 tablets"
  instructions: { type: String, trim: true }, // How to take the medication
  prescribedBy: { type: String, required: true, trim: true }, // Doctor name
  prescribedDate: { type: Date, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  refills: { type: Number, default: 0 }, // Number of refills allowed
  refillsUsed: { type: Number, default: 0 }, // Number of refills used
  status: { type: String, enum: ['prescribed', 'filled', 'refilled', 'active', 'completed', 'cancelled', 'expired'], default: 'prescribed' },
  reason: { type: String, trim: true }, // Why prescribed
  sideEffects: [String], // Reported side effects
  notes: { type: String, trim: true }, // Additional notes
  pharmacy: { type: String, trim: true }, // Pharmacy name
  cost: { type: Number }, // Prescription cost
}, { _id: false });

// Sub-schema for lab results
const LabResultSchema = new Schema({
  testName: { type: String, required: true, trim: true },
  testDate: { type: Date, required: true },
  results: { type: String, required: true, trim: true },
  normalRange: { type: String, trim: true },
  status: { type: String, enum: ['normal', 'abnormal', 'critical'], default: 'normal' },
  notes: { type: String, trim: true },
}, { _id: false });

// Sub-schema for medications
const MedicationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true }, // e.g., "10mg twice daily"
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  prescribedBy: { type: String, trim: true }, // Doctor name
  reason: { type: String, trim: true }, // Why prescribed
  status: { type: String, enum: ['active', 'discontinued', 'completed'], default: 'active' },
  sideEffects: [String],
}, { _id: false });

// Sub-schema for diagnoses
const DiagnosisSchema = new Schema({
  condition: { type: String, required: true, trim: true },
  diagnosisDate: { type: Date, required: true },
  diagnosedBy: { type: String, trim: true }, // Doctor name
  status: { type: String, enum: ['active', 'resolved', 'chronic'], default: 'active' },
  notes: { type: String, trim: true },
  icdCode: { type: String, trim: true }, // International Classification of Diseases code
}, { _id: false });

// Sub-schema for procedures
const ProcedureSchema = new Schema({
  // Distinguish between surgery, imaging/scan, generic procedure, treatment
  type: { type: String, enum: ['surgery', 'scan', 'procedure', 'treatment'], default: 'surgery' },
  procedureName: { type: String, required: true, trim: true },
  procedureDate: { type: Date, required: true },
  performedBy: { type: String, trim: true }, // Doctor name
  location: { type: String, trim: true }, // Hospital/Clinic
  notes: { type: String, trim: true },
  complications: { type: String, trim: true },
  recoveryNotes: { type: String, trim: true },
}, { _id: false });

// Sub-schema for immunizations
const ImmunizationSchema = new Schema({
  vaccineName: { type: String, required: true, trim: true },
  vaccinationDate: { type: Date, required: true },
  administeredBy: { type: String, trim: true }, // Doctor/Nurse name
  location: { type: String, trim: true }, // Hospital/Clinic
  lotNumber: { type: String, trim: true },
  nextDueDate: { type: Date },
  notes: { type: String, trim: true },
}, { _id: false });

// Sub-schema for family history
const FamilyHistorySchema = new Schema({
  relation: { type: String, required: true, trim: true }, // e.g., "Father", "Mother", "Sibling"
  condition: { type: String, required: true, trim: true },
  ageOfOnset: { type: Number }, // Age when condition was diagnosed
  notes: { type: String, trim: true },
}, { _id: false });

const MedicalHistorySchema = new Schema({
  patientId: { 
    type: Schema.Types.ObjectId, 
    ref: 'PatientProfile', 
    required: true, 
    index: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  hospitalId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hospital', 
    required: true, 
    index: true 
  },
  
  // Personal medical information
  bloodType: { type: String, trim: true },
  allergies: [String],
  chronicConditions: [String],
  
  // Medical records
  prescriptions: [PrescriptionSchema],
  labResults: [LabResultSchema],
  medications: [MedicationSchema],
  diagnoses: [DiagnosisSchema],
  procedures: [ProcedureSchema],
  immunizations: [ImmunizationSchema],
  familyHistory: [FamilyHistorySchema],
  
  // Emergency information
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relation: { type: String, trim: true },
  },
  
  // Additional notes
  generalNotes: { type: String, trim: true },
  lastUpdatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  lastUpdatedAt: { type: Date, default: Date.now },
  
}, { 
  timestamps: true 
});

// Indexes for efficient querying
MedicalHistorySchema.index({ hospitalId: 1, userId: 1 });
MedicalHistorySchema.index({ patientId: 1, createdAt: -1 });
MedicalHistorySchema.index({ 'medications.status': 1, 'medications.endDate': 1 });
MedicalHistorySchema.index({ 'prescriptions.status': 1, 'prescriptions.endDate': 1 });
MedicalHistorySchema.index({ 'diagnoses.status': 1, 'diagnoses.diagnosisDate': -1 });

module.exports = mongoose.models.MedicalHistory || mongoose.model('MedicalHistory', MedicalHistorySchema);

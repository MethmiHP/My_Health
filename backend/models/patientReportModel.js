const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientReportSchema = new Schema({
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
  reportContent: { 
    type: String, 
    required: true, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['new', 'read', 'responded'], 
    default: 'new' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  doctorResponse: { 
    type: String, 
    trim: true 
  },
  respondedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  respondedAt: { 
    type: Date 
  }
}, { 
  timestamps: true 
});

// Index for efficient querying
PatientReportSchema.index({ hospitalId: 1, status: 1, createdAt: -1 });
PatientReportSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.models.PatientReport || mongoose.model('PatientReport', PatientReportSchema);


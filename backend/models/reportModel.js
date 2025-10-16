const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    reportId: {
      type: String,
      unique: true,            // let us generate it, don't mark required
      index: true
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Report Configuration
    reportType: {
      type: String,
      enum: ['summary', 'appointments', 'payments', 'patients', 'doctors', 'custom'],
      required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Filters
    filters: {
      startDate: { type: Date },
      endDate: { type: Date },
      department: { type: String },
      doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
      serviceType: { type: String },
      paymentMethod: { type: String },
      status: { type: String }
    },

    // Report Data Snapshot
    data: {
      summary: Schema.Types.Mixed,
      charts: Schema.Types.Mixed,
      tables: Schema.Types.Mixed
    },

    // Comments and Notes
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],

    // Scheduling
    schedule: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'] },
      cronExpression: { type: String },
      recipients: [{ type: String }],
      lastRun: { type: Date },
      nextRun: { type: Date }
    },

    // Metadata
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    isPublic: { type: Boolean, default: false },
    views: { type: Number, default: 0 },

    // Versions
    version: { type: Number, default: 1 },
    previousVersions: [
      {
        version: Number,
        data: Schema.Types.Mixed,
        updatedAt: Date,
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ]
  },
  { timestamps: true }
);

// Generate unique report ID before validation/save
ReportSchema.pre('validate', async function (next) {
  try {
    if (!this.reportId) {
      const count = await mongoose.model('Report').countDocuments();
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      this.reportId = `RPT-${year}${month}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
  } catch (e) {
    next(e);
  }
});

ReportSchema.index({ hospitalId: 1, createdAt: -1 });
ReportSchema.index({ reportType: 1, status: 1 });
ReportSchema.index({ 'schedule.enabled': 1, 'schedule.nextRun': 1 });

module.exports = mongoose.models.Report || mongoose.model('Report', ReportSchema);

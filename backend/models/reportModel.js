// // // models/reportModel.js
// // const mongoose = require('mongoose');
// // const { Schema } = mongoose;

// // const ReportSchema = new Schema({
// //   reportId: { 
// //     type: String, 
// //     unique: true, 
// //     required: true 
// //   },
// //   hospitalId: { 
// //     type: Schema.Types.ObjectId, 
// //     ref: 'Hospital', 
// //     required: true, 
// //     index: true 
// //   },
// //   createdBy: { 
// //     type: Schema.Types.ObjectId, 
// //     ref: 'User', 
// //     required: true 
// //   },
  
// //   // Report Configuration
// //   reportType: { 
// //     type: String, 
// //     enum: ['summary', 'appointments', 'payments', 'patients', 'doctors', 'custom'], 
// //     required: true 
// //   },
// //   title: { 
// //     type: String, 
// //     required: true, 
// //     trim: true 
// //   },
// //   description: { 
// //     type: String, 
// //     trim: true 
// //   },
  
// //   // Filters
// //   filters: {
// //     startDate: { type: Date },
// //     endDate: { type: Date },
// //     department: { type: String },
// //     doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
// //     serviceType: { type: String },
// //     paymentMethod: { type: String },
// //     status: { type: String }
// //   },
  
// //   // Report Data Snapshot
// //   data: {
// //     summary: Schema.Types.Mixed,
// //     charts: Schema.Types.Mixed,
// //     tables: Schema.Types.Mixed
// //   },
  
// //   // Comments and Notes
// //   comments: [{
// //     userId: { type: Schema.Types.ObjectId, ref: 'User' },
// //     userName: { type: String },
// //     comment: { type: String, required: true },
// //     createdAt: { type: Date, default: Date.now }
// //   }],
  
// //   // Scheduling
// //   schedule: {
// //     enabled: { type: Boolean, default: false },
// //     frequency: { 
// //       type: String, 
// //       enum: ['daily', 'weekly', 'monthly', 'custom'] 
// //     },
// //     cronExpression: { type: String },
// //     recipients: [{ type: String }], // email addresses
// //     lastRun: { type: Date },
// //     nextRun: { type: Date }
// //   },
  
// //   // Metadata
// //   status: { 
// //     type: String, 
// //     enum: ['draft', 'published', 'archived'], 
// //     default: 'draft' 
// //   },
// //   isPublic: { 
// //     type: Boolean, 
// //     default: false 
// //   },
// //   views: { 
// //     type: Number, 
// //     default: 0 
// //   },
  
// //   // Versions
// //   version: { 
// //     type: Number, 
// //     default: 1 
// //   },
// //   previousVersions: [{
// //     version: Number,
// //     data: Schema.Types.Mixed,
// //     updatedAt: Date,
// //     updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
// //   }]
  
// // }, { timestamps: true });

// // // Generate unique report ID before save
// // ReportSchema.pre('save', async function(next) {
// //   if (!this.reportId) {
// //     const count = await mongoose.model('Report').countDocuments();
// //     const date = new Date();
// //     const year = date.getFullYear().toString().substr(-2);
// //     const month = String(date.getMonth() + 1).padStart(2, '0');
// //     this.reportId = `RPT-${year}${month}-${String(count + 1).padStart(6, '0')}`;
// //   }
// //   next();
// // });

// // // Indexes for performance
// // ReportSchema.index({ hospitalId: 1, createdAt: -1 });
// // ReportSchema.index({ reportType: 1, status: 1 });
// // ReportSchema.index({ 'schedule.enabled': 1, 'schedule.nextRun': 1 });

// // module.exports = mongoose.models.Report || mongoose.model('Report', ReportSchema);

// // models/reportModel.js
// const mongoose = require('mongoose');
// const { Schema, Types } = mongoose;

// const ReportSchema = new Schema(
//   {
//     reportId: {
//       type: String,
//       unique: true,
//       required: true,
//       index: true,
//     },
//     hospitalId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Hospital',
//       required: true,
//       index: true,
//     },
//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },

//     // Report Configuration
//     reportType: {
//       type: String,
//       enum: ['summary', 'appointments', 'payments', 'patients', 'doctors', 'custom'],
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },

//     // Filters
//     filters: {
//       startDate: { type: Date },
//       endDate: { type: Date },
//       department: { type: String },
//       doctorId: { type: Schema.Types.ObjectId, ref: 'User' },
//       serviceType: { type: String },
//       paymentMethod: { type: String },
//       status: { type: String },
//       // optional compareWith etc. will be stripped unless added here
//     },

//     // Report Data Snapshot
//     data: {
//       period: Schema.Types.Mixed,   // <- add this to keep your UI's "period"
//       summary: Schema.Types.Mixed,
//       charts: Schema.Types.Mixed,
//       tables: Schema.Types.Mixed,
//     },

//     // Comments and Notes
//     comments: [
//       {
//         userId: { type: Schema.Types.ObjectId, ref: 'User' },
//         userName: { type: String },
//         comment: { type: String, required: true },
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],

//     // Scheduling
//     schedule: {
//       enabled: { type: Boolean, default: false },
//       frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'] },
//       cronExpression: { type: String },
//       recipients: [{ type: String }],
//       lastRun: { type: Date },
//       nextRun: { type: Date },
//     },

//     // Metadata
//     status: {
//       type: String,
//       enum: ['draft', 'published', 'archived'],
//       default: 'draft',
//     },
//     isPublic: { type: Boolean, default: false },
//     views: { type: Number, default: 0 },

//     // Versions
//     version: { type: Number, default: 1 },
//     previousVersions: [
//       {
//         version: Number,
//         data: Schema.Types.Mixed,
//         updatedAt: Date,
//         updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Generate unique report ID before save
// ReportSchema.pre('save', async function (next) {
//   try {
//     if (!this.reportId) {
//       // (Optional) scope the sequence per month to keep IDs tidy
//       const now = new Date();
//       const year = now.getFullYear().toString().slice(-2);
//       const month = String(now.getMonth() + 1).padStart(2, '0');

//       // You can do a monthly-scoped count if you want:
//       // const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//       // const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//       // const count = await this.constructor.countDocuments({ createdAt: { $gte: monthStart, $lt: monthEnd } });

//       const count = await this.constructor.countDocuments(); // simple global sequence
//       const seq = String(count + 1).padStart(6, '0');

//       // ✅ Use backticks for template string
//       this.reportId = `RPT-${year}${month}-${seq}`;
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Helpful indexes
// ReportSchema.index({ hospitalId: 1, createdAt: -1 });
// ReportSchema.index({ reportType: 1, status: 1 });
// ReportSchema.index({ 'schedule.enabled': 1, 'schedule.nextRun': 1 });

// module.exports = mongoose.models.Report || mongoose.model('Report', ReportSchema);

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

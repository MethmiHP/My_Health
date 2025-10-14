// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const PaymentSchema = new Schema({
//   visitId: { type: String, required: true },
//   patientId: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
//   cashierId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   method: { type: String, enum: ['cash', 'card', 'mobile', 'split'], required: true },
//   amount: { type: Number, required: true },
//   note: { type: String },
//   status: { type: String, enum: ['paid', 'refunded', 'void'], default: 'paid' },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);


// // backend/models/paymentModel.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const PaymentSchema = new Schema({
//   patientId: {
//     type: Schema.Types.ObjectId,
//     ref: 'PatientProfile',
//     required: true,
//     index: true
//   },
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   hospitalId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Hospital',
//     required: true,
//     index: true
//   },
//   visitId: {
//     type: String,
//     required: true,
//     index: true
//   },
//   cashierId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
  
//   medications: [{
//     name: { type: String, required: true },
//     quantity: { type: Number, required: true, default: 1 },
//     unitPrice: { type: Number, required: true },
//     totalPrice: { type: Number, required: true }
//   }],
  
//   subtotal: { type: Number, required: true },
//   tax: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, required: true },
  
//   paymentMethod: {
//     type: String,
//     enum: ['cash', 'card', 'mobile', 'split'],
//     required: true
//   },
//   paymentDetails: {
//     amountTendered: Number,
//     change: Number,
//     authorizationCode: String,
//     transactionId: String,
//     cardLast4: String,
//     splitPayments: [{
//       method: String,
//       amount: Number,
//       authCode: String
//     }]
//   },
  
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'completed', 'refunded', 'void', 'partial'],
//     default: 'pending'
//   },
  
//   receiptNumber: {
//     type: String,
//     unique: true
//     // ✅ REMOVED 'required: true' - will be generated automatically
//   },
//   receiptDelivery: {
//     print: { type: Boolean, default: false },
//     sms: { type: Boolean, default: false },
//     email: { type: Boolean, default: false }
//   },
  
//   refundAmount: { type: Number, default: 0 },
//   refundReason: String,
//   refundDate: Date,
//   refundBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
//   voidReason: String,
//   voidDate: Date,
//   voidBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
//   notes: String,
  
// }, { timestamps: true });

// // ✅ CORRECTED: Generate receipt number before validation
// PaymentSchema.pre('validate', async function(next) {
//   if (!this.receiptNumber) {
//     try {
//       // Get the model correctly
//       const PaymentModel = this.constructor;
//       const count = await PaymentModel.countDocuments();
//       const date = new Date();
//       const year = date.getFullYear().toString().substr(-2);
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       this.receiptNumber = `RCP-${year}${month}-${String(count + 1).padStart(6, '0')}`;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// // Indexes
// PaymentSchema.index({ hospitalId: 1, createdAt: -1 });
// PaymentSchema.index({ patientId: 1, createdAt: -1 });
// PaymentSchema.index({ receiptNumber: 1 });
// PaymentSchema.index({ paymentStatus: 1 });

// module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);


// // backend/models/paymentModel.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const PaymentSchema = new Schema({
//   patientId: {
//     type: Schema.Types.ObjectId,
//     ref: 'PatientProfile',
//     required: true,
//     index: true
//   },
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   hospitalId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Hospital',
//     required: true,
//     index: true
//   },
//   visitId: {
//     type: String,
//     required: true,
//     index: true
//   },
//   cashierId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
 
//   medications: [{
//     name: { type: String, required: true },
//     quantity: { type: Number, required: true, default: 1 },
//     unitPrice: { type: Number, required: true },
//     totalPrice: { type: Number, required: true }
//   }],
 
//   subtotal: { type: Number, required: true },
//   tax: { type: Number, default: 0 },
//   discount: { type: Number, default: 0 },
//   totalAmount: { type: Number, required: true },
 
//   paymentMethod: {
//     type: String,
//     enum: ['cash', 'card', 'insurance', 'split'], // Changed 'mobile' to 'insurance'
//     required: true
//   },
//   paymentDetails: {
//     // For cash payments
//     amountTendered: Number,
//     change: Number,
    
//     // For card payments
//     authorizationCode: String,
//     transactionId: String,
//     cardLast4: String,
    
//     // For insurance payments
//     insuranceName: String,
//     insuranceLocation: String,
//     insuranceAmount: Number,
//     insuranceClaimNumber: String,
    
//     // For split payments
//     splitPayments: [{
//       method: String,
//       amount: Number,
//       authCode: String
//     }]
//   },
 
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'completed', 'refunded', 'void', 'partial'],
//     default: 'pending'
//   },
 
//   receiptNumber: {
//     type: String,
//     unique: true
//   },
//   receiptDelivery: {
//     print: { type: Boolean, default: false },
//     sms: { type: Boolean, default: false },
//     email: { type: Boolean, default: false }
//   },
 
//   refundAmount: { type: Number, default: 0 },
//   refundReason: String,
//   refundDate: Date,
//   refundBy: { type: Schema.Types.ObjectId, ref: 'User' },
 
//   voidReason: String,
//   voidDate: Date,
//   voidBy: { type: Schema.Types.ObjectId, ref: 'User' },
 
//   notes: String,
 
// }, { timestamps: true });

// // Generate receipt number before validation
// PaymentSchema.pre('validate', async function(next) {
//   if (!this.receiptNumber) {
//     try {
//       const PaymentModel = this.constructor;
//       const count = await PaymentModel.countDocuments();
//       const date = new Date();
//       const year = date.getFullYear().toString().substr(-2);
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       this.receiptNumber = `RCP-${year}${month}-${String(count + 1).padStart(6, '0')}`;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// // Indexes
// PaymentSchema.index({ hospitalId: 1, createdAt: -1 });
// PaymentSchema.index({ patientId: 1, createdAt: -1 });
// PaymentSchema.index({ receiptNumber: 1 });
// PaymentSchema.index({ paymentStatus: 1 });

// module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

// backend/models/paymentModel.js - UPDATED VERSION

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'PatientProfile',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitalId: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true
  },
  visitId: {
    type: String,
    required: true,
    index: true
  },
  cashierId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
 
  // Medications
  medications: [{
    type: { type: String, default: 'medication' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],

  // Surgeries
  surgeries: [{
    type: { type: String, default: 'surgery' },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],

  // Procedures (scans, treatments, etc.)
  procedures: [{
    type: { type: String, default: 'procedure' },
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],

  // Appointment Fee
  appointmentFee: { type: Number, default: 0 },
 
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
 
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'split'],
    required: true
  },
  paymentDetails: {
    // For cash payments
    amountTendered: Number,
    change: Number,
   
    // For card payments
    authorizationCode: String,
    transactionId: String,
    cardLast4: String,
   
    // For insurance payments
    insuranceName: String,
    insuranceLocation: String,
    insuranceAmount: Number,
    insuranceClaimNumber: String,
   
    // For split payments
    splitPayments: [{
      method: String,
      amount: Number,
      authCode: String
    }]
  },
 
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded', 'void', 'partial'],
    default: 'pending'
  },
 
  receiptNumber: {
    type: String,
    unique: true
  },
  receiptDelivery: {
    print: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false }
  },
 
  refundAmount: { type: Number, default: 0 },
  refundReason: String,
  refundDate: Date,
  refundBy: { type: Schema.Types.ObjectId, ref: 'User' },
 
  voidReason: String,
  voidDate: Date,
  voidBy: { type: Schema.Types.ObjectId, ref: 'User' },
 
  notes: String,
 
}, { timestamps: true });

// Generate receipt number before validation
PaymentSchema.pre('validate', async function(next) {
  if (!this.receiptNumber) {
    try {
      const PaymentModel = this.constructor;
      const count = await PaymentModel.countDocuments();
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      this.receiptNumber = `RCP-${year}${month}-${String(count + 1).padStart(6, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Indexes
PaymentSchema.index({ hospitalId: 1, createdAt: -1 });
PaymentSchema.index({ patientId: 1, createdAt: -1 });
PaymentSchema.index({ receiptNumber: 1 });
PaymentSchema.index({ paymentStatus: 1 });

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
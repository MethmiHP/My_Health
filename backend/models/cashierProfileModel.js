const mongoose = require('mongoose');
const { Schema } = mongoose;

const CashierProfileSchema = new Schema({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },

  employeeId: { type: String, trim: true },    // your internal id
  joinedAt:   { type: Date, default: Date.now },
  shift:      { type: String, enum: ['morning','evening','night','rotational'], default: 'rotational' },
  permissions: {
    canRefund: { type: Boolean, default: true },
    canSplit:  { type: Boolean, default: true },
  }
}, { timestamps: true });

CashierProfileSchema.index({ hospitalId: 1, employeeId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.models.CashierProfile || mongoose.model('CashierProfile', CashierProfileSchema);

const mongoose = require('mongoose');
const Counter = require('./counterModel');

const HospitalSchema = new mongoose.Schema({
  hospital_id: { type: Number, unique: true },              // auto-increment
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g., "CGH"
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },                      // contact email (not login)
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

// Auto-increment hospital_id on create
HospitalSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'hospital_id' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.hospital_id = counter.value;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);

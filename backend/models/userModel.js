const mongoose = require('mongoose');
const Counter = require('./counterModel');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: { type: Number, unique: true },                  // auto-increment (like your old project)
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },              // bcrypt hash
  profilePic:{ type: String, default: '' },
  role:      { type: String, enum: ['admin','doctor','reception','cashier','manager','patient'], default: 'patient' },
  hospitalId:{ type: Schema.Types.ObjectId, ref: 'Hospital', index: true }, // tenant boundary
  phone:     { type: String, default: '' },
  userStatus:{ type: String, enum: ['active', 'inactive'], default: 'active' },
  token:     { type: String, default: '' },
  isVerified:{ type: Boolean, default: true },              // set true for admin on onboarding; you can add email verify later
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Auto-increment user_id on create
UserSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'user_id' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.user_id = counter.value;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

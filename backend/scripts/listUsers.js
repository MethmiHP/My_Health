// backend/scripts/listUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    const users = await User.find({})
      .select('email role userStatus hospitalId createdAt')
      .lean();
    console.table(users);
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

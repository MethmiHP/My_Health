// backend/scripts/seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Hospital = require('../models/hospitalModel');
const User = require('../models/userModel');

const DEFAULT_PASSWORD = 'Passw0rd!'; // what you'll use to login
const SALT_ROUNDS = 10;

async function connectDB() {
  const uri = process.env.DB_URI;
  if (!uri) {
    console.error('❌ Missing DB_URI in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
}

async function getHospital() {
  // Optionally pin a code in .env: SEED_HOSPITAL_CODE=CGH
  const code = (process.env.SEED_HOSPITAL_CODE || 'CGH').toUpperCase();

  let hospital = await Hospital.findOne({ code });
  if (!hospital) {
    // fallback to newest hospital if you onboarded with a different code
    hospital = await Hospital.findOne({}).sort({ createdAt: -1 });
  }

  if (!hospital) {
    // create a default one if none exists
    hospital = await Hospital.create({
      name: 'Central General Hospital',
      code,
      email: 'contact@cgh.lk',
      phone: '+94 11 123 4567',
      address: '123 Lake Rd, Colombo',
    });
    console.log('🏥 Created hospital', hospital.name, hospital.code);
  } else {
    console.log('🏥 Using hospital', hospital.name, hospital.code);
  }

  return hospital;
}

async function upsertUser(hospital, u) {
  const email = u.email.toLowerCase().trim();
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const existing = await User.findOne({ email });

  if (existing) {
    existing.firstName = u.firstName;
    existing.lastName  = u.lastName;
    existing.role      = u.role;
    existing.hospitalId = hospital._id;
    existing.userStatus = 'active';
    existing.password   = hash; // overwrite so you know the password
    await existing.save();
    console.log(`🔁 Updated ${email} as ${u.role}`);
    return existing;
  }

  const created = await User.create({
    firstName: u.firstName,
    lastName : u.lastName,
    email,
    role     : u.role,                         // 'doctor' | 'cashier' | 'reception' | 'patient'
    hospitalId: hospital._id,
    userStatus: 'active',
    password : hash,
  });
  console.log(`✅ Created ${email} as ${u.role}`);
  return created;
}

async function main() {
  try {
    await connectDB();
    const hospital = await getHospital();

    const usersToSeed = [
      { firstName: 'Chathuranga', lastName: 'Gamage',  email: 'doc@cgh.lk',       role: 'doctor' },
      { firstName: 'Ravi',        lastName: 'De Silva', email: 'reception@cgh.lk', role: 'reception' },
      { firstName: 'Kasun',       lastName: 'Perera',   email: 'cashier@cgh.lk',   role: 'cashier' },
      { firstName: 'Nadeesha',    lastName: 'Fernando', email: 'patient@cgh.lk',   role: 'patient' },
    ];

    for (const u of usersToSeed) {
      await upsertUser(hospital, u);
    }

    console.log('\n🔐 Default password for all seeded users:', DEFAULT_PASSWORD);
    console.log('   Try logging in with doc@cgh.lk / Passw0rd!\n');

  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();

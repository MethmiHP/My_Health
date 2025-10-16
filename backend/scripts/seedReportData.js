// backend/scripts/seedReportData.js
// Run with: node backend/scripts/seedReportData.js

require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');
const Payment = require('../models/paymentModel');
const PatientProfile = require('../models/patientProfileModel');
const DoctorProfile = require('../models/doctorProfileModel');
const User = require('../models/userModel');
const Hospital = require('../models/hospitalModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedAppointments(hospitalId, doctorIds, patientIds) {
  console.log('📅 Seeding appointments...');
  
  const statuses = ['booked', 'completed', 'cancelled', 'no_show'];
  const reasons = ['Checkup', 'Follow-up', 'Emergency', 'Consultation', 'Vaccination'];
  const appointments = [];

  // Generate appointments for the last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // 3-10 appointments per day
    const dailyAppointments = Math.floor(Math.random() * 8) + 3;
    
    for (let j = 0; j < dailyAppointments; j++) {
      const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(30);
      
      appointments.push({
        hospitalId,
        patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
        doctorId: doctorIds[Math.floor(Math.random() * doctorIds.length)],
        slotStart,
        slotEnd,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        channel: Math.random() > 0.5 ? 'patient' : 'reception',
        createdBy: patientIds[0],
        createdAt: new Date(date.getTime() - 24 * 60 * 60 * 1000)
      });
    }
  }

  await Appointment.insertMany(appointments);
  console.log(`✅ Created ${appointments.length} appointments`);
}

async function seedPayments(hospitalId, patientIds) {
  console.log('💰 Seeding payments...');
  
  const paymentMethods = ['cash', 'card', 'insurance'];
  const medications = [
    { name: 'Paracetamol', unitPrice: 50 },
    { name: 'Amoxicillin', unitPrice: 100 },
    { name: 'Ibuprofen', unitPrice: 80 },
    { name: 'Cetirizine', unitPrice: 60 },
    { name: 'Metformin', unitPrice: 120 }
  ];
  
  const surgeries = [
    { name: 'Appendectomy', unitPrice: 50000 },
    { name: 'Cataract Surgery', unitPrice: 35000 },
    { name: 'Tonsillectomy', unitPrice: 25000 }
  ];

  const payments = [];

  // Generate payments for the last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // 5-15 payments per day
    const dailyPayments = Math.floor(Math.random() * 11) + 5;
    
    for (let j = 0; j < dailyPayments; j++) {
      const meds = [];
      const medCount = Math.floor(Math.random() * 3) + 1;
      
      for (let k = 0; k < medCount; k++) {
        const med = medications[Math.floor(Math.random() * medications.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        meds.push({
          type: 'medication',
          name: med.name,
          quantity: qty,
          unitPrice: med.unitPrice,
          totalPrice: med.unitPrice * qty
        });
      }

      // Occasionally add surgery
      const surgeriesArr = [];
      if (Math.random() > 0.9) {
        const surg = surgeries[Math.floor(Math.random() * surgeries.length)];
        surgeriesArr.push({
          type: 'surgery',
          name: surg.name,
          quantity: 1,
          unitPrice: surg.unitPrice,
          totalPrice: surg.unitPrice
        });
      }

      const subtotal = [...meds, ...surgeriesArr].reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = subtotal * 0.05;
      const totalAmount = subtotal + tax;

      payments.push({
        hospitalId,
        userId: patientIds[Math.floor(Math.random() * patientIds.length)],
        patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
        visitId: `VST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        cashierId: patientIds[0],
        medications: meds,
        surgeries: surgeriesArr,
        procedures: [],
        appointmentFee: 0,
        subtotal,
        tax,
        discount: 0,
        totalAmount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: 'completed',
        paymentDetails: {},
        receiptDelivery: { print: true },
        createdAt: date
      });
    }
  }

  await Payment.insertMany(payments);
  console.log(`✅ Created ${payments.length} payments`);
}

async function seedPatients(hospitalId, count = 50) {
  console.log('👥 Seeding patients...');
  
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Emma'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  
  const patientIds = [];
  const hospital = await Hospital.findById(hospitalId);

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@test.com`;
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: '$2b$10$defaultHashForTesting', // Pre-hashed password
      role: 'patient',
      hospitalId,
      userStatus: 'active',
      isVerified: true
    });

    // Create patient profile
    const age = Math.floor(Math.random() * 70) + 18;
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - age);

    const patient = await PatientProfile.create({
      userId: user._id,
      hospitalId,
      firstName,
      lastName,
      nic: `${Math.floor(Math.random() * 1000000000)}V`,
      dob,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      allergies: ['None'],
      chronicConditions: [],
      medications: [],
      barcode: `PT-${hospital.code}-${String(user.user_id).padStart(6, '0')}`
    });

    patientIds.push(user._id);
  }

  console.log(`✅ Created ${count} patients`);
  return patientIds;
}

async function seedDoctors(hospitalId, count = 10) {
  console.log('👨‍⚕️ Seeding doctors...');
  
  const firstNames = ['Dr. James', 'Dr. Maria', 'Dr. Ahmed', 'Dr. Lisa', 'Dr. Chen'];
  const lastNames = ['Wilson', 'Patel', 'Kumar', 'Anderson', 'Lee'];
  const specialties = ['Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'];
  
  const doctorIds = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase().replace('dr. ', '')}.${lastName.toLowerCase()}@hospital.com`;
    
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: '$2b$10$defaultHashForTesting',
      role: 'doctor',
      hospitalId,
      userStatus: 'active',
      isVerified: true
    });

    // Create doctor profile
    await DoctorProfile.create({
      userId: user._id,
      hospitalId,
      licenseNumber: `SLMC-${Math.floor(Math.random() * 100000)}`,
      specialties: [specialties[Math.floor(Math.random() * specialties.length)]],
      qualifications: [
        { degree: 'MBBS', institution: 'University of Colombo', year: 2010 }
      ],
      availability: [
        { day: 1, start: '09:00', end: '12:00' },
        { day: 3, start: '14:00', end: '17:00' }
      ],
      consultationFee: Math.floor(Math.random() * 2000) + 1000,
      roomNo: `R${Math.floor(Math.random() * 50) + 1}`
    });

    doctorIds.push(user._id);
  }

  console.log(`✅ Created ${count} doctors`);
  return doctorIds;
}

async function main() {
  console.log('🚀 Starting data seeding...\n');
  
  await connectDB();

  // Get or create a test hospital
  let hospital = await Hospital.findOne({ code: 'TST' });
  
  if (!hospital) {
    hospital = await Hospital.create({
      name: 'Test Hospital',
      code: 'TST',
      address: '123 Test Street',
      phone: '0112345678',
      status: 'active'
    });
    console.log('✅ Created test hospital');
  }

  const hospitalId = hospital._id;

  // Clear existing test data
  await Appointment.deleteMany({ hospitalId });
  await Payment.deleteMany({ hospitalId });
  console.log('🗑️  Cleared existing data\n');

  // Seed data
  const patientIds = await seedPatients(hospitalId, 50);
  const doctorIds = await seedDoctors(hospitalId, 10);
  await seedAppointments(hospitalId, doctorIds, patientIds);
  await seedPayments(hospitalId, patientIds);

  console.log('\n✨ Data seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Hospital ID: ${hospitalId}`);
  console.log(`   Patients: ${patientIds.length}`);
  console.log(`   Doctors: ${doctorIds.length}`);
  console.log(`   Appointments: ${await Appointment.countDocuments({ hospitalId })}`);
  console.log(`   Payments: ${await Payment.countDocuments({ hospitalId })}`);
  
  await mongoose.connection.close();
  console.log('\n👋 Database connection closed');
}

main().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
// _tests_/hospitalUsers.controller.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const hospitalUsersController = require('../controllers/hospitalUser.controller');
const User = require('../models/userModel');
const Hospital = require('../models/hospitalModel');
const DoctorProfile = require('../models/doctorProfileModel');
const PatientProfile = require('../models/patientProfileModel');
const CashierProfile = require('../models/cashierProfileModel');
const barcodeUtils = require('../utils/barcodeUtils');

jest.mock('../models/userModel');
jest.mock('../models/hospitalModel');
jest.mock('../models/doctorProfileModel');
jest.mock('../models/patientProfileModel');
jest.mock('../models/cashierProfileModel');
jest.mock('../utils/barcodeUtils');
jest.mock('bcrypt');

const app = express();
app.use(bodyParser.json());

// mock auth context with valid ObjectId and existing hospital
const { Types } = require('mongoose');
const hid = new Types.ObjectId();
jest.spyOn(Hospital, 'exists').mockResolvedValue(true);
jest.spyOn(Hospital, 'findById').mockResolvedValue({ _id: hid, code: 'HOSP1' });
app.use((req, res, next) => {
  req.user = { hospitalId: hid };
  next();
});

app.post('/doctor', hospitalUsersController.createDoctor);
app.post('/patient', hospitalUsersController.createPatient);
app.post('/cashier', hospitalUsersController.createCashier);

describe('Hospital Users Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  // Make model constructors return sensible instances with fields preserved
  User.mockImplementation((doc) => ({
    ...doc,
    _id: 'u-mock',
    user_id: 'user-mock',
    save: jest.fn().mockResolvedValue(true),
  }));
  DoctorProfile.mockImplementation((doc) => ({
    ...doc,
    save: jest.fn().mockResolvedValue(true),
  }));
  PatientProfile.mockImplementation((doc) => ({
    ...doc,
    save: jest.fn().mockResolvedValue(true),
  }));
  CashierProfile.mockImplementation((doc) => ({
    ...doc,
    save: jest.fn().mockResolvedValue(true),
  }));
  });

  describe('createDoctor', () => {
    it('should create a doctor successfully', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpass');

      const res = await request(app).post('/doctor').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'pass123',
        licenseNumber: 'LIC123'
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('email', 'john@test.com');
      expect(res.body.profile).toHaveProperty('licenseNumber', 'LIC123');
    });

    it('should fail if email exists', async () => {
      User.findOne.mockResolvedValue({ _id: 'u2' });

      const res = await request(app).post('/doctor').send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'pass123'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Email already in use/);
    });
  });

  describe('createPatient', () => {
    it('should create patient successfully for age >16', async () => {
      User.findOne.mockResolvedValue(null);
      Hospital.findById.mockResolvedValue({ code: 'HOSP1' });
      bcrypt.hash.mockResolvedValue('hashedpass');
      barcodeUtils.generatePatientBarcode.mockReturnValue('PT-HOSP1-0001');

      const res = await request(app).post('/patient').send({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@test.com',
        password: 'pass123',
        dob: '2000-01-01',
        nic: '123456789V'
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('email', 'alice@test.com');
      expect(res.body.profile).toHaveProperty('barcode', 'PT-HOSP1-0001');
    });

    it('should fail for missing NIC for age >16', async () => {
      User.findOne.mockResolvedValue(null);
      Hospital.findById.mockResolvedValue({ code: 'HOSP1' });

      const res = await request(app).post('/patient').send({
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@test.com',
        password: 'pass123',
        dob: '2000-01-01'
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/NIC is required/);
    });
  });

  describe('createCashier', () => {
    it('should create cashier successfully', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpass');

      const res = await request(app).post('/cashier').send({
        firstName: 'Bob',
        lastName: 'Cash',
        email: 'bob@test.com',
        password: 'pass123'
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('email', 'bob@test.com');
      expect(res.body.profile).toHaveProperty('shift', 'rotational');
    });

    it('should fail if required fields missing', async () => {
      const res = await request(app).post('/cashier').send({ firstName: 'Bob' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Missing required user fields/);
    });
  });
});

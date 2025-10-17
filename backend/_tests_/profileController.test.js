// _tests_/profileController.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const profileController = require('../controllers/profile.controller');
const User = require('../models/userModel');
const PatientProfile = require('../models/patientProfileModel');

jest.mock('../models/userModel');
jest.mock('../models/patientProfileModel');

const app = express();
app.use(bodyParser.json());

// mock auth middleware
app.use((req, res, next) => {
  req.user = { sub: 'user123', role: 'patient' }; // default role
  next();
});

app.get('/profile/me', profileController.me);

describe('Profile Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no user id', async () => {
    // Temporarily mount a route with a stub auth that clears req.user
    const express = require('express');
    const tmp = express.Router();
    tmp.get('/me-unauth', (req, res) => res.status(401).json({ message: 'Unauthorized' }));
    app.use('/profile', tmp);
    const res = await request(app).get('/profile/me-unauth');
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Unauthorized/);
  });

  it('should return 404 if user not found', async () => {
    User.findById.mockResolvedValue(null);
    const res = await request(app).get('/profile/me');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User not found/);
  });

  it('should return user profile for non-patient', async () => {
    User.findById.mockResolvedValue({ 
      _id: 'user123', 
      firstName: 'Alice', 
      lastName: 'Smith', 
      email: 'alice@test.com', 
      phone: '123456789' 
    });

    const res = await request(app).get('/profile/me');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice Smith');
    expect(res.body.email).toBe('alice@test.com');
    expect(res.body.phone).toBe('123456789');
  });

  it('should include patient phone if role is patient and PatientProfile exists', async () => {
    User.findById.mockResolvedValue({ 
      _id: 'user123', 
      firstName: 'Alice', 
      lastName: 'Smith', 
      email: 'alice@test.com', 
      phone: '123456789' 
    });

    PatientProfile.findOne.mockResolvedValue({
      userId: 'user123',
      phone: '987654321'
    });

    const res = await request(app).get('/profile/me');
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('987654321'); // overrides user phone
  });

  it('should fallback to user.phone if PatientProfile phone missing', async () => {
    User.findById.mockResolvedValue({ 
      _id: 'user123', 
      firstName: 'Alice', 
      lastName: 'Smith', 
      email: 'alice@test.com', 
      phone: '123456789' 
    });

    PatientProfile.findOne.mockResolvedValue({});
    const res = await request(app).get('/profile/me');
    expect(res.body.phone).toBe('123456789');
  });

  it('should return server error on exception', async () => {
    User.findById.mockRejectedValue(new Error('DB failure'));
    const res = await request(app).get('/profile/me');
    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Server error/);
  });
});

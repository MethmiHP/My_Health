// _tests_/hospitalAuthController.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const hospitalAuthController = require('../controllers/hospitalAuth.controller');
const Hospital = require('../models/hospitalModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/hospitalModel');
jest.mock('../models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.post('/register', hospitalAuthController.registerHospital);
app.post('/login', hospitalAuthController.login);
// mount route with proper auth path like real router would
app.get('/me', (req, res, next) => {
  req.user = { id: 'user123', role: 'admin' };
  return next();
}, hospitalAuthController.me);

describe('Hospital Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerHospital', () => {
    it('should register hospital and admin successfully', async () => {
      const fakeHospital = { _id: 'h1', name: 'Test Hospital', code: 'TH1', save: jest.fn().mockResolvedValue(null) };
      const fakeUser = { _id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john@test.com', save: jest.fn().mockResolvedValue(null), role: 'admin', hospitalId: 'h1' };

      // Return new instances with save resolving to themselves
      Hospital.mockImplementation(() => ({
        ...fakeHospital,
        save: jest.fn().mockResolvedValue({ ...fakeHospital })
      }));
      User.mockImplementation(() => ({
        ...fakeUser,
        save: jest.fn().mockResolvedValue({ ...fakeUser })
      }));
      bcrypt.hash.mockResolvedValue('hashedpassword');
      jwt.sign.mockReturnValue('token123');

      const res = await request(app).post('/register').send({
        hospital: { name: 'Test Hospital', code: 'TH1' },
        admin: { firstName: 'John', lastName: 'Doe', email: 'john@test.com', password: 'pass123' }
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('hospital');
      expect(res.body).toHaveProperty('admin');
      expect(res.body).toHaveProperty('token', 'token123');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/register').send({ hospital: {}, admin: {} });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Missing required fields');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const fakeUser = {
        _id: 'u1',
        email: 'john@test.com',
        password: 'hashedpass',
        role: 'admin',
        userStatus: 'active',
        hospitalId: { _id: 'h1', status: 'active' }
      };
      User.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(fakeUser) });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const res = await request(app).post('/login').send({ email: 'john@test.com', password: 'pass123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token', 'token123');
      expect(res.body.user).toHaveProperty('email', 'john@test.com');
    });

    it('should fail login for wrong password', async () => {
      const fakeUser = { password: 'hashed', userStatus: 'active', hospitalId: { status: 'active' } };
      User.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(fakeUser) });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post('/login').send({ email: 'john@test.com', password: 'wrong' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('me', () => {
    it('should return basic profile info', async () => {
      const fakeUser = {
        _id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
      };
      User.findById.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(fakeUser) }) });

      const res = await request(app).get('/me');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'John Doe');
      expect(res.body).toHaveProperty('email', 'john@test.com');
      expect(res.body).toHaveProperty('phone');
    });

    it('should return empty fields if user not found', async () => {
      User.findById.mockReturnValue({ lean: () => ({ exec: () => Promise.resolve(null) }) });
      const res = await request(app).get('/me');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('phone');
    });
  });
});

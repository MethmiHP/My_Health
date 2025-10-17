// tests/userController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// Mock auth middleware before loading routes, returning a noop that sets req.user
jest.mock('../middleware/authMiddleware', () => {
  // Use a fixed hospitalId to align created test users
  const FIXED_HID = '507f191e810c19729de860ea';
  return () => (req, res, next) => {
    req.user = {
      _id: FIXED_HID,
      hospitalId: FIXED_HID,
      role: 'admin',
    };
    return next();
  };
});

const userRoutes = require('../routes/user.routes'); // adjust path
jest.mock('../models/userModel', () => {
  const Model = function (doc) {
    Object.assign(this, doc);
    this.save = jest.fn().mockResolvedValue(this);
  };
  Model.findOne = jest.fn();
  Model.create = jest.fn();
  Model.find = jest.fn();
  Model.findByIdAndUpdate = jest.fn();
  return Model;
});
const User = require('../models/userModel');

const app = express();
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

// Mock auth middleware
// (authMiddleware mock defined above)

// Connect to in-memory MongoDB
beforeAll(async () => {});

afterAll(async () => {});

afterEach(async () => {
  jest.clearAllMocks();
});

describe('User Controller', () => {
  test('should create a new user', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'u1', firstName: 'John', email: 'john@example.com' });
    const res = await request(app)
      .post('/api/users')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'doctor',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.firstName).toBe('John');
    expect(res.body.user.email).toBe('john@example.com');
  });

  test('should not create user if email exists', async () => {
    User.findOne.mockResolvedValue({ _id: 'exists' });

    const res = await request(app)
      .post('/api/users')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'doctor',
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Email already in use');
  });

  test('should list users for hospital', async () => {
    // Make find return a chainable object with .select().sort()
    User.find.mockReturnValue({
      select: () => ({
        sort: () => Promise.resolve([
          { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' },
          { _id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' },
        ])
      })
    });

    const res = await request(app)
      .get('/api/users')
      .query({});

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.users[0]).not.toHaveProperty('password');
  });

  test('should update user status', async () => {
    const user = { _id: 'u2', userStatus: 'inactive' };
    User.findOneAndUpdate = jest.fn().mockReturnValue({ select: () => Promise.resolve(user) });

    const res = await request(app)
      .patch(`/api/users/${user._id}/status`)
      .send({ userStatus: 'inactive' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.userStatus).toBe('inactive');
  });

  test('should return 404 if user not found when updating status', async () => {
    User.findOneAndUpdate = jest.fn().mockReturnValue({ select: () => Promise.resolve(null) });
    const res = await request(app)
      .patch(`/api/users/${new mongoose.Types.ObjectId()}/status`)
      .send({ userStatus: 'inactive' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});

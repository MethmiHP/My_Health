const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock auth to allow admin
jest.mock('../../middleware/authMiddleware', () => () => (req, res, next) => {
  req.user = { role: 'admin', hospitalId: '507f191e810c19729de860ea' };
  return next();
});

// Mock controller module with internal fns and export spies
let mockCreate, mockList, mockUpdate;
jest.mock('../../controllers/user.controller', () => {
  mockCreate = jest.fn((req, res) => res.status(201).json({ ok: true }));
  mockList = jest.fn((req, res) => res.json({ ok: true }));
  mockUpdate = jest.fn((req, res) => res.json({ ok: true }));
  return {
    createUserForHospital: (req, res, next) => mockCreate(req, res, next),
    listUsersForHospital: (req, res, next) => mockList(req, res, next),
    updateUserStatus: (req, res, next) => mockUpdate(req, res, next),
  };
});

const routes = require('../../routes/user.routes');

describe('user.routes', () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/api/users', routes);

  test('POST /api/users -> createUserForHospital', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'A' });
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalled();
  });

  test('GET /api/users -> listUsersForHospital', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(mockList).toHaveBeenCalled();
  });

  test('PATCH /api/users/:id/status -> updateUserStatus', async () => {
    const res = await request(app).patch('/api/users/abc/status').send({ userStatus: 'inactive' });
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });
});



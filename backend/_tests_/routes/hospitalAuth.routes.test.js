const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock auth to passthrough
jest.mock('../../middleware/authMiddleware', () => () => (req, res, next) => next());

let mockRegister, mockLogin, mockMe;
jest.mock('../../controllers/hospitalAuth.controller', () => {
  mockRegister = jest.fn((req, res) => res.status(201).json({ ok: true }));
  mockLogin = jest.fn((req, res) => res.json({ ok: true }));
  mockMe = jest.fn((req, res) => res.json({ ok: true }));
  return {
    registerHospital: (req, res, next) => mockRegister(req, res, next),
    login: (req, res, next) => mockLogin(req, res, next),
    me: (req, res, next) => mockMe(req, res, next),
  };
});

const routes = require('../../routes/hospitalAuth.routes');

describe('hospitalAuth.routes', () => {
  const app = express();
  app.use(bodyParser.json());
  app.use('/api/auth', routes);

  test('POST /api/auth/register -> registerHospital', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(201);
    expect(mockRegister).toHaveBeenCalled();
  });

  test('POST /api/auth/login -> login', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(200);
    expect(mockLogin).toHaveBeenCalled();
  });

  test('GET /api/auth/me -> me', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(mockMe).toHaveBeenCalled();
  });
});



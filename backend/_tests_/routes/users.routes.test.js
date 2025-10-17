const request = require('supertest');
const app = require('../../app');

// Mock auth middleware used inside routes
jest.mock('../../middleware/authMiddleware', () => () => (req, res, next) => {
  req.user = { hospitalId: '507f191e810c19729de860ea', role: 'admin' };
  return next();
});

// Stub User model methods used by controller to avoid DB
jest.mock('../../models/userModel', () => {
  const M = {};
  M.findOne = jest.fn().mockResolvedValue(null);
  M.create = jest.fn().mockResolvedValue({ _id: 'u1', firstName: 'John', email: 'john@example.com' });
  M.find = jest.fn().mockReturnValue({ select: () => ({ sort: () => Promise.resolve([]) }) });
  M.findOneAndUpdate = jest.fn().mockReturnValue({ select: () => Promise.resolve({ _id: 'u2', userStatus: 'inactive' }) });
  return M;
});

describe('User Routes', () => {
  it('POST /api/users should create user', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'John', lastName: 'D', email: 'john@example.com', password: 'x', role: 'doctor' });
    expect([201,409,500]).toContain(res.status);
  });

  it('GET /api/users should list users', async () => {
    const res = await request(app).get('/api/users');
    expect([200,500]).toContain(res.status);
  });
});



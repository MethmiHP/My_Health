// tests/reportController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// Mock auth middleware before loading routes
jest.mock('../middleware/authMiddleware', () => {
  const FIXED_ID = '507f191e810c19729de860ea';
  const { Types } = require('mongoose');
  return () => (req, res, next) => {
    req.user = { sub: new Types.ObjectId(FIXED_ID), hospitalId: new Types.ObjectId(FIXED_ID), role: 'admin' };
    return next();
  };
});

const reportRoutes = require('../routes/report.routes');
const User = require('../models/userModel');
const Report = require('../models/reportModel');

const app = express();
app.use(bodyParser.json());
app.use('/api/reports', reportRoutes);

// Mock authentication middleware
// (authMiddleware mock defined above)

// Connect to in-memory MongoDB
beforeAll(async () => {});

afterAll(async () => {});

afterEach(async () => {
  jest.clearAllMocks();
});

describe('Report Controller', () => {
  test('should save a report', async () => {
    // Mock Report.prototype.save to avoid DB
    const origSave = Report.prototype.save;
    Report.prototype.save = jest.fn().mockResolvedValue();
    const res = await request(app)
      .post('/api/reports/save')
      .send({
        reportType: 'summary',
        title: 'Test Report',
        description: 'This is a test report',
        data: { test: 123 },
        filters: { startDate: '2025-01-01', endDate: '2025-10-01' }
      });
    Report.prototype.save = origSave;
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.report.title).toBe('Test Report');
  });

  test('should get saved reports', async () => {
    // Mock Report.find and countDocuments chain
    const findMock = jest.spyOn(Report, 'find').mockReturnValue({
      populate: () => ({ sort: () => ({ limit: () => ({ skip: () => [{ _id: 'r1', title: 'X' }] }) }) })
    });
    const countMock = jest.spyOn(Report, 'countDocuments').mockResolvedValue(1);

    const res = await request(app)
      .get('/api/reports/saved')
      .query({ page: 1, limit: 10 });
    findMock.mockRestore();
    countMock.mockRestore();
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.reports)).toBe(true);
  });

  test('should add comment to a report', async () => {
    const user = { _id: new mongoose.Types.ObjectId(), firstName: 'Test', lastName: 'User' };
    jest.spyOn(User, 'findById').mockResolvedValue(user);
    const updated = { comments: [{ userId: user._id, userName: 'Test User', comment: 'This is a test comment' }] };
    jest.spyOn(Report, 'findByIdAndUpdate').mockResolvedValue(updated);
    const fakeReportId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/reports/${fakeReportId}/comment`)
      .send({ comment: 'This is a test comment' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });
});

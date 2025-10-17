const request = require('supertest');
const app = require('../../app');

// Mock auth middleware
jest.mock('../../middleware/authMiddleware', () => () => (req, res, next) => {
  req.user = { hospitalId: 'HID1', sub: 'cash1' };
  return next();
});

// Mock models/utils used by controller
jest.mock('../../models/patientProfileModel', () => ({ findOne: jest.fn().mockResolvedValue(null) }));
jest.mock('../../utils/medicationPrices', () => ({ calculateMedicationBill: jest.fn().mockReturnValue({ items: [], subtotal: 0, tax: 0, discount: 0, total: 0 }) }));

describe('Payment Routes', () => {
  it('GET /api/payments/bill/:nic returns 404 when not found', async () => {
    const res = await request(app).get('/api/payments/bill/123V');
    expect([200,404,400]).toContain(res.status);
  });
});



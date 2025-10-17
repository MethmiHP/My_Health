// _tests_/paymentController.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

const paymentController = require('../controllers/paymentController');
const PatientProfile = require('../models/patientProfileModel');
const Payment = require('../models/paymentModel');
const Appointment = require('../models/appointmentModel');
const { calculateMedicationBill } = require('../utils/medicationPrices');

jest.mock('../models/patientProfileModel');
jest.mock('../models/paymentModel');
jest.mock('../models/appointmentModel');
jest.mock('../utils/medicationPrices');

const app = express();
app.use(bodyParser.json());

// mock auth middleware with fixed hospital id matching any created docs
app.use((req, res, next) => {
  req.user = { hospitalId: 'HID1', sub: 'cashier001' };
  next();
});

app.get('/bill/:nic', paymentController.getPatientBillByNIC);
app.post('/process', paymentController.processPayment);
app.post('/refund/:receiptNumber', paymentController.refundPayment);
app.post('/void/:receiptNumber', paymentController.voidPayment);

describe('Payment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPatientBillByNIC', () => {
    it('should return 404 if patient not found', async () => {
      PatientProfile.findOne.mockResolvedValue(null);
      const res = await request(app).get('/bill/123456789V');
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Patient not found/);
    });

    it('should return bill successfully', async () => {
      PatientProfile.findOne.mockResolvedValue({
        _id: 'p1',
        nic: '123456789V',
        barcode: 'PT-001',
        userId: { _id: 'u1', firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', phone: '123' },
        medications: [{ name: 'med1', price: 100 }],
        surgeries: [],
        procedures: []
      });
      calculateMedicationBill.mockReturnValue({
        items: [{ type: 'medication', name: 'med1', totalPrice: 100 }],
        subtotal: 100,
        tax: 10,
        discount: 0,
        total: 110
      });

      const res = await request(app).get('/bill/123456789V');
      expect(res.status).toBe(200);
      expect(res.body.patient.name).toBe('Alice Smith');
      expect(res.body.bill.totalAmount).toBe(110);
    });
  });

  describe('processPayment', () => {
    it('should fail if missing required fields', async () => {
      const res = await request(app).post('/process').send({ patientId: 'p1' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Missing required fields/);
    });

    it('should process payment successfully', async () => {
      // When controller tries to fetch recent appointment, return an object
      Appointment.findOne.mockReturnValue({
        populate: () => ({ sort: () => ({ doctorId: { appointmentFee: 0 } }) })
      });
      calculateMedicationBill.mockReturnValue({
        items: [{ type: 'medication', name: 'med1', totalPrice: 100 }],
        subtotal: 100,
        tax: 10,
        discount: 0,
        total: 110
      });

      Payment.prototype.save = jest.fn().mockResolvedValue({
        _id: 'pay1',
        receiptNumber: 'RCPT001',
        visitId: 'VST001',
        totalAmount: 110,
        paymentMethod: 'cash',
        paymentStatus: 'completed',
        medications: [{ type: 'medication', name: 'med1', totalPrice: 100 }],
        populate: jest.fn().mockResolvedValue({ firstName: 'Cashier' })
      });

      // Make Payment.save actually set the instance fields like controller expects
      Payment.mockImplementation(function(doc){
        return {
          ...doc,
          _id: 'pay1',
          receiptNumber: 'RCPT001',
          createdAt: new Date(),
          save: Payment.prototype.save,
          populate: jest.fn().mockResolvedValue({ firstName: 'Cashier' })
        };
      });

      const res = await request(app).post('/process').send({
        patientId: 'p1',
        userId: 'u1',
        medications: [{ name: 'med1', price: 100 }],
        paymentMethod: 'cash'
      });

      expect(res.status).toBe(201);
      expect(res.body.payment.totalAmount).toBe(110);
      expect(res.body.payment.paymentStatus).toBe('completed');
    });
  });

  describe('refundPayment', () => {
    it('should refund payment successfully', async () => {
      Payment.findOne.mockResolvedValue({
        _id: 'pay1',
        totalAmount: 100,
        paymentStatus: 'completed',
        save: jest.fn().mockResolvedValue(true)
      });

      const res = await request(app).post('/refund/RCPT001').send({ refundAmount: 50, refundReason: 'Test' });
      expect(res.status).toBe(200);
      expect(res.body.payment.paymentStatus).toBe('refunded');
    });

    it('should fail if refund amount exceeds total', async () => {
      Payment.findOne.mockResolvedValue({
        _id: 'pay1',
        totalAmount: 100,
        paymentStatus: 'completed'
      });

      const res = await request(app).post('/refund/RCPT001').send({ refundAmount: 150, refundReason: 'Test' });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Refund amount cannot exceed/);
    });
  });

  describe('voidPayment', () => {
    it('should void payment successfully', async () => {
      Payment.findOne.mockResolvedValue({
        _id: 'pay1',
        paymentStatus: 'completed',
        save: jest.fn().mockResolvedValue(true)
      });

      const res = await request(app).post('/void/RCPT001').send({ voidReason: 'Test' });
      expect(res.status).toBe(200);
      expect(res.body.payment.paymentStatus).toBe('void');
    });
  });
});

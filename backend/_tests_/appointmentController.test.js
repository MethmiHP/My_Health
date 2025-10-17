const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');
const DoctorProfile = require('../models/doctorProfileModel');
const Hospital = require('../models/hospitalModel');
const mailService = require('../services/mail.service');
const slotService = require('../services/slot.service');
const controller = require('../controllers/appointment.controller');

jest.mock('../models/appointmentModel');
jest.mock('../models/userModel');
jest.mock('../models/doctorProfileModel');
jest.mock('../models/hospitalModel');
jest.mock('../services/mail.service');
jest.mock('../services/slot.service');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('appointmentController', () => {
  beforeEach(() => jest.clearAllMocks());

  // --------------------
  // listSpecialties
  // --------------------
  it('listSpecialties returns sorted specialties', async () => {
    DoctorProfile.distinct.mockResolvedValue(['Cardiology', 'Neurology', '']);
    const req = { user: { hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.listSpecialties(req, res);
    expect(res.json).toHaveBeenCalledWith({ specialties: ['Cardiology', 'Neurology'] });
  });

  // --------------------
  // listDoctorsBySpecialty
  // --------------------
  it('listDoctorsBySpecialty returns doctors mapped', async () => {
    DoctorProfile.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([{ userId: { _id: 'd1', firstName: 'John', lastName: 'Doe' }, roomNo: 101, consultationFee: 50 }]) }) });
    const req = { query: { specialty: 'Cardiology' }, user: { hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.listDoctorsBySpecialty(req, res);
    expect(res.json).toHaveBeenCalledWith({
      doctors: [{ doctorId: 'd1', name: 'John Doe', roomNo: 101, fee: 50 }]
    });
  });

  // --------------------
  // getSlots
  // --------------------
  it('getSlots returns days from slotService', async () => {
    slotService.getSlots.mockResolvedValue(['day1', 'day2']);
    const req = { query: { doctorId: 'd1', from: '2025-10-17', to: '2025-10-18', slotMinutes: 15 }, user: { hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.getSlots(req, res);
    expect(res.json).toHaveBeenCalledWith({ days: ['day1', 'day2'] });
  });

  // --------------------
  // book
  // --------------------
  it('book returns 400 if patientId missing', async () => {
    const req = { body: {}, user: { sub: null, role: 'patient', hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.book(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'patientId required' });
  });

  it('book returns 409 if slot already booked', async () => {
    Appointment.findOne.mockResolvedValue(true);
    const req = { body: { patientId: 'p1', doctorId: 'd1', slotStart: new Date(), slotEnd: new Date() }, user: { sub: 'p1', role: 'patient', hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.book(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Slot already booked' });
  });

  it('book creates appointment successfully', async () => {
    const fakeAppt = { _id: 'a1', slotStart: new Date(), slotEnd: new Date(), reason: 'Test', status: 'booked', patientId: 'p1' };
    Appointment.findOne.mockResolvedValue(null);
    Appointment.create.mockResolvedValue(fakeAppt);
    User.findById.mockResolvedValue({ _id: 'p1', firstName: 'John', lastName: 'Doe', email: 'a@b.com' });
    Hospital.findById.mockResolvedValue({ name: 'H1', code: 'H001' });
    mailService.send.mockResolvedValue(true);

    const req = { body: { patientId: 'p1', doctorId: 'd1', slotStart: new Date(), slotEnd: new Date() }, user: { sub: 'p1', role: 'patient', hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.book(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Appointment confirmed', appointment: fakeAppt }));
  });

  // --------------------
  // cancel
  // --------------------
  it('cancel returns 404 if appointment not found', async () => {
    Appointment.findById.mockResolvedValue(null);
    const req = { params: { id: 'a1' }, user: { sub: 'p1', role: 'patient', hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.cancel(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('cancel updates appointment successfully', async () => {
    const appt = { _id: 'a1', patientId: 'p1', doctorId: 'd1', hospitalId: 'h1', status: 'booked', save: jest.fn() };
    Appointment.findById.mockResolvedValue(appt);
    User.findById.mockResolvedValue({ email: 'a@b.com', firstName: 'John' });
    Hospital.findById.mockResolvedValue({ name: 'H1', code: 'H001' });
    mailService.send.mockResolvedValue(true);

    const req = { params: { id: 'a1' }, user: { sub: 'p1', role: 'patient', hospitalId: 'h1' }, body: { reason: 'Cancel' } };
    const res = mockResponse();
    await controller.cancel(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Cancelled', appointment: appt }));
  });

  // --------------------
  // updateReason
  // --------------------
  it('updateReason returns 400 if reason missing', async () => {
    const req = { params: { id: 'a1' }, body: {}, user: { sub: 'p1', role: 'patient', hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.updateReason(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updateReason updates successfully', async () => {
    const appt = { _id: 'a1', patientId: 'p1', hospitalId: 'h1', status: 'booked', save: jest.fn() };
    Appointment.findById.mockResolvedValue(appt);
    const req = { params: { id: 'a1' }, body: { reason: 'New reason' }, user: { sub: 'p1', role: 'patient', hospitalId: 'h1' } };
    const res = mockResponse();
    await controller.updateReason(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Reason updated', appointment: appt });
  });
});

const mongoose = require('mongoose');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');
const MedicalHistory = require('../models/medicalHistoryModel');
const controller = require('../controllers/patientController');

// Mock Mongoose models
jest.mock('../models/patientProfileModel');
jest.mock('../models/userModel');
jest.mock('../models/medicalHistoryModel');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('patientController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------
  // getPatientByUserId
  // --------------------
  describe('getPatientByUserId', () => {
    it('should return 403 if user ID does not match', async () => {
      const req = { params: { userId: '123' }, user: { sub: '456' } };
      const res = mockResponse();
      await controller.getPatientByUserId(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should return 404 if patient profile not found', async () => {
      PatientProfile.findOne.mockResolvedValue(null);
      const req = { params: { userId: '123' }, user: { sub: '123', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientByUserId(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient profile not found' });
    });

    it('should return patient profile if found', async () => {
      const fakePatient = { _id: 'pid1' };
      fakePatient.populate = jest.fn().mockResolvedValue(fakePatient);
      PatientProfile.findOne.mockResolvedValue(fakePatient);
      const req = { params: { userId: '123' }, user: { sub: '123', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientByUserId(req, res);
      // Controller may transform/populate; assert by id match
      const payload = res.json.mock.calls[0][0];
      expect(payload._id).toBe(fakePatient._id);
    });
  });

  // --------------------
  // getAllPatients
  // --------------------
  describe('getAllPatients', () => {
    it('should return 400 if hospitalId is missing', async () => {
      const req = { user: {} };
      const res = mockResponse();
      await controller.getAllPatients(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hospital context required' });
    });

    it('should return patients', async () => {
      const fakePatients = [{ _id: 'p1' }];
      PatientProfile.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakePatients),
      });
      const req = { user: { hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getAllPatients(req, res);
      expect(res.json).toHaveBeenCalledWith({ count: 1, patients: fakePatients });
    });
  });

  // --------------------
  // getPatientById
  // --------------------
  describe('getPatientById', () => {
    it('should return 403 if patient role and ID mismatch', async () => {
      const req = { params: { id: '123' }, user: { role: 'patient', sub: '456', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientById(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should return 404 if patient not found', async () => {
      PatientProfile.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const req = { params: { id: '123' }, user: { role: 'doctor', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should return patient if found', async () => {
      const fakePatient = { _id: 'pid1' };
      PatientProfile.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(fakePatient) });
      const req = { params: { id: '123' }, user: { role: 'doctor', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientById(req, res);
      expect(res.json).toHaveBeenCalledWith(fakePatient);
    });
  });

  // --------------------
  // updatePatient
  // --------------------
  describe('updatePatient', () => {
    it('should return 404 if patient not found', async () => {
      PatientProfile.findOne.mockResolvedValue(null);
      const req = { params: { id: 'pid1' }, user: { sub: '123', role: 'doctor', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.updatePatient(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should return 403 if patient role mismatch', async () => {
      const existing = { _id: 'pid1', userId: 'user123', surgeries: [] };
      PatientProfile.findOne.mockResolvedValue(existing);
      const req = { params: { id: 'pid1' }, user: { sub: 'user456', role: 'patient', hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.updatePatient(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    });

    it('should update patient and append procedures to MedicalHistory', async () => {
      const existing = { _id: 'pid1', userId: 'user123', surgeries: [] };
      const updatedPatient = { _id: 'pid1', userId: 'user123' };
      PatientProfile.findOne.mockResolvedValue(existing);
      PatientProfile.findOneAndUpdate.mockReturnValue({ populate: jest.fn().mockResolvedValue(updatedPatient) });

      const fakeHistory = { procedures: [], save: jest.fn() };
      MedicalHistory.findOne.mockResolvedValue(fakeHistory);

      const req = {
        params: { id: 'pid1' },
        user: { sub: 'user123', role: 'doctor', hospitalId: 'hosp1' },
        body: {
          surgeries: [{ name: 'Appendectomy', type: 'surgery', surgeon: 'Dr. Smith', hospital: 'City Hosp' }],
        },
      };
      const res = mockResponse();

      await controller.updatePatient(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient updated successfully', patient: updatedPatient });
      expect(fakeHistory.save).toHaveBeenCalled();
    });
  });

  // --------------------
  // deletePatient
  // --------------------
  describe('deletePatient', () => {
    it('should return 404 if patient not found', async () => {
      PatientProfile.findOneAndDelete.mockResolvedValue(null);
      const req = { params: { id: 'pid1' }, user: { hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.deletePatient(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should delete patient and set user inactive', async () => {
      const patient = { _id: 'pid1', userId: 'user123' };
      PatientProfile.findOneAndDelete.mockResolvedValue(patient);
      User.findByIdAndUpdate.mockResolvedValue(true);

      const req = { params: { id: 'pid1' }, user: { hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.deletePatient(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient deleted successfully' });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', { userStatus: 'inactive' });
    });
  });

  // --------------------
  // getPatientByBarcode
  // --------------------
  describe('getPatientByBarcode', () => {
    it('should return 404 if patient not found', async () => {
      PatientProfile.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
      const req = { params: { barcode: 'BC123' }, user: { hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientByBarcode(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should return patient if found', async () => {
      const fakePatient = { _id: 'pid1' };
      PatientProfile.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(fakePatient) });
      const req = { params: { barcode: 'BC123' }, user: { hospitalId: 'hosp1' } };
      const res = mockResponse();
      await controller.getPatientByBarcode(req, res);
      expect(res.json).toHaveBeenCalledWith(fakePatient);
    });
  });
});

const PatientReport = require('../models/patientReportModel');
const PatientProfile = require('../models/patientProfileModel');
const controller = require('../controllers/patientReportController');

// Mock Mongoose models
jest.mock('../models/patientReportModel');
jest.mock('../models/patientProfileModel');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('patientReportController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------
  // createReport
  // --------------------
  describe('createReport', () => {
    it('should return 400 if reportContent is empty', async () => {
      const req = { body: { reportContent: '' }, user: { sub: 'u1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.createReport(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report content is required' });
    });

    it('should return 404 if patient profile not found', async () => {
      PatientProfile.findOne.mockResolvedValue(null);
      const req = { body: { reportContent: 'Test' }, user: { sub: 'u1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.createReport(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient profile not found' });
    });

    it('should create and return a report', async () => {
      const fakeProfile = { _id: 'pid1' };
      const fakeReport = {
        _id: 'r1',
        reportContent: 'Test',
        priority: 'medium',
        status: 'new',
        createdAt: new Date(),
        userId: { firstName: 'John', lastName: 'Doe' },
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(true),
      };
      PatientProfile.findOne.mockResolvedValue(fakeProfile);
      PatientReport.mockImplementation(() => fakeReport);

      const req = { body: { reportContent: 'Test' }, user: { sub: 'u1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Report submitted successfully',
        report: {
          _id: 'r1',
          reportContent: 'Test',
          priority: 'medium',
          status: 'new',
          createdAt: fakeReport.createdAt,
          patient: { firstName: 'John', lastName: 'Doe' },
        },
      });
    });
  });

  // --------------------
  // getMyReports
  // --------------------
  describe('getMyReports', () => {
    it('should return 404 if patient profile not found', async () => {
      PatientProfile.findOne.mockResolvedValue(null);
      const req = { user: { sub: 'u1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.getMyReports(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient profile not found' });
    });

    it('should return reports if found', async () => {
      const fakeProfile = { _id: 'pid1' };
      const fakeReports = [{ _id: 'r1' }];
      PatientProfile.findOne.mockResolvedValue(fakeProfile);
      PatientReport.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(fakeReports),
      });
      const req = { user: { sub: 'u1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.getMyReports(req, res);
      expect(res.json).toHaveBeenCalledWith({ count: 1, reports: fakeReports });
    });
  });

  // --------------------
  // getDoctorReports
  // --------------------
  describe('getDoctorReports', () => {
    it('should return mapped reports', async () => {
      const fakeReports = [{
        _id: 'r1',
        userId: { firstName: 'John', lastName: 'Doe', email: 'a@b.com' },
        patientId: { barcode: 'BC123' },
        reportContent: 'Test',
        priority: 'high',
        status: 'new',
        doctorResponse: 'OK',
        respondedBy: { firstName: 'Dr', lastName: 'Who' },
        respondedAt: new Date(),
        createdAt: new Date(),
      }];
      PatientReport.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(fakeReports),
      });

      const req = { user: { hospitalId: 'h1' }, query: {} };
      const res = mockResponse();
      await controller.getDoctorReports(req, res);
      expect(res.json).toHaveBeenCalledWith({ count: 1, reports: expect.any(Array) });
    });
  });

  // --------------------
  // respondToReport
  // --------------------
  describe('respondToReport', () => {
    it('should return 400 if doctorResponse is missing', async () => {
      const req = { params: { reportId: 'r1' }, body: {}, user: { sub: 'doc1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.respondToReport(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Doctor response is required' });
    });

    it('should return 404 if report not found', async () => {
      PatientReport.findOneAndUpdate.mockResolvedValue(null);
      const req = {
        params: { reportId: 'r1' },
        body: { doctorResponse: 'OK' },
        user: { sub: 'doc1', hospitalId: 'h1' },
      };
      const res = mockResponse();
      await controller.respondToReport(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report not found' });
    });

    it('should update report successfully', async () => {
      const fakeReport = { _id: 'r1' };
      PatientReport.findOneAndUpdate.mockReturnValue({ populate: jest.fn().mockResolvedValue(fakeReport) });
      const req = { params: { reportId: 'r1' }, body: { doctorResponse: 'OK' }, user: { sub: 'doc1', hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.respondToReport(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Response added successfully', report: fakeReport });
    });
  });

  // --------------------
  // markReportAsRead
  // --------------------
  describe('markReportAsRead', () => {
    it('should return 404 if report not found', async () => {
      PatientReport.findOneAndUpdate.mockResolvedValue(null);
      const req = { params: { reportId: 'r1' }, user: { hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.markReportAsRead(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report not found or already processed' });
    });

    it('should mark report as read successfully', async () => {
      const fakeReport = { _id: 'r1' };
      PatientReport.findOneAndUpdate.mockResolvedValue(fakeReport);
      const req = { params: { reportId: 'r1' }, user: { hospitalId: 'h1' } };
      const res = mockResponse();
      await controller.markReportAsRead(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report marked as read', report: fakeReport });
    });
  });
});

/**
 * @fileoverview Unit tests for medicalHistoryController.js
 */

const mongoose = require("mongoose");
const MedicalHistory = require("../models/medicalHistoryModel");
const PatientProfile = require("../models/patientProfileModel");
const controller = require("../controllers/medicalHistoryController");

// Mock Mongoose models
jest.mock("../models/medicalHistoryModel");
jest.mock("../models/patientProfileModel");

// Helper to mock Express res object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper to mock Date.now for consistent tests
const mockDate = new Date("2025-10-17T00:00:00Z");
global.Date = class extends Date {
  constructor(...args) {
    if (args.length === 0) return mockDate;
    return super(...args);
  }
};

describe("medicalHistoryController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------
  // getMedicalHistory()
  // --------------------
  describe("getMedicalHistory()", () => {
    it("should return 403 if patient tries to view another user’s history", async () => {
      const req = {
        params: { userId: "123" },
        user: { role: "patient", sub: "456" },
      };
      const res = mockResponse();

      await controller.getMedicalHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    });

    it("should return 404 if patient profile not found", async () => {
      PatientProfile.findOne.mockResolvedValue(null);

      const req = {
        params: { userId: "123" },
        user: { role: "doctor", sub: "doc001", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.getMedicalHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Patient profile not found" });
    });

    it("should return medical history if found", async () => {
      const fakeProfile = {
        _id: "pid001",
        bloodGroup: "A+",
        medications: ["Paracetamol"], // profile has one medication
        allergies: [],
        chronicConditions: [],
        familyConditions: [],
        emergencyContact: {},
      };
      const fakeHistory = {
        _id: "mh001",
        medications: [], // initially empty, triggers sync
        populate: jest.fn().mockResolvedValue(true),
        save: jest.fn(),
      };

      PatientProfile.findOne.mockResolvedValue(fakeProfile);
      MedicalHistory.findOne.mockResolvedValue(fakeHistory);

      const req = {
        params: { userId: "123" },
        user: { role: "doctor", sub: "doc001", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.getMedicalHistory(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        medicalHistory: expect.any(Object),
      }));

      // Save should be called because medication sync adds "Paracetamol"
      expect(fakeHistory.save).toHaveBeenCalled();
      expect(fakeHistory.populate).toHaveBeenCalledWith('lastUpdatedBy', 'firstName lastName');
    });
  });

  // --------------------
  // updateMedicalHistory()
  // --------------------
  describe("updateMedicalHistory()", () => {
    it("should return 404 if profile not found", async () => {
      PatientProfile.findOne.mockResolvedValue(null);

      const req = {
        params: { userId: "123" },
        body: { bloodType: "A+" },
        user: { sub: "user123", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.updateMedicalHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Patient profile not found" });
    });

    it("should update and return medical history", async () => {
      const fakeProfile = { _id: "pid001" };
      const fakeUpdatedHistory = { _id: "mh001", bloodType: "A+" };

      PatientProfile.findOne.mockResolvedValue(fakeProfile);

      // Mock findOneAndUpdate chain with populate
      MedicalHistory.findOneAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(fakeUpdatedHistory),
      });

      const req = {
        params: { userId: "123" },
        body: { bloodType: "A+" },
        user: { sub: "user123", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.updateMedicalHistory(req, res);

      expect(MedicalHistory.findOneAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Medical history updated successfully",
        medicalHistory: fakeUpdatedHistory,
      });
    });
  });

  // --------------------
  // addMedicalRecord()
  // --------------------
  describe("addMedicalRecord()", () => {
    it("should return 400 for invalid record type", async () => {
      const req = {
        params: { userId: "123", recordType: "invalidType" },
        user: { sub: "doc001", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.addMedicalRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid record type" });
    });

    it("should create new medical record successfully", async () => {
      const fakeProfile = { _id: "pid001" };
      const fakeHistory = {
        _id: "mh001",
        medications: [],
        save: jest.fn(),
      };

      PatientProfile.findOne.mockResolvedValue(fakeProfile);
      MedicalHistory.findOne.mockResolvedValue(fakeHistory);

      const req = {
        params: { userId: "123", recordType: "medications" },
        body: { name: "Aspirin", dosage: "100mg" },
        user: { sub: "doc001", firstName: "John", lastName: "Doe", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.addMedicalRecord(req, res);

      expect(fakeHistory.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining("record added successfully"),
      }));
    });
  });

  // --------------------
  // deleteMedicalRecord()
  // --------------------
  describe("deleteMedicalRecord()", () => {
    it("should return 400 for invalid record type", async () => {
      const req = {
        params: { userId: "123", recordType: "invalid", recordId: "rec1" },
        user: { sub: "doc001", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.deleteMedicalRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid record type" });
    });

    it("should mark medication as completed", async () => {
      const record = { status: "active" };
      const fakeHistory = {
        medications: { id: jest.fn().mockReturnValue(record) },
        save: jest.fn(),
      };

      MedicalHistory.findOne.mockResolvedValue(fakeHistory);

      const req = {
        params: { userId: "123", recordType: "medications", recordId: "rec001" },
        user: { sub: "doc001", hospitalId: "hosp001" },
      };
      const res = mockResponse();

      await controller.deleteMedicalRecord(req, res);

      expect(record.status).toBe("completed");
      expect(fakeHistory.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Medication marked as completed",
      });
    });
  });
});

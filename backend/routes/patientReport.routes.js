const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const PatientReport = require('../models/patientReportModel');
const PatientProfile = require('../models/patientProfileModel');
const User = require('../models/userModel');

// Helper function to get hospital ID from request
const getHospitalId = (req) => {
  return req.user?.hospitalId || req.user?.hospital?._id;
};

// -------------------- Patient Report Routes -------------------- //

// Create a new patient report (patients only)
router.post('/', auth(['patient']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.user.sub;
    const { reportContent, priority = 'medium' } = req.body;

    if (!reportContent || reportContent.trim().length === 0) {
      return res.status(400).json({ message: 'Report content is required' });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority level' });
    }

    // Find the patient profile
    const patientProfile = await PatientProfile.findOne({ 
      userId, 
      hospitalId 
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Create the report
    const report = new PatientReport({
      patientId: patientProfile._id,
      userId,
      hospitalId,
      reportContent: reportContent.trim(),
      priority
    });

    await report.save();

    // Populate user info for response
    await report.populate('userId', 'firstName lastName email');

    res.status(201).json({
      message: 'Report submitted successfully',
      report: {
        _id: report._id,
        reportContent: report.reportContent,
        priority: report.priority,
        status: report.status,
        createdAt: report.createdAt,
        patient: {
          firstName: report.userId.firstName,
          lastName: report.userId.lastName
        }
      }
    });
  } catch (error) {
    console.error('Create patient report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient's own reports (patients only)
router.get('/my-reports', auth(['patient']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.user.sub;

    // Find the patient profile
    const patientProfile = await PatientProfile.findOne({ 
      userId, 
      hospitalId 
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const reports = await PatientReport.find({ 
      patientId: patientProfile._id 
    })
    .populate('respondedBy', 'firstName lastName')
    .sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports: reports.map(report => ({
        _id: report._id,
        reportContent: report.reportContent,
        priority: report.priority,
        status: report.status,
        doctorResponse: report.doctorResponse,
        respondedBy: report.respondedBy,
        respondedAt: report.respondedAt,
        createdAt: report.createdAt
      }))
    });
  } catch (error) {
    console.error('Get patient reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reports for doctors (doctors and admin only)
router.get('/doctor', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { status = 'new', priority, limit = 50 } = req.query;

    const filter = { hospitalId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const reports = await PatientReport.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('patientId', 'barcode')
      .populate('respondedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      count: reports.length,
      reports: reports.map(report => ({
        _id: report._id,
        patient: {
          firstName: report.userId.firstName,
          lastName: report.userId.lastName,
          email: report.userId.email,
          barcode: report.patientId.barcode
        },
        reportContent: report.reportContent,
        priority: report.priority,
        status: report.status,
        doctorResponse: report.doctorResponse,
        respondedBy: report.respondedBy,
        respondedAt: report.respondedAt,
        createdAt: report.createdAt
      }))
    });
  } catch (error) {
    console.error('Get doctor reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update report status and add doctor response (doctors and admin only)
router.put('/:reportId/respond', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { reportId } = req.params;
    const { doctorResponse, status = 'responded' } = req.body;

    if (!doctorResponse || doctorResponse.trim().length === 0) {
      return res.status(400).json({ message: 'Doctor response is required' });
    }

    if (!['read', 'responded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await PatientReport.findOneAndUpdate(
      { 
        _id: reportId, 
        hospitalId 
      },
      {
        status,
        doctorResponse: doctorResponse.trim(),
        respondedBy: req.user.sub,
        respondedAt: new Date()
      },
      { new: true }
    )
    .populate('userId', 'firstName lastName email')
    .populate('patientId', 'barcode')
    .populate('respondedBy', 'firstName lastName');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      message: 'Response added successfully',
      report: {
        _id: report._id,
        patient: {
          firstName: report.userId.firstName,
          lastName: report.userId.lastName,
          email: report.userId.email,
          barcode: report.patientId.barcode
        },
        reportContent: report.reportContent,
        priority: report.priority,
        status: report.status,
        doctorResponse: report.doctorResponse,
        respondedBy: report.respondedBy,
        respondedAt: report.respondedAt,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark report as read (doctors and admin only)
router.put('/:reportId/read', auth(['doctor', 'admin']), async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { reportId } = req.params;

    const report = await PatientReport.findOneAndUpdate(
      { 
        _id: reportId, 
        hospitalId,
        status: 'new'
      },
      { status: 'read' },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found or already processed' });
    }

    res.json({
      message: 'Report marked as read',
      report: {
        _id: report._id,
        status: report.status
      }
    });
  } catch (error) {
    console.error('Mark report as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


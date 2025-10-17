// controllers/patientReportController.js
const PatientReport = require('../models/patientReportModel');
const PatientProfile = require('../models/patientProfileModel');

const getHospitalId = (req) => req.user?.hospitalId || req.user?.hospital?._id;

// ================= Controller Functions ================= //

// Create a new patient report (patients only)
exports.createReport = async (req, res) => {
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

    const patientProfile = await PatientProfile.findOne({ userId, hospitalId });
    if (!patientProfile) return res.status(404).json({ message: 'Patient profile not found' });

    const report = new PatientReport({
      patientId: patientProfile._id,
      userId,
      hospitalId,
      reportContent: reportContent.trim(),
      priority
    });

    await report.save();
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
};

// Get patient's own reports (patients only)
exports.getMyReports = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const userId = req.user.sub;

    const patientProfile = await PatientProfile.findOne({ userId, hospitalId });
    if (!patientProfile) return res.status(404).json({ message: 'Patient profile not found' });

    const reports = await PatientReport.find({ patientId: patientProfile._id })
      .populate('respondedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Get patient reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reports for doctors (doctors/admin only)
exports.getDoctorReports = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { status, priority, limit = 50 } = req.query;

    const filter = { hospitalId };
    if (status && status !== 'all') filter.status = status;
    if (priority) filter.priority = priority;

    const reports = await PatientReport.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('patientId', 'barcode')
      .populate('respondedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const mapped = reports.map(r => ({
      _id: r._id,
      patient: {
        firstName: r.userId?.firstName,
        lastName: r.userId?.lastName,
        email: r.userId?.email,
        barcode: r.patientId?.barcode,
      },
      reportContent: r.reportContent,
      priority: r.priority,
      status: r.status,
      doctorResponse: r.doctorResponse,
      respondedBy: r.respondedBy ? { firstName: r.respondedBy.firstName, lastName: r.respondedBy.lastName } : undefined,
      respondedAt: r.respondedAt,
      createdAt: r.createdAt,
    }));

    res.json({ count: mapped.length, reports: mapped });
  } catch (error) {
    console.error('Get doctor reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update report status and add doctor response (doctors/admin only)
exports.respondToReport = async (req, res) => {
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

    let report = await PatientReport.findOneAndUpdate(
      { _id: reportId, hospitalId },
      { status, doctorResponse: doctorResponse.trim(), respondedBy: req.user.sub, respondedAt: new Date() },
      { new: true }
    );
    if (report && typeof report.populate === 'function') {
      report = await report.populate([
        { path: 'userId', select: 'firstName lastName email' },
        { path: 'patientId', select: 'barcode' },
        { path: 'respondedBy', select: 'firstName lastName' },
      ]);
    }

    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.json({ message: 'Response added successfully', report });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark report as read (doctors/admin only)
exports.markReportAsRead = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);
    const { reportId } = req.params;

    const report = await PatientReport.findOneAndUpdate(
      { _id: reportId, hospitalId, status: 'new' },
      { status: 'read' },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found or already processed' });

    res.json({ message: 'Report marked as read', report });
  } catch (error) {
    console.error('Mark report as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

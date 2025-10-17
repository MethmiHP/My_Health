const mongoose = require('mongoose');
const PatientReport = require('../../models/patientReportModel');

describe('PatientReport Model (schema validation)', () => {
  test('validates required report fields without DB', async () => {
    const r = new PatientReport({
      patientId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      hospitalId: new mongoose.Types.ObjectId(),
      reportContent: 'Patient has a mild fever.'
    });
    await r.validate();
    expect(r.status).toBe('new');
    expect(r.priority).toBe('medium');
  });
});



const mongoose = require('mongoose');
const MedicalHistory = require('../../models/medicalHistoryModel');

describe('MedicalHistory Model (schema validation)', () => {
  test('validates required refs and nested schemas without DB', async () => {
    const mh = new MedicalHistory({
      patientId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      hospitalId: new mongoose.Types.ObjectId(),
      bloodType: 'O+',
      procedures: [{ type: 'surgery', procedureName: 'Appendectomy', procedureDate: new Date('2020-01-01') }]
    });
    await mh.validate();
    expect(mh.procedures[0].procedureName).toBe('Appendectomy');
  });
});



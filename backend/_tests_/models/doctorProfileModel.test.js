const mongoose = require('mongoose');
const DoctorProfile = require('../../models/doctorProfileModel');

describe('DoctorProfile Model (schema validation)', () => {
  test('validates required fields without DB', async () => {
    const doc = new DoctorProfile({
      userId: new mongoose.Types.ObjectId(),
      hospitalId: new mongoose.Types.ObjectId(),
      licenseNumber: 'LIC123',
      specialties: ['cardiology'],
      consultationFee: 500,
      roomNo: 'A1',
    });
    await doc.validate();
    expect(doc.specialties).toContain('cardiology');
  });

  test('declares unique index on userId', () => {
    const indexes = DoctorProfile.schema.indexes();
    const hasUnique = indexes.some(([fields, opts]) => fields.userId === 1 && opts && opts.unique === true);
    expect(hasUnique).toBe(true);
  });
});



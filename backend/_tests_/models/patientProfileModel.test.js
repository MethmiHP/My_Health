const mongoose = require('mongoose');
const PatientProfile = require('../../models/patientProfileModel');

describe('PatientProfile Model (schema validation)', () => {
  test('validates required fields without DB', async () => {
    const p = new PatientProfile({
      userId: new mongoose.Types.ObjectId(),
      hospitalId: new mongoose.Types.ObjectId(),
      firstName: 'Alice',
      lastName: 'Smith',
      dob: new Date('2000-01-01'),
    });
    await p.validate();
    expect(p.firstName).toBe('Alice');
  });

  test('declares compound index hospitalId+barcode (unique, sparse)', () => {
    const indexes = PatientProfile.schema.indexes();
    const hasIndex = indexes.some(([fields, opts]) => fields.hospitalId === 1 && fields.barcode === 1 && opts && opts.unique === true && opts.sparse === true);
    expect(hasIndex).toBe(true);
  });
});



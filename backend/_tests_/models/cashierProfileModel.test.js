const mongoose = require('mongoose');
const CashierProfile = require('../../models/cashierProfileModel');

describe('CashierProfile Model (schema validation)', () => {
  test('validates defaults without DB', async () => {
    const doc = new CashierProfile({
      userId: new mongoose.Types.ObjectId(),
      hospitalId: new mongoose.Types.ObjectId(),
      employeeId: 'EMP001',
    });
    await doc.validate();
    expect(doc.shift).toBe('rotational');
    expect(doc.permissions.canRefund).toBe(true);
  });

  test('declares compound unique index on (hospitalId, employeeId)', () => {
    const indexes = CashierProfile.schema.indexes();
    const hasCompound = indexes.some(([fields, opts]) => fields.hospitalId === 1 && fields.employeeId === 1 && opts && opts.unique === true);
    expect(hasCompound).toBe(true);
  });
});



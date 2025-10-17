const mongoose = require('mongoose');
const Payment = require('../../models/paymentModel');

describe('Payment Model (schema validation)', () => {
  test('schema defines receiptNumber and payment fields', () => {
    const pay = new Payment({
      patientId: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(),
      hospitalId: new mongoose.Types.ObjectId(),
      visitId: 'VST-1',
      cashierId: new mongoose.Types.ObjectId(),
      medications: [{ name: 'med1', quantity: 1, unitPrice: 100, totalPrice: 100 }],
      subtotal: 100,
      tax: 0,
      discount: 0,
      totalAmount: 100,
      paymentMethod: 'cash'
    });
    expect(pay.paymentMethod).toBe('cash');
    // Not asserting generation here to avoid DB dependency; just ensure field exists
    expect(Object.prototype.hasOwnProperty.call(Payment.schema.paths, 'receiptNumber')).toBe(true);
    // Ensure pre('validate') hook is registered
    const pres = Payment.schema.s.hooks._pres;
    const hasValidateHook = pres && pres.get('validate') && pres.get('validate').length > 0;
    expect(!!hasValidateHook).toBe(true);
  });
});



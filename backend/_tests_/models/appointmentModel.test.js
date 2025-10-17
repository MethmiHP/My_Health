const mongoose = require('mongoose');
const Appointment = require('../../models/appointmentModel');

describe('Appointment Model (schema validation)', () => {
  test('validates required fields and defaults without DB', async () => {
    const now = new Date();
    const appt = new Appointment({
      hospitalId: new mongoose.Types.ObjectId(),
      patientId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      slotStart: now,
      slotEnd: new Date(now.getTime() + 30 * 60 * 1000),
      createdBy: new mongoose.Types.ObjectId()
    });
    await appt.validate();
    expect(appt.status).toBe('booked');
    expect(appt.channel).toBe('patient');
  });

  test('has unique index for doctorId-slotStart when booked', () => {
    const indexes = Appointment.schema.indexes();
    const hasDoctorSlotUnique = indexes.some(([fields, opts]) =>
      fields.doctorId === 1 && fields.slotStart === 1 && opts && opts.unique === true
    );
    expect(hasDoctorSlotUnique).toBe(true);
  });
});



const Appointment = require('../models/appointmentModel');
const DoctorProfile = require('../models/doctorProfileModel');

function toMinutes(t) { const [h,m] = t.split(':').map(Number); return h*60+m; }

function* buildDailySlots(dayAvail, isoDate, slotMinutes) {
  // dayAvail: { start: "09:00", end: "12:00" }
  const startM = toMinutes(dayAvail.start);
  const endM   = toMinutes(dayAvail.end);
  for (let m = startM; m + slotMinutes <= endM; m += slotMinutes) {
    const start = new Date(isoDate);
    start.setHours(Math.floor(m/60), m%60, 0, 0);
    const end = new Date(start.getTime() + slotMinutes*60000);
    yield { start, end };
  }
}

exports.getSlots = async ({ doctorId, hospitalId, from, to, slotMinutes = 15 }) => {
  const prof = await DoctorProfile.findOne({ userId: doctorId, hospitalId });
  if (!prof) return [];

  const byDay = prof.availability || []; // [{day:0..6,start,end}]
  const taken = await Appointment.find({
    doctorId, status: 'booked', slotStart: { $gte: new Date(from) }, slotEnd: { $lte: new Date(to) }
  }).select('slotStart slotEnd').lean();

  const takenKey = new Set(taken.map(a => new Date(a.slotStart).toISOString()));

  const days = [];
  let cursor = new Date(from);
  const end = new Date(to);

  while (cursor <= end) {
    const dow = cursor.getDay(); // 0..6 (Sun..Sat)
    const dayAvail = byDay.filter(d => Number(d.day) === dow);
    const iso = new Date(cursor).toISOString().slice(0,10); // YYYY-MM-DD
    const daySlots = [];
    for (const a of dayAvail) {
      for (const slot of buildDailySlots(a, iso, slotMinutes)) {
        const key = slot.start.toISOString();
        if (!takenKey.has(key)) daySlots.push(slot);
      }
    }
    days.push({ date: iso, slots: daySlots });
    cursor.setDate(cursor.getDate()+1);
  }
  return days;
};

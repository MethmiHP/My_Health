const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // your roles guard
const ctrl = require('../controllers/appointment.controller');

// Public/Patient browse helpers
router.get('/specialties', auth(['patient','reception','admin','doctor']), ctrl.listSpecialties);
router.get('/doctors',     auth(['patient','reception','admin','doctor']), ctrl.listDoctorsBySpecialty);
router.get('/slots',       auth(['patient','reception','admin','doctor']), ctrl.getSlots);

// Booking flows
router.post('/',                   auth(['patient','reception']), ctrl.book);             // create
router.post('/:id/cancel',         auth(['patient','reception','admin']), ctrl.cancel);   // cancel
router.post('/:id/reschedule',     auth(['patient','reception']), ctrl.reschedule);       // resched

// Convenience reads
router.get('/my',                  auth(['patient']), ctrl.myAppointments);
router.get('/doctor/day',          auth(['doctor']),  ctrl.doctorDayList);

router.patch('/:id/reason', auth(), ctrl.updateReason);

module.exports = router;


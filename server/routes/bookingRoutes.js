const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorizeRoles, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, bookingController.createBooking);
router.get('/', authenticate, authorizeRoles('admin', 'staff'), bookingController.getAllBookings);
router.get('/my', authenticate, bookingController.getMyBookings);
router.get('/:id', optionalAuth, bookingController.getBookingById);
router.post('/:id/check-in', authenticate, authorizeRoles('admin', 'staff'), bookingController.checkInGuest);
router.post('/:id/check-out', authenticate, authorizeRoles('admin', 'staff'), bookingController.checkOutGuest);
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

module.exports = router;


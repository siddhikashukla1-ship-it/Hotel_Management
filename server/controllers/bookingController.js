const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');

// Helper to calculate days between dates
const calculateNights = (checkIn, checkOut) => {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

// @route   POST /api/bookings
// @desc    Create a new hotel reservation
exports.createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guestName,
      guestEmail,
      guestPhone,
      guestsCount,
      specialRequests,
      paymentMethod
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate || !guestName || !guestEmail) {
      return res.status(400).json({
        success: false,
        message: 'Room, check-in date, check-out date, and guest information are required.'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Selected room not found.' });
    }

    const nights = calculateNights(checkInDate, checkOutDate);
    const roomSubtotal = room.pricePerNight * nights;
    const taxes = Math.round(roomSubtotal * 0.12); // 12% hospitality tax
    const serviceFee = 25; // standard service fee
    const grandTotal = roomSubtotal + taxes + serviceFee;

    const bookingCode = `HP-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionId = `TXN-${bookingCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = await Booking.create({
      bookingCode,
      user: req.user ? req.user.id : null,
      guestName,
      guestEmail,
      guestPhone: guestPhone || (req.user ? req.user.phone : ''),
      room: room._id,
      checkInDate,
      checkOutDate,
      nights,
      guestsCount: Number(guestsCount) || 1,
      totalAmount: grandTotal,
      status: 'Confirmed',
      paymentStatus: paymentMethod === 'Pay at Check-in' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod || 'Credit Card',
      specialRequests: specialRequests || '',
      createdAt: new Date().toISOString()
    });

    // Create corresponding payment ledger record
    const payment = await Payment.create({
      transactionId,
      booking: newBooking._id,
      bookingCode,
      user: req.user ? req.user.id : null,
      guestName,
      amount: grandTotal,
      currency: 'USD',
      method: paymentMethod || 'Credit Card',
      status: paymentMethod === 'Pay at Check-in' ? 'Pending' : 'Success',
      invoiceNumber,
      breakdown: {
        roomCharges: roomSubtotal,
        taxes,
        serviceFee,
        total: grandTotal
      },
      createdAt: new Date().toISOString()
    });

    // If checkInDate is today, set room status to Occupied or Reserved
    const today = new Date().toISOString().split('T')[0];
    if (checkInDate === today) {
      await Room.findByIdAndUpdate(room._id, { status: 'Occupied' });
    }

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: newBooking,
      payment,
      invoice: {
        invoiceNumber,
        bookingCode,
        room: room.title,
        roomNumber: room.roomNumber,
        nights,
        guestName,
        guestEmail,
        checkInDate,
        checkOutDate,
        breakdown: payment.breakdown
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Reservation failed', error: error.message });
  }
};

// @route   GET /api/bookings
// @desc    Get all bookings (Admin/Staff)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingCode: { $regex: search, $options: 'i' } },
        { guestName: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } }
      ];
    }

    let bookings = await Booking.find(query);

    // Populate room and user details
    for (let i = 0; i < bookings.length; i++) {
      await bookings[i].populate('room');
      await bookings[i].populate('user');
    }

    return res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.reverse()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
  }
};

// @route   GET /api/bookings/my
// @desc    Get bookings of authenticated user
exports.getMyBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({
      $or: [
        { user: req.user.id },
        { guestEmail: req.user.email }
      ]
    });

    for (let i = 0; i < bookings.length; i++) {
      await bookings[i].populate('room');
    }

    return res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.reverse()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch your bookings', error: error.message });
  }
};

// @route   GET /api/bookings/:id
// @desc    Get booking details with payment invoice
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await booking.populate('room');
    await booking.populate('user');

    const payment = await Payment.findOne({
      $or: [{ booking: booking._id }, { bookingCode: booking.bookingCode }]
    });

    return res.json({
      success: true,
      booking,
      payment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve booking', error: error.message });
  }
};

// @route   POST /api/bookings/:id/check-in
// @desc    Check-in guest (Staff/Admin)
exports.checkInGuest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'Checked-in';
    booking.actualCheckInTime = new Date();
    await booking.save();

    // Mark room as occupied
    const roomId = typeof booking.room === 'object' ? booking.room._id : booking.room;
    await Room.findByIdAndUpdate(roomId, { status: 'Occupied' });

    return res.json({
      success: true,
      message: `Guest ${booking.guestName} successfully checked in to Room!`,
      booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Check-in failed', error: error.message });
  }
};

// @route   POST /api/bookings/:id/check-out
// @desc    Check-out guest (Staff/Admin)
exports.checkOutGuest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'Checked-out';
    booking.actualCheckOutTime = new Date();
    await booking.save();

    // Mark room as Cleaning / Dirty so housekeeping is dispatched
    const roomId = typeof booking.room === 'object' ? booking.room._id : booking.room;
    await Room.findByIdAndUpdate(roomId, {
      status: 'Cleaning',
      cleaningStatus: 'Dirty'
    });

    return res.json({
      success: true,
      message: `Guest ${booking.guestName} checked out successfully. Room assigned for housekeeping.`,
      booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Check-out failed', error: error.message });
  }
};

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Permission check: only admin, staff, or the booking owner
    if (req.user.role === 'guest' && String(booking.user) !== String(req.user.id) && booking.guestEmail !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
    }

    booking.status = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    // Free room back to Available if was occupied/reserved
    const roomId = typeof booking.room === 'object' ? booking.room._id : booking.room;
    await Room.findByIdAndUpdate(roomId, { status: 'Available' });

    return res.json({
      success: true,
      message: `Booking ${booking.bookingCode} has been cancelled and refunded.`,
      booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Cancellation failed', error: error.message });
  }
};


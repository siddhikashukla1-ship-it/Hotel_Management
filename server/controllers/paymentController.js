const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @route   GET /api/payments
// @desc    Get all payment transactions (Admin/Staff)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({});
    return res.json({
      success: true,
      count: payments.length,
      payments: payments.reverse()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
  }
};

// @route   GET /api/payments/invoice/:invoiceNumber
// @desc    Get detailed invoice for printing / downloading
exports.getInvoice = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const payment = await Payment.findOne({
      $or: [{ invoiceNumber }, { bookingCode: invoiceNumber }]
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const booking = await Booking.findById(payment.booking);
    if (booking) {
      await booking.populate('room');
    }

    return res.json({
      success: true,
      invoice: {
        invoiceNumber: payment.invoiceNumber,
        transactionId: payment.transactionId,
        date: payment.createdAt,
        guestName: payment.guestName,
        paymentMethod: payment.method,
        paymentStatus: payment.status,
        booking: booking || null,
        breakdown: payment.breakdown
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load invoice', error: error.message });
  }
};

// @route   POST /api/payments/process
// @desc    Simulate payment gateway completion
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, cardNumber } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const transactionId = `TXN-${booking.bookingCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const roomSubtotal = Math.round(booking.totalAmount / 1.12);
    const taxes = booking.totalAmount - roomSubtotal;

    const payment = await Payment.create({
      transactionId,
      booking: booking._id,
      bookingCode: booking.bookingCode,
      user: booking.user,
      guestName: booking.guestName,
      amount: booking.totalAmount,
      currency: 'USD',
      method: paymentMethod || 'Credit Card',
      status: 'Success',
      invoiceNumber,
      breakdown: {
        roomCharges: roomSubtotal,
        taxes,
        serviceFee: 20,
        total: booking.totalAmount
      },
      createdAt: new Date().toISOString()
    });

    booking.paymentStatus = 'Paid';
    await booking.save();

    return res.json({
      success: true,
      message: 'Payment processed successfully!',
      payment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Payment processing failed', error: error.message });
  }
};


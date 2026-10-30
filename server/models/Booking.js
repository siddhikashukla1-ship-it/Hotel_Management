const mongoose = require('mongoose');
const memoryDb = require('../config/memoryStore');

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    nights: { type: Number, required: true, default: 1 },
    guestsCount: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'],
      default: 'Confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded'],
      default: 'Paid'
    },
    paymentMethod: { type: String, default: 'Credit Card' },
    specialRequests: { type: String, default: '' },
    actualCheckInTime: { type: Date },
    actualCheckOutTime: { type: Date }
  },
  { timestamps: true }
);

let MongooseBooking;
try {
  MongooseBooking = mongoose.model('Booking', bookingSchema);
} catch (e) {
  MongooseBooking = mongoose.model('Booking');
}

const BookingProxy = new Proxy(MongooseBooking, {
  get(target, prop) {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryDb.bookings) {
      const val = memoryDb.bookings[prop];
      return typeof val === 'function' ? val.bind(memoryDb.bookings) : val;
    }
    return target[prop];
  }
});

module.exports = BookingProxy;


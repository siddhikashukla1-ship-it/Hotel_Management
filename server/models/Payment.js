const mongoose = require('mongoose');
const memoryDb = require('../config/memoryStore');

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    bookingCode: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    method: { type: String, default: 'Credit Card' },
    status: {
      type: String,
      enum: ['Success', 'Pending', 'Failed', 'Refunded'],
      default: 'Success'
    },
    invoiceNumber: { type: String, required: true },
    breakdown: {
      roomCharges: { type: Number, default: 0 },
      taxes: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

let MongoosePayment;
try {
  MongoosePayment = mongoose.model('Payment', paymentSchema);
} catch (e) {
  MongoosePayment = mongoose.model('Payment');
}

const PaymentProxy = new Proxy(MongoosePayment, {
  get(target, prop) {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryDb.payments) {
      const val = memoryDb.payments[prop];
      return typeof val === 'function' ? val.bind(memoryDb.payments) : val;
    }
    return target[prop];
  }
});

module.exports = PaymentProxy;


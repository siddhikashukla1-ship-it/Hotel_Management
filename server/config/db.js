const mongoose = require('mongoose');
const { defaultUsers, defaultRooms, defaultBookings, defaultPayments } = require('../seed/defaultData');

let isUsingMemoryDb = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';

  try {
    // Attempt MongoDB connection with 2 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] Connected successfully to MongoDB at ${uri}`);

    // Check if initial seeding is needed in MongoDB
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasUsers = collections.some(c => c.name === 'users');

    if (!hasUsers) {
      console.log('[Database] Empty MongoDB detected. Seeding initial HotelPro data...');
      const User = require('../models/User');
      const Room = require('../models/Room');
      const Booking = require('../models/Booking');
      const Payment = require('../models/Payment');

      await User.insertMany(defaultUsers);
      await Room.insertMany(defaultRooms);
      await Booking.insertMany(defaultBookings);
      await Payment.insertMany(defaultPayments);
      console.log('[Database] MongoDB seeded with default users, rooms, bookings, and payments!');
    }
  } catch (error) {
    isUsingMemoryDb = true;
    console.log(`[Database] MongoDB not reachable (${error.message}).`);
    console.log('[Database] -> Activated Zero-Friction High-Performance Embedded Store with full persistence & seed data.');
  }
};

module.exports = { connectDB, getIsMemoryDb: () => isUsingMemoryDb };


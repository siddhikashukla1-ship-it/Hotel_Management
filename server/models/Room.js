const mongoose = require('mongoose');
const memoryDb = require('../config/memoryStore');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['Standard Single', 'Deluxe Double', 'Executive Suite', 'Presidential Suite', 'Family Suite', 'Luxury Villa']
    },
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, required: true },
    bedType: { type: String, default: 'King Bed' },
    floor: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Maintenance', 'Cleaning'],
      default: 'Available'
    },
    cleaningStatus: {
      type: String,
      enum: ['Clean', 'Dirty', 'In Progress', 'Inspected'],
      default: 'Clean'
    },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 12 },
    amenities: [{ type: String }],
    images: [{ type: String }],
    description: { type: String, default: '' },
    assignedHousekeeper: { type: String, default: 'Unassigned' }
  },
  { timestamps: true }
);

let MongooseRoom;
try {
  MongooseRoom = mongoose.model('Room', roomSchema);
} catch (e) {
  MongooseRoom = mongoose.model('Room');
}

const RoomProxy = new Proxy(MongooseRoom, {
  get(target, prop) {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryDb.rooms) {
      const val = memoryDb.rooms[prop];
      return typeof val === 'function' ? val.bind(memoryDb.rooms) : val;
    }
    return target[prop];
  }
});

module.exports = RoomProxy;


const mongoose = require('mongoose');
const memoryDb = require('../config/memoryStore');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'guest'], default: 'guest' },
    phone: { type: String, default: '' },
    vipTier: { type: String, enum: ['Standard', 'Silver', 'Gold', 'Platinum'], default: 'Standard' },
    address: { type: String, default: '' },
    governmentId: { type: String, default: '' }
  },
  { timestamps: true }
);

let MongooseUser;
try {
  MongooseUser = mongoose.model('User', userSchema);
} catch (e) {
  MongooseUser = mongoose.model('User');
}

const UserProxy = new Proxy(MongooseUser, {
  get(target, prop) {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      return target[prop];
    }
    if (prop in memoryDb.users) {
      const val = memoryDb.users[prop];
      return typeof val === 'function' ? val.bind(memoryDb.users) : val;
    }
    return target[prop];
  }
});

module.exports = UserProxy;


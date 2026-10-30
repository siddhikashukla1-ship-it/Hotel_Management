const fs = require('fs');
const path = require('path');
const { defaultUsers, defaultRooms, defaultBookings, defaultPayments } = require('../seed/defaultData');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'hotelpro_db.json');

class MemoryCollection {
  constructor(name, initialData, dbInstance) {
    this.name = name;
    this.data = JSON.parse(JSON.stringify(initialData));
    this.db = dbInstance;
  }

  _matchesQuery(item, query = {}) {
    for (const key of Object.keys(query)) {
      if (key === '$or' && Array.isArray(query.$or)) {
        const matchesOr = query.$or.some(subQuery => this._matchesQuery(item, subQuery));
        if (!matchesOr) return false;
        continue;
      }

      const val = item[key];
      const qVal = query[key];

      if (qVal && typeof qVal === 'object' && !Array.isArray(qVal) && !(qVal instanceof RegExp)) {
        if ('$gte' in qVal && !(val >= qVal.$gte)) return false;
        if ('$lte' in qVal && !(val <= qVal.$lte)) return false;
        if ('$gt' in qVal && !(val > qVal.$gt)) return false;
        if ('$lt' in qVal && !(val < qVal.$lt)) return false;
        if ('$ne' in qVal && val === qVal.$ne) return false;
        if ('$in' in qVal && Array.isArray(qVal.$in) && !qVal.$in.includes(val)) return false;
        if ('$regex' in qVal) {
          const re = new RegExp(qVal.$regex, qVal.$options || 'i');
          if (!re.test(String(val || ''))) return false;
        }
      } else if (qVal instanceof RegExp) {
        if (!qVal.test(String(val || ''))) return false;
      } else {
        if (String(val) !== String(qVal)) return false;
      }
    }
    return true;
  }

  async find(query = {}) {
    const results = this.data.filter(item => this._matchesQuery(item, query));
    return this._wrapResults(results);
  }

  async findOne(query = {}) {
    const item = this.data.find(item => this._matchesQuery(item, query));
    return item ? this._wrapItem(item) : null;
  }

  async findById(id) {
    const item = this.data.find(item => String(item._id) === String(id));
    return item ? this._wrapItem(item) : null;
  }

  async create(doc) {
    const newDoc = {
      ...doc,
      _id: doc._id || `${this.name.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: doc.createdAt || new Date().toISOString()
    };
    this.data.push(newDoc);
    this.db._persist();
    return this._wrapItem(newDoc);
  }

  async insertMany(docs) {
    const created = [];
    for (const d of docs) {
      created.push(await this.create(d));
    }
    return created;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = this.data.findIndex(item => String(item._id) === String(id));
    if (idx === -1) return null;

    const current = this.data[idx];
    const updated = { ...current };

    if (update.$set) {
      Object.assign(updated, update.$set);
    } else {
      Object.assign(updated, update);
    }

    this.data[idx] = updated;
    this.db._persist();
    return this._wrapItem(updated);
  }

  async findByIdAndDelete(id) {
    const idx = this.data.findIndex(item => String(item._id) === String(id));
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    this.db._persist();
    return this._wrapItem(removed);
  }

  async deleteOne(query) {
    const idx = this.data.findIndex(item => this._matchesQuery(item, query));
    if (idx === -1) return { deletedCount: 0 };
    this.data.splice(idx, 1);
    this.db._persist();
    return { deletedCount: 1 };
  }

  async countDocuments(query = {}) {
    return this.data.filter(item => this._matchesQuery(item, query)).length;
  }

  _wrapResults(items) {
    const collectionName = this.name;
    const db = this.db;
    const array = items.map(item => this._wrapItem(item));

    // Support Mongoose-like chaining (.sort, .populate, .limit, etc.)
    array.sort = function (sortOptions) {
      if (typeof sortOptions === 'object') {
        const [field, direction] = Object.entries(sortOptions)[0] || [];
        if (field) {
          array.sort((a, b) => {
            const valA = a[field] || '';
            const valB = b[field] || '';
            if (valA < valB) return direction === -1 || direction === 'desc' ? 1 : -1;
            if (valA > valB) return direction === -1 || direction === 'desc' ? -1 : 1;
            return 0;
          });
        }
      }
      return array;
    };

    array.populate = async function (path, select) {
      for (let i = 0; i < array.length; i++) {
        await array[i].populate(path, select);
      }
      return array;
    };

    return array;
  }

  _wrapItem(item) {
    if (!item) return null;
    const cloned = JSON.parse(JSON.stringify(item));
    const db = this.db;

    // Attach Mongoose document helpers
    cloned.save = async function () {
      return cloned;
    };

    cloned.populate = async function (pathField, select) {
      if (pathField === 'room' && cloned.room) {
        const roomId = typeof cloned.room === 'object' ? cloned.room._id : cloned.room;
        const roomDoc = await db.rooms.findById(roomId);
        if (roomDoc) cloned.room = roomDoc;
      }
      if (pathField === 'user' && cloned.user) {
        const userId = typeof cloned.user === 'object' ? cloned.user._id : cloned.user;
        const userDoc = await db.users.findById(userId);
        if (userDoc) cloned.user = userDoc;
      }
      if (pathField === 'booking' && cloned.booking) {
        const bookingId = typeof cloned.booking === 'object' ? cloned.booking._id : cloned.booking;
        const bookingDoc = await db.bookings.findById(bookingId);
        if (bookingDoc) cloned.booking = bookingDoc;
      }
      return cloned;
    };

    return cloned;
  }
}

class MemoryDatabase {
  constructor() {
    this._loadOrInit();
  }

  _loadOrInit() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let saved = null;
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        saved = JSON.parse(raw);
      } catch (err) {
        console.warn('Failed to parse cached hotelpro_db.json, resetting with defaults:', err.message);
      }
    }

    this.users = new MemoryCollection('users', saved?.users || defaultUsers, this);
    this.rooms = new MemoryCollection('rooms', saved?.rooms || defaultRooms, this);
    this.bookings = new MemoryCollection('bookings', saved?.bookings || defaultBookings, this);
    this.payments = new MemoryCollection('payments', saved?.payments || defaultPayments, this);
  }

  _persist() {
    try {
      const dump = {
        users: this.users.data,
        rooms: this.rooms.data,
        bookings: this.bookings.data,
        payments: this.payments.data
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(dump, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err.message);
    }
  }

  resetToDefault() {
    this.users.data = JSON.parse(JSON.stringify(defaultUsers));
    this.rooms.data = JSON.parse(JSON.stringify(defaultRooms));
    this.bookings.data = JSON.parse(JSON.stringify(defaultBookings));
    this.payments.data = JSON.parse(JSON.stringify(defaultPayments));
    this._persist();
  }
}

const memoryDb = new MemoryDatabase();

module.exports = memoryDb;


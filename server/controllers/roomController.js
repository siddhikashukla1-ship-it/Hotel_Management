const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @route   GET /api/rooms
// @desc    Get all rooms with filtering & search
exports.getAllRooms = async (req, res) => {
  try {
    const { type, status, capacity, minPrice, maxPrice, search, checkIn, checkOut } = req.query;

    let query = {};

    if (type && type !== 'All') {
      query.type = type;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    let rooms = await Room.find(query);

    // If checkIn and checkOut are provided, check actual booking overlaps
    if (checkIn && checkOut) {
      const activeBookings = await Booking.find({
        status: { $in: ['Confirmed', 'Checked-in'] }
      });

      const bookedRoomIds = new Set();
      const reqIn = new Date(checkIn).getTime();
      const reqOut = new Date(checkOut).getTime();

      activeBookings.forEach(b => {
        const bIn = new Date(b.checkInDate).getTime();
        const bOut = new Date(b.checkOutDate).getTime();
        // Overlap condition: startA < endB && endA > startB
        if (reqIn < bOut && reqOut > bIn) {
          const roomId = typeof b.room === 'object' ? b.room._id : b.room;
          bookedRoomIds.add(String(roomId));
        }
      });

      rooms = rooms.map(room => {
        const isBooked = bookedRoomIds.has(String(room._id));
        return {
          ...room,
          isAvailableForDates: !isBooked && room.status !== 'Maintenance'
        };
      });
    }

    return res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch rooms', error: error.message });
  }
};

// @route   GET /api/rooms/:id
// @desc    Get single room details
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    return res.json({ success: true, room });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving room', error: error.message });
  }
};

// @route   POST /api/rooms
// @desc    Create a new room (Admin only)
exports.createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      title,
      type,
      pricePerNight,
      capacity,
      bedType,
      floor,
      status,
      amenities,
      images,
      description
    } = req.body;

    if (!roomNumber || !title || !pricePerNight || !capacity) {
      return res.status(400).json({ success: false, message: 'Room number, title, price, and capacity are required.' });
    }

    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: `Room ${roomNumber} already exists.` });
    }

    const newRoom = await Room.create({
      roomNumber,
      title,
      type: type || 'Deluxe Double',
      pricePerNight: Number(pricePerNight),
      capacity: Number(capacity),
      bedType: bedType || 'King Bed',
      floor: Number(floor) || 1,
      status: status || 'Available',
      cleaningStatus: 'Clean',
      amenities: amenities || ['High-Speed Wi-Fi', 'Smart TV', 'Air Conditioning'],
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      ],
      description: description || 'Spacious, elegantly appointed room featuring modern hospitality comforts.',
      rating: 5.0,
      reviewsCount: 1
    });

    return res.status(201).json({
      success: true,
      message: `Room ${roomNumber} created successfully!`,
      room: newRoom
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Room creation failed', error: error.message });
  }
};

// @route   PUT /api/rooms/:id
// @desc    Update room details (Admin/Staff)
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    return res.json({
      success: true,
      message: 'Room updated successfully',
      room: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update room', error: error.message });
  }
};

// @route   DELETE /api/rooms/:id
// @desc    Delete room (Admin only)
exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    return res.json({
      success: true,
      message: `Room ${deleted.roomNumber} has been removed successfully.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete room', error: error.message });
  }
};

// @route   PATCH /api/rooms/:id/housekeeping
// @desc    Update room cleaning & housekeeping status
exports.updateHousekeeping = async (req, res) => {
  try {
    const { cleaningStatus, assignedHousekeeper, status } = req.body;
    const update = {};
    if (cleaningStatus) update.cleaningStatus = cleaningStatus;
    if (assignedHousekeeper !== undefined) update.assignedHousekeeper = assignedHousekeeper;
    if (status) update.status = status;

    const updated = await Room.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.json({ success: true, message: 'Housekeeping status updated', room: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};


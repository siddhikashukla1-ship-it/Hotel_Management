const User = require('../models/User');
const Booking = require('../models/Booking');

// @route   GET /api/guests
// @desc    Get all guests with stay history & statistics (Staff/Admin)
exports.getAllGuests = async (req, res) => {
  try {
    const guests = await User.find({ role: 'guest' });
    const allBookings = await Booking.find({});

    const guestProfiles = guests.map(guest => {
      const guestBookings = allBookings.filter(
        b => String(b.user) === String(guest._id) || b.guestEmail === guest.email
      );

      const totalStays = guestBookings.filter(b => b.status === 'Checked-out' || b.status === 'Checked-in' || b.status === 'Confirmed').length;
      const totalSpend = guestBookings
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      const latestBooking = guestBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      return {
        id: guest._id,
        _id: guest._id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        vipTier: guest.vipTier || 'Standard',
        address: guest.address,
        governmentId: guest.governmentId,
        totalStays,
        totalSpend,
        latestBooking: latestBooking ? {
          bookingCode: latestBooking.bookingCode,
          status: latestBooking.status,
          date: latestBooking.checkInDate
        } : null,
        joinedDate: guest.createdAt
      };
    });

    return res.json({
      success: true,
      count: guestProfiles.length,
      guests: guestProfiles
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch guests', error: error.message });
  }
};

// @route   GET /api/guests/:id
// @desc    Get guest detail with booking history
exports.getGuestById = async (req, res) => {
  try {
    const guest = await User.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ success: false, message: 'Guest not found' });
    }

    const bookings = await Booking.find({
      $or: [{ user: guest._id }, { guestEmail: guest.email }]
    });

    for (let i = 0; i < bookings.length; i++) {
      await bookings[i].populate('room');
    }

    return res.json({
      success: true,
      guest: {
        id: guest._id,
        _id: guest._id,
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
        vipTier: guest.vipTier,
        address: guest.address,
        governmentId: guest.governmentId,
        createdAt: guest.createdAt
      },
      bookings: bookings.reverse()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch guest details', error: error.message });
  }
};

// @route   PATCH /api/guests/:id/vip
// @desc    Update guest VIP tier
exports.updateGuestVip = async (req, res) => {
  try {
    const { vipTier } = req.body;
    if (!['Standard', 'Silver', 'Gold', 'Platinum'].includes(vipTier)) {
      return res.status(400).json({ success: false, message: 'Invalid VIP Tier.' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { vipTier }, { new: true });
    return res.json({ success: true, message: `VIP tier updated to ${vipTier}`, guest: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update VIP status', error: error.message });
  }
};


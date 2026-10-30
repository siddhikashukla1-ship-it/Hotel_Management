const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');

// @route   GET /api/dashboard/analytics
// @desc    Get complete hotel operational analytics & KPI metrics
exports.getAnalytics = async (req, res) => {
  try {
    const rooms = await Room.find({});
    const bookings = await Booking.find({});
    const payments = await Payment.find({});
    const users = await User.find({});

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const cleaningRooms = rooms.filter(r => r.status === 'Cleaning').length;
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const totalRevenue = payments
      .filter(p => p.status === 'Success')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const activeBookings = bookings.filter(b => ['Confirmed', 'Checked-in'].includes(b.status)).length;
    const totalGuests = users.filter(u => u.role === 'guest').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayCheckIns = bookings.filter(b => b.checkInDate === todayStr && b.status !== 'Cancelled').length;
    const todayCheckOuts = bookings.filter(b => b.checkOutDate === todayStr && b.status !== 'Cancelled').length;

    // Room Status breakdown
    const roomStatusBreakdown = {
      available: availableRooms,
      occupied: occupiedRooms,
      cleaning: cleaningRooms,
      maintenance: maintenanceRooms
    };

    // Housekeeping status breakdown
    const housekeepingBreakdown = {
      clean: rooms.filter(r => r.cleaningStatus === 'Clean').length,
      dirty: rooms.filter(r => r.cleaningStatus === 'Dirty').length,
      inProgress: rooms.filter(r => r.cleaningStatus === 'In Progress').length,
      inspected: rooms.filter(r => r.cleaningStatus === 'Inspected').length
    };

    // Revenue by month (simulated or real aggregated)
    const revenueByMonth = [
      { month: 'Jun', revenue: 14200, occupancy: 72 },
      { month: 'Jul', revenue: 18900, occupancy: 85 },
      { month: 'Aug', revenue: 21400, occupancy: 91 },
      { month: 'Sep', revenue: 16800, occupancy: 76 },
      { month: 'Oct', revenue: 24300, occupancy: 88 },
      { month: 'Current', revenue: totalRevenue, occupancy: occupancyRate }
    ];

    // Room Type distribution
    const roomTypeStats = {};
    rooms.forEach(r => {
      roomTypeStats[r.type] = (roomTypeStats[r.type] || 0) + 1;
    });

    // Populate last 6 bookings
    const recentBookings = [...bookings].reverse().slice(0, 6);
    for (let i = 0; i < recentBookings.length; i++) {
      await recentBookings[i].populate('room');
    }

    return res.json({
      success: true,
      data: {
        kpi: {
          totalRevenue,
          occupancyRate,
          activeBookings,
          availableRooms,
          occupiedRooms,
          totalRooms,
          totalGuests,
          todayCheckIns,
          todayCheckOuts
        },
        roomStatusBreakdown,
        housekeepingBreakdown,
        revenueByMonth,
        roomTypeStats,
        recentBookings
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate analytics', error: error.message });
  }
};


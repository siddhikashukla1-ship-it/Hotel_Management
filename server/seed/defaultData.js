const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const adminPassword = bcrypt.hashSync('admin123', salt);
const staffPassword = bcrypt.hashSync('staff123', salt);
const guestPassword = bcrypt.hashSync('guest123', salt);

const defaultUsers = [
  {
    _id: 'usr_admin_001',
    name: 'Alexander Wright',
    email: 'admin@hotelpro.com',
    password: adminPassword,
    role: 'admin',
    phone: '+1 (555) 019-2834',
    vipTier: 'Platinum',
    address: 'Suite 400, HotelPro Executive Offices, New York',
    governmentId: 'US-PASSPORT-990182'
  },
  {
    _id: 'usr_staff_002',
    name: 'Elena Rostova',
    email: 'staff@hotelpro.com',
    password: staffPassword,
    role: 'staff',
    phone: '+1 (555) 014-7721',
    vipTier: 'Gold',
    address: 'Front Desk Operations, HotelPro Downtown',
    governmentId: 'US-DL-8827361'
  },
  {
    _id: 'usr_guest_003',
    name: 'Sarah Jenkins',
    email: 'guest@hotelpro.com',
    password: guestPassword,
    role: 'guest',
    phone: '+1 (555) 018-4492',
    vipTier: 'Platinum',
    address: '428 Sunset Boulevard, Los Angeles, CA',
    governmentId: 'US-PASSPORT-339102'
  },
  {
    _id: 'usr_guest_004',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    password: guestPassword,
    role: 'guest',
    phone: '+1 (555) 012-9938',
    vipTier: 'Gold',
    address: '120 Market Street, San Francisco, CA',
    governmentId: 'US-DL-4729104'
  },
  {
    _id: 'usr_guest_005',
    name: 'Olivia Martinez',
    email: 'olivia.m@example.com',
    password: guestPassword,
    role: 'guest',
    phone: '+1 (555) 017-3849',
    vipTier: 'Silver',
    address: '77 Ocean Drive, Miami, FL',
    governmentId: 'US-PASSPORT-662918'
  }
];

const defaultRooms = [
  {
    _id: 'room_101',
    roomNumber: '101',
    title: 'Grand Deluxe Ocean Suite',
    type: 'Executive Suite',
    pricePerNight: 285,
    capacity: 2,
    bedType: 'California King',
    floor: 1,
    status: 'Available',
    cleaningStatus: 'Clean',
    rating: 4.95,
    reviewsCount: 42,
    amenities: [
      'Panoramic Ocean View',
      'Ultra High-Speed Wi-Fi 6',
      '65" OLED Smart TV',
      'Private Marble Balcony',
      'Italian Espresso Machine',
      'Hydro-Jet Bathtub',
      'Complimentary Gourmet Breakfast',
      '24/7 Butler & Room Service'
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immerse yourself in sheer luxury with uninterrupted vistas of the azure ocean. Featuring handcrafted Italian furnishings, a deep-soaking hydrotherapy tub, and personal concierge service.'
  },
  {
    _id: 'room_102',
    roomNumber: '102',
    title: 'Skyline Executive Business Suite',
    type: 'Executive Suite',
    pricePerNight: 240,
    capacity: 2,
    bedType: 'King Bed',
    floor: 1,
    status: 'Occupied',
    cleaningStatus: 'Clean',
    rating: 4.88,
    reviewsCount: 38,
    amenities: [
      'High-Floor City Skyline View',
      'Dedicated Workstation & Herman Miller Chair',
      'Fiber Optic High-Speed Internet',
      'Soundproof Triple-Glazed Windows',
      'Nespresso Bar',
      'Rainfall Shower',
      'Executive Lounge Access'
    ],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Designed tailored for modern executives and discerning professionals. Features an ergonomic Herman Miller workstation, high-speed fiber internet, and exclusive executive lounge privileges.'
  },
  {
    _id: 'room_201',
    roomNumber: '201',
    title: 'Presidential Royal Penthouse',
    type: 'Presidential Suite',
    pricePerNight: 550,
    capacity: 4,
    bedType: '2 King Beds',
    floor: 2,
    status: 'Available',
    cleaningStatus: 'Clean',
    rating: 4.99,
    reviewsCount: 29,
    amenities: [
      'Wraparound 360° Terrace with Jacuzzi',
      'Private Chef Kitchen & Dining for 8',
      'Dual Master Bedrooms',
      'Bose Surround Sound System',
      'Private In-Suite Sauna',
      'VIP Airport Limousine Transfer',
      'Sommelier Curated Wine Cellar'
    ],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The pinnacle of hospitality extravagance. Spanning 1,800 sq ft across the top floor with private elevator access, an open terrace jacuzzi, and bespoke fine dining amenities.'
  },
  {
    _id: 'room_202',
    roomNumber: '202',
    title: 'Contemporary Deluxe Queen Room',
    type: 'Deluxe Double',
    pricePerNight: 165,
    capacity: 2,
    bedType: 'Queen Bed',
    floor: 2,
    status: 'Available',
    cleaningStatus: 'Clean',
    rating: 4.82,
    reviewsCount: 54,
    amenities: [
      'Garden Courtyard View',
      'High-Speed Wi-Fi',
      '50" 4K Smart TV',
      'Walk-in Rain Shower',
      'Luxury Organic Toiletries',
      'Mini Bar & Kettle'
    ],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Sleek, minimalist aesthetic infused with warm timber accents. Ideal for leisure seekers wanting a serene sanctuary with courtyard views.'
  },
  {
    _id: 'room_301',
    roomNumber: '301',
    title: 'Family Garden Oasis Villa',
    type: 'Family Suite',
    pricePerNight: 340,
    capacity: 5,
    bedType: '1 King + 2 Twin Beds',
    floor: 3,
    status: 'Cleaning',
    cleaningStatus: 'In Progress',
    rating: 4.91,
    reviewsCount: 31,
    amenities: [
      'Direct Private Garden Access',
      'Spacious Living Area with Sofa-Bed',
      'Kitchenette with Microwave & Refrigerator',
      'Children Play Corner & Board Games',
      'Dual Bathroom Vanity',
      'Complimentary Laundry Service'
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Generously proportioned for families traveling in style. Features separate living and sleeping wings, child-friendly facilities, and peaceful private garden terrace.'
  },
  {
    _id: 'room_302',
    roomNumber: '302',
    title: 'Classic Urban Comfort Room',
    type: 'Standard Single',
    pricePerNight: 120,
    capacity: 1,
    bedType: 'Double Bed',
    floor: 3,
    status: 'Available',
    cleaningStatus: 'Clean',
    rating: 4.75,
    reviewsCount: 66,
    amenities: [
      'Quiet Interior Courtyard Exposure',
      'High-Speed Wi-Fi',
      'Work Desk',
      'En-Suite Bathroom with Hairdryer',
      'Coffee & Tea Maker',
      'In-Room Electronic Safe'
    ],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A cozy, impeccably maintained retreat for solo travelers or budget-conscious visitors seeking all the core comforts of HotelPro.'
  },
  {
    _id: 'room_401',
    roomNumber: '401',
    title: 'Lagoon Private Pool Villa',
    type: 'Luxury Villa',
    pricePerNight: 480,
    capacity: 3,
    bedType: 'King Bed + Daybed',
    floor: 4,
    status: 'Maintenance',
    cleaningStatus: 'Dirty',
    rating: 4.96,
    reviewsCount: 22,
    amenities: [
      'Private Heated Plunge Pool',
      'Outdoor Tropical Sun Deck',
      'Open-Air Stone Soaking Tub',
      'Dedicated Villa Host',
      'Floating Breakfast Available',
      'Complimentary Sunset Cocktails'
    ],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An exclusive sanctuary with private plunge pool and tropical sun deck. Designed for romantic retreats and uncompromised privacy.'
  },
  {
    _id: 'room_402',
    roomNumber: '402',
    title: 'Panoramic Deluxe King Room',
    type: 'Deluxe Double',
    pricePerNight: 195,
    capacity: 2,
    bedType: 'King Bed',
    floor: 4,
    status: 'Available',
    cleaningStatus: 'Clean',
    rating: 4.89,
    reviewsCount: 47,
    amenities: [
      'Corner Room with Floor-to-Ceiling Windows',
      'Pillow Menu Selection',
      'Smart Climate Control',
      '55" 4K Smart TV with Netflix',
      'Marble Bathroom with Rain Shower'
    ],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Expansive corner layout boasting natural light throughout the day. Premium Egyptian cotton bedding and automated ambient mood lighting.'
  }
];

const now = new Date();
const formatDate = (daysOffset) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const defaultBookings = [
  {
    _id: 'bk_9011',
    bookingCode: 'HP-9011',
    user: 'usr_guest_003',
    guestName: 'Sarah Jenkins',
    guestEmail: 'guest@hotelpro.com',
    guestPhone: '+1 (555) 018-4492',
    room: 'room_102',
    checkInDate: formatDate(-1),
    checkOutDate: formatDate(3),
    nights: 4,
    guestsCount: 2,
    totalAmount: 960,
    status: 'Checked-in',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    specialRequests: 'High floor preferred, late check-out requested at 1 PM.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'bk_9012',
    bookingCode: 'HP-9012',
    user: 'usr_guest_004',
    guestName: 'Marcus Chen',
    guestEmail: 'marcus.chen@example.com',
    guestPhone: '+1 (555) 012-9938',
    room: 'room_101',
    checkInDate: formatDate(2),
    checkOutDate: formatDate(5),
    nights: 3,
    guestsCount: 2,
    totalAmount: 855,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    specialRequests: 'Anniversary celebration. Complimentary wine appreciated.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: 'bk_9013',
    bookingCode: 'HP-9013',
    user: 'usr_guest_005',
    guestName: 'Olivia Martinez',
    guestEmail: 'olivia.m@example.com',
    guestPhone: '+1 (555) 017-3849',
    room: 'room_201',
    checkInDate: formatDate(-4),
    checkOutDate: formatDate(-1),
    nights: 3,
    guestsCount: 4,
    totalAmount: 1650,
    status: 'Checked-out',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    specialRequests: 'VIP airport limousine pickup arranged.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    _id: 'bk_9014',
    bookingCode: 'HP-9014',
    user: 'usr_guest_003',
    guestName: 'Sarah Jenkins',
    guestEmail: 'guest@hotelpro.com',
    guestPhone: '+1 (555) 018-4492',
    room: 'room_202',
    checkInDate: formatDate(7),
    checkOutDate: formatDate(10),
    nights: 3,
    guestsCount: 2,
    totalAmount: 495,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'Debit Card',
    specialRequests: 'Quiet room near garden.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const defaultPayments = [
  {
    _id: 'pay_001',
    transactionId: 'TXN-9011-8842',
    booking: 'bk_9011',
    bookingCode: 'HP-9011',
    user: 'usr_guest_003',
    guestName: 'Sarah Jenkins',
    amount: 960,
    currency: 'USD',
    method: 'Credit Card',
    status: 'Success',
    invoiceNumber: 'INV-2026-0041',
    breakdown: {
      roomCharges: 840,
      taxes: 96,
      serviceFee: 24,
      total: 960
    },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'pay_002',
    transactionId: 'TXN-9012-7719',
    booking: 'bk_9012',
    bookingCode: 'HP-9012',
    user: 'usr_guest_004',
    guestName: 'Marcus Chen',
    amount: 855,
    currency: 'USD',
    method: 'UPI',
    status: 'Success',
    invoiceNumber: 'INV-2026-0042',
    breakdown: {
      roomCharges: 750,
      taxes: 85,
      serviceFee: 20,
      total: 855
    },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: 'pay_003',
    transactionId: 'TXN-9013-1109',
    booking: 'bk_9013',
    bookingCode: 'HP-9013',
    user: 'usr_guest_005',
    guestName: 'Olivia Martinez',
    amount: 1650,
    currency: 'USD',
    method: 'Credit Card',
    status: 'Success',
    invoiceNumber: 'INV-2026-0043',
    breakdown: {
      roomCharges: 1450,
      taxes: 160,
      serviceFee: 40,
      total: 1650
    },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    _id: 'pay_004',
    transactionId: 'TXN-9014-4421',
    booking: 'bk_9014',
    bookingCode: 'HP-9014',
    user: 'usr_guest_003',
    guestName: 'Sarah Jenkins',
    amount: 495,
    currency: 'USD',
    method: 'Debit Card',
    status: 'Success',
    invoiceNumber: 'INV-2026-0044',
    breakdown: {
      roomCharges: 435,
      taxes: 50,
      serviceFee: 10,
      total: 495
    },
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

module.exports = {
  defaultUsers,
  defaultRooms,
  defaultBookings,
  defaultPayments
};


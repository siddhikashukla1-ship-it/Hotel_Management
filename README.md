# 🏨 HotelPro — Enterprise Hotel Management Solution

**HotelPro** is a modern, full-stack hotel management platform designed to streamline operations, reservations, guest CRM, and revenue tracking across boutique properties and large hospitality chains.

Built with **React JSX**, **Node.js**, **Express.js**, **MongoDB / Mongoose**, **JSON Web Tokens (JWT)**, and **Bootstrap 5**, HotelPro provides an intuitive interface, robust role-based access control, real-time availability tracking, and automated housekeeping workflows.

---

## ✨ Key Features

### 1. 🛏️ Room Inventory & Live Availability Tracking
- **Suites & Categories**: Executive Suite, Presidential Penthouse, Deluxe Double, Standard Single, Family Suite, and Luxury Villa.
- **Detailed Specifications**: Room numbering, floor levels, guest capacity, bed arrangement, and luxury amenities.
- **Dynamic Filters**: Search by keyword, price range slider ($100–$600/night), room type pills, and guest count.
- **Live Conflict Detection**: Automatically verifies dates against confirmed bookings to prevent double-booking.

### 2. 📅 Seamless Reservation & Booking Lifecycle
- **Interactive Booking Flow**: Real-time stay duration and transparent price calculation (room charges + 12% hospitality tax + service fees).
- **Multi-Status Workflow**: `Confirmed` ➔ `Checked-in` ➔ `Checked-out` ➔ `Cancelled` (with instant refund simulation).
- **Payment Processing**: Simulates multiple payment methods: Credit Card, Debit Card, UPI, and Pay at Check-in.
- **Digital Tax Invoices**: Automatically generated for each reservation (`INV-YYYY-XXXX`) with full print/download support (`@media print`).

### 3. 🛎️ Front Desk & Operations Dashboard
- **Executive KPIs**: Total Revenue ($), Occupancy Rate (%), Active Bookings, Available Rooms, Today's Check-ins, and Departures.
- **Visual Occupancy Meter**: Progress breakdown of Available vs. Occupied vs. Cleaning vs. Maintenance.
- **1-Click Front Desk Actions**: Express Check-in and Check-out directly from the dashboard and bookings management page.
- **Monthly Revenue Trends**: Track performance across past quarters and current month.

### 4. 🧹 Intelligent Housekeeping Workflow
- **Automated Turnover**: Guest check-out instantly changes room status to `Cleaning` and housekeeping status to `Dirty`.
- **Status Lifecycle**: `Dirty` ➔ `In Progress` ➔ `Inspected` ➔ `Clean`.
- **Auto-Availability**: Marking a room as `Clean` or `Inspected` automatically makes it `Available` for incoming guests.

### 5. 👥 Guest CRM & Loyalty (VIP Tiers)
- **Guest Profiles**: Verified contact details, phone numbers, addresses, and government ID / passport numbers.
- **Loyalty Program**: Tiered membership badges (`Standard`, `Silver`, `Gold`, `Platinum`) with custom tier perks.
- **Lifetime Stay History**: Aggregated total stays, lifetime spend, and past booking history.

### 6. 🔐 Secure JWT Authentication & Role-Based Access Control (RBAC)
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **Token Verification**: Stateless JSON Web Tokens (JWT) verified on all protected API routes.
- **Roles**:
  - `admin`: Full property access (Analytics, Room CRUD, Reservations, Staff & Guest CRM, VIP upgrades).
  - `staff`: Front Desk operations (Dashboard, Check-in/Check-out, Room cleaning status, Guest CRM).
  - `guest`: Customer portal (Browse suites, Book rooms, View My Bookings, Digital Invoices, Profile).

---

## 🚀 Pre-Configured Demo Accounts (1-Click Switcher)

HotelPro includes a built-in **Quick Demo Switcher Bar** at the top of the interface for instantaneous testing across roles:

| Role | Name | Email | Password | Access Level |
|---|---|---|---|---|
| **Admin** | Alexander Wright | `admin@hotelpro.com` | `admin123` | General Manager (Full Access) |
| **Staff** | Elena Rostova | `staff@hotelpro.com` | `staff123` | Front Desk & Operations |
| **Guest** | Sarah Jenkins | `guest@hotelpro.com` | `guest123` | VIP Platinum Customer |

---

## 🛠️ Technology Stack

- **Frontend**:
  - **React 18** (Functional components, Hooks, Context API)
  - **React Router v6** (Multi-page client-side navigation with protected route guards)
  - **Bootstrap 5** & **Bootstrap Icons** (Clean, responsive layout & components)
  - **Modern CSS3** (Custom luxury hospitality color palette: Deep Navy `#0b132b` & Warm Gold `#c5a059`)
  - **Vite** (Ultra-fast build and development server)
- **Backend**:
  - **Node.js** & **Express.js** (Modular RESTful API architecture)
  - **JSON Web Token (JWT)** & **bcryptjs** (Stateless authentication & authorization)
  - **MongoDB / Mongoose**:
    - **Dual-Mode Engine**: Connects seamlessly to MongoDB (`mongodb://127.0.0.1:27017/hotelpro`). If MongoDB is not running locally, it activates an embedded in-memory persistence store pre-seeded with rich data, ensuring **100% zero-configuration plug-and-play capability**!

---

## 📂 Project Architecture

```
hotelpro/
├── server/
│   ├── config/
│   │   ├── db.js                 # Dual-mode DB connection (MongoDB + zero-friction fallback)
│   │   └── memoryStore.js        # Embedded in-memory store with JSON persistence
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, JWT issuance, profile
│   │   ├── roomController.js     # Room inventory CRUD, filters, date availability
│   │   ├── bookingController.js  # Reservation lifecycle, check-in, check-out, cancel
│   │   ├── guestController.js    # Guest CRM, VIP loyalty tier management, stay history
│   │   ├── paymentController.js  # Multi-method payment simulation & tax invoicing
│   │   └── dashboardController.js# Operational analytics, KPI metrics, occupancy rates
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role-based route protection
│   ├── models/
│   │   ├── User.js               # User & Guest schema
│   │   ├── Room.js               # Room & Suite inventory schema
│   │   ├── Booking.js            # Reservation schema
│   │   └── Payment.js            # Transaction & tax invoice schema
│   ├── routes/                   # Modular Express routers
│   ├── seed/
│   │   └── defaultData.js        # Pre-populated realistic hospitality seed data
│   ├── package.json
│   └── server.js                 # Server entry point
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation with role-based links & profile badge
│   │   │   ├── Footer.jsx        # Hospitality footer with contacts & resort info
│   │   │   ├── QuickLoginPills.jsx # 1-Click instant demo role switcher
│   │   │   ├── ProtectedRoute.jsx# Role authorization route guard
│   │   │   ├── RoomCard.jsx      # High-res room card with live status & specs
│   │   │   ├── BookingModal.jsx  # Interactive booking modal with live pricing
│   │   │   └── InvoiceModal.jsx  # Print-ready digital tax invoice
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global JWT authentication & user state
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero, live search bar, KPIs, featured suites
│   │   │   ├── Rooms.jsx         # Catalog with price slider, status & type filters
│   │   │   ├── RoomDetails.jsx   # Photo gallery, specs, amenities, direct booking
│   │   │   ├── Dashboard.jsx     # Front desk & managerial analytics command center
│   │   │   ├── ManageBookings.jsx# Complete reservation desk with check-in/out
│   │   │   ├── ManageRooms.jsx   # Room inventory control & housekeeping dispatch
│   │   │   ├── ManageGuests.jsx  # Guest CRM, VIP tier management & stay history
│   │   │   ├── MyBookings.jsx    # Guest portal to review stays & view receipts
│   │   │   ├── Login.jsx         # JWT login with instant demo credentials
│   │   │   ├── Register.jsx      # Guest registration form with ID verification
│   │   │   └── Profile.jsx       # Personal profile & VIP membership perks
│   │   ├── services/
│   │   │   └── api.js            # Centralized API service with JWT injection
│   │   ├── App.jsx               # Application layout & route definition
│   │   ├── index.css             # Custom luxury design system & Bootstrap import
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── run-dev.js                    # Cross-platform concurrent runner
├── package.json                  # Root project scripts
└── README.md
```

---

## 🏃 Quick Start Guide

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(Dependencies are already installed and verified).*

### 2. Start the Full Application
```bash
npm run dev
```
This concurrently starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

### 3. Alternative Individual Startup
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 4. Build for Production
```bash
npm run build
```

---

## 📡 RESTful API Endpoints Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new guest | Public |
| `POST` | `/api/auth/login` | Authenticate & retrieve JWT | Public |
| `GET` | `/api/auth/me` | Current authenticated user profile | Authenticated |
| `GET` | `/api/rooms` | Query rooms with filters (type, status, price, dates) | Public |
| `GET` | `/api/rooms/:id` | Room details & amenities | Public |
| `POST` | `/api/rooms` | Create new room | Admin |
| `PUT` | `/api/rooms/:id` | Update room specs / status | Admin / Staff |
| `DELETE` | `/api/rooms/:id` | Delete room from inventory | Admin |
| `PATCH` | `/api/rooms/:id/housekeeping` | Update cleaning status | Admin / Staff |
| `POST` | `/api/bookings` | Create new reservation & invoice | Public / Guest |
| `GET` | `/api/bookings` | View all reservations | Admin / Staff |
| `GET` | `/api/bookings/my` | View personal reservations | Authenticated |
| `POST` | `/api/bookings/:id/check-in` | Check in guest & occupy room | Admin / Staff |
| `POST` | `/api/bookings/:id/check-out` | Check out guest & dispatch cleaning | Admin / Staff |
| `POST` | `/api/bookings/:id/cancel` | Cancel reservation & refund | Authenticated |
| `GET` | `/api/guests` | Guest CRM directory & VIP status | Admin / Staff |
| `PATCH` | `/api/guests/:id/vip` | Update guest loyalty tier | Admin |
| `GET` | `/api/dashboard/analytics` | KPIs, occupancy rates, revenue trends | Admin / Staff |
| `GET` | `/api/payments/invoice/:invoiceNumber` | Fetch itemized tax invoice | Public / Guest |


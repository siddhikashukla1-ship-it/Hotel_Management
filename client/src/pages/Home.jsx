import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import InvoiceModal from '../components/InvoiceModal';

export default function Home() {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [confirmedInvoice, setConfirmedInvoice] = useState(null);

  // Search widget state
  const [searchParams, setSearchParams] = useState({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    guests: '2',
    type: 'All'
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.getRooms();
        if (res.success && res.rooms) {
          // Take top 3 or 4 rooms
          setFeaturedRooms(res.rooms.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured rooms:', err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      capacity: searchParams.guests,
      type: searchParams.type !== 'All' ? searchParams.type : ''
    });
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-hospitality">
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <span className="badge px-3 py-2 rounded-pill mb-3" style={{ backgroundColor: 'rgba(197, 160, 89, 0.25)', color: '#f6eedb', border: '1px solid #c5a059' }}>
                <i className="bi bi-stars me-1 text-warning"></i> Award-Winning Hospitality Management Platform
              </span>
              <h1 className="display-4 font-serif fw-bold mb-3 text-white">
                Elevating Hotel Operations & Guest Experiences
              </h1>
              <p className="lead text-light opacity-90 mx-auto mb-4" style={{ maxWidth: '780px' }}>
                HotelPro delivers an all-in-one hospitality ecosystem powering real-time room inventory,
                streamlined reservations, secure JWT role authentication, automated housekeeping, and transparent billing.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/rooms" className="btn btn-gold btn-lg rounded-pill px-4 shadow">
                  <i className="bi bi-compass me-2"></i> Explore Accommodations
                </Link>
                <Link to="/dashboard" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  <i className="bi bi-speedometer2 me-2"></i> Operational Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <div className="container">
        <div className="search-box-floating">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-calendar-check me-1 text-warning"></i> Check-in Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg fs-6"
                  value={searchParams.checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-calendar-x me-1 text-warning"></i> Check-out Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg fs-6"
                  value={searchParams.checkOut}
                  min={searchParams.checkIn}
                  onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-people me-1 text-warning"></i> Guests
                </label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({ ...searchParams, guests: e.target.value })}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label small fw-bold text-muted">
                  <i className="bi bi-house-door me-1 text-warning"></i> Suite Type
                </label>
                <select
                  className="form-select form-select-lg fs-6"
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                >
                  <option value="All">All Categories</option>
                  <option value="Standard Single">Standard Single</option>
                  <option value="Deluxe Double">Deluxe Double</option>
                  <option value="Executive Suite">Executive Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                  <option value="Luxury Villa">Luxury Villa</option>
                </select>
              </div>

              <div className="col-md-2">
                <button type="submit" className="btn btn-gold btn-lg w-100 rounded-3 fw-bold">
                  <i className="bi bi-search me-1"></i> Check Rooms
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* KPI Stats Counter */}
      <section className="py-5 bg-white border-bottom mt-4">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold font-serif text-dark mb-1">98.4%</h2>
              <p className="text-muted small text-uppercase mb-0 fw-semibold">Guest Satisfaction</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold font-serif mb-1" style={{ color: '#c5a059' }}>120+</h2>
              <p className="text-muted small text-uppercase mb-0 fw-semibold">Boutique & Luxury Suites</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold font-serif text-dark mb-1">24/7</h2>
              <p className="text-muted small text-uppercase mb-0 fw-semibold">Concierge & Front Desk</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-5 fw-bold font-serif text-success mb-1">0%</h2>
              <p className="text-muted small text-uppercase mb-0 fw-semibold">Double-Booking Conflict</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suites Showcase */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="text-muted text-uppercase small fw-bold" style={{ letterSpacing: '1px' }}>
                Handpicked Living Spaces
              </span>
              <h2 className="font-serif fw-bold text-dark mt-1">Featured Suites & Accommodations</h2>
            </div>
            <Link to="/rooms" className="btn btn-outline-navy rounded-pill px-4">
              View All Suites <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loadingRooms ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading suites...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredRooms.map(room => (
                <div key={room._id} className="col-lg-3 col-md-6">
                  <RoomCard room={room} onBook={(r) => setSelectedRoomForBooking(r)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-5">
            <span className="badge bg-warning text-dark text-uppercase fw-bold px-3 py-1 mb-2">
              Full Hospitality Ecosystem
            </span>
            <h2 className="font-serif fw-bold text-dark">Engineered for Operational Excellence</h2>
            <p className="text-muted">
              Built on Node.js, Express, MongoDB, and React, HotelPro delivers enterprise-grade scalability,
              security, and automated workflows.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '54px', height: '54px', backgroundColor: '#f6eedb', color: '#c5a059' }}
                >
                  <i className="bi bi-calendar2-range fs-4"></i>
                </div>
                <h5 className="fw-bold font-serif mb-2">Real-Time Availability</h5>
                <p className="text-muted small">
                  Prevents overbooking with atomic reservation validation and instant room status synchronizations
                  across multiple front desk channels.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '54px', height: '54px', backgroundColor: '#e0f2fe', color: '#0284c7' }}
                >
                  <i className="bi bi-shield-check fs-4"></i>
                </div>
                <h5 className="fw-bold font-serif mb-2">Robust JWT & RBAC Security</h5>
                <p className="text-muted small">
                  Role-based permissions separate Admin, Staff, and Guest views. Password hashing with bcrypt
                  and secure token headers protect every API endpoint.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '54px', height: '54px', backgroundColor: '#dcfce7', color: '#16a34a' }}
                >
                  <i className="bi bi-sparkles fs-4"></i>
                </div>
                <h5 className="fw-bold font-serif mb-2">Automated Housekeeping</h5>
                <p className="text-muted small">
                  Check-outs automatically trigger room cleaning status transitions (Dirty → In Progress → Inspected)
                  ensuring seamless turnover for front-desk staff.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '54px', height: '54px', backgroundColor: '#fef3c7', color: '#d97706' }}
                >
                  <i className="bi bi-receipt-cutoff fs-4"></i>
                </div>
                <h5 className="fw-bold font-serif mb-2">Transparent Invoicing</h5>
                <p className="text-muted small">
                  Instant tax breakdown (GST/Hospitality tax, service charges), simulated multi-method payment
                  processing (Card, UPI, Cash), and print-ready receipts.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '54px', height: '54px', backgroundColor: '#ede9fe', color: '#7c3aed' }}
                >
                  <i className="bi bi-person-heart fs-4"></i>
                </div>
                <h5 className="fw-bold font-serif mb-2">Guest CRM & VIP Tiers</h5>
                <p className="text-muted small">
                  Track guest history, lifetime value, and loyalty tiers (Silver, Gold, Platinum) with custom
                  preferences, notes, and government ID verification.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '54px', height: '54px', backgroundColor: '#ffe4e6', color: '#e11d48' }}
                >
                  <i className="bi bi-graph-up-arrow fs-4"></i>
                </div>
                <h5 className="fw-bold font-serif mb-2">Hospitality Analytics</h5>
                <p className="text-muted small">
                  Live occupancy gauges, room category distribution, today's arrivals & departures, and revenue
                  metrics provide complete managerial oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Experience Amenities */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <span className="text-muted text-uppercase small fw-bold" style={{ letterSpacing: '1px' }}>
                Resort Amenities
              </span>
              <h2 className="font-serif fw-bold text-dark mt-1 mb-3">
                Curated Luxury for the Modern Discerning Traveler
              </h2>
              <p className="text-muted mb-4">
                Every detail at HotelPro properties is designed to provide memorable stays. From infinity pools
                overlooking azure shorelines to Michelin-inspired gastronomy.
              </p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-water text-primary fs-4"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Heated Infinity Pool</h6>
                      <small className="text-muted">Panoramic skyline views</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-cup-hot text-warning fs-4"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Gourmet Dining</h6>
                      <small className="text-muted">Sommelier & Michelin chefs</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-flower1 text-success fs-4"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Holistic Spa & Sauna</h6>
                      <small className="text-muted">Ayurvedic treatments</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-wifi text-info fs-4"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">Wi-Fi 6 Across Property</h6>
                      <small className="text-muted">Uninterrupted connectivity</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80"
                    alt="Resort Pool"
                    className="img-fluid rounded-4 shadow-sm h-100 object-fit-cover"
                    style={{ minHeight: '220px' }}
                  />
                </div>
                <div className="col-6">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                    alt="Spa Villa"
                    className="img-fluid rounded-4 shadow-sm h-100 object-fit-cover"
                    style={{ minHeight: '220px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          isOpen={!!selectedRoomForBooking}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingSuccess={(res) => {
            setConfirmedInvoice(res.invoice || res.booking);
          }}
        />
      )}

      {/* Invoice Modal */}
      {confirmedInvoice && (
        <InvoiceModal
          invoiceData={confirmedInvoice}
          isOpen={!!confirmedInvoice}
          onClose={() => setConfirmedInvoice(null)}
        />
      )}
    </div>
  );
}


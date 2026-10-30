import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import InvoiceModal from '../components/InvoiceModal';

export default function Rooms() {
  const [searchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirmedInvoice, setConfirmedInvoice] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [maxPrice, setMaxPrice] = useState(600);
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');

  const roomTypes = [
    'All',
    'Executive Suite',
    'Presidential Suite',
    'Deluxe Double',
    'Standard Single',
    'Family Suite',
    'Luxury Villa'
  ];

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedType !== 'All') params.type = selectedType;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (maxPrice < 600) params.maxPrice = maxPrice;
      if (capacity) params.capacity = capacity;
      if (checkIn) params.checkIn = checkIn;
      if (checkOut) params.checkOut = checkOut;

      const res = await api.getRooms(params);
      if (res.success) {
        setRooms(res.rooms);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedType, selectedStatus, maxPrice, capacity, checkIn, checkOut]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('All');
    setSelectedStatus('All');
    setMaxPrice(600);
    setCapacity('');
    setCheckIn('');
    setCheckOut('');
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Title */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark text-uppercase fw-bold px-3 py-1 mb-2">
            Rooms & Suites Catalog
          </span>
          <h1 className="font-serif fw-bold text-dark display-5">Find Your Ideal Accommodation</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Browse through our luxury collection with real-time occupancy status, flexible date availability,
            and tailored amenities.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by suite title, room number (e.g. 101, 201), or amenity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-navy px-4">
                Search
              </button>
            </div>
          </form>

          {/* Type Pills */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {roomTypes.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`btn btn-sm rounded-pill px-3 ${selectedType === type ? 'btn-gold fw-bold' : 'btn-outline-secondary'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Advanced Filter Row */}
          <div className="row g-3 pt-3 border-top align-items-center">
            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">Status Filter</label>
              <select
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Room Statuses</option>
                <option value="Available">Available Only</option>
                <option value="Occupied">Currently Occupied</option>
                <option value="Cleaning">Cleaning / Housekeeping</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">
                Max Price: <strong className="text-dark">${maxPrice} / night</strong>
              </label>
              <input
                type="range"
                className="form-range"
                min="100"
                max="600"
                step="25"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label small text-muted fw-semibold">Guests</label>
              <select
                className="form-select form-select-sm"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              >
                <option value="">Any Capacity</option>
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div className="col-md-4 d-flex justify-content-end align-items-end gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted small">
            Showing <strong>{rooms.length}</strong> luxury accommodations
          </span>
          <div className="d-flex gap-2">
            <span className="badge badge-available">● Available</span>
            <span className="badge badge-occupied">● Occupied</span>
            <span className="badge badge-cleaning">● Cleaning</span>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading accommodations...</span>
            </div>
            <p className="mt-2 text-muted small">Querying HotelPro room inventories...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4">
            <div className="text-muted mb-3">
              <i className="bi bi-door-closed fs-1"></i>
            </div>
            <h4 className="fw-bold">No Rooms Match Your Criteria</h4>
            <p className="text-muted small mb-3">
              Try adjusting your search terms, changing the price range, or selecting another room category.
            </p>
            <div>
              <button onClick={handleResetFilters} className="btn btn-gold rounded-pill px-4">
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map(room => (
              <div key={room._id} className="col-lg-4 col-md-6">
                <RoomCard room={room} onBook={(r) => setSelectedRoom(r)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBookingSuccess={(res) => {
            setConfirmedInvoice(res.invoice || res.booking);
            fetchRooms(); // refresh room states
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


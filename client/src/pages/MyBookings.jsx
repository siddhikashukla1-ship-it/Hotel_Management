import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InvoiceModal from '../components/InvoiceModal';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const res = await api.getMyBookings();
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (bookingId, bookingCode) => {
    if (!window.confirm(`Are you sure you want to cancel reservation ${bookingCode}? Full refund will be credited.`)) return;
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        setMessage(`✓ Reservation ${bookingCode} has been cancelled and refunded.`);
        fetchMyBookings();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Cancellation failed');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-dark text-warning text-uppercase px-3 py-1 mb-1">
              Guest Portal
            </span>
            <h2 className="font-serif fw-bold text-dark mb-0">My Reservations</h2>
            <small className="text-muted">Welcome back, {user?.name}. Manage your suite reservations and invoices.</small>
          </div>

          <Link to="/rooms" className="btn btn-gold btn-sm rounded-pill px-4 mt-2 mt-sm-0 fw-bold">
            <i className="bi bi-plus-lg me-1"></i> Book Another Suite
          </Link>
        </div>

        {/* Alerts */}
        {message && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm mb-4">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
            <p className="mt-2 text-muted small">Retrieving your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-4 bg-white">
            <i className="bi bi-calendar2-heart fs-1 text-muted mb-2"></i>
            <h4 className="fw-bold">No Active Reservations</h4>
            <p className="text-muted small mb-4">
              You haven't reserved any accommodations with HotelPro yet.
            </p>
            <div>
              <Link to="/rooms" className="btn btn-navy rounded-pill px-4">
                Explore Available Suites
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {bookings.map((b) => (
              <div key={b._id} className="col-lg-6">
                <div className="card hotel-card border-0 rounded-4 overflow-hidden h-100 p-0 shadow-sm">
                  <div className="row g-0 h-100">
                    <div className="col-sm-5 position-relative">
                      <img
                        src={
                          b.room?.images && b.room.images[0]
                            ? b.room.images[0]
                            : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
                        }
                        alt=""
                        className="w-100 h-100 object-fit-cover"
                        style={{ minHeight: '180px' }}
                      />
                      <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-pill px-2 py-1 text-white small">
                        Room #{b.room?.roomNumber || '101'}
                      </span>
                    </div>

                    <div className="col-sm-7 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="font-monospace fw-bold text-primary small">{b.bookingCode}</span>
                          <span className={`badge rounded-pill px-2 py-1 ${b.status === 'Checked-in' ? 'bg-success' : b.status === 'Confirmed' ? 'bg-primary' : b.status === 'Checked-out' ? 'bg-secondary' : 'bg-danger'}`}>
                            {b.status}
                          </span>
                        </div>

                        <h5 className="font-serif fw-bold text-dark mb-2">
                          {b.room?.title || 'Deluxe Suite'}
                        </h5>

                        <div className="small text-muted mb-2">
                          <div><i className="bi bi-calendar-event me-1"></i> {b.checkInDate} → {b.checkOutDate}</div>
                          <div><i className="bi bi-moon-stars me-1"></i> {b.nights} Night(s) • {b.guestsCount || 1} Guests</div>
                        </div>

                        <div className="fw-bold fs-5 font-serif text-dark mb-3">
                          ${b.totalAmount} <span className="badge bg-success-subtle text-success small">{b.paymentStatus}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2 border-top pt-3">
                        <button
                          onClick={() => setActiveInvoice(b)}
                          className="btn btn-outline-secondary btn-sm rounded-pill flex-grow-1"
                        >
                          <i className="bi bi-receipt me-1"></i> View Invoice
                        </button>

                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleCancel(b._id, b.bookingCode)}
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            title="Cancel Stay"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {activeInvoice && (
        <InvoiceModal
          invoiceData={activeInvoice}
          isOpen={!!activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
}


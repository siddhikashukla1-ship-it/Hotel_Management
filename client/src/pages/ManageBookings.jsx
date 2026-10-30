import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.getBookings(params);
      if (res.success) {
        setBookings(res.bookings);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleCheckIn = async (bookingId, guestName) => {
    try {
      const res = await api.checkInGuest(bookingId);
      if (res.success) {
        setMessage(`✓ Guest ${guestName} successfully checked in.`);
        fetchBookings();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (bookingId, guestName) => {
    try {
      const res = await api.checkOutGuest(bookingId);
      if (res.success) {
        setMessage(`✓ Guest ${guestName} checked out. Room dispatched for cleaning.`);
        fetchBookings();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Check-out failed');
    }
  };

  const handleCancelBooking = async (bookingId, bookingCode) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingCode}?`)) return;
    try {
      const res = await api.cancelBooking(bookingId);
      if (res.success) {
        setMessage(`✓ Booking ${bookingCode} cancelled and marked refunded.`);
        fetchBookings();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Cancellation failed');
    }
  };

  const statusBadges = {
    'Confirmed': 'bg-primary text-white',
    'Checked-in': 'bg-success text-white',
    'Checked-out': 'bg-secondary text-white',
    'Cancelled': 'bg-danger text-white',
    'Pending': 'bg-warning text-dark'
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Title & Stats */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-dark text-warning text-uppercase px-3 py-1 mb-1">
              Front Desk Desk
            </span>
            <h2 className="font-serif fw-bold text-dark mb-0">Reservation Management</h2>
            <small className="text-muted">Manage guest stays, arrivals, check-outs, and invoices</small>
          </div>

          <button onClick={fetchBookings} className="btn btn-outline-secondary btn-sm rounded-pill px-3 mt-2 mt-sm-0">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh List
          </button>
        </div>

        {/* Notifications */}
        {message && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card shadow-sm border-0 rounded-4 p-4 bg-white mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <form onSubmit={handleSearchSubmit}>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by Booking Ref (e.g. HP-9011), Guest Name, or Email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-navy">
                    Filter
                  </button>
                </div>
              </form>
            </div>

            <div className="col-md-6">
              <div className="d-flex flex-wrap justify-content-md-end gap-2">
                {['All', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`btn btn-sm rounded-pill px-3 ${statusFilter === st ? 'btn-gold fw-bold' : 'btn-outline-secondary'}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <h6 className="fw-bold mb-0 text-dark">
              Total Reservations: <span className="text-primary">{bookings.length}</span>
            </h6>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
              <p className="mt-2 text-muted small">Loading reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x fs-1 text-muted"></i>
              <h5 className="mt-2 text-muted">No reservations found</h5>
              <p className="small text-muted">Try changing the status filter or search query.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Booking Ref</th>
                    <th>Guest Information</th>
                    <th>Suite / Room</th>
                    <th>Dates & Duration</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Front Desk Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="ps-4 font-monospace fw-bold text-primary">
                        {b.bookingCode}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{b.guestName}</div>
                        <div className="text-muted">{b.guestEmail}</div>
                        {b.guestPhone && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.guestPhone}</div>}
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{b.room?.title || 'Suite'}</div>
                        <span className="badge bg-dark bg-opacity-75 text-white">
                          Room #{b.room?.roomNumber || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div><strong>In:</strong> {b.checkInDate}</div>
                        <div><strong>Out:</strong> {b.checkOutDate}</div>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>({b.nights} Nights)</span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">${b.totalAmount}</div>
                        <span className={`badge ${b.paymentStatus === 'Paid' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning-emphasis border border-warning'}`}>
                          {b.paymentStatus} • {b.paymentMethod}
                        </span>
                      </td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-1 ${statusBadges[b.status] || 'bg-secondary'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          {b.status === 'Confirmed' && (
                            <button
                              onClick={() => handleCheckIn(b._id, b.guestName)}
                              className="btn btn-outline-success"
                              title="Check In Guest"
                            >
                              <i className="bi bi-box-arrow-in-right me-1"></i> Check In
                            </button>
                          )}
                          {b.status === 'Checked-in' && (
                            <button
                              onClick={() => handleCheckOut(b._id, b.guestName)}
                              className="btn btn-outline-danger"
                              title="Check Out Guest"
                            >
                              <i className="bi bi-box-arrow-right me-1"></i> Check Out
                            </button>
                          )}
                          <button
                            onClick={() => setActiveInvoice(b)}
                            className="btn btn-outline-secondary"
                            title="View / Print Tax Invoice"
                          >
                            <i className="bi bi-receipt"></i>
                          </button>
                          {b.status !== 'Cancelled' && b.status !== 'Checked-out' && (
                            <button
                              onClick={() => handleCancelBooking(b._id, b.bookingCode)}
                              className="btn btn-outline-danger"
                              title="Cancel Reservation"
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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


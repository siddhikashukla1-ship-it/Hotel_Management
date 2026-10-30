import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ManageGuests() {
  const { isAdmin } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestBookings, setGuestBookings] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await api.getGuests();
      if (res.success) {
        setGuests(res.guests);
      }
    } catch (err) {
      console.error('Failed to load guests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleUpdateVip = async (guestId, newTier) => {
    try {
      const res = await api.updateGuestVip(guestId, newTier);
      if (res.success) {
        setMessage(`✓ VIP Tier updated to ${newTier}`);
        fetchGuests();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'VIP update failed');
    }
  };

  const handleViewHistory = async (guest) => {
    setSelectedGuest(guest);
    setLoadingHistory(true);
    try {
      const res = await api.getGuest(guest.id || guest._id);
      if (res.success) {
        setGuestBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-dark text-warning text-uppercase px-3 py-1 mb-1">
              Guest Experience & Loyalty
            </span>
            <h2 className="font-serif fw-bold text-dark mb-0">Guest Profiles & CRM</h2>
            <small className="text-muted">Manage VIP tiers, stay frequencies, verified identity, and guest lifetime value</small>
          </div>

          <button onClick={fetchGuests} className="btn btn-outline-secondary btn-sm rounded-pill px-3 mt-2 mt-sm-0">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>

        {/* Feedback message */}
        {message && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Guests Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white mb-4">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <h6 className="fw-bold mb-0 text-dark">
              Registered Guests: <span className="text-primary">{guests.length} Profiles</span>
            </h6>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Guest</th>
                    <th>Contact & Identity</th>
                    <th>Loyalty / VIP Tier</th>
                    <th className="text-center">Total Stays</th>
                    <th>Lifetime Spend</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {guests.map((g) => (
                    <tr key={g.id || g._id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle bg-dark text-warning d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '38px', height: '38px' }}
                          >
                            {g.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{g.name}</div>
                            <div className="text-muted">{g.address || 'Address on file'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div><i className="bi bi-envelope me-1 text-muted"></i> {g.email}</div>
                        <div><i className="bi bi-telephone me-1 text-muted"></i> {g.phone || 'N/A'}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          ID: {g.governmentId || 'Verified Passport/DL'}
                        </div>
                      </td>
                      <td>
                        {isAdmin ? (
                          <select
                            className={`form-select form-select-sm fw-bold ${g.vipTier === 'Platinum' ? 'badge-vip-platinum' : g.vipTier === 'Gold' ? 'badge-vip-gold' : 'badge-vip-silver'}`}
                            style={{ maxWidth: '140px' }}
                            value={g.vipTier}
                            onChange={(e) => handleUpdateVip(g.id || g._id, e.target.value)}
                          >
                            <option value="Standard">Standard</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                          </select>
                        ) : (
                          <span className={`badge px-3 py-1 ${g.vipTier === 'Platinum' ? 'badge-vip-platinum' : g.vipTier === 'Gold' ? 'badge-vip-gold' : 'badge-vip-silver'}`}>
                            {g.vipTier} Member
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark border fs-6 px-3 py-1">
                          {g.totalStays}
                        </span>
                      </td>
                      <td>
                        <strong className="fs-6 text-dark font-serif">${g.totalSpend.toLocaleString()}</strong>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          onClick={() => handleViewHistory(g)}
                          className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        >
                          <i className="bi bi-clock-history me-1"></i> Stay History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Guest History Modal */}
        {selectedGuest && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(11, 19, 43, 0.75)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header bg-dark text-white p-4">
                  <div>
                    <h5 className="modal-title font-serif fw-bold text-white mb-0">
                      Stay History: {selectedGuest.name}
                    </h5>
                    <small className="text-warning">{selectedGuest.vipTier} Member • {selectedGuest.email}</small>
                  </div>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedGuest(null)}></button>
                </div>

                <div className="modal-body p-4">
                  {loadingHistory ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-warning" role="status"></div>
                    </div>
                  ) : guestBookings.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      No reservations recorded for this guest profile yet.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle small mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Ref #</th>
                            <th>Suite</th>
                            <th>Stay Dates</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {guestBookings.map(b => (
                            <tr key={b._id}>
                              <td className="font-monospace fw-bold text-primary">{b.bookingCode}</td>
                              <td>{b.room?.title || 'Suite'}</td>
                              <td>{b.checkInDate} to {b.checkOutDate}</td>
                              <td className="fw-bold">${b.totalAmount}</td>
                              <td>
                                <span className={`badge ${b.status === 'Checked-in' ? 'bg-success' : b.status === 'Checked-out' ? 'bg-secondary' : 'bg-primary'}`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-navy rounded-pill px-4" onClick={() => setSelectedGuest(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


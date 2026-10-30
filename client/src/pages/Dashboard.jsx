import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchAnalytics = async () => {
    try {
      const res = await api.getAnalytics();
      if (res.success && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load operational analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleQuickCheckIn = async (bookingId, guestName) => {
    try {
      const res = await api.checkInGuest(bookingId);
      if (res.success) {
        setActionMessage(`✓ ${guestName} checked in successfully!`);
        fetchAnalytics();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Check-in failed');
    }
  };

  const handleQuickCheckOut = async (bookingId, guestName) => {
    try {
      const res = await api.checkOutGuest(bookingId);
      if (res.success) {
        setActionMessage(`✓ ${guestName} checked out. Room dispatched for cleaning!`);
        fetchAnalytics();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Check-out failed');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading Analytics...</span>
        </div>
        <p className="mt-2 text-muted small">Aggregating hotel operational metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>
          {error}
        </div>
      </div>
    );
  }

  const { kpi, roomStatusBreakdown, housekeepingBreakdown, revenueByMonth, recentBookings } = analytics;

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-dark text-warning text-uppercase px-3 py-1 mb-1">
              Command Center
            </span>
            <h2 className="font-serif fw-bold text-dark mb-0">Hotel Operations & Analytics</h2>
            <small className="text-muted">Real-time property performance, occupancy, and guest turnover</small>
          </div>

          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button onClick={fetchAnalytics} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
            <Link to="/manage-bookings" className="btn btn-navy btn-sm rounded-pill px-3">
              <i className="bi bi-calendar-check me-1"></i> All Bookings
            </Link>
            <Link to="/manage-rooms" className="btn btn-gold btn-sm rounded-pill px-3">
              <i className="bi bi-grid-3x3 me-1"></i> Room Inventory
            </Link>
          </div>
        </div>

        {/* Action feedback banner */}
        {actionMessage && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {actionMessage}
            <button type="button" className="btn-close" onClick={() => setActionMessage('')}></button>
          </div>
        )}

        {/* 6 Key KPI Cards */}
        <div className="row g-3 mb-4">
          {/* Total Revenue */}
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold">Total Revenue</span>
                <div className="badge bg-success-subtle text-success rounded-circle p-2">
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </div>
              <h4 className="fw-bold font-serif mb-0 text-dark">${kpi.totalRevenue.toLocaleString()}</h4>
              <small className="text-success small">
                <i className="bi bi-arrow-up-right me-1"></i> +14.2% MoM
              </small>
            </div>
          </div>

          {/* Occupancy Rate */}
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold">Occupancy</span>
                <div className="badge bg-primary-subtle text-primary rounded-circle p-2">
                  <i className="bi bi-pie-chart"></i>
                </div>
              </div>
              <h4 className="fw-bold font-serif mb-0 text-dark">{kpi.occupancyRate}%</h4>
              <small className="text-muted small">{kpi.occupiedRooms} of {kpi.totalRooms} Rooms</small>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold">Active Stays</span>
                <div className="badge bg-info-subtle text-info rounded-circle p-2">
                  <i className="bi bi-calendar2-heart"></i>
                </div>
              </div>
              <h4 className="fw-bold font-serif mb-0 text-dark">{kpi.activeBookings}</h4>
              <small className="text-muted small">Confirmed/Checked-in</small>
            </div>
          </div>

          {/* Available Rooms */}
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold">Available</span>
                <div className="badge bg-warning-subtle text-warning rounded-circle p-2">
                  <i className="bi bi-door-open"></i>
                </div>
              </div>
              <h4 className="fw-bold font-serif mb-0 text-dark">{kpi.availableRooms}</h4>
              <small className="text-success small">Ready for Guests</small>
            </div>
          </div>

          {/* Today Check-Ins */}
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold">Arrivals</span>
                <div className="badge bg-purple-subtle text-primary rounded-circle p-2">
                  <i className="bi bi-box-arrow-in-right"></i>
                </div>
              </div>
              <h4 className="fw-bold font-serif mb-0 text-dark">{kpi.todayCheckIns}</h4>
              <small className="text-muted small">Today's Check-ins</small>
            </div>
          </div>

          {/* Today Check-Outs */}
          <div className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 bg-white h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="text-muted small fw-semibold">Departures</span>
                <div className="badge bg-danger-subtle text-danger rounded-circle p-2">
                  <i className="bi bi-box-arrow-right"></i>
                </div>
              </div>
              <h4 className="fw-bold font-serif mb-0 text-dark">{kpi.todayCheckOuts}</h4>
              <small className="text-muted small">Today's Check-outs</small>
            </div>
          </div>
        </div>

        {/* Operational Status Breakdown & Housekeeping */}
        <div className="row g-4 mb-4">
          {/* Room Inventory Status Meter */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="font-serif fw-bold text-dark mb-0">Room Inventory Status</h5>
                <span className="text-muted small">Total: {kpi.totalRooms} Rooms</span>
              </div>

              {/* Progress Bar Stack */}
              <div className="progress mb-4" style={{ height: '24px', borderRadius: '12px' }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${(roomStatusBreakdown.available / kpi.totalRooms) * 100}%` }}
                  title={`Available: ${roomStatusBreakdown.available}`}
                >
                  {roomStatusBreakdown.available > 0 && `${roomStatusBreakdown.available} Available`}
                </div>
                <div
                  className="progress-bar bg-danger"
                  style={{ width: `${(roomStatusBreakdown.occupied / kpi.totalRooms) * 100}%` }}
                  title={`Occupied: ${roomStatusBreakdown.occupied}`}
                >
                  {roomStatusBreakdown.occupied > 0 && `${roomStatusBreakdown.occupied} Occupied`}
                </div>
                <div
                  className="progress-bar bg-warning text-dark"
                  style={{ width: `${(roomStatusBreakdown.cleaning / kpi.totalRooms) * 100}%` }}
                  title={`Cleaning: ${roomStatusBreakdown.cleaning}`}
                >
                  {roomStatusBreakdown.cleaning > 0 && `${roomStatusBreakdown.cleaning} Cleaning`}
                </div>
                <div
                  className="progress-bar bg-secondary"
                  style={{ width: `${(roomStatusBreakdown.maintenance / kpi.totalRooms) * 100}%` }}
                  title={`Maintenance: ${roomStatusBreakdown.maintenance}`}
                >
                  {roomStatusBreakdown.maintenance > 0 && `${roomStatusBreakdown.maintenance}`}
                </div>
              </div>

              {/* Legend & Count Cards */}
              <div className="row g-3 text-center">
                <div className="col-3">
                  <div className="p-3 rounded-3 bg-success-subtle border border-success-subtle">
                    <span className="d-block text-success fw-bold fs-5">{roomStatusBreakdown.available}</span>
                    <small className="text-muted">Available</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-3 rounded-3 bg-danger-subtle border border-danger-subtle">
                    <span className="d-block text-danger fw-bold fs-5">{roomStatusBreakdown.occupied}</span>
                    <small className="text-muted">Occupied</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-3 rounded-3 bg-warning-subtle border border-warning-subtle">
                    <span className="d-block text-warning-emphasis fw-bold fs-5">{roomStatusBreakdown.cleaning}</span>
                    <small className="text-muted">Cleaning</small>
                  </div>
                </div>
                <div className="col-3">
                  <div className="p-3 rounded-3 bg-light border">
                    <span className="d-block text-secondary fw-bold fs-5">{roomStatusBreakdown.maintenance}</span>
                    <small className="text-muted">Maintenance</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Housekeeping Live Board */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="font-serif fw-bold text-dark mb-0">Housekeeping Board</h5>
                <Link to="/manage-rooms" className="small text-decoration-none">
                  Manage <i className="bi bi-chevron-right"></i>
                </Link>
              </div>

              <div className="vstack gap-3">
                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success rounded-circle p-2"></span>
                    <span className="small fw-semibold">Clean & Inspected</span>
                  </div>
                  <span className="badge bg-success px-3 py-1">{housekeepingBreakdown.clean + housekeepingBreakdown.inspected}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning rounded-circle p-2"></span>
                    <span className="small fw-semibold">Turnover In Progress</span>
                  </div>
                  <span className="badge bg-warning text-dark px-3 py-1">{housekeepingBreakdown.inProgress}</span>
                </div>

                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger rounded-circle p-2"></span>
                    <span className="small fw-semibold">Dirty / Awaiting Staff</span>
                  </div>
                  <span className="badge bg-danger px-3 py-1">{housekeepingBreakdown.dirty}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-3 border border-dashed text-center small text-muted">
                <i className="bi bi-info-circle me-1 text-primary"></i>
                Guest check-outs automatically dispatch rooms into the cleaning queue.
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Performance & Recent Bookings */}
        <div className="row g-4">
          {/* Revenue Monthly Trends */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <h5 className="font-serif fw-bold text-dark mb-3">Revenue Trends (USD)</h5>
              <div className="vstack gap-3">
                {revenueByMonth.map((item, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="fw-semibold text-dark">{item.month}</span>
                      <span className="text-muted">${item.revenue.toLocaleString()} ({item.occupancy}% Occ.)</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar ${idx === revenueByMonth.length - 1 ? 'bg-warning' : 'bg-navy'}`}
                        style={{
                          width: `${Math.min(100, (item.revenue / 28000) * 100)}%`,
                          backgroundColor: idx === revenueByMonth.length - 1 ? '#c5a059' : '#0b132b'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="font-serif fw-bold text-dark mb-0">Recent Reservations</h5>
                <Link to="/manage-bookings" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                  View All ({recentBookings.length})
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Ref #</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Stay</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((bk) => (
                      <tr key={bk._id}>
                        <td className="font-monospace fw-bold text-primary">{bk.bookingCode}</td>
                        <td>
                          <div className="fw-semibold text-dark">{bk.guestName}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{bk.guestEmail}</div>
                        </td>
                        <td>
                          <div>{bk.room?.title || 'Suite'}</div>
                          <small className="text-muted">Room #{bk.room?.roomNumber}</small>
                        </td>
                        <td>
                          <div>{bk.checkInDate}</div>
                          <small className="text-muted">{bk.nights} Night(s)</small>
                        </td>
                        <td>
                          <span className={`badge rounded-pill px-2 py-1 ${bk.status === 'Checked-in' ? 'bg-success' : bk.status === 'Confirmed' ? 'bg-primary' : bk.status === 'Checked-out' ? 'bg-secondary' : 'bg-danger'}`}>
                            {bk.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            {bk.status === 'Confirmed' && (
                              <button
                                onClick={() => handleQuickCheckIn(bk._id, bk.guestName)}
                                className="btn btn-outline-success"
                                title="Check In Guest"
                              >
                                Check In
                              </button>
                            )}
                            {bk.status === 'Checked-in' && (
                              <button
                                onClick={() => handleQuickCheckOut(bk._id, bk.guestName)}
                                className="btn btn-outline-danger"
                                title="Check Out Guest"
                              >
                                Check Out
                              </button>
                            )}
                            <button
                              onClick={() => setActiveInvoice(bk)}
                              className="btn btn-outline-secondary"
                              title="View Invoice"
                            >
                              <i className="bi bi-receipt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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


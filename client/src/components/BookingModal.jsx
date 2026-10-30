import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function BookingModal({ room, isOpen, onClose, onBookingSuccess }) {
  const { user } = useAuth();

  const getTodayStr = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    checkInDate: getTodayStr(0),
    checkOutDate: getTodayStr(2),
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestsCount: 1,
    paymentMethod: 'Credit Card',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        guestName: user.name || '',
        guestEmail: user.email || '',
        guestPhone: user.phone || ''
      }));
    }
  }, [user, isOpen]);

  if (!isOpen || !room) return null;

  // Calculate nights & pricing
  const d1 = new Date(formData.checkInDate);
  const d2 = new Date(formData.checkOutDate);
  const diffTime = d2 - d1;
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1);

  const roomCharges = room.pricePerNight * nights;
  const taxes = Math.round(roomCharges * 0.12);
  const serviceFee = 25;
  const grandTotal = roomCharges + taxes + serviceFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      setError('Check-out date must be strictly after the check-in date.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        roomId: room._id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        guestsCount: Number(formData.guestsCount),
        paymentMethod: formData.paymentMethod,
        specialRequests: formData.specialRequests
      };

      const res = await api.createBooking(payload);
      if (res.success) {
        onBookingSuccess(res);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(11, 19, 43, 0.75)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white p-4">
            <div>
              <span className="badge bg-warning text-dark text-uppercase fw-bold mb-1">
                Room Reservation
              </span>
              <h4 className="modal-title font-serif fw-bold text-white mb-0">
                {room.title}
              </h4>
              <small className="text-secondary">
                Room #{room.roomNumber} • {room.type} • Floor {room.floor}
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="row g-3">
                {/* Dates */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Check-In Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-calendar-event"></i></span>
                    <input
                      type="date"
                      className="form-control"
                      name="checkInDate"
                      min={getTodayStr(0)}
                      value={formData.checkInDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Check-Out Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-calendar-check"></i></span>
                    <input
                      type="date"
                      className="form-control"
                      name="checkOutDate"
                      min={formData.checkInDate || getTodayStr(1)}
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Guest Count */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-muted">Number of Guests</label>
                  <select
                    className="form-select"
                    name="guestsCount"
                    value={formData.guestsCount}
                    onChange={handleChange}
                  >
                    {[...Array(room.capacity || 2)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'Guest' : 'Guests'} (Max: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guest Details */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-muted">Primary Guest Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="guestName"
                    placeholder="Full Name"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="guestEmail"
                    placeholder="name@example.com"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="guestPhone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.guestPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted">Payment Preference</label>
                  <select
                    className="form-select"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="Credit Card">Credit Card (Instant Confirmation)</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI / Digital Payment</option>
                    <option value="Pay at Check-in">Pay at Check-in (Cash/Card)</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small text-muted">Special Requests / Preferences</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="specialRequests"
                    placeholder="e.g. Quiet floor, early check-in, honeymoon setup, extra pillows"
                    value={formData.specialRequests}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div className="card bg-light border-0 rounded-3 mt-4 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2 small">
                  <span className="text-muted">
                    ${room.pricePerNight} × {nights} {nights === 1 ? 'Night' : 'Nights'}
                  </span>
                  <span className="fw-semibold text-dark">${roomCharges}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 small">
                  <span className="text-muted">Hospitality Tax & GST (12%)</span>
                  <span className="fw-semibold text-dark">${taxes}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2 small">
                  <span className="text-muted">Service & Tourism Fee</span>
                  <span className="fw-semibold text-dark">${serviceFee}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-6">Grand Total Amount</span>
                  <span className="fw-bold fs-5 text-dark font-serif">${grandTotal}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-gold px-4 rounded-pill fw-bold">
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing Reservation...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-1"></i> Confirm & Book (${grandTotal})
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


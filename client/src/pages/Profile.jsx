import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    governmentId: user?.governmentId || ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateProfile(formData);
      setMessage('✓ Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const vipPerks = {
    'Standard': ['Free High-Speed Wi-Fi', 'Member Rate Guarantee', 'Digital Key Access'],
    'Silver': ['10% In-Room Dining Discount', 'Early Check-In (subject to availability)', 'Welcome Drink'],
    'Gold': ['Complimentary Gourmet Breakfast for Two', 'Room Upgrade when available', 'Late Check-out until 2 PM'],
    'Platinum': ['24/7 Butler Service', 'Free VIP Airport Limousine Transfer', 'Guaranteed Suite Upgrade', 'Executive Lounge Privileges']
  };

  const tier = user?.vipTier || 'Standard';

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* User Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white text-center mb-4">
              <div
                className="rounded-circle bg-dark text-warning fw-bold fs-2 d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '80px', height: '80px' }}
              >
                {user?.name?.charAt(0)}
              </div>
              <h4 className="font-serif fw-bold text-dark mb-1">{user?.name}</h4>
              <p className="text-muted small mb-2">{user?.email}</p>
              <div className="mb-3">
                <span className={`badge px-3 py-1 fs-6 ${tier === 'Platinum' ? 'badge-vip-platinum' : tier === 'Gold' ? 'badge-vip-gold' : 'badge-vip-silver'}`}>
                  {tier} Member
                </span>
                <span className="badge bg-secondary ms-2 text-uppercase">{user?.role}</span>
              </div>
              <small className="text-muted d-block">
                Member ID: <span className="font-monospace">{user?.id || user?._id}</span>
              </small>
            </div>

            {/* Loyalty Perks */}
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-uppercase small text-muted mb-3" style={{ letterSpacing: '0.5px' }}>
                Your {tier} Membership Benefits
              </h6>
              <ul className="list-unstyled vstack gap-2 small mb-0">
                {(vipPerks[tier] || vipPerks['Standard']).map((perk, i) => (
                  <li key={i} className="d-flex align-items-center gap-2">
                    <i className="bi bi-patch-check-fill text-warning"></i>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Profile Form */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
              <h4 className="font-serif fw-bold text-dark mb-1">Personal Details</h4>
              <p className="text-muted small mb-4">Keep your contact and identity details updated for seamless check-ins</p>

              {message && (
                <div className="alert alert-success py-2 small mb-3">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger py-2 small mb-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Government ID / Passport #</label>
                  <input
                    type="text"
                    name="governmentId"
                    className="form-control"
                    placeholder="US-PASSPORT-XXXX"
                    value={formData.governmentId}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">Address</label>
                  <textarea
                    rows="2"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn btn-navy rounded-pill px-4 fw-bold">
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


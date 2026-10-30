import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    governmentId: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/rooms');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white p-4 p-md-5">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: '50px', height: '50px', backgroundColor: '#0b132b', color: '#c5a059' }}
                >
                  <i className="bi bi-person-plus-fill fs-4"></i>
                </div>
                <h3 className="font-serif fw-bold text-dark mb-1">
                  Create Guest Profile
                </h3>
                <p className="text-muted small">Join HotelPro for exclusive member rates, VIP perks, and express check-in</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-muted">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Sarah Jenkins"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
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

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Government ID / Passport #</label>
                    <input
                      type="text"
                      name="governmentId"
                      className="form-control"
                      placeholder="e.g. US-PASSPORT-12345"
                      value={formData.governmentId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold text-muted">Residential / Billing Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Street, City, State, ZIP"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold w-100 py-2 rounded-pill fw-bold shadow-sm mt-4 mb-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Register & Access HotelPro'
                  )}
                </button>
              </form>

              <div className="text-center text-muted small">
                Already have an account?{' '}
                <Link to="/login" className="fw-bold text-decoration-none text-dark">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


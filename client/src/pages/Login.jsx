import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, quickLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role === 'admin' || res.user.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (roleKey) => {
    setError('');
    setLoading(true);
    try {
      const res = await quickLogin(roleKey);
      if (res.user.role === 'admin' || res.user.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-white p-4 p-md-5">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: '50px', height: '50px', backgroundColor: '#0b132b', color: '#c5a059' }}
                >
                  <i className="bi bi-shield-lock-fill fs-4"></i>
                </div>
                <h3 className="font-serif fw-bold text-dark mb-1">
                  Sign In to Hotel<span style={{ color: '#c5a059' }}>Pro</span>
                </h3>
                <p className="text-muted small">Access your hotel reservations, front desk desk, or analytics</p>
              </div>

              {/* Demo Accounts Quick-Select Box */}
              <div className="p-3 mb-4 rounded-3 bg-light border border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-1 small fw-bold text-dark mb-2">
                  <i className="bi bi-lightning-charge-fill text-warning"></i> 1-Click Instant Demo Access:
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuick('admin')}
                    className="btn btn-outline-dark btn-sm text-start d-flex justify-content-between align-items-center px-3"
                  >
                    <span>
                      <i className="bi bi-shield-shaded me-2 text-primary"></i>
                      <strong>General Manager</strong> (Admin)
                    </span>
                    <span className="badge bg-primary text-white">Full Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuick('staff')}
                    className="btn btn-outline-dark btn-sm text-start d-flex justify-content-between align-items-center px-3"
                  >
                    <span>
                      <i className="bi bi-person-badge me-2 text-success"></i>
                      <strong>Front Desk</strong> (Staff)
                    </span>
                    <span className="badge bg-success text-white">Operations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuick('guest')}
                    className="btn btn-outline-dark btn-sm text-start d-flex justify-content-between align-items-center px-3"
                  >
                    <span>
                      <i className="bi bi-person-heart me-2 text-warning"></i>
                      <strong>Sarah Jenkins</strong> (VIP Guest)
                    </span>
                    <span className="badge bg-warning text-dark">Customer</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="form-label small fw-semibold text-muted">Password</label>
                    <span className="small text-muted">Default: admin123 / guest123</span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-navy w-100 py-2 rounded-pill fw-bold shadow-sm mb-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Authenticating...
                    </>
                  ) : (
                    'Sign In to Account'
                  )}
                </button>
              </form>

              <div className="text-center text-muted small">
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-bold text-decoration-none text-dark">
                  Create Guest Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


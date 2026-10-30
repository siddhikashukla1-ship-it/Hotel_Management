import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isStaff, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-hotelpro sticky-top py-3">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: '42px', height: '42px', backgroundColor: '#0b132b', color: '#c5a059' }}
          >
            <i className="bi bi-building fs-4"></i>
          </div>
          <div>
            <span className="fw-bold fs-4 d-block lh-1 font-serif text-dark" style={{ letterSpacing: '0.5px' }}>
              Hotel<span style={{ color: '#c5a059' }}>Pro</span>
            </span>
            <small className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Hospitality Suite
            </small>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/rooms">
                <i className="bi bi-door-open me-1"></i> Rooms & Suites
              </NavLink>
            </li>

            {/* Staff & Admin Links */}
            {isStaff && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i> Operations Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/manage-bookings">
                    <i className="bi bi-calendar-check me-1"></i> Reservations
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/manage-rooms">
                    <i className="bi bi-grid-3x3-gap me-1"></i> Room Inventory
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/manage-guests">
                    <i className="bi bi-people me-1"></i> Guest CRM
                  </NavLink>
                </li>
              </>
            )}

            {/* Guest / Authenticated user links */}
            {isAuthenticated && !isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-bookings">
                  <i className="bi bi-briefcase me-1"></i> My Bookings
                </NavLink>
              </li>
            )}
          </ul>

          {/* User Account / Auth Actions */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 py-1 px-3 rounded-pill"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-start">
                    <span className="fw-semibold text-dark small d-block lh-1">{user.name}</span>
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {user.role} {user.vipTier ? `• ${user.vipTier}` : ''}
                    </span>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
                  <li className="px-3 py-2 border-bottom">
                    <p className="mb-0 fw-bold">{user.name}</p>
                    <p className="mb-0 small text-muted">{user.email}</p>
                    <span className={`badge mt-1 ${user.vipTier === 'Platinum' ? 'badge-vip-platinum' : user.vipTier === 'Gold' ? 'badge-vip-gold' : 'badge-vip-silver'}`}>
                      {user.vipTier || 'Standard'} Member
                    </span>
                  </li>
                  {isStaff ? (
                    <li>
                      <Link className="dropdown-item py-2" to="/dashboard">
                        <i className="bi bi-speedometer2 me-2 text-primary"></i> Operations Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link className="dropdown-item py-2" to="/my-bookings">
                        <i className="bi bi-calendar2-heart me-2 text-primary"></i> My Reservations
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item py-2" to="/profile">
                      <i className="bi bi-person-gear me-2 text-muted"></i> Account Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-secondary rounded-pill px-3 py-1">
                  <i className="bi bi-person me-1"></i> Sign In
                </Link>
                <Link to="/register" className="btn btn-gold rounded-pill px-3 py-1">
                  Register
                </Link>
              </div>
            )}

            <Link to="/rooms" className="btn btn-navy rounded-pill px-3 py-1 d-none d-sm-inline-block">
              <i className="bi bi-calendar-plus me-1"></i> Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}


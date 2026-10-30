import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: '40px', height: '40px', backgroundColor: '#1c2541', color: '#c5a059' }}
              >
                <i className="bi bi-building fs-5"></i>
              </div>
              <span className="fw-bold fs-4 font-serif text-white">
                Hotel<span style={{ color: '#c5a059' }}>Pro</span>
              </span>
            </div>
            <p className="text-secondary small leading-relaxed">
              Your ultimate hotel management solution. Streamlining modern hospitality operations with a secure,
              scalable backend, real-time availability tracking, guest CRM, and seamless digital booking.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: '#c5a059', letterSpacing: '1px' }}>
              Navigation
            </h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li className="mb-2"><Link to="/rooms" className="text-secondary text-decoration-none hover-white">Rooms & Suites</Link></li>
              <li className="mb-2"><Link to="/my-bookings" className="text-secondary text-decoration-none hover-white">My Reservations</Link></li>
              <li className="mb-2"><Link to="/dashboard" className="text-secondary text-decoration-none hover-white">Admin Dashboard</Link></li>
              <li className="mb-2"><Link to="/login" className="text-secondary text-decoration-none hover-white">Staff Login</Link></li>
            </ul>
          </div>

          {/* Suite Types */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: '#c5a059', letterSpacing: '1px' }}>
              Accommodations
            </h6>
            <ul className="list-unstyled small text-secondary">
              <li className="mb-2">Grand Deluxe Ocean Suite</li>
              <li className="mb-2">Presidential Royal Penthouse</li>
              <li className="mb-2">Skyline Executive Business Suite</li>
              <li className="mb-2">Family Garden Oasis Villa</li>
              <li className="mb-2">Lagoon Private Pool Villa</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: '#c5a059', letterSpacing: '1px' }}>
              Concierge Desk
            </h6>
            <p className="small text-secondary mb-2">
              <i className="bi bi-geo-alt me-2 text-warning"></i> 500 Grand Coastal Parkway, Suite 100
            </p>
            <p className="small text-secondary mb-2">
              <i className="bi bi-telephone me-2 text-warning"></i> +1 (800) 555-HOTELPRO
            </p>
            <p className="small text-secondary mb-2">
              <i className="bi bi-envelope me-2 text-warning"></i> reservations@hotelpro.com
            </p>
            <div className="mt-3 p-2 rounded bg-black bg-opacity-25 border border-secondary border-opacity-25 small">
              <span className="badge bg-success me-1">24/7 Available</span>
              <span className="text-white-50">Front desk & butler service</span>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-wrap justify-content-between align-items-center small text-secondary">
          <p className="mb-0">
            © {new Date().getFullYear()} HotelPro Inc. All rights reserved. Full-Stack Hospitality Suite.
          </p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <span>Powered by React, Node.js, Express, MongoDB & Bootstrap</span>
            <span>•</span>
            <span className="text-warning">JWT Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


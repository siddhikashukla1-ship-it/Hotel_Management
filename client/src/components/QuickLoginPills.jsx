import React from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export default function QuickLoginPills() {
  const { user, quickLogin, logout } = useAuth();

  return (
    <div className="bg-dark text-white py-1 px-3 d-flex flex-wrap align-items-center justify-content-between small border-bottom border-secondary">
      <div className="d-flex align-items-center gap-2">
        <span className="badge bg-warning text-dark fw-bold">
          <i className="bi bi-lightning-charge-fill me-1"></i> Quick Demo Switcher:
        </span>
        <button
          onClick={() => quickLogin('admin')}
          className={`btn btn-sm py-0 px-2 rounded-pill ${user?.role === 'admin' ? 'btn-light fw-bold' : 'btn-outline-light'}`}
          title="Login as General Manager / Admin"
        >
          <i className="bi bi-shield-lock me-1"></i> Admin (Alexander)
        </button>
        <button
          onClick={() => quickLogin('staff')}
          className={`btn btn-sm py-0 px-2 rounded-pill ${user?.role === 'staff' ? 'btn-light fw-bold' : 'btn-outline-light'}`}
          title="Login as Front Desk Receptionist"
        >
          <i className="bi bi-person-badge me-1"></i> Staff (Elena)
        </button>
        <button
          onClick={() => quickLogin('guest')}
          className={`btn btn-sm py-0 px-2 rounded-pill ${user?.role === 'guest' ? 'btn-light fw-bold' : 'btn-outline-light'}`}
          title="Login as Customer / Guest"
        >
          <i className="bi bi-person-heart me-1"></i> Guest (Sarah)
        </button>
      </div>

      <div className="d-flex align-items-center gap-3">
        {user ? (
          <>
            <span className="text-light">
              Active: <strong>{user.name}</strong> <span className="text-warning">({user.role.toUpperCase()})</span>
            </span>
            <button onClick={logout} className="btn btn-sm btn-link text-white-50 text-decoration-none p-0">
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </>
        ) : (
          <span className="text-white-50">Not signed in (Browsing as Public Guest)</span>
        )}
      </div>
    </div>
  );
}


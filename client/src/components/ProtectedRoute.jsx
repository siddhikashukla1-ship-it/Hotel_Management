import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted small">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm p-5 border-0 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="text-danger mb-3">
            <i className="bi bi-shield-x fs-1"></i>
          </div>
          <h3 className="fw-bold">Access Restricted</h3>
          <p className="text-muted">
            This module requires <strong>{allowedRoles.join(' or ')}</strong> privileges.
            Your current account role is <span className="badge bg-secondary">{user?.role}</span>.
          </p>
          <div className="alert alert-info small mt-2">
            Tip: Use the <strong>Quick Demo Switcher</strong> bar at the top to switch to an Admin or Staff account!
          </div>
        </div>
      </div>
    );
  }

  return children;
}


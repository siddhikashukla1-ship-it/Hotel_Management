import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import QuickLoginPills from './components/QuickLoginPills';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Dashboard from './pages/Dashboard';
import ManageBookings from './pages/ManageBookings';
import ManageRooms from './pages/ManageRooms';
import ManageGuests from './pages/ManageGuests';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          {/* Quick Demo Switcher Bar */}
          <QuickLoginPills />

          {/* Main Navigation */}
          <Navbar />

          {/* Application Routing */}
          <main className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated Guest / Customer Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Staff & Admin Operational Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-bookings"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <ManageBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-rooms"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <ManageRooms />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-guests"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <ManageGuests />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Luxury Hospitality Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

